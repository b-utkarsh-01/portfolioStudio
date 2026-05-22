import { API_BASE_URL } from "./config";

export const apiRequest = async (path, options = {}) => {
  const { headers: customHeaders = {}, ...restOptions } = options;
  const call = () =>
    fetch(`${API_BASE_URL}${path}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...customHeaders,
      },
      ...restOptions,
    });

  let response;
  try {
    response = await call();
  } catch (networkError) {
    const error = new Error("Network error. Please check your connection.");
    error.code = "NETWORK_ERROR";
    throw error;
  }

  // One silent refresh attempt for expired access cookies.
  if (response.status === 401 && path !== "/auth/login" && path !== "/auth/register" && path !== "/auth/refresh") {
    try {
      await fetch(`${API_BASE_URL}/auth/refresh`, { method: "POST", credentials: "include" });
      response = await call();
    } catch {
      // ignore refresh network errors and fall back to original 401 handling
    }
  }

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.message || "Request failed");
    error.status = response.status;
    error.code = payload.code || "REQUEST_FAILED";
    error.details = payload.details;
    throw error;
  }
  return payload;
};
