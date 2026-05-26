export const toText = (value) => `${value || ""}`.trim();
export const pickFirst = (...values) => values.map(toText).find(Boolean) || "";
export const toArray = (value) => (Array.isArray(value) ? value : []);

export const buildSkillGroups = (skills) => {
  if (Array.isArray(skills)) {
    return [
      {
        name: "Skills",
        items: skills.map((item) => toText(item)).filter(Boolean),
      },
    ].filter((group) => group.items.length);
  }

  if (typeof skills === "string") {
    return [
      {
        name: "Skills",
        items: skills
          .split(/[\n,]+/)
          .map((item) => toText(item))
          .filter(Boolean),
      },
    ].filter((group) => group.items.length);
  }

  return Object.entries(skills || {})
    .map(([name, values]) => ({
      name,
      items: toArray(values).map((item) => toText(item)).filter(Boolean),
    }))
    .filter((group) => group.items.length);
};

export const buildSections = ({ sections, education, contacts, profile, customStages, skillGroups, experiences, projects }) => {
  const visibleSections = toArray(sections)
    .filter((section) => section?.visible !== false)
    .sort((a, b) => Number(a?.order || 0) - Number(b?.order || 0));

  const typesPresent = new Set(visibleSections.map((section) => `${section?.type || ""}`.toLowerCase()));
  const fallbackSections = [];

  const hasProfile = toText(profile?.name) || toText(profile?.summary);
  if (!typesPresent.has("hero") && hasProfile) {
    fallbackSections.push({ id: "hero-auto", type: "hero", visible: true, order: 0, variant: "auto" });
  }
  if (!typesPresent.has("skills") && toArray(skillGroups).some((group) => toArray(group?.items).length)) {
    fallbackSections.push({ id: "skills-auto", type: "skills", visible: true, order: 1, variant: "auto" });
  }
  if (!typesPresent.has("experience") && toArray(experiences).length) {
    fallbackSections.push({ id: "experience-auto", type: "experience", visible: true, order: 2, variant: "auto" });
  }
  if (!typesPresent.has("projects") && toArray(projects).length) {
    fallbackSections.push({ id: "projects-auto", type: "projects", visible: true, order: 3, variant: "auto" });
  }
  if (!typesPresent.has("education") && education.length) {
    fallbackSections.push({ id: "education-auto", type: "education", visible: true, order: 98, variant: "auto" });
  }
  if (!typesPresent.has("contact") && (contacts.length || toText(profile?.email) || toText(profile?.phone))) {
    fallbackSections.push({ id: "contact-auto", type: "contact", visible: true, order: 99, variant: "auto" });
  }
  if (!typesPresent.has("custom") && toArray(customStages).length) {
    fallbackSections.push({ id: "custom-auto", type: "custom", visible: true, order: 97, variant: "auto" });
  }

  return [...visibleSections, ...fallbackSections].sort((a, b) => Number(a?.order || 0) - Number(b?.order || 0));
};

export const buildStyles = (palette, specTheme) => {
  const clamp = (n) => Math.max(0, Math.min(255, Number(n) || 0));
  const parseHex = (hex = "") => {
    const raw = `${hex || ""}`.trim();
    if (!/^#([0-9a-fA-F]{6})$/.test(raw)) return null;
    return {
      r: parseInt(raw.slice(1, 3), 16),
      g: parseInt(raw.slice(3, 5), 16),
      b: parseInt(raw.slice(5, 7), 16),
    };
  };
  const toHex = ({ r, g, b }) =>
    `#${clamp(r).toString(16).padStart(2, "0")}${clamp(g).toString(16).padStart(2, "0")}${clamp(b)
      .toString(16)
      .padStart(2, "0")}`;
  const mix = (a, b, amount = 0.5) => {
    const c1 = parseHex(a);
    const c2 = parseHex(b);
    if (!c1 || !c2) return a || b || "#0f172a";
    return toHex({
      r: Math.round(c1.r + (c2.r - c1.r) * amount),
      g: Math.round(c1.g + (c2.g - c1.g) * amount),
      b: Math.round(c1.b + (c2.b - c1.b) * amount),
    });
  };
  const relativeLuminance = ({ r, g, b }) => {
    const toLinear = (v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    };
    const R = toLinear(r);
    const G = toLinear(g);
    const B = toLinear(b);
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
  };
  const contrastRatio = (a, b) => {
    const c1 = parseHex(a);
    const c2 = parseHex(b);
    if (!c1 || !c2) return 1;
    const l1 = relativeLuminance(c1);
    const l2 = relativeLuminance(c2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  };
  const pickReadableText = (background, preferred, modeHint) => {
    const darkText = "#0f172a";
    const lightText = "#f8fafc";
    const fallback = modeHint === "light" ? darkText : lightText;
    const candidate = parseHex(preferred) ? preferred : fallback;
    if (contrastRatio(candidate, background) >= 4.5) return candidate;
    return contrastRatio(darkText, background) >= contrastRatio(lightText, background) ? darkText : lightText;
  };

  const bgRgb = parseHex(palette?.background);
  const bgLuma = bgRgb ? (0.2126 * bgRgb.r + 0.7152 * bgRgb.g + 0.0722 * bgRgb.b) / 255 : null;
  const autoMode = bgLuma !== null ? (bgLuma >= 0.62 ? "light" : "dark") : "dark";
  const mode = `${palette.mode || autoMode}`.toLowerCase();
  const safePalette =
    mode === "light"
      ? {
          ...palette,
          background: palette.background || "#f8fafc",
          surface: palette.surface || "#ffffff",
          text: palette.text || "#0f172a",
          textMuted: palette.textMuted || "#475569",
          border: palette.border || "#cbd5e1",
        }
      : {
          ...palette,
          background: palette.background || "#020617",
          surface: palette.surface || "#0f172a",
          text: palette.text || "#e2e8f0",
          textMuted: palette.textMuted || "#94a3b8",
          border: palette.border || "#334155",
        };

  const cardBg = safePalette.surface || safePalette.background || "#0f172a";
  const safeText = pickReadableText(cardBg, safePalette.text, mode);
  const safeMuted = pickReadableText(cardBg, safePalette.textMuted, mode);
  const mutedBlended = contrastRatio(safeMuted, cardBg) >= 4 ? safeMuted : mix(safeText, cardBg, 0.35);
  const headingColor = pickReadableText(cardBg, safePalette.primary || safePalette.accent || safeText, mode);

  safePalette.text = safeText;
  safePalette.textMuted = mutedBlended;
  safePalette.heading = headingColor;

  const shellStyle = {
    background: safePalette.background,
    color: safePalette.text,
    minHeight: "100dvh",
    width: "100%",
  };

  const cardStyle = {
    background: safePalette.surface,
    border: `1px solid ${safePalette.primary || safePalette.border}`,
    borderRadius: specTheme?.radius === "none" ? "0px" : specTheme?.radius === "lg" ? "20px" : "14px",
    padding: "16px",
    marginBottom: "14px",
    boxShadow:
      specTheme?.shadow === "none"
        ? "none"
        : specTheme?.shadow === "strong"
          ? `0 18px 40px ${safePalette.primary || "#000000"}33`
          : `0 8px 20px ${safePalette.primary || "#000000"}22`,
  };

  return { shellStyle, cardStyle, palette: safePalette };
};
