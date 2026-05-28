import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

const api = axios.create({ baseURL: API_BASE, timeout: 10000 });

// Attach JWT from localStorage on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("ws_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout on 401 (expired/invalid token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("ws_user");
      localStorage.removeItem("ws_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ── Destinations ─────────────────────────────────────────────────────────────
export const getDestinations      = ()      => api.get("/destinations");
export const getDestinationById   = (id)    => api.get(`/destinations/${id}`);
export const getDestinationsByCat = (cat)   => api.get(`/destinations?category=${cat}`);
export const searchDestinations   = (q)     => api.get(`/destinations/search?keyword=${encodeURIComponent(q)}`);
export const getTopRated          = ()      => api.get("/destinations/top-rated");

// ── Bookings (user) ───────────────────────────────────────────────────────────
export const createBooking       = (booking, destinationName) =>
  api.post(`/bookings?destinationName=${encodeURIComponent(destinationName)}`, booking);
export const getBookingsByEmail  = (email)  => api.get(`/bookings?email=${encodeURIComponent(email)}`);
export const getBookingById      = (id)     => api.get(`/bookings/${id}`);
export const updateBookingStatus = (id, status) => api.patch(`/bookings/${id}/status`, { status });
export const cancelBooking       = (id)     => updateBookingStatus(id, "CANCELLED");

// ── Auth ──────────────────────────────────────────────────────────────────────
export const loginUser    = (email, password) => api.post("/auth/login",    { email, password });
export const registerUser = (data)            => api.post("/auth/register", data);
export const getProfile   = (email)           => api.get(`/auth/me?email=${encodeURIComponent(email)}`);

// ── Reviews ───────────────────────────────────────────────────────────────────
export const getReviews        = (destId) => api.get(`/reviews/${destId}`);
export const submitReview      = (review, destId) => api.post(`/reviews?destinationId=${destId}`, review);
export const getAverageRating  = (destId) => api.get(`/reviews/${destId}/average`);

// ── Admin ─────────────────────────────────────────────────────────────────────
export const adminGetStats          = ()             => api.get("/admin/stats");

export const getAllBookings          = ()             => api.get("/admin/bookings");
export const adminUpdateStatus      = (id, status)   => api.patch(`/admin/bookings/${id}/status`, { status });
export const adminDeleteBooking     = (id)           => api.delete(`/admin/bookings/${id}`);

export const adminGetDestinations   = ()             => api.get("/admin/destinations");
export const adminCreateDestination = (data)         => api.post("/admin/destinations", data);
export const adminUpdateDestination = (id, data)     => api.put(`/admin/destinations/${id}`, data);
export const adminDeleteDestination = (id)           => api.delete(`/admin/destinations/${id}`);

export const adminGetUsers          = ()             => api.get("/admin/users");
export const adminUpdateUserRole    = (id, role)     => api.patch(`/admin/users/${id}/role`, { role });
export const adminDeleteUser        = (id)           => api.delete(`/admin/users/${id}`);

export default api;
