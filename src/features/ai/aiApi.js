import { apiRequest } from "../api/http";
import { API_BASE_URL } from "../api/config";

export const generateAiPortfolioFromTextApi = (resumeText, preferences = {}) =>
  apiRequest("/ai/generate", {
    method: "POST",
    body: JSON.stringify({
      mode: "resume_text",
      resumeText,
      preferences,
    }),
  });

export const getAiJobStatusApi = (jobId) =>
  apiRequest(`/ai/job/${encodeURIComponent(jobId)}`);

export const applyAiPortfolioApi = (portfolio, jobId = "") =>
  apiRequest("/ai/apply", {
    method: "POST",
    body: JSON.stringify({ portfolio, jobId }),
  });

export const generateAiPortfolioFromUploadApi = async (file, { ideaPrompt = "", templateId = "" } = {}) => {
  const formData = new FormData();
  formData.append("mode", "resume_upload");
  formData.append("resume", file);
  if (ideaPrompt) formData.append("ideaPrompt", ideaPrompt);
  if (templateId) formData.append("templateId", templateId);

  const response = await fetch(`${API_BASE_URL}/ai/generate-upload`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new Error(payload?.message || `Request failed (${response.status})`);
  }

  return payload;
};

export const generateAiTemplateFromTextApi = (resumeText, preferences = {}) =>
  apiRequest("/ai/generate-template", {
    method: "POST",
    body: JSON.stringify({
      mode: "resume_text",
      resumeText,
      preferences,
    }),
  });

export const getAiTemplateJobStatusApi = (jobId) =>
  apiRequest(`/ai/template-job/${encodeURIComponent(jobId)}`);

export const applyAiTemplateApi = (portfolio, templateSpec, jobId = "") =>
  apiRequest("/ai/apply-template", {
    method: "POST",
    body: JSON.stringify({ portfolio, templateSpec, jobId }),
  });

export const generateAiTemplateFromUploadApi = async (
  file,
  { ideaPrompt = "", templateId = "", designControls = null } = {}
) => {
  const formData = new FormData();
  formData.append("mode", "resume_upload");
  formData.append("resume", file);
  if (ideaPrompt) formData.append("ideaPrompt", ideaPrompt);
  if (templateId) formData.append("templateId", templateId);
  if (designControls && typeof designControls === "object") {
    formData.append("designControls", JSON.stringify(designControls));
  }

  const response = await fetch(`${API_BASE_URL}/ai/generate-template-upload`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new Error(payload?.message || `Request failed (${response.status})`);
  }

  return payload;
};
