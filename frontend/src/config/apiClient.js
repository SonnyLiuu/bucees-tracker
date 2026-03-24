import axios from "axios";

import { API_BASE } from "./api";

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getAuthConfig = (user, config = {}) => ({
  ...config,
  headers: {
    ...(config.headers || {}),
    ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {}),
  },
});

export const getErrorMessage = (error, fallbackMessage) =>
  error?.response?.data?.message || fallbackMessage;

export default apiClient;
