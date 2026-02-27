import { apiRequest } from "../api/http";

export const getPortfolioByUsernameApi = (username) =>
  apiRequest(`/portfolios/${encodeURIComponent(username)}`);

export const getMyPortfolioApi = (token) =>
  apiRequest("/portfolios/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const upsertMyPortfolioApi = (token, payload) =>
  apiRequest("/portfolios/me", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
