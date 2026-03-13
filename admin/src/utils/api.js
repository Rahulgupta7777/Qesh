import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // to Send/Receive HttpOnly Cookies
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // If Backend says "Unauthorized" (401), force logout
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("adminUser");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

const api = {
  auth: {
    login: (data) => apiClient.post("/api/auth/admin/login", data),
    logout: () => apiClient.post("/api/auth/logout"),
    updateProfile: (data) => apiClient.patch("/api/admin/profile", data),
  },
  // Dashboard & Stats
  dashboard: {
    getStats: () => apiClient.get("/api/admin/stats"),
  },

  // Bookings & Appointments
  bookings: {
    getAll: () => apiClient.get("/api/admin/bookings"),
    create: (data) => apiClient.post("/api/admin/bookings", data), // Admin Walk-in
    update: (id, data) => apiClient.patch(`/api/admin/bookings/${id}`, data), // Reschedule/Reassign
    cancel: (id) => apiClient.patch(`/api/admin/bookings/${id}/cancel`), // Admin Cancel
  },

  // Services
  services: {
    getAll: () => apiClient.get("/api/admin/services"),
    create: (data) => apiClient.post("/api/admin/services", data),
    update: (id, data) => apiClient.patch(`/api/admin/services/${id}`, data),
    delete: (id) => apiClient.delete(`/api/admin/services/${id}`),
  },

  // Products
  products: {
    getAll: () => apiClient.get("/api/admin/products"),
    create: (data) => apiClient.post("/api/admin/products", data),
    update: (id, data) => apiClient.patch(`/api/admin/products/${id}`, data),
    delete: (id) => apiClient.delete(`/api/admin/products/${id}`),
  },

  // Staff Management
  staff: {
    getAll: () => apiClient.get("/api/admin/staff"),
    create: (data) => apiClient.post("/api/admin/staff", data),
    update: (id, data) => apiClient.patch(`/api/admin/staff/${id}`, data),
    delete: (id) => apiClient.delete(`/api/admin/staff/${id}`),
    getSchedule: (id) => apiClient.get(`/api/admin/staff/${id}/schedule`),
  },

  // Calendar Control & Slot Management
  slots: {
    block: (data) => apiClient.post("/api/admin/blocked-slots", data),
    unblock: (id) => apiClient.delete(`/api/admin/blocked-slots/${id}`),
  },

  // Marketing (Offers & Categories)
  offers: {
    getAll: () => apiClient.get("/api/admin/offers"),
    create: (data) => apiClient.post("/api/admin/offers", data),
    delete: (id) => apiClient.delete(`/api/admin/offers/${id}`),
    update: (id, data) => apiClient.patch(`/api/admin/offers/${id}`, data),
  },
  categories: {
    getAll: () => apiClient.get("/api/admin/categories"),
    create: (data) => apiClient.post("/api/admin/categories", data),
    update: (id, data) => apiClient.patch(`/api/admin/categories/${id}`, data),
    delete: (id) => apiClient.delete(`/api/admin/categories/${id}`),
    deletePermanent: (id) => apiClient.delete(`/api/admin/categories/${id}/permanent`),
  },

  // User & Profile & notices
  users: {
    promote: (email) => apiClient.post("/api/admin/promote-user", { email }),
    demote: (email) => apiClient.post("/api/admin/demote-user", { email }),
  },
  profile: {
    update: (data) => apiClient.patch("/api/admin/profile", data),
  },
  notices: {
    getAll: () => apiClient.get("/api/admin/notices"),
    create: (data) => apiClient.post("/api/admin/notices", data),
    delete: (id) => apiClient.delete(`/api/admin/notices/${id}`),
    update: (id, data) => apiClient.patch(`/api/admin/notices/${id}`, data)
  },

  // Utilities (pixabay image search)
  images: {
    search: (query) => apiClient.get(`/api/admin/search-images?query=${encodeURIComponent(query)}`),
    },
  
  staffPortal: {
      getProfile: () => apiClient.get('/api/staff/profile'),
      getSchedule: (date) => apiClient.get(`/api/staff/schedule${date ? `?date=${date}` : ''}`),
      getNotices: () => apiClient.get('/api/staff/notices'),
      updateStatus: (id, status) => apiClient.patch(`/api/staff/appointments/${id}/status`, { status })
  },
};

export default api;
