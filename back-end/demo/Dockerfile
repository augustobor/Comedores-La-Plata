# Usar una imagen base con OpenJDK 21
FROM openjdk:21-jdk-slim AS build

# Instalar Maven
RUN apt-get update && apt-get install -y maven

# Definir los argumentos de construcción
ARG DB_PASSWORD
ARG JWT_SECRET_KEY
ARG DB_HOST
ARG DB_USER
ARG SUPERADMIN

# Definir variables de entorno dentro del contenedor con los valores de los argumentos
ENV JWT_SECRET_KEY=${JWT_SECRET_KEY}
ENV DB_PASSWORD=${DB_PASSWORD}
ENV DB_HOST=${DB_HOST}
ENV DB_USER=${DB_USER}
ENV SUPERADMIN=${SUPERADMIN}

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar el archivo pom.xml (para que Maven pueda resolver las dependencias)
COPY ./pom.xml /app/

# Descargar las dependencias del proyecto sin compilar
RUN mvn dependency:go-offline

# Copiar el resto del código fuente de la aplicación al contenedor
COPY ./src /app/src/

# Ejecutar mvn clean package para compilar y empaquetar la aplicación
RUN mvn clean package

RUN mv /app/target/demo-0.0.1-SNAPSHOT.jar /app/demo-0.0.1-SNAPSHOT.jar 

# Crear archivo .env vacío
RUN touch /app/src/main/resources/.env
# Añadir las variables de entorno al archivo .env
RUN echo "DB_HOST=${DB_HOST}" >> /app/src/main/resources/.env && \
    echo "DB_PORT=${DB_PORT}" >> /app/src/main/resources/.env && \
    echo "DB_USER=${DB_USER}" >> /app/src/main/resources/.env && \
    echo "DB_PASSWORD=${DB_PASSWORD}" >> /app/src/main/resources/.env

# Exponer el puerto en el que la aplicación Spring Boot escucha
EXPOSE 4000

# Comando para ejecutar la aplicación cuando el contenedor se inicie
ENTRYPOINT ["java", "-jar", "demo-0.0.1-SNAPSHOT.jar"]
