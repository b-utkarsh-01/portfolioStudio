const ensureArray = (value) => (Array.isArray(value) ? value : []);
const ensureObject = (value) => (value && typeof value === "object" ? value : {});

export const normalizePortfolioForRender = (portfolio) => {
  const base = ensureObject(portfolio);
  const profile = ensureObject(base.profile);
  const layout = ensureObject(base.layout);

  const normalized = {
    ...base,
    layout: {
      stages: ensureArray(layout.stages).map((stage) => ({
        id: `${stage?.id || ""}`.trim(),
        title: `${stage?.title || ""}`.trim() || "Section",
        enabled: stage?.enabled !== false,
      })),
    },
    customStages: ensureArray(base.customStages).map((stage) => ({
      id: `${stage?.id || ""}`.trim(),
      kind: stage?.kind === "cards" ? "cards" : "paragraph",
      paragraph: `${stage?.paragraph || ""}`,
      cards: ensureArray(stage?.cards).map((card) => ({
        title: `${card?.title || ""}`,
        subtitle: `${card?.subtitle || ""}`,
        description: `${card?.description || ""}`,
        link: `${card?.link || ""}`,
        image: `${card?.image || ""}`,
      })),
    })),
    profile: {
      name: `${profile.name || ""}`.trim() || "Portfolio Owner",
      title: ensureArray(profile.title).map((item) => `${item || ""}`.trim()).filter(Boolean),
      summary: `${profile.summary || ""}`,
      highlights: ensureArray(profile.highlights).map((item) => `${item || ""}`.trim()).filter(Boolean),
      contacts: ensureArray(profile.contacts)
        .map((item) => ({
          type: `${item?.type || ""}`.trim().toLowerCase(),
          text: `${item?.text || ""}`.trim(),
          href: `${item?.href || ""}`.trim(),
          external: Boolean(item?.external),
        }))
        .filter((item) => item.type && item.text && item.href),
      avatar: `${profile.avatar || ""}`.trim(),
    },
    badgeName: {
      ...ensureObject(base.badgeName),
      name: `${ensureObject(base.badgeName).name || ""}`.trim(),
      logo: `${ensureObject(base.badgeName).logo || ""}`.trim(),
      badgeTitle: `${ensureObject(base.badgeName).badgeTitle || ""}`.trim(),
    },
    skills: ensureObject(base.skills),
    education: ensureArray(base.education),
    experiences: ensureArray(base.experiences),
    projects: ensureArray(base.projects),
    services: ensureArray(base.services),
    testimonials: ensureArray(base.testimonials),
    certifications: ensureArray(base.certifications),
  };

  return normalized;
};

