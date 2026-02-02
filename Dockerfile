# Root Dockerfile that builds the project located in api/milha

# Build stage
# Use Gradle 8.x which is required by Spring Boot plugin
FROM gradle:8.4-jdk17 AS builder
WORKDIR /app

# Copy gradle wrapper and build.gradle first for better caching
COPY api/milha/build.gradle api/milha/settings.gradle api/milha/gradlew api/milha/gradlew.bat ./
COPY api/milha/gradle/ ./gradle/

# Download dependencies
RUN ./gradlew --version

# Copy source code
COPY api/milha/src/ ./src/
COPY api/milha/bin/ ./bin/

# Build the application
RUN ./gradlew build -DskipTests

# Runtime stage
# Use Eclipse Temurin JDK which is widely available on Docker Hub
FROM eclipse-temurin:17-jdk
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
