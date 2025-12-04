const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

interface MoMoOrderResponse {
  bookingId: string;
  orderId: string;
  requestId: string;
  payUrl?: string;
  deeplink?: string;
  qrCodeUrl?: string;
  resultCode: number;
  message?: string;
}

interface PaymentDetailsResponse {
  bookingId: number;
  status: string;
  payUrl?: string;
  deeplink?: string;
  qrCodeUrl?: string;
  paymentMethod?: string;
  message?: string;
  createdAt?: string;
}

function buildUrl(path: string) {
  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('authToken');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

async function handleJsonResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text();
    const message = text || response.statusText || 'Yêu cầu thất bại';
    throw new Error(message);
  }
  if (response.status === 204) {
    return {} as T;
  }
  return (await response.json()) as T;
}

type CreateMoMoOrderParams = {
  bookingId: number | string;
  amount: number;
  userId: number;
  orderInfo?: string;
  extraData?: string;
};

export async function createMoMoOrder(params: CreateMoMoOrderParams): Promise<MoMoOrderResponse> {
  const { bookingId, amount, userId, orderInfo, extraData } = params;

  const payload = {
    bookingId: String(bookingId),
    amount,
    userId,
    orderInfo,
    extraData,
  };

  const response = await fetch(buildUrl('/payments/momo/orders'), {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  return handleJsonResponse<MoMoOrderResponse>(response);
}

export async function getPaymentStatus(bookingId: number): Promise<PaymentDetailsResponse> {
  const response = await fetch(buildUrl(`/payments/booking/${bookingId}`), {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  return handleJsonResponse<PaymentDetailsResponse>(response);
}

export async function getBookingStatus(bookingId: number) {
  const response = await fetch(buildUrl(`/bookings/${bookingId}`), {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  return handleJsonResponse<unknown>(response);
}

export type { MoMoOrderResponse, PaymentDetailsResponse, CreateMoMoOrderParams };
