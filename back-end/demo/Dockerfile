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


COPY ./src/main/resources/.env /app/src/main/resources/.env


# Exponer el puerto en el que la aplicación Spring Boot escucha
EXPOSE 4000

# Comando para ejecutar la aplicación cuando el contenedor se inicie
ENTRYPOINT ["java", "-jar", "app.jar"]
