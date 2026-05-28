import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 10000,
});

export const palaceApi = {
  getHealth: () => api.get("/health"),

  getPalaces: () => api.get("/palaces"),

  getPalaceById: (id) => api.get(`/palaces/${id}`),

  getMaterials: () => api.get("/materials"),

  getCraftTimeline: () => api.get("/craft-timeline"),

  getAchievements: () => api.get("/achievements"),

  getInfluence: () => api.get("/influence"),
};

export default api;
