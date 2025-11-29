FROM eclipse-temurin:17-jdk-alpine

VOLUME /tmp

COPY target/api-gateway-0.0.1-SNAPSHOT.jar api-gateway.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/api-gateway.jar"]
