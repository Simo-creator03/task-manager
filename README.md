# Task Manager

Application de gestion de tâches : **backend Spring Boot** (Java) + **frontend React** (Vite) + **base MySQL**. Elle s'exécute **entièrement en local**.

## Fonctionnalités

- Inscription et connexion (authentification JWT)
- Création, modification et suppression de tâches
- Statuts et filtres sur les tâches
- Compte de démonstration créé au démarrage : **nelson / 12345**

## Architecture et choix techniques

```
Task Manager/
├── task_manager_backend/    API REST Spring Boot (Java 17, MySQL)
├── task_manager_frontend/   Interface React + TypeScript (Vite)
└── docker-compose.yml       Lancement de l'ensemble en une commande
```

**Backend**

| Choix | Pourquoi |
| --- | --- |
| Spring Boot 2.7 + Spring Web | API REST classique et rapide à mettre en place |
| Spring Security + JWT | Endpoints protégés sans session serveur |
| Spring Data JPA / Hibernate | Accès à la base sans écrire de SQL |
| MySQL 8 (H2 pour les tests) | Base relationnelle ; H2 évite d'installer MySQL pour les tests |
| MapStruct | Conversion automatique entités ↔ DTO |
| Lombok | Moins de code répétitif (getters, constructeurs...) |
| Swagger (springfox) | Documentation interactive de l'API |

**Frontend**

| Choix | Pourquoi |
| --- | --- |
| React 19 + TypeScript | Interface à composants, typée |
| Vite | Démarrage et build très rapides |
| React Router | Navigation entre les pages (SPA) |
| `fetch` natif | Aucune librairie HTTP externe |
| CSS pur | Pas de framework CSS à apprendre |

**Local**

| Choix | Pourquoi |
| --- | --- |
| Docker Compose | MySQL + backend + frontend en une seule commande |

## Mon expérience avec React

Ce projet a été bien plus qu'un exercice pour moi : React a été un **vrai défi**.

J'arrivais avec mes habitudes, ma façon de penser le front-end, et il a fallu réapprendre autrement : le JSX, les hooks, la gestion d'état... Il y a eu des moments de doute, des heures à chercher pourquoi un composant ne se comportait pas comme prévu, et parfois l'impression de repartir de zéro.

Mais j'ai eu la chance de pouvoir **apprendre**, à mon rythme, sur un projet concret qui me tenait à cœur. Et petit à petit, la lumière s'est faite. Venant d'**Angular**, j'ai retrouvé des concepts familiers — les composants, les props, la séparation des responsabilités, le routage, l'état — et l'assimilation a finalement été **plutôt rapide**. C'était une belle surprise, et une vraie fierté.

Aujourd'hui, je repars de ce projet avec une compétence de plus, une autre vision du développement front-end et beaucoup plus de confiance. Ce défi restera une étape marquante de mon parcours.

## Prérequis

- **Option Docker** : Docker Desktop uniquement.
- **Option manuelle** : Java 17, Node.js 20+, MySQL 8.

## Installation et exécution

### Option 1 — Docker (tout-en-un, recommandé)

À la racine du projet :

```bash
docker compose up --build
```

| Service | Adresse |
| --- | --- |
| Frontend | http://localhost:5173 |
| Backend (API) | http://localhost:8081 |
| Documentation Swagger | http://localhost:8081/swagger-ui.html |
| MySQL | port **13306** sur ta machine |

Pour arrêter : `docker compose down` (ajoute `-v` pour effacer la base).

### Option 2 — Manuellement (développement)

**1. Démarrer MySQL**

Base `task_manager`, utilisateur `root` sans mot de passe, port `3306`
(configuration dans `task_manager_backend/src/main/resources/application-dev.yml`).

**2. Lancer le backend**

```powershell
cd task_manager_backend
.\mvnw.cmd spring-boot:run
```

Sous macOS/Linux : `./mvnw spring-boot:run`

→ API sur http://localhost:8081, Swagger sur http://localhost:8081/swagger-ui.html

**3. Lancer le frontend**

```bash
cd task_manager_frontend
npm install     # une seule fois
npm run dev
```

→ Interface sur http://localhost:5173 (elle appelle le backend sur le port 8081).

### Lancer les tests

```bash
cd task_manager_backend
.\mvnw.cmd verify       # tests backend (base H2 en mémoire, MySQL inutile)
```

```bash
cd task_manager_frontend
npm run lint            # analyse ESLint
npm run build           # vérification TypeScript + build de production
```

Un workflow GitHub Actions (`.github/workflows/ci.yml`) lance automatiquement ces
vérifications à chaque push ou pull request sur `main`. Aucun déploiement en ligne.

## Déploiement en ligne

Le déploiement sur **Google Cloud Run** n'a pas pu être réalisé : l'activation de
la facturation Google Cloud m'a bloqué (impossible de créer les ressources sans
compte de facturation). L'application est donc prévue pour tourner **uniquement
en local**, avec les deux options ci-dessus.

## Structure rapide du code

```
Task Manager/
├── .github/workflows/ci.yml     Tests automatiques (GitHub Actions)
├── task_manager_backend/
│   ├── src/main/java/...        contrôleurs, services, repositories, sécurité JWT
│   ├── src/main/resources/      configuration dev / prod / test
│   └── Dockerfile               image du backend
├── task_manager_frontend/
│   ├── src/                     pages, composants, hooks, appels API
│   ├── nginx.conf               serveur du conteneur frontend
│   ├── Dockerfile               image du frontend
│   └── README.md                guide de lecture du code React
└── docker-compose.yml           MySQL + backend + frontend
```
