# Build stage
FROM gradle:7.6-jdk17 AS builder
WORKDIR /app
COPY . .
RUN gradle build -DskipTests

# Runtime stage
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
