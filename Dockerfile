# Root Dockerfile that builds the project located in api/milha

# Build stage
FROM gradle:7.6-jdk17 AS builder
WORKDIR /app
COPY api/milha/ ./
RUN gradle build -DskipTests

# Runtime stage
# Use Eclipse Temurin JDK which is widely available on Docker Hub
FROM eclipse-temurin:17-jdk
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
