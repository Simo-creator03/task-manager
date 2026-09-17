# Task Manager — Monorepo (backend + frontend) avec pipeline CI/CD

Application de gestion de tâches : **Spring Boot** (`task_manager_backend`) + **React/Vite** (`task_manager_frontend`), livrée automatiquement sur **Google Cloud Run** par un pipeline **GitHub Actions + Cloud Build**.

## Le pipeline en un coup d'œil

```
 push / PR sur main
        │
        ▼
┌──────────────────────────────────────────────────────────────┐
│ GitHub Actions (.github/workflows/ci-cd.yml)                 │
│                                                              │
│  job "backend"   → mvn verify            (compile + tests)   │
│  job "frontend"  → npm ci, lint, build   (compile + lint)    │
│                                                              │
│  job "deploy" (uniquement sur push main)                     │
│    1. docker build backend  → push Artifact Registry         │
│    2. docker build frontend → push Artifact Registry         │
│    3. gcloud builds submit ──────────────┐                   │
└──────────────────────────────────────────│───────────────────┘
                                           ▼
┌──────────────────────────────────────────────────────────────┐
│ Cloud Build (cloudbuild.yaml)                                │
│    gcloud run deploy task-manager-backend  (image fraîche)   │
│    gcloud run deploy task-manager-frontend (image fraîche)   │
└──────────────────────────────────────────────────────────────┘
```

## Fichiers ajoutés pour le CI/CD

| Fichier | Rôle |
| --- | --- |
| `.github/workflows/ci-cd.yml` | Pipeline GitHub Actions : tests, images Docker, déclenchement du déploiement |
| `cloudbuild.yaml` | Déploiement des deux services sur Cloud Run |
| `task_manager_backend/Dockerfile` | Image du backend (Maven → JRE 17 alpine) |
| `task_manager_frontend/Dockerfile` | Image du frontend (Node build → nginx) |
| `task_manager_frontend/nginx.conf` | Serveur statique : port 8080, fallback SPA, cache |
| `docker-compose.yml` | Test **local** des images de production |
| `.gcloudignore` | N'envoie que `cloudbuild.yaml` à Cloud Build |

## Prérequis GCP (à faire une seule fois)

Remplacez `mon-projet-gcp` par l'identifiant de votre projet et `europe-west1` par votre région.

### 1. Projet et APIs

```bash
export PROJECT_ID="mon-projet-gcp"
export REGION="europe-west1"
gcloud config set project "$PROJECT_ID"

gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com \
  secretmanager.googleapis.com \
  sqladmin.googleapis.com
```

### 2. Dépôt d'images (Artifact Registry)

```bash
gcloud artifacts repositories create task-manager \
  --repository-format=docker \
  --location="$REGION"
```

### 3. Base MySQL (Cloud SQL)

```bash
gcloud sql instances create task-manager-db \
  --database-version=MYSQL_8_0 \
  --tier=db-f1-micro \
  --region="$REGION"

gcloud sql databases create task_manager --instance=task-manager-db

# Choisissez un mot de passe fort
gcloud sql users create task_manager \
  --instance=task-manager-db \
  --password="CHANGEZ_MOI_MOT_DE_PASSE_FORT"
```

### 4. Mot de passe dans Secret Manager

```bash
printf "CHANGEZ_MOI_MOT_DE_PASSE_FORT" | gcloud secrets create db-password \
  --data-file=- \
  --replication-policy=automatic
```

### 5. Compte de service pour la CI (GitHub Actions)

```bash
gcloud iam service-accounts create github-ci --display-name="GitHub Actions CI"

SA="github-ci@$PROJECT_ID.iam.gserviceaccount.com"

# Rôles nécessaires : pousser des images + déclencher Cloud Build
for role in \
  roles/artifactregistry.writer \
  roles/cloudbuild.builds.editor \
  roles/run.admin \
  roles/iam.serviceAccountUser
do
  gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:$SA" --role="$role"
done

# Clé JSON à coller dans le secret GitHub GCP_SA_KEY
gcloud iam service-accounts keys create github-ci-key.json --iam-account="$SA"
```

> Ouvrez `github-ci-key.json`, copiez tout son contenu dans le secret GitHub
> `GCP_SA_KEY`, puis supprimez le fichier.

### 6. Rôles des comptes de service internes

```bash
PROJECT_NUMBER=$(gcloud projects describe "$PROJECT_ID" --format='value(projectNumber)')
CLOUDBUILD_SA="$PROJECT_NUMBER@cloudbuild.gserviceaccount.com"
COMPUTE_SA="$PROJECT_NUMBER-compute@developer.gserviceaccount.com"

# Cloud Build doit pouvoir déployer et agir en tant que compte de service
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:$CLOUDBUILD_SA" --role=roles/run.admin
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:$CLOUDBUILD_SA" --role=roles/iam.serviceAccountUser

# Cloud Run doit pouvoir lire Cloud SQL et le secret du mot de passe
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:$COMPUTE_SA" --role=roles/cloudsql.client
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:$COMPUTE_SA" --role=roles/secretmanager.secretAccessor
```

## Configuration GitHub

