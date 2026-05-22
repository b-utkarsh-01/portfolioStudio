import { apiRequest } from "../api/http";

export const getTemplatesApi = () => apiRequest("/templates");
