# Task Manager — Frontend React

Interface de l'application de gestion de tâches. Elle consomme l'API REST
Spring Boot du dossier `task_manager_backend` (par défaut sur `http://localhost:8081`).

- **React 19** + **TypeScript** + **Vite**
- **react-router-dom** pour la navigation
- **fetch** natif pour les appels HTTP (aucune librairie externe)

## Démarrage

### 1. Démarrer le backend

Dans le dossier `task_manager_backend` (MySQL doit être lancé) :

```powershell
.\mvnw.cmd spring-boot:run
```

L'API écoute sur `http://localhost:8081` (Swagger : `http://localhost:8081/swagger-ui.html`).
Un compte de test existe : **nelson / 12345**.

### 2. Démarrer le frontend

```bash
npm install     # une seule fois
npm run dev     # démarre Vite sur http://localhost:5173
```

### Autres scripts

| Commande          | Rôle                                                        |
| ----------------- | ----------------------------------------------------------- |
| `npm run dev`     | Serveur de développement avec rechargement automatique      |
| `npm run build`   | Vérification TypeScript + build de production (`dist/`)     |
| `npm run lint`    | Analyse ESLint (règles React hooks incluses)                |
| `npm run preview` | Sert localement le build de production                      |

### Changer l'adresse du backend

Créer un fichier `.env` à la racine :

```
VITE_API_URL=http://adresse-du-backend:8081
```

Puis relancer `npm run dev`.

## Comment lire le code (ordre conseillé)

Le code est commenté en français, bloc par bloc. Pour comprendre le projet,
il est recommandé de suivre cet ordre :

| Étape | Fichier                          | Ce qu'on y apprend                                      |
| ----- | -------------------------------- | ------------------------------------------------------- |
| 1     | `src/types/index.ts`             | La forme des données échangées avec l'API               |
| 2     | `src/api/client.ts`              | Le client HTTP central + ajout automatique du JWT       |
| 3     | `src/api/auth.ts` / `tasks.ts`   | Les appels aux endpoints (login, register, CRUD tâches) |
| 4     | `src/utils/`                     | Validation email/téléphone, libellés, dates             |
| 5     | `src/context/AuthContext.ts`     | Le partage de l'état de connexion (comme un service)    |
| 6     | `src/context/AuthProvider.tsx`   | Comment l'état de connexion est fourni à l'application  |
| 7     | `src/hooks/useTasks.ts`          | La logique des tâches isolée dans un hook personnalisé  |
| 8     | `src/components/`                | Les petits composants d'affichage (boutons, cartes...)  |
| 9     | `src/pages/`                     | Les trois pages : connexion, inscription, mes tâches    |
| 10    | `src/App.tsx`                    | Le tableau des routes                                   |
| 11    | `src/main.tsx`                   | Le démarrage de React                                   |

## Structure des dossiers

```
src/
├── api/          Appels HTTP (client central + services par domaine)
├── components/   Composants réutilisables (Navbar, TaskItem, modale...)
├── context/      État global d'authentification (contexte + provider)
├── hooks/        Logique réutilisable (useTasks)
├── pages/        Une page par route (/login, /register, /tasks)
├── types/        Types TypeScript partagés
├── utils/        Fonctions pures (validation, formatage, erreurs)
├── App.tsx       Déclaration des routes
├── main.tsx      Point d'entrée
├── index.css     Styles globaux (variables, boutons, formulaires)
└── App.css       Styles de mise en page (navbar, tâches, modale)
```

## Rappels utiles

- **StrictMode** : en développement, certains traitements sont exécutés deux fois
  (c'est normal, y compris deux appels API au premier chargement). En production,
  chaque traitement n'a lieu qu'une fois.
- **Convention de nommage** : les composants commencent par une majuscule
  (`TaskItem.tsx`), les hooks par `use` (`useTasks.ts`).
- **Formulaire contrôlé** : chaque champ a `value={etat}` et
  `onChange={(e) => setEtat(e.target.value)}`.
- **Listes** : toujours fournir une prop `key` stable (`key={task.id}`).
- **State** : ne jamais modifier un état directement, toujours passer par
  le setter avec une nouvelle valeur.
