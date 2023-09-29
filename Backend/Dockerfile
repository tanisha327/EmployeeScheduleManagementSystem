# Use the official Maven image with JDK 17 as the base image
FROM maven:3.8.3-openjdk-17

# Set the working directory in the container
WORKDIR /app

# Copy the Maven build files to the container
COPY pom.xml .
COPY src ./src

# Build the Spring Boot application with Maven
RUN mvn package

# Rename the JAR file to app.jar
RUN mv target/shiftninja-0.0.1.jar target/app.jar

# Set the entry point to run the Spring Boot application
ENTRYPOINT ["java", "-jar", "target/app.jar"]

# Expose the port for Spring Boot application to listen
EXPOSE 8080
