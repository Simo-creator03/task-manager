# ============================================================================
# IMAGE DOCKER DU BACKEND (Spring Boot)
#
# Construction en deux étapes :
#   1. "build"  : compile le projet avec Maven et produit le jar exécutable ;
#   2. "runtime": copie uniquement le jar dans une image JRE légère.
#
# Les tests ne sont pas relancés ici : ils le sont déjà par le pipeline CI.
# ============================================================================

# ---------- Étape 1 : compilation ----------
FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /app

# On copie d'abord le pom seul pour profiter du cache Docker :
# tant que les dépendances ne changent pas, cette couche n'est pas reconstruite.
COPY pom.xml ./
RUN mvn -B -q dependency:go-offline

# Puis le code source, et on construit le jar exécutable.
COPY src ./src
RUN mvn -B -DskipTests package

# ---------- Étape 2 : exécution ----------
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Bonne pratique : ne pas exécuter l'application en root.
RUN addgroup -S app && adduser -S app -G app
USER app

# Le jar Spring Boot (le fichier *.jar.original est exclu par le motif *.jar).
COPY --from=build /app/target/*.jar app.jar

# Cloud Run fournit le port via la variable PORT (voir application-prod.yml).
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
