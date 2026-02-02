# Build stage
# Use Gradle 8.x with JDK 21 (required by project toolchain)
FROM gradle:8.4-jdk21 AS builder
WORKDIR /app

# Copy gradle wrapper and build.gradle first for better caching
COPY build.gradle settings.gradle gradlew gradlew.bat ./
COPY gradle/ ./gradle/

# Make gradlew executable and download dependencies
RUN chmod +x ./gradlew && ./gradlew --version

# Copy source code
COPY src/ ./src/

# Build the application
RUN ./gradlew build -DskipTests

# Runtime stage
# Use Eclipse Temurin JDK 21 to match build environment
FROM eclipse-temurin:21-jdk
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
