FROM eclipse-temurin:17-jdk-alpine
VOLUME /tmp
COPY target/tour-service-0.0.1-SNAPSHOT.jar tour-service.jar
EXPOSE 8082
ENTRYPOINT ["java", "-jar", "/tour-service.jar"]

