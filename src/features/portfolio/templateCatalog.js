import { defaultTemplates } from "../../../../default-templates/src";
import { premiumV1Template } from "../../../../premium-templates/src";

export const TEMPLATE_CATALOG = [
  ...defaultTemplates,
  premiumV1Template,
];

export const getTemplateById = (templateId) =>
  TEMPLATE_CATALOG.find((template) => template.id === templateId) || TEMPLATE_CATALOG[0];
