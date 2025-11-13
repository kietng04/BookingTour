// Dùng đường dẫn tương đối để trình duyệt gửi same-origin tới Vite dev server
// và proxy qua gateway → tránh CORS khi chạy MCP Playwright
const API_BASE_URL = '/api';

// Get admin token from storage
const getAdminToken = () => {
  return localStorage.getItem('bt-admin-token');
};

const getAdminHeaders = () => {
  const token = getAdminToken();
  return token ? {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  } : {
    'Content-Type': 'application/json',
  };
};

async function fetchAdminAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: getAdminHeaders(),
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if (response.status === 401) {
      // Unauthorized - clear token and redirect to login
      console.warn('Unauthorized access, redirecting to login...');
      localStorage.removeItem('bt-admin-token');
      window.location.href = '/auth/login';
      return;
    }

    if (response.status === 403) {
      // Forbidden - insufficient permissions
      throw new Error('Insufficient permissions for this action');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Request failed' }));
      const error = new Error(errorData.message || `HTTP ${response.status}`);
      // Attach response information for better error handling
      error.response = {
        status: response.status,
        statusText: response.statusText,
        data: errorData
      };
      throw error;
    }

    // Handle empty response body (e.g., 204 No Content or DELETE with 200 OK but no body)
    const contentLength = response.headers.get('content-length');
    if (contentLength === '0' || response.status === 204) {
      return null;
    }

    // Try to parse JSON, return null if empty
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  } catch (error) {
    console.error(`Admin API Error (${endpoint}):`, error);
    throw error;
  }
}

// Legacy function for backward compatibility
async function fetchAPI(endpoint, options = {}) {
  return fetchAdminAPI(endpoint, options);
}

export const toursAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/tours${query ? `?${query}` : ''}`);
  },

  getById: (tourId) => fetchAPI(`/tours/${tourId}`),

  create: (tourData) => fetchAPI('/tours', {
    method: 'POST',
    body: JSON.stringify(tourData),
  }),

  update: (tourId, tourData) => fetchAPI(`/tours/${tourId}`, {
    method: 'PUT',
    body: JSON.stringify(tourData),
  }),

  delete: (tourId) => fetchAPI(`/tours/${tourId}`, {
    method: 'DELETE',
  }),
};

export const departuresAPI = {
  getByTour: (tourId, params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/tours/${tourId}/departures${query ? `?${query}` : ''}`);
  },

  getAll: async (params = {}) => {
    try {
      const toursData = await toursAPI.getAll(params);
      const tours = toursData.content || toursData || [];

      if (!Array.isArray(tours)) {
        console.error('Tours data is not an array:', tours);
        return [];
      }

      const allDepartures = [];
      for (const tour of tours) {
        const tourId = tour.id ?? tour.tourId;
        if (!tourId) continue;

        try {
          const departures = await fetchAPI(`/tours/${tourId}/departures`);
          if (Array.isArray(departures)) {
            departures.forEach(dep => {
              if (dep && typeof dep === 'object') {
                allDepartures.push({
                  ...dep,
                  departureId: dep.id ?? dep.departureId,
                  tourName: tour.tourName || tour.tour_name,
                  tourId,
                });
              }
            });
          }
        } catch (err) {
          console.error(`Failed to fetch departures for tour ${tourId}:`, err);
        }
      }
      return allDepartures;
    } catch (error) {
      console.error('Failed to fetch all departures:', error);
      return [];
    }
  },

  create: (tourId, departureData) => fetchAPI(`/tours/${tourId}/departures`, {
    method: 'POST',
    body: JSON.stringify(departureData),
  }),

  update: (tourId, departureId, departureData) =>
    fetchAPI(`/tours/${tourId}/departures/${departureId}`, {
      method: 'PUT',
      body: JSON.stringify(departureData),
    }),

  delete: (tourId, departureId) =>
    fetchAPI(`/tours/${tourId}/departures/${departureId}`, {
      method: 'DELETE',
    }),
};

export const bookingsAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/bookings${query ? `?${query}` : ''}`);
  },

  getById: (bookingId) => fetchAPI(`/bookings/${bookingId}`),

  getByDeparture: (departureId, params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/bookings/departure/${departureId}${query ? `?${query}` : ''}`);
  },

  getByUser: (userId, params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/bookings/user/${userId}${query ? `?${query}` : ''}`);
  },

  cancel: (bookingId) => fetchAPI(`/bookings/${bookingId}`, {
    method: 'DELETE',
  }),
};

export const usersAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/users${query ? `?${query}` : ''}`);
  },

  getById: (userId) => fetchAPI(`/users/${userId}`),
};

// Tour schedules CRUD
export const schedulesAPI = {
  getAll: (tourId) => fetchAPI(`/tours/${tourId}/schedules`),
  create: (tourId, data) => fetchAPI(`/tours/${tourId}/schedules`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (tourId, scheduleId, data) => fetchAPI(`/tours/${tourId}/schedules/${scheduleId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (tourId, scheduleId) => fetchAPI(`/tours/${tourId}/schedules/${scheduleId}`, {
    method: 'DELETE',
  }),
};

// Tour images CRUD
export const imagesAPI = {
  getAll: (tourId) => fetchAPI(`/tours/${tourId}/images`),
  create: (tourId, data) => fetchAPI(`/tours/${tourId}/images`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (tourId, imageId, data) => fetchAPI(`/tours/${tourId}/images/${imageId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (tourId, imageId) => fetchAPI(`/tours/${tourId}/images/${imageId}`, {
    method: 'DELETE',
  }),
};

// Tour discounts CRUD
export const discountsAPI = {
  getAll: (tourId) => fetchAPI(`/tours/${tourId}/discounts`),
  create: (tourId, data) => fetchAPI(`/tours/${tourId}/discounts`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (tourId, discountId, data) => fetchAPI(`/tours/${tourId}/discounts/${discountId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (tourId, discountId) => fetchAPI(`/tours/${tourId}/discounts/${discountId}`, {
    method: 'DELETE',
  }),
};

// Dashboard API
export const dashboardAPI = {
  getStats: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/dashboard/stats${query ? `?${query}` : ''}`);
  },

  getRevenueTrends: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/dashboard/revenue-trends${query ? `?${query}` : ''}`);
  },

  getTopTours: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/dashboard/top-tours${query ? `?${query}` : ''}`);
  },

  getBookingStatus: () => fetchAPI('/dashboard/booking-status'),

  getDepartureOccupancy: () => fetchAPI('/dashboard/departure-occupancy'),
};

export default {
  tours: toursAPI,
  departures: departuresAPI,
  bookings: bookingsAPI,
  users: usersAPI,
  schedules: schedulesAPI,
  images: imagesAPI,
  discounts: discountsAPI,
  dashboard: dashboardAPI,
  fetchAdminAPI, // Export the new auth-aware function
};
