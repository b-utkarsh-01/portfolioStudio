const toBase64 = (text) => {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
};

const fromBase64 = (encoded) => {
  const normalized = `${encoded}`.replace(/-/g, "+").replace(/_/g, "/");
  const padLength = (4 - (normalized.length % 4 || 4)) % 4;
  const padded = normalized + "=".repeat(padLength);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
};

export const encodePortfolioDataToParam = (data) => {
  try {
    return toBase64(JSON.stringify(data));
  } catch {
    return "";
  }
};

export const decodePortfolioDataFromParam = (value) => {
  if (!value) return null;
  try {
    const parsed = JSON.parse(fromBase64(value));
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
};
