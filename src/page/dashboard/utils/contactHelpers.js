import { sanitizeText } from "./generalHelpers";

export const ensurePhoneHref = (text, href) => {
  const safeHref = sanitizeText(href);
  if (safeHref) return safeHref;
  const digits = sanitizeText(text).replace(/[^\d+]/g, "");
  return digits ? `tel:${digits}` : "";
};

export const ensureEmailHref = (text, href) => {
  const safeHref = sanitizeText(href);
  if (safeHref) return safeHref;
  const email = sanitizeText(text);
  return email ? `mailto:${email}` : "";
};

export const ensureGithubHref = (text, href) => {
  const safeHref = sanitizeText(href);
  if (safeHref) return safeHref;
  const raw = sanitizeText(text);
  if (!raw) return "";
  return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
};
