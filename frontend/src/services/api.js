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

export const toursAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/tours${query ? `?${query}` : ''}`);
  },

  getById: (tourId) => fetchAPI(`/tours/${tourId}`),

  getBySlug: (slug) => fetchAPI(`/tours/by-slug/${slug}`),


  getDepartures: (tourId, params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/tours/${tourId}/departures${query ? `?${query}` : ''}`);
  },


  getDepartureAvailability: (tourId, departureId) =>
    fetchAPI(`/tours/${tourId}/departures/availability?departureId=${departureId}`),
};

export const bookingsAPI = {
  create: (bookingData, token) => {
    console.log('[bookingsAPI.create] payload', bookingData);
    return fetchAPI('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
      authToken: token,
    });
  },

  getById: (bookingId, token) => fetchAPI(`/bookings/${bookingId}`, token ? { authToken: token } : undefined),

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

export const reviewsAPI = {
  // Get all approved reviews (public)
  getAllApproved: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/reviews/approved${query ? `?${query}` : ''}`);
  },

  // Get approved reviews for a tour (public)
  getByTourId: (tourId, params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/reviews/tours/${tourId}${query ? `?${query}` : ''}`);
  },

  // Get review summary/statistics for a tour (public)
  getSummary: (tourId) => fetchAPI(`/reviews/tours/${tourId}/summary`),

  // Create a new review (authenticated)
  create: (tourId, reviewData, token) => {
    return fetchAPI(`/reviews/tours/${tourId}`, {
      method: 'POST',
      body: JSON.stringify(reviewData),
      authToken: token,
    });
  },

  // Update own review (authenticated)
  update: (reviewId, reviewData, token) => {
    return fetchAPI(`/reviews/${reviewId}`, {
      method: 'PUT',
      body: JSON.stringify(reviewData),
      authToken: token,
    });
  },

  // Delete own review (authenticated)
  delete: (reviewId, token) => {
    return fetchAPI(`/reviews/${reviewId}`, {
      method: 'DELETE',
      authToken: token,
    });
  },

  // Get current user's reviews (authenticated)
  getMyReviews: (token) => {
    return fetchAPI('/reviews/my-reviews', {
      authToken: token,
    });
  },

  // Admin: Get all reviews with filters
  getAllAdmin: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/reviews/admin${query ? `?${query}` : ''}`);
  },

  // Admin: Update review status
  updateStatus: (reviewId, status) => {
    return fetchAPI(`/reviews/admin/${reviewId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  // Admin: Delete any review
  deleteAdmin: (reviewId) => {
    return fetchAPI(`/reviews/admin/${reviewId}`, {
      method: 'DELETE',
    });
  },
};

export default {
  tours: toursAPI,
  bookings: bookingsAPI,
  regions: regionsAPI,
  reviews: reviewsAPI,
};
