# Stage 1: Build stage
FROM maven:3.9-eclipse-temurin-17-alpine AS builder

WORKDIR /app

# Copy the Maven configuration files
COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .
COPY mvnw.cmd .

# Download project dependencies
# This layer will be cached if pom.xml hasn't changed
RUN mvn dependency:go-offline -B

# Copy the project source code
COPY src src

# Build the application
RUN mvn clean package -DskipTests

# Stage 2: Run stage
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy the built application from the builder stage
COPY --from=builder /app/target/*.jar app.jar

# Expose application port
EXPOSE 8080

# Set health check
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:8080/api/v1/actuator/health || exit 1

# Run the application
CMD ["java", "-jar", "app.jar"]
