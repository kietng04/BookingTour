const API_BASE_URL = '/api';

const getAdminHeaders = () => {
  const token = localStorage.getItem('bt-admin-token');
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

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Request failed' }));
      const error = new Error(errorData.message || `HTTP ${response.status}`);
      
      // Only log errors that are not database-related empty data issues
      if (!errorData.message?.includes('does not exist') && response.status !== 404) {
        console.error(`Admin API Error (${endpoint}):`, error);
      }
      
      throw error;
    }

    return await response.json();
  } catch (error) {
    // Only log non-network errors or actual server errors
    if (!error.message?.includes('does not exist')) {
      console.error(`Admin API Error (${endpoint}):`, error);
    }
    throw error;
  }
}

export const customTourService = {
  /**
   * Get all custom tours with filters (admin)
   */
  getAllCustomTours: async (status = null, page = 0, size = 20) => {
    const params = new URLSearchParams({ page, size });
    if (status) params.append('status', status);

    return fetchAdminAPI(`/custom-tours/admin?${params}`);
  },

  /**
   * Get custom tour by ID
   */
  getCustomTourById: async (id) => {
    return fetchAdminAPI(`/custom-tours/${id}`);
  },

  /**
   * Update custom tour status
   */
  updateCustomTourStatus: async (id, data) => {
    return fetchAdminAPI(`/custom-tours/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete custom tour
   */
  deleteCustomTour: async (id) => {
    return fetchAdminAPI(`/custom-tours/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Get custom tours statistics
   */
  getStats: async () => {
    return fetchAdminAPI('/custom-tours/stats');
  },
};

export default customTourService;
