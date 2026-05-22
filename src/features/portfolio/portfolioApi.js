import { apiRequest } from "../api/http";

export const getPortfolioByUsernameApi = (username) =>
  apiRequest(`/portfolios/${encodeURIComponent(username)}`);

export const getMyPortfolioApi = () => apiRequest("/portfolios/me");

export const upsertMyPortfolioApi = (payload) =>
  apiRequest("/portfolios/me", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
