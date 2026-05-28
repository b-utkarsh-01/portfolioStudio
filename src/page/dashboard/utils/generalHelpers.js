export const splitCsv = (value) =>
  `${value ?? ""}`
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export const toCsv = (list) => (Array.isArray(list) ? list.join(", ") : "");

export const sanitizeText = (value) => `${value ?? ""}`.trim();
