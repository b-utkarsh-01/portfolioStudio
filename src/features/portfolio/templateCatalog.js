import { defaultTemplates } from "portfolio-studio-default/src";
import { premiumV1Template } from "portfolio-studio-premium/src";

export const TEMPLATE_CATALOG = [
  ...defaultTemplates,
  premiumV1Template,
];

export const getTemplateById = (templateId) =>
  TEMPLATE_CATALOG.find((template) => template.id === templateId) || TEMPLATE_CATALOG[0];

