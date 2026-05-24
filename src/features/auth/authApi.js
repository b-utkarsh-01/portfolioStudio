import { apiRequest } from "../api/http";

export const registerApi = (payload) =>
  apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const loginApi = (payload) =>
  apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const getCurrentUserApi = () => apiRequest("/auth/me");

export const refreshSessionApi = () =>
  apiRequest("/auth/refresh", {
    method: "POST",
  });

export const logoutApi = () =>
  apiRequest("/auth/logout", {
    method: "POST",
  });

export const updateCurrentUserApi = (payload) =>
  apiRequest("/auth/me", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
