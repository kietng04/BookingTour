const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

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
      console.warn('Unauthorized access, clearing session and redirecting to login...');
      // Clear all admin storage keys
      const ADMIN_STORAGE_KEYS = [
        'bt-admin-token',
        'bt-admin-username',
        'bt-admin-email',
        'bt-admin-fullName',
        'bt-admin-avatar',
        'bt-admin-role',
        'bt-admin-userId',
        'bt-admin-permissions',
        'bt-admin-lastActivity'
      ];
      ADMIN_STORAGE_KEYS.forEach(key => localStorage.removeItem(key));

      // Trigger auth context refresh
      window.dispatchEvent(new Event('admin-auth-changed'));

      window.location.href = '/auth/login';
      return;
    }

    if (response.status === 403) {
      throw new Error('Insufficient permissions for this action');
    }

    if (!response.ok) {
      // Clone response to read body multiple times if needed
      const responseClone = response.clone();
      
      // Try to parse as JSON first, fallback to text if it fails
      let errorData;
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      
      const contentType = response.headers.get('content-type') || '';
      
      try {
        if (contentType.includes('application/json')) {
          // Try JSON first
          errorData = await response.json();
          // Extract message from JSON
          if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.error) {
            errorMessage = errorData.error;
          } else if (errorData.details) {
            errorMessage = errorData.details;
          } else if (typeof errorData === 'string') {
            errorMessage = errorData;
          }
        } else {
          // Spring Boot ResponseStatusException returns plain text
          const text = await response.text();
          if (text && text.trim()) {
            // Try to parse as JSON if it looks like JSON
            try {
              errorData = JSON.parse(text);
              if (errorData.message) {
                errorMessage = errorData.message;
              } else if (errorData.error) {
                errorMessage = errorData.error;
              } else {
                errorMessage = text;
              }
            } catch {
              // Not JSON, use as plain text
              errorData = { message: text };
              errorMessage = text;
            }
          }
        }
      } catch (parseError) {
        // If all parsing fails, try to get text from cloned response
        try {
          const text = await responseClone.text();
          errorData = { message: text || 'Request failed' };
          errorMessage = text || `HTTP ${response.status}: ${response.statusText}`;
        } catch {
          errorData = { message: 'Request failed' };
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
      }
      
      const error = new Error(errorMessage);
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

  confirm: (bookingId) => fetchAPI(`/bookings/${bookingId}/confirm`, {
    method: 'POST',
  }),

  cancel: (bookingId) => fetchAPI(`/bookings/${bookingId}`, {
    method: 'DELETE',
  }),
};

export const paymentsAPI = {
  getByBookingId: (bookingId) => fetchAPI(`/payments/booking/${bookingId}`),
};

export const usersAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/users${query ? `?${query}` : ''}`);
  },

  getById: (userId) => fetchAPI(`/users/${userId}`),

  create: (data) => fetchAPI('/users', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  update: (userId, data) => fetchAPI(`/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  delete: (userId) => fetchAPI(`/users/${userId}`, {
    method: 'DELETE',
  }),
};

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

export const regionsAPI = {
  getAll: () => fetchAPI('/tours/regions'),
  getProvinces: (regionId) => fetchAPI(`/tours/regions/${regionId}/provinces`),
};

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

export const exportAPI = {
  /**
   * Download bookings as Excel file
   * @param {Object} params - Filter parameters (userId, tourId, status, startDate, endDate)
   */
  downloadBookingsExcel: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/export/bookings/excel${query ? `?${query}` : ''}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${getAdminToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download bookings Excel');
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `bookings_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading bookings Excel:', error);
      throw error;
    }
  },

  /**
   * Download dashboard stats as Excel file
   * @param {string} startDate - Start date (YYYY-MM-DD)
   * @param {string} endDate - End date (YYYY-MM-DD)
   */
  downloadDashboardExcel: async (startDate, endDate) => {
    const query = new URLSearchParams({ startDate, endDate }).toString();
    const url = `${API_BASE_URL}/export/dashboard/excel?${query}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${getAdminToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download dashboard Excel');
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `dashboard_stats_${startDate}_to_${endDate}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading dashboard Excel:', error);
      throw error;
    }
  },
};

const reviewsAPI = {
  /**
   * Get all reviews with filters (admin)
   * @param {Object} params - Query parameters (tourId, status, minRating)
   */
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAdminAPI(`/reviews/admin${query ? `?${query}` : ''}`);
  },

  /**
   * Update review status (admin)
   * @param {number} reviewId - Review ID
   * @param {string} status - New status (APPROVED, REJECTED, PENDING)
   */
  updateStatus: (reviewId, status) => {
    return fetchAdminAPI(`/reviews/admin/${reviewId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  /**
   * Delete review (admin)
   * @param {number} reviewId - Review ID
   */
  delete: (reviewId) => {
    return fetchAdminAPI(`/reviews/admin/${reviewId}`, {
      method: 'DELETE',
    });
  },

  /**
   * Get review summary for all tours
   */
  getOverallStats: async () => {
    try {
      // Aggregate from all tours - this is a workaround until we have a dedicated endpoint
      const reviews = await fetchAdminAPI('/reviews/admin');
      const reviewList = Array.isArray(reviews) ? reviews : [];

      return {
        total: reviewList.length,
        pending: reviewList.filter(r => r.status === 'PENDING').length,
        approved: reviewList.filter(r => r.status === 'APPROVED').length,
        rejected: reviewList.filter(r => r.status === 'REJECTED').length,
        averageRating: reviewList.length > 0
          ? reviewList.reduce((sum, r) => sum + parseFloat(r.rating), 0) / reviewList.length
          : 0
      };
    } catch (error) {
      console.error('Failed to get review stats:', error);
      return { total: 0, pending: 0, approved: 0, rejected: 0, averageRating: 0 };
    }
  },
};

export { reviewsAPI };

export default {
  tours: toursAPI,
  departures: departuresAPI,
  bookings: bookingsAPI,
  payments: paymentsAPI,
  users: usersAPI,
  schedules: schedulesAPI,
  images: imagesAPI,
  discounts: discountsAPI,
  regions: regionsAPI,
  dashboard: dashboardAPI,
  export: exportAPI,
  reviews: reviewsAPI,
  fetchAdminAPI,
};
