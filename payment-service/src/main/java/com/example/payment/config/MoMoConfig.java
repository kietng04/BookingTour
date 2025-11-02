package com.example.payment.config;

import com.example.payment.gateway.MoMoPaymentGateway;
import com.example.payment.gateway.MoMoSignatureGenerator;
import com.example.payment.gateway.PaymentGateway;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties(MoMoProperties.class)
public class MoMoConfig {

    @Bean
    public MoMoSignatureGenerator momoSignatureGenerator(MoMoProperties properties) {
        return new MoMoSignatureGenerator(properties);
    }

    @Bean
    public PaymentGateway momoPaymentGateway(MoMoProperties properties,
                                             MoMoSignatureGenerator signatureGenerator,
                                             RestTemplateBuilder restTemplateBuilder,
                                             ObjectMapper objectMapper) {
        return new MoMoPaymentGateway(properties, signatureGenerator, restTemplateBuilder, objectMapper);
    }
}

