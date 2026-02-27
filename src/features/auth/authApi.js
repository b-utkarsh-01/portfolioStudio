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

export const getCurrentUserApi = (token) =>
  apiRequest("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
