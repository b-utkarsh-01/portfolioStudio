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

const loadRendererModule = async () => {
  if (!rendererModulePromise) {
    rendererModulePromise = import("portfolio-template-renderer").catch((err) => {
      console.error("[templateCatalog] Failed to load portfolio-template-renderer:", err);
      throw err;
    });
  }
  return rendererModulePromise;
};

export const getTemplateCatalog = async () => {
  try {
    // Source of truth: renderer package (default + premium repos).
    const renderer = await loadRendererModule();
    return normalizeCatalog(renderer.TEMPLATE_CATALOG);
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

