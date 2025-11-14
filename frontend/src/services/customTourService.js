const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

async function fetchAPI(endpoint, options = {}) {
  const { authToken, headers: customHeaders, ...restOptions } = options;
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const config = {
    headers,
    ...restOptions,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Yêu cầu thất bại' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Lỗi API (${endpoint}):`, error);
    throw error;
  }
}

export const customTourAPI = {
  /**
   * Create custom tour request
   */
  create: (userId, customTourData, token) => {
    console.log('[customTourAPI.create] payload', customTourData);
    return fetchAPI(`/custom-tours?userId=${userId}`, {
      method: 'POST',
      body: JSON.stringify(customTourData),
      authToken: token,
    });
  },

  /**
   * Get custom tour by ID
   */
  getById: (customTourId, token) =>
    fetchAPI(`/custom-tours/${customTourId}`, token ? { authToken: token } : undefined),

  /**
   * Get all custom tours for a user
   */
  getByUserId: (userId, token) =>
    fetchAPI(`/custom-tours/user/${userId}`, token ? { authToken: token } : undefined),
};

export default customTourAPI;
