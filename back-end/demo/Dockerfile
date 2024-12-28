# Usar una imagen base con OpenJDK 21
FROM maven:3.9.5-eclipse-temurin-21 AS build


# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar el archivo pom.xml (para que Maven pueda resolver las dependencias)
COPY ./pom.xml /app/

# Descargar las dependencias del proyecto sin compilar
RUN mvn dependency:go-offline

# Copiar el resto del código fuente de la aplicación al contenedor
COPY ./src /app/src/

# Ejecutar mvn clean package para compilar y empaquetar la aplicación
RUN mvn clean package -DskipTests -Dfile.encoding=UTF-8

FROM openjdk:21-jdk-slim AS deploy

WORKDIR /app

COPY --from=build /app/target/demo-0.0.1-SNAPSHOT.jar app.jar

ARG JWT_SECRET_KEY
ARG DB_PASSWORD
ARG DB_USER
ARG DB_HOST
ARG SUPER_ADMIN
ARG FRONTEND_URL

ENV JWT_SECRET_KEY=${JWT_SECRET_KEY}
ENV DB_PASSWORD=${DB_PASSWORD}
ENV DB_USER=${DB_USER}
ENV DB_HOST=${DB_HOST}
ENV SUPER_ADMIN=${SUPER_ADMIN}
ENV FRONTEND_URL=${FRONTEND_URL}

RUN mkdir -p /app/src/main/resources && touch /app/src/main/resources/.env

# Crear el archivo .env en el contenedor
RUN echo "JWT_SECRET_KEY=${JWT_SECRET_KEY}" >> /app/src/main/resources/.env && \
    echo "DB_PASSWORD=${DB_PASSWORD}" >> /app/src/main/resources/.env && \
    echo "DB_USER=${DB_USER}" >> /app/src/main/resources/.env && \
    echo "DB_HOST=${DB_HOST}" >> /app/src/main/resources/.env && \
    echo "SUPER_ADMIN=${SUPER_ADMIN}" >> /app/src/main/resources/.env \
    echo "FRONTEND_URL=${FRONTEND_URL}" >> /app/src/main/resources/.env


# Exponer el puerto en el que la aplicación Spring Boot escucha
EXPOSE 4000

# Comando para ejecutar la aplicación cuando el contenedor se inicie
ENTRYPOINT ["java", "-jar", "app.jar"]
