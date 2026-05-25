import {
  KNOWN_SKILL_GROUPS,
  ensureEmailHref,
  ensureGithubHref,
  ensurePhoneHref,
  linesToAdditionalSkills,
  linesToArray,
  linesToEducation,
  sanitizeText,
  splitCsv,
} from "./formDataHelpers";

const getFirstName = (name) => `${name || ""}`.trim().split(/\s+/).filter(Boolean)[0] || "";

const getInitials2 = (name) =>
  `${name || ""}`
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() || "")
    .join("");

export const buildPortfolioData = (form) => {
  const layoutStageTitleById = new Map(
    (Array.isArray(form.layoutStages) ? form.layoutStages : []).map((stage) => [
      `${stage?.id ?? ""}`.trim(),
      `${stage?.title ?? ""}`.trim(),
    ])
  );
  const additionalSkillGroupsFromCards = (Array.isArray(form.skillsAdditionalGroups) ? form.skillsAdditionalGroups : []).reduce(
    (acc, group) => {
      const key = `${group?.name ?? ""}`.trim();
      if (!key || KNOWN_SKILL_GROUPS.includes(key)) return acc;
      const values = (Array.isArray(group?.skills) ? group.skills : []).map((item) => `${item ?? ""}`.trim()).filter(Boolean);
      if (values.length) acc[key] = values;
      return acc;
    },
    {}
  );

  const additionalSkillGroupsFromLines = linesToAdditionalSkills(form.skillsAdditional ?? "");
  const additionalSkillGroups =
    Object.keys(additionalSkillGroupsFromCards).length > 0 ? additionalSkillGroupsFromCards : additionalSkillGroupsFromLines;

  const educationFromItems = (Array.isArray(form.educationItems) ? form.educationItems : [])
    .map((item) => ({
      subtitle: `${item?.subtitle ?? ""}`.trim(),
      items: [{ institute: `${item?.institute ?? ""}`.trim(), degree: `${item?.degree ?? ""}`.trim() }],
    }))
    .filter((item) => item.subtitle || item.items[0].institute || item.items[0].degree);

  const experiencesFromItems = (Array.isArray(form.experienceItems) ? form.experienceItems : [])
    .map((item) => ({
      title: `${item?.title ?? ""}`.trim(),
      company: `${item?.company ?? ""}`.trim(),
      period: `${item?.period ?? ""}`.trim(),
      description: `${item?.description ?? ""}`.trim(),
    }))
    .filter((item) => item.title || item.company || item.period || item.description);

  const projectsFromItems = (Array.isArray(form.projectItems) ? form.projectItems : [])
    .map((item) => ({
      name: `${item?.name ?? ""}`.trim(),
      tech: `${item?.tech ?? ""}`.trim(),
      description: `${item?.description ?? ""}`.trim(),
      link: `${item?.link ?? ""}`.trim(),
      image: `${item?.image ?? ""}`.trim(),
    }))
    .filter((item) => item.name || item.tech || item.description || item.link || item.image);

  const contactsFromItems = (Array.isArray(form.contactItems) ? form.contactItems : [])
    .map((item) => ({
      type: `${item?.type ?? ""}`.trim().toLowerCase(),
      text: `${item?.text ?? ""}`.trim(),
      href: `${item?.href ?? ""}`.trim(),
      external: Boolean(item?.external),
    }))
    .filter((item) => item.type && item.text && item.href);

  const servicesFromItems = (Array.isArray(form.serviceItems) ? form.serviceItems : [])
    .map((item) => ({
      name: `${item?.name ?? ""}`.trim(),
      description: `${item?.description ?? ""}`.trim(),
    }))
    .filter((item) => item.name || item.description);

  const testimonialsFromItems = (Array.isArray(form.testimonialItems) ? form.testimonialItems : [])
    .map((item) => ({
      name: `${item?.name ?? ""}`.trim(),
      role: `${item?.role ?? ""}`.trim(),
      quote: `${item?.quote ?? ""}`.trim(),
    }))
    .filter((item) => item.name || item.role || item.quote);

  const certificationsFromItems = (Array.isArray(form.certificationItems) ? form.certificationItems : [])
    .map((item) => ({
      name: `${item?.name ?? ""}`.trim(),
      provider: `${item?.provider ?? ""}`.trim(),
      link: `${item?.link ?? ""}`.trim(),
    }))
    .filter((item) => item.name || item.provider || item.link);

  const phoneText = sanitizeText(form.phone);
  const phoneHref = ensurePhoneHref(form.phone, form.phoneHref);
  const emailText = sanitizeText(form.email);
  const emailHref = ensureEmailHref(form.email, form.emailHref);
  const githubText = sanitizeText(form.github);
  const githubHref = ensureGithubHref(form.github, form.githubHref);
  const titleList = `${form.titles || ""}`
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
  const resolvedName = form.name.trim();
  const resolvedFirstName = getFirstName(resolvedName);
  const resolvedBadgeLogo = getInitials2(resolvedName);
  const resolvedBadgeTitle = titleList[0] || "";

  return {
    profile: {
      name: resolvedName,
      title: titleList,
      summary: form.summary.trim(),
      avatar: form.avatar.trim(),
      highlights: splitCsv(form.highlights),
      contacts:
        contactsFromItems.length > 0
          ? contactsFromItems
          : [
              phoneText && phoneHref ? { type: "phone", text: phoneText, href: phoneHref } : null,
              emailText && emailHref ? { type: "email", text: emailText, href: emailHref } : null,
              githubText && githubHref ? { type: "github", text: githubText, href: githubHref, external: true } : null,
            ].filter(Boolean),
    },
    badgeName: {
      name: resolvedFirstName,
      logo: resolvedBadgeLogo,
      badgeTitle: resolvedBadgeTitle,
    },
    skills: {
      programming: splitCsv(form.skillsProgramming ?? ""),
      frontend: splitCsv(form.skillsFrontend ?? ""),
      backend: splitCsv(form.skillsBackend ?? ""),
      databases: splitCsv(form.skillsDatabases ?? ""),
      api: splitCsv(form.skillsApi ?? ""),
      cloud: splitCsv(form.skillsCloud ?? ""),
      ...additionalSkillGroups,
    },
    education: educationFromItems.length ? educationFromItems : linesToEducation(form.education ?? ""),
    experiences: experiencesFromItems.length
      ? experiencesFromItems
      : linesToArray(form.experiences ?? "", ["title", "company", "period", "description"]),
    projects: projectsFromItems.length
      ? projectsFromItems
      : linesToArray(form.projects ?? "", ["name", "tech", "description", "link", "image"]),
    services: servicesFromItems.length ? servicesFromItems : linesToArray(form.services, ["name", "description"]),
    testimonials: testimonialsFromItems.length
      ? testimonialsFromItems
      : linesToArray(form.testimonials, ["name", "role", "quote"]),
    certifications: certificationsFromItems.length
      ? certificationsFromItems
      : linesToArray(form.certifications, ["name", "provider", "link"]),
    layout: {
      stages: (Array.isArray(form.layoutStages) ? form.layoutStages : []).map((stage) => ({
        id: `${stage?.id ?? ""}`,
        title: `${stage?.title ?? ""}`.trim() || `${stage?.id ?? ""}`,
        enabled: stage?.enabled !== false,
      })),
    },
    customStages: (Array.isArray(form.customStages) ? form.customStages : []).map((stage) => ({
      id: `${stage?.id ?? ""}`,
      title:
        `${layoutStageTitleById.get(`${stage?.id ?? ""}`.trim()) || ""}`.trim() ||
        `${stage?.title ?? ""}`.trim() ||
        "Custom Stage",
      kind: stage?.kind === "cards" ? "cards" : "paragraph",
      paragraph: `${stage?.paragraph ?? ""}`.trim(),
      cards: (Array.isArray(stage?.cards) ? stage.cards : [])
        .map((item) => ({
          title: `${item?.title ?? ""}`.trim(),
          subtitle: `${item?.subtitle ?? ""}`.trim(),
          description: `${item?.description ?? ""}`.trim(),
          link: `${item?.link ?? ""}`.trim(),
          image: `${item?.image ?? ""}`.trim(),
        }))
        .filter((item) => item.title || item.subtitle || item.description || item.link || item.image),
    })),
  };
};
