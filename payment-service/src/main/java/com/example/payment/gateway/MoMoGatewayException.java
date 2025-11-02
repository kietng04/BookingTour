package com.example.payment.gateway;

public class MoMoGatewayException extends RuntimeException {

    public MoMoGatewayException(String message) {
        super(message);
    }

    public MoMoGatewayException(String message, Throwable cause) {
        super(message, cause);
    }
}

