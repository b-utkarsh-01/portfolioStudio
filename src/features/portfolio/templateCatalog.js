import { TEMPLATE_CATALOG, getTemplateById as getTemplateByIdSync } from "./templateRendererBridge";

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

export const getTemplateCatalog = async () => normalizeCatalog(TEMPLATE_CATALOG);

export const getTemplateCatalogFromRenderer = async () => normalizeCatalog(TEMPLATE_CATALOG);

export const getTemplateById = async (templateId) => getTemplateByIdSync(templateId);
