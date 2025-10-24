const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
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

export const toursAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/tours${query ? `?${query}` : ''}`);
  },

  getById: (tourId) => fetchAPI(`/tours/${tourId}`),

  getDepartures: (tourId, params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/tours/${tourId}/departures${query ? `?${query}` : ''}`);
  },

  getDepartureAvailability: (tourId, departureId) =>
    fetchAPI(`/tours/${tourId}/departures/availability?departureId=${departureId}`),
};

export const bookingsAPI = {
  create: (bookingData) => fetchAPI('/bookings', {
    method: 'POST',
    body: JSON.stringify(bookingData),
  }),

  getById: (bookingId) => fetchAPI(`/bookings/${bookingId}`),

  getUserBookings: (userId, params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/bookings/user/${userId}${query ? `?${query}` : ''}`);
  },

  cancel: (bookingId) => fetchAPI(`/bookings/${bookingId}`, {
    method: 'DELETE',
  }),
};

export const regionsAPI = {
  getAll: () => fetchAPI('/tours/regions'),
  getProvinces: (regionId) => fetchAPI(`/tours/regions/${regionId}/provinces`),
};

export default {
  tours: toursAPI,
  bookings: bookingsAPI,
  regions: regionsAPI,
};
