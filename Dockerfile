FROM openjdk:11-jre-slim
COPY target/your-app.jar /app.jar
ENTRYPOINT ["java", "-jar", "/app.jar"]
