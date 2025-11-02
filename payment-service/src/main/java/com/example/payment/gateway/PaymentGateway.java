package com.example.payment.gateway;

import com.example.payment.gateway.dto.MoMoCallbackRequest;
import com.example.payment.gateway.dto.MoMoCreateOrderRequest;
import com.example.payment.gateway.dto.MoMoCreateOrderResponse;

public interface PaymentGateway {

    MoMoCreateOrderResponse createOrder(MoMoCreateOrderRequest request);

    boolean verifyCallback(MoMoCallbackRequest callbackRequest);
}

