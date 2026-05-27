import { apiRequest } from "../api/http";

export const getPortfolioByUsernameApi = (username) =>
  apiRequest(`/portfolios/${encodeURIComponent(username)}`);

export const getPortfolioBySlugApi = (slug) =>
  apiRequest(`/portfolios/public/${encodeURIComponent(slug)}`);

export const getMyPortfolioApi = () => apiRequest("/portfolios/me");

export const upsertMyPortfolioApi = (payload) =>
  apiRequest("/portfolios/me", {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const checkSlugAvailabilityApi = (slug) =>
  apiRequest(`/portfolios/slug-availability/${encodeURIComponent(slug)}`).catch((error) => {
    // Backward compatibility with older deployments that exposed singular /portfolio routes.
    if (error?.status === 404) {
      return apiRequest(`/portfolio/slug-availability/${encodeURIComponent(slug)}`);
    }
    throw error;
  });

export const publishMyPortfolioApi = (payload) =>
  apiRequest("/portfolios/me/publish", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const unpublishMyPortfolioApi = () =>
  apiRequest("/portfolios/me/unpublish", {
    method: "POST",
  });
