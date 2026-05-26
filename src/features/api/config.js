const devDefaultBase = "http://localhost:5000/api";
const prodDefaultBase = "https://portfoliostudio-backend.onrender.com/api";

const normalizeBaseUrl = (base) => base.replace(/\/+$/, "");

export const API_BASE_URL =
  normalizeBaseUrl(
    import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? devDefaultBase : prodDefaultBase)
  );
