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
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
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
      const tours = toursData.content || toursData;

      const allDepartures = [];
      for (const tour of tours) {
        try {
          const departures = await fetchAPI(`/tours/${tour.tourId}/departures`);
          departures.forEach(dep => {
            allDepartures.push({
              ...dep,
              tourName: tour.tourName,
              tourId: tour.tourId,
            });
          });
        } catch (err) {
          console.error(`Failed to fetch departures for tour ${tour.tourId}`, err);
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

export default {
  tours: toursAPI,
  departures: departuresAPI,
  bookings: bookingsAPI,
  users: usersAPI,
};
