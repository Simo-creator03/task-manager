# ============================================================================
# IMAGE DOCKER DU FRONTEND (React + Vite, servi par nginx)
#
# Construction en deux étapes :
#   1. "build"  : compile l'application React avec npm (produit le dossier dist/) ;
#   2. "runtime": copie dist/ dans une image nginx qui sert les fichiers statiques.
#
# IMPORTANT : l'URL du backend est "figée" dans le bundle JavaScript au moment
# du build (Vite remplace import.meta.env.VITE_API_URL). Elle se passe donc en
# argument de build, comme dans le pipeline :
#   docker build --build-arg VITE_API_URL=https://mon-backend... .
# ============================================================================

# ---------- Étape 1 : compilation React ----------
FROM node:22-alpine AS build

WORKDIR /app

# L'URL de l'API, fournie par le pipeline (GitHub Actions) ou docker-compose.
ARG VITE_API_URL=http://localhost:8081
ENV VITE_API_URL=$VITE_API_URL

# Installation des dépendances (avec le cache Docker sur package-lock.json).
COPY package*.json ./
RUN npm ci

# Copie du code puis build de production (tsc + vite build -> dossier dist/).
COPY . .
RUN npm run build

# ---------- Étape 2 : serveur nginx ----------
FROM nginx:1.27-alpine

# Configuration nginx : port 8080 + fallback SPA + cache des assets.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Les fichiers statiques générés par Vite.
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
