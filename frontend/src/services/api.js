import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api/v1",
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
);

export const generateLink = (dateEntries) => api.post("/availability/generate-link", { dateEntries });
export const getAvailability = (linkId) => api.get(`/availability/${linkId}`);
export const createBooking = (linkId, payload) => api.post(`/book/${linkId}`, payload);
