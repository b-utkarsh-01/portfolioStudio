let rendererModulePromise;

const FALLBACK_TEMPLATE_CATALOG = [
  {
    id: "default-horizon",
    tier: "default",
    name: "Horizon",
    description: "Clean portfolio layout with modern sections.",
  },
  {
    id: "default-slate",
    tier: "default",
    name: "Slate",
    description: "Minimal dark style with strong readability.",
  },
  {
    id: "default-nova",
    tier: "default",
    name: "Chronicle",
    description: "Editorial dark layout with lookbook typography and bronze accents.",
  },
  {
    id: "default-v4",
    tier: "default",
    name: "Cyberpunk Glassmorphism",
    description: "Futuristic frosted-glass visual style.",
  },
  {
    id: "premium-v1",
    tier: "premium",
    name: "Premium Nebula",
    description: "Creative glow effects and premium visual depth.",
  },
  {
    id: "premium-obsidian",
    tier: "premium",
    name: "Premium Obsidian",
    description: "High-contrast premium layout with bold surfaces.",
  },
  {
    id: "premium-cartoon",
    tier: "premium",
    name: "Premium Cartoon",
    description: "Playful style with character-driven visual elements.",
  },
  {
    id: "premium-cyber",
    tier: "premium",
    name: "Premium Cyber",
    description: "Neon cyberpunk look with strong visual motion.",
  },
  {
    id: "premium-linux",
    tier: "premium",
    name: "Premium Linux Terminal",
    description: "Terminal-inspired interactive portfolio experience.",
  },
];

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
    const renderer = await loadRendererModule();
    const normalized = normalizeCatalog(renderer.TEMPLATE_CATALOG);
    return normalized.length ? normalized : FALLBACK_TEMPLATE_CATALOG;
  } catch (err) {
    console.error("[templateCatalog] getTemplateCatalog error:", err);
    return FALLBACK_TEMPLATE_CATALOG;
  }
};

export const getTemplateById = async (templateId) => {
  const renderer = await loadRendererModule();
  if (typeof renderer.getTemplateById === "function") {
    return renderer.getTemplateById(templateId);
  }
  return null;
};

