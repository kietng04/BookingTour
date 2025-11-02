package com.example.payment.gateway;

public final class MoMoConstants {

    private MoMoConstants() {
    }

    public static final String TEST_ENDPOINT = "https://test-payment.momo.vn";
    public static final String PROD_ENDPOINT = "https://api.momo.vn";
    public static final String CREATE_ORDER_PATH = "/v2/gateway/api/create";
    public static final String QUERY_ORDER_PATH = "/v2/gateway/api/query";
    public static final String REFUND_PATH = "/v2/gateway/api/refund";

    public static final String DEFAULT_REQUEST_TYPE = "captureWallet";
    public static final String DEFAULT_LANG = "vi";

    public static final int RESULT_SUCCESS = 0;
    public static final int RESULT_DUPLICATE = -11;
    public static final int RESULT_PROCESSING = 1000;
}
