# Task Manager — Monorepo (backend + frontend) avec pipeline CI/CD

Application de gestion de tâches : **Spring Boot** (`task_manager_backend`) + **React/Vite** (`task_manager_frontend`).

Déploiement **100 % gratuit** (aucune facturation Google Cloud) :

- **frontend** publié sur **Firebase Hosting** (offre Spark, gratuite) ;
- **backend** exécuté **en local** (ton PC) avec MySQL, exposé sur Internet par un **tunnel gratuit** (ngrok ou cloudflared).

> App Engine + Cloud SQL exigent un compte de facturation : la configuration est
> prête (`app.yaml`, job désactivé dans le pipeline) pour plus tard, voir
> [« Plus tard : App Engine »](#plus-tard--app-engine-avec-facturation).

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
│  job "deploy-frontend" (push main uniquement)                │
│    npm run build avec VITE_API_URL = URL du tunnel           │
│    firebase deploy --only hosting ──► Firebase Hosting       │
│                                                              │
│  job "deploy-backend" : désactivé (facturation GCP requise)  │
└──────────────────────────────────────────────────────────────┘
```

## Fichiers du projet

| Fichier | Rôle |
| --- | --- |
| `.github/workflows/ci-cd.yml` | Pipeline GitHub Actions : tests, déploiement Firebase Hosting |
| `firebase.json` | Configuration Firebase Hosting (dossier `dist`, fallback SPA, cache) |
| `task_manager_backend/app.yaml` | Configuration App Engine — **pour plus tard** (facturation requise) |
| `docker-compose.yml` | Lance MySQL + backend + frontend en local |
| `task_manager_backend/Dockerfile` | Image backend (utilisée par `docker compose`) |
| `task_manager_frontend/Dockerfile` | Image frontend (utilisée par `docker compose`) |
| `task_manager_frontend/nginx.conf` | Serveur statique du conteneur local |

## Configuration (une seule fois, sans facturation)

### 1. Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase projects:addfirebase        # choisis ton projet GCP existant
```

Cela associe Firebase au projet et crée le site Hosting par défaut
(`https://PROJECT_ID.web.app`). Aucune carte bancaire n'est demandée : l'offre
Spark inclut le hosting statique, le SSL et un domaine `web.app` gratuit.

> Si la commande échoue, passe par la
> [console Firebase](https://console.firebase.google.com) :
> **Ajouter un projet** → **Add Firebase to Google Cloud project**, puis
> **Hosting → Get started**.

### 2. Compte de service pour GitHub Actions

Le pipeline doit pouvoir publier sur Hosting. Dans Google Cloud SDK Shell
(remplace `mon-projet-gcp` par ton identifiant de projet) :

```bash
gcloud config set project mon-projet-gcp

gcloud iam service-accounts create github-ci --display-name="GitHub Actions CI"

gcloud projects add-iam-policy-binding mon-projet-gcp --member="serviceAccount:github-ci@mon-projet-gcp.iam.gserviceaccount.com" --role=roles/firebasehosting.admin

gcloud projects add-iam-policy-binding mon-projet-gcp --member="serviceAccount:github-ci@mon-projet-gcp.iam.gserviceaccount.com" --role=roles/serviceusage.apiKeysViewer

gcloud iam service-accounts keys create github-ci-key.json --iam-account=github-ci@mon-projet-gcp.iam.gserviceaccount.com
```

> Ces commandes ne nécessitent **pas** de facturation. Si le compte
> `github-ci` existe déjà, saute la première commande.
> Ouvre `github-ci-key.json`, copie tout son contenu dans le secret GitHub
> `GCP_SA_KEY`, puis supprime le fichier.

### 3. Configuration GitHub

Dans le dépôt : **Settings → Secrets and variables → Actions**.

| Type | Nom | Valeur | Obligatoire |
| --- | --- | --- | --- |
| Secret | `GCP_SA_KEY` | Contenu du fichier `github-ci-key.json` | Oui |
| Variable | `GCP_PROJECT_ID` | `mon-projet-gcp` | Oui |
| Variable | `VITE_API_URL` | URL du tunnel vers ton backend local (voir ci-dessous) | Oui |

## Utilisation quotidienne

### 1. Démarrer le backend en local

Avec une base MySQL locale sur le port 3306 (celle de `application-dev.yml`) :

```powershell
cd task_manager_backend
.\mvnw.cmd spring-boot:run
```

L'API écoute sur `http://localhost:8081` (Swagger : `http://localhost:8081/swagger-ui.html`).
Compte de test : **nelson / 12345**.

Sinon, tout en conteneurs :

```bash
docker compose up --build
```

### 2. Exposer le backend sur Internet

Le site Firebase est en HTTPS : il faut donc une URL HTTPS publique vers ton
backend local. Deux solutions gratuites :

**ngrok (recommandé, URL stable)** — crée un compte sur https://ngrok.com,
puis dans un second terminal :

```bash
ngrok config add-authtoken <ton_jeton>
ngrok http 8081 --url https://<ton-domaine-statique>.ngrok-free.app
```

ngrok offre **un domaine statique gratuit** par compte : l'URL ne change pas
après un redémarrage.

**cloudflared (sans compte, URL aléatoire)** :

```bash
cloudflared tunnel --url http://localhost:8081
```

L'URL `https://xxxx.trycloudflare.com` change à chaque lancement : il faut
alors mettre à jour `VITE_API_URL` et repousser sur `main`.

### 3. Publier le frontend

1. Renseigne `VITE_API_URL` dans GitHub avec l'URL du tunnel.
2. Pousse sur `main` (ou relance le workflow **Actions → Re-run all jobs**).

Le frontend est alors en ligne sur `https://PROJECT_ID.web.app` et parle à ton
backend local via le tunnel.

## Tester les images en local

```bash
docker compose up --build
```

- Frontend : http://localhost:5173
- Backend : http://localhost:8081
- MySQL : port **13306** côté machine (13306 → 3306 dans le conteneur, pour ne
  pas entrer en conflit avec un MySQL déjà installé). Données conservées dans
  le volume `mysql-data`.

Pour tout arrêter : `docker compose down` (ajoutez `-v` pour effacer la base).

## Plus tard : App Engine (avec facturation)

Le dossier `task_manager_backend/app.yaml` et l'ancien job `deploy-backend`
(présent dans le workflow, marqué `if: false`) sont prêts. Quand tu auras
activé la facturation :

1. suivre `docs/etape2-ressources-gcp.html` (App Engine + Cloud SQL + secret
   + rôles) ;
2. dans `.github/workflows/ci-cd.yml`, remplacer `if: false` par
   `if: github.event_name == 'push' && github.ref == 'refs/heads/main'` ;
3. ajouter les variables GitHub `CLOUDSQL_INSTANCE`, `DB_NAME`, `DB_USER` ;
4. supprimer `VITE_API_URL` : le pipeline récupère alors automatiquement
   l'URL du backend déployé.

## Dépannage

| Symptôme | Cause probable | Solution |
| --- | --- | --- |
| Le frontend affiche « Impossible de contacter le serveur » | Tunnel arrêté ou `VITE_API_URL` incorrect | Relancer le backend + le tunnel, corriger `VITE_API_URL`, repousser |
| Message d'avertissement ngrok dans le navigateur | Page d'interstitiel ngrok | Ajouter l'en-tête `ngrok-skip-browser-warning` (ou utiliser cloudflared) |
| Erreur CORS | Origine non autorisée | Le backend autorise déjà toutes les origines (voir `ApplicationConfig`) |
| Firebase : `HTTP Error: 403` | Rôle `firebasehosting.admin` manquant | Rejouer la configuration du compte de service |
| Firebase : site Hosting introuvable | Firebase pas associé au projet | Rejouer `firebase projects:addfirebase` |
| Le backend ne démarre pas : `Access denied for user` | MySQL local absent ou mauvais identifiants | Vérifier `application-dev.yml` (root sans mot de passe sur 3306) ou utiliser `docker compose` |

## Structure du monorepo

```
Task Manager/
├── .github/workflows/ci-cd.yml    Pipeline GitHub Actions
├── firebase.json                  Configuration Firebase Hosting
├── docker-compose.yml             Application complète en local
├── docs/                          Guides (dont ressources GCP)
├── task_manager_backend/          API Spring Boot (Java 17)
│   ├── app.yaml                   Configuration App Engine (plus tard)
│   ├── Dockerfile
│   └── src/...
└── task_manager_frontend/         Application React (Vite)
    ├── Dockerfile
    ├── nginx.conf
    └── src/...
```
