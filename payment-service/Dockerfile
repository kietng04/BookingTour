FROM openjdk:17-jdk-alpine
VOLUME /tmp
COPY target/payment-service-0.0.1-SNAPSHOT.jar payment-service.jar
EXPOSE 8084
ENTRYPOINT ["java", "-jar", "/payment-service.jar"]

