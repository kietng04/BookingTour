package com.example.payment.gateway;

import com.example.payment.config.MoMoProperties;
import com.example.payment.gateway.dto.MoMoCallbackRequest;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Locale;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class MoMoSignatureGenerator {

    private static final String HMAC_SHA256 = "HmacSHA256";
    private static final Logger log = LoggerFactory.getLogger(MoMoSignatureGenerator.class);

    private final MoMoProperties properties;

    public MoMoSignatureGenerator(MoMoProperties properties) {
        this.properties = properties;
    }

    public String signCreateOrder(String orderId, String requestId, String amount, String orderInfo,
                                  String extraData, String ipnUrl, String redirectUrl, String requestType) {
        String rawSignature = "accessKey=" + properties.getAccessKey()
                + "&amount=" + amount
                + "&extraData=" + valueOrEmpty(extraData)
                + "&ipnUrl=" + ipnUrl
                + "&orderId=" + orderId
                + "&orderInfo=" + orderInfo
                + "&partnerCode=" + properties.getPartnerCode()
                + "&redirectUrl=" + redirectUrl
                + "&requestId=" + requestId
                + "&requestType=" + requestType;
        String signature = hmacSha256(rawSignature);
        if (log.isDebugEnabled()) {
            log.debug("[MoMo] Raw signature string: {}", rawSignature);
            log.debug("[MoMo] Generated signature: {}", signature);
        }
        return signature;
    }

    public boolean verifyCallback(MoMoCallbackRequest request) {
        String rawSignature = "accessKey=" + properties.getAccessKey()
                + "&amount=" + valueOrEmpty(request.getAmount())
                + "&extraData=" + valueOrEmpty(request.getExtraData())
                + "&message=" + valueOrEmpty(request.getMessage())
                + "&orderId=" + request.getOrderId()
                + "&orderInfo=" + valueOrEmpty(request.getOrderInfo())
                + "&orderType=" + valueOrEmpty(request.getOrderType())
                + "&partnerCode=" + request.getPartnerCode()
                + "&payType=" + valueOrEmpty(request.getPayType())
                + "&requestId=" + request.getRequestId()
                + "&responseTime=" + valueOrEmpty(request.getResponseTime())
                + "&resultCode=" + request.getResultCode()
                + "&transId=" + valueOrEmpty(request.getTransId());

        String expectedSignature = hmacSha256(rawSignature);
        return expectedSignature.equalsIgnoreCase(request.getSignature());
    }

    private String hmacSha256(String rawSignature) {
        try {
            Mac mac = Mac.getInstance(HMAC_SHA256);
            mac.init(new SecretKeySpec(properties.getSecretKey().getBytes(StandardCharsets.UTF_8), HMAC_SHA256));
            byte[] result = mac.doFinal(rawSignature.getBytes(StandardCharsets.UTF_8));
            return bytesToHex(result);
        } catch (Exception e) {
            throw new IllegalStateException("Unable to generate MoMo signature", e);
        }
    }

    private String bytesToHex(byte[] bytes) {
        StringBuilder hexString = new StringBuilder(2 * bytes.length);
        for (byte b : bytes) {
            String hex = Integer.toHexString(0xff & b).toLowerCase(Locale.ROOT);
            if (hex.length() == 1) {
                hexString.append('0');
            }
            hexString.append(hex);
        }
        return hexString.toString();
    }

    private String valueOrEmpty(Object value) {
        return value == null ? "" : value.toString();
    }
}
