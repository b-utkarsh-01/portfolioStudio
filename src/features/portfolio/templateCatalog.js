import { API_BASE_URL } from "../api/config";

let rendererModulePromise;

const normalizeTier = (tierValue) => {
  const normalized = `${tierValue || ""}`.toLowerCase().trim();
  if (normalized === "default" || normalized === "free" || normalized === "neutral") return "default";
  if (normalized === "premium" || normalized === "pro" || normalized === "paid") return "premium";
  return normalized;
};

const normalizeCatalog = (catalog) =>
  (Array.isArray(catalog) ? catalog : [])
    .filter((template) => template && typeof template.id === "string")
    .map((template) => ({
      ...template,
      tier: normalizeTier(template.tier),
      name: typeof template.name === "string" && template.name.trim() ? template.name : template.id,
      description:
        typeof template.description === "string" && template.description.trim()
          ? template.description
          : "Template preview is available.",
    }))
    .filter((template) => template.tier === "default" || template.tier === "premium");

const mergeCatalogs = (primary, fallback) => {
  const merged = new Map();
  [...(Array.isArray(fallback) ? fallback : []), ...(Array.isArray(primary) ? primary : [])].forEach((template) => {
    if (template?.id) merged.set(template.id, template);
  });
  return Array.from(merged.values());
};

const loadRendererModule = async () => {
  if (!rendererModulePromise) {
    rendererModulePromise = import("portfolio-template-renderer").catch((err) => {
      console.error("[templateCatalog] Failed to load portfolio-template-renderer:", err);
      throw err;
    });
  }
  return rendererModulePromise;
};

const loadBackendCatalog = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/templates`, {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });
    if (!response.ok) return [];
    const payload = await response.json().catch(() => ({}));
    return normalizeCatalog(payload?.templates);
  } catch {
    return [];
  }
};

export const getTemplateCatalog = async () => {
  try {
    // Source of truth: renderer package (default + premium repos).
    const renderer = await loadRendererModule();
    const rendererCatalog = normalizeCatalog(renderer.TEMPLATE_CATALOG);
    const backendCatalog = await loadBackendCatalog();
    return mergeCatalogs(backendCatalog, rendererCatalog);
  } catch (err) {
    console.error("[templateCatalog] catalog load error:", err);
    return [];
  }
};

export const getTemplateCatalogFromRenderer = async () => {
  try {
    const renderer = await loadRendererModule();
    return normalizeCatalog(renderer.TEMPLATE_CATALOG);
  } catch (err) {
    console.error("[templateCatalog] renderer catalog error:", err);
    return [];
  }
};

export const getTemplateById = async (templateId) => {
  const renderer = await loadRendererModule();
  if (typeof renderer.getTemplateById === "function") {
    return renderer.getTemplateById(templateId);
  }
  return null;
};

