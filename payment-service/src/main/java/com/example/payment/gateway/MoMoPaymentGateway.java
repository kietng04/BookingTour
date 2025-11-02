package com.example.payment.gateway;

import com.example.payment.config.MoMoProperties;
import com.example.payment.gateway.dto.MoMoCallbackRequest;
import com.example.payment.gateway.dto.MoMoCreateOrderRequest;
import com.example.payment.gateway.dto.MoMoCreateOrderResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.util.LinkedHashMap;
import java.util.Map;

public class MoMoPaymentGateway implements PaymentGateway {

    private static final Logger log = LoggerFactory.getLogger(MoMoPaymentGateway.class);

    private final MoMoProperties properties;
    private final MoMoSignatureGenerator signatureGenerator;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final String baseUrl;

    public MoMoPaymentGateway(MoMoProperties properties,
                              MoMoSignatureGenerator signatureGenerator,
                              RestTemplateBuilder restTemplateBuilder,
                              ObjectMapper objectMapper) {
        this.properties = properties;
        this.signatureGenerator = signatureGenerator;
        this.restTemplate = restTemplateBuilder
                .setConnectTimeout(Duration.ofSeconds(10))
                .setReadTimeout(Duration.ofSeconds(20))
                .build();
        this.objectMapper = objectMapper;
        this.baseUrl = resolveBaseUrl(properties.getEnvironment());
    }

    @Override
    public MoMoCreateOrderResponse createOrder(MoMoCreateOrderRequest request) {
        Map<String, Object> payload = buildPayload(request);
        String amount = normalizeAmount(request.getAmount());

        String signature = signatureGenerator.signCreateOrder(
                request.getOrderId(),
                request.getRequestId(),
                amount,
                request.getOrderInfo(),
                defaultString(request.getExtraData()),
                request.getIpnUrl(),
                request.getRedirectUrl(),
                request.getRequestType() != null ? request.getRequestType() : properties.getRequestType()
        );
        payload.put("signature", signature);

        log.info("[MoMo] Sending create order request orderId={}, requestId={}, amount={}, partnerCode={}",
                request.getOrderId(), request.getRequestId(), amount, properties.getPartnerCode());
        if (log.isDebugEnabled()) {
            log.debug("[MoMo] Request payload: {}", sanitizePayloadForLog(payload));
        }

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(
                    baseUrl + MoMoConstants.CREATE_ORDER_PATH,
                    payload,
                    String.class
            );

            if (!response.getStatusCode().is2xxSuccessful()) {
                String errorBody = response.getBody();
                log.error("[MoMo] HTTP {} calling create order. Body={}",
                        response.getStatusCode(), errorBody);
                throw new MoMoGatewayException("MoMo responded with HTTP " + response.getStatusCode()
                        + (errorBody != null ? ": " + errorBody : ""));
            }

            String body = response.getBody();
            if (body == null) {
                throw new MoMoGatewayException("MoMo empty response for order " + request.getOrderId());
            }

            MoMoCreateOrderResponse parsed = objectMapper.readValue(body, MoMoCreateOrderResponse.class);
            parsed.setRawResponse(body);

             log.info("[MoMo] Create order success HTTP {} resultCode={} message={} payUrl={}",
                    response.getStatusCodeValue(), parsed.getResultCode(), parsed.getMessage(), parsed.getPayUrl());

            if (parsed.getResultCode() != MoMoConstants.RESULT_SUCCESS) {
                log.warn("[MoMo] Create order failed: resultCode={}, message={}",
                        parsed.getResultCode(), parsed.getMessage());
            } else {
                log.info("[MoMo] Create order success. orderId={}, payUrl={}",
                        parsed.getOrderId(), parsed.getPayUrl());
            }

            return parsed;

        } catch (RestClientException ex) {
            throw new MoMoGatewayException("Error calling MoMo create order API", ex);
        } catch (Exception ex) {
            throw new MoMoGatewayException("Failed to parse MoMo response", ex);
        }
    }

    @Override
    public boolean verifyCallback(MoMoCallbackRequest callbackRequest) {
        return signatureGenerator.verifyCallback(callbackRequest);
    }

    private Map<String, Object> buildPayload(MoMoCreateOrderRequest request) {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("partnerCode", properties.getPartnerCode());
        payload.put("partnerName", properties.getPartnerName());
        payload.put("storeId", properties.getStoreName());
        payload.put("requestId", request.getRequestId());
        payload.put("amount", normalizeAmount(request.getAmount()));
        payload.put("orderId", request.getOrderId());
        payload.put("orderInfo", request.getOrderInfo());
        payload.put("redirectUrl", request.getRedirectUrl());
        payload.put("ipnUrl", request.getIpnUrl());
        payload.put("lang", request.getLang() != null ? request.getLang() : properties.getLang());
        payload.put("extraData", defaultString(request.getExtraData()));
        payload.put("requestType", request.getRequestType() != null ? request.getRequestType() : properties.getRequestType());
        payload.put("autoCapture", true);
        return payload;
    }

    private String normalizeAmount(BigDecimal amount) {
        if (amount == null) {
            return "0";
        }
        BigDecimal normalized = amount.setScale(0, RoundingMode.HALF_UP);
        return normalized.toPlainString();
    }

    private String defaultString(String value) {
        return value == null ? "" : value;
    }

    private String resolveBaseUrl(String environment) {
        if ("prod".equalsIgnoreCase(environment) || "production".equalsIgnoreCase(environment)) {
            return MoMoConstants.PROD_ENDPOINT;
        }
        return MoMoConstants.TEST_ENDPOINT;
    }

    private Map<String, Object> sanitizePayloadForLog(Map<String, Object> payload) {
        Map<String, Object> copy = new LinkedHashMap<>(payload);
        if (copy.containsKey("signature")) {
            copy.put("signature", "***");
        }
        return copy;
    }
}
