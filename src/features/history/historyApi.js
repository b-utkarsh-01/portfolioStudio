import { apiRequest } from "../api/http";

export const getHistoryListApi = () => apiRequest("/history");

export const getSnapshotDetailsApi = (id) => apiRequest(`/history/${encodeURIComponent(id)}`);

export const createManualSnapshotApi = (name) =>
  apiRequest("/history/manual", {
    method: "POST",
    body: JSON.stringify({ name }),
  });

export const rollbackSnapshotApi = (id) =>
  apiRequest(`/history/${encodeURIComponent(id)}/rollback`, {
    method: "POST",
  });

export const deleteSnapshotApi = (id) =>
  apiRequest(`/history/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });

export const clearAllHistoryApi = () =>
  apiRequest("/history", {
    method: "DELETE",
  });

export const updateRetentionPolicyApi = (days) =>
  apiRequest("/history/retention", {
    method: "PUT",
    body: JSON.stringify({ days }),
  });