Dans le dépôt : **Settings → Secrets and variables → Actions**.

| Type | Nom | Valeur | Obligatoire |
| --- | --- | --- | --- |
| Secret | `GCP_SA_KEY` | Contenu du fichier `github-ci-key.json` | Oui |
| Variable | `GCP_PROJECT_ID` | `mon-projet-gcp` | Oui |
| Variable | `CLOUDSQL_INSTANCE` | `mon-projet-gcp:europe-west1:task-manager-db` | Oui |
| Variable | `DB_NAME` | `task_manager` | Non (défaut) |
| Variable | `DB_USER` | `task_manager` | Non (défaut) |
| Variable | `VITE_API_URL` | URL publique du backend Cloud Run | Oui (voir étape 5 ci-dessous) |

## Premier déploiement

1. **Initialiser Git et pousser le code** (depuis ce dossier) :

   ```bash
   git init -b main
   git add .
   git commit -m "chore: monorepo + pipeline CI/CD"
   git remote add origin https://github.com/<compte>/<depot>.git
   git push -u origin main
   ```

2. Renseigner les secrets et variables du tableau ci-dessus
   (`VITE_API_URL` peut rester vide au tout premier passage).

3. Le workflow se lance : tests → images → déploiement. Suivez-le dans
   l'onglet **Actions** du dépôt et dans **Cloud Build → Historique**.

4. **Récupérer l'URL du backend** une fois déployé :

   ```bash
   gcloud run services describe task-manager-backend \
     --region="$REGION" --format='value(status.url)'
   ```

5. **Renseigner `VITE_API_URL`** avec cette URL
   (ex. `https://task-manager-backend-xxxxx-ew.a.run.app`), puis relancer
   le workflow (**Actions → Re-run all jobs**) ou pousser un petit commit.

   > C'est indispensable : l'URL du backend est écrite dans le JavaScript
   > au moment du build du frontend (Vite fige les variables `VITE_*`).

6. URLs finales :

   ```bash
   gcloud run services list --region="$REGION"
   ```

L'application est alors accessible sur l'URL du service `task-manager-frontend`.

## Utilisation au quotidien

- **Pull request** : seuls les jobs `backend` et `frontend` s'exécutent
  (pas de déploiement).
- **Push sur `main`** : tests + images + déploiement automatique.
- Compte créé automatiquement au démarrage du backend
  (voir `InitializeDataService.java`) : actuellement `nelson` / `12345`.

## Tester les images en local (avant de pousser)

```bash
docker compose up --build
```

- Frontend : http://localhost:5173
- Backend : http://localhost:8081
- MySQL : port **13306** côté machine (13306 → 3306 dans le conteneur, pour ne
  pas entrer en conflit avec un MySQL déjà installé). Données conservées dans
  le volume `mysql-data`.

Pour tout arrêter : `docker compose down` (ajoutez `-v` pour effacer la base).

## Dépannage

| Symptôme | Cause probable | Solution |
| --- | --- | --- |
| `Permission 'artifactregistry.repositories.uploadArtifacts' denied` | Rôle manquant sur le compte de service CI | Rejouer l'étape 5 (rôles GCP) |
| `Permission 'run.services.update' denied` dans Cloud Build | Rôle manquant sur le compte de service Cloud Build | Rejouer l'étape 6 |
| `secret "db-password" not found` / accès refusé | Secret absent ou `secretAccessor` manquant | Étape 4 + étape 6 |
| Le backend démarre puis s'arrête : `Access denied for user` | Identifiants MySQL faux | Vérifier `DB_USER` et le secret |
| Le frontend affiche « Impossible de contacter le serveur » | `VITE_API_URL` vide ou incorrect au moment du build | Étape 5, puis re-déployer |
| `Cloud SQL connection failed` | Nom d'instance mal formé | Format exact `PROJET:REGION:INSTANCE` |
| Le déploiement Cloud Build échoue sur `--substitutions` | Variable GitHub manquante | Vérifier le tableau de configuration |

Consulter les logs d'un service :

```bash
gcloud run services logs read task-manager-backend --region="$REGION" --limit=50
```

## Nettoyage (éviter les frais)

```bash
gcloud run services delete task-manager-backend --region="$REGION"
gcloud run services delete task-manager-frontend --region="$REGION"
gcloud sql instances delete task-manager-db
gcloud artifacts repositories delete task-manager --location="$REGION"
gcloud secrets delete db-password
```

Les services Cloud Run sont configurés avec `--min-instances=0` : ils ne
coûtent rien quand personne ne les utilise. La base Cloud SQL, elle, reste
facturée tant qu'elle existe.

## Structure du monorepo

```
Task Manager/
├── .github/workflows/ci-cd.yml    Pipeline GitHub Actions
├── cloudbuild.yaml                Déploiement Cloud Run
├── docker-compose.yml             Test local des images
├── task_manager_backend/          API Spring Boot (Java 17)
│   ├── Dockerfile
│   └── src/...
└── task_manager_frontend/         Application React (Vite)
    ├── Dockerfile
    ├── nginx.conf
    ├── docs/                      Guide React (PDF)
    └── src/...
```
