import { defaultPortfolioData } from "./defaultPortfolioData";

const sectionIcons = {};
const experienceIcons = {};
const projectIcons = {};
const contactIcons = {};
const skillGroupIcons = {};
const skillIcons = {};

const {
  layout: defaultLayout,
  customStages: defaultCustomStages,
  profile: defaultProfile,
  badgeName: defaultBadgeName,
  skills: defaultSkills,
  education: defaultEducation,
  experiences: defaultExperiences,
  projects: defaultProjects,
  services: defaultServices,
  testimonials: defaultTestimonials,
  certifications: defaultCertifications,
} = defaultPortfolioData;

const cloneArray = (value) => (Array.isArray(value) ? [...value] : []);
const cloneCards = (value) =>
  cloneArray(value).map((item) => ({
    title: item?.title ?? "",
    subtitle: item?.subtitle ?? "",
    description: item?.description ?? "",
    link: item?.link ?? "",
    image: item?.image ?? "",
  }));
const cloneCustomStages = (value) =>
  cloneArray(value).map((stage) => ({
    id: `${stage?.id ?? ""}`,
    kind: stage?.kind === "cards" ? "cards" : "paragraph",
    paragraph: stage?.paragraph ?? "",
    cards: cloneCards(stage?.cards),
  }));
const cloneStages = (stages) =>
  cloneArray(stages).map((stage) => ({
    id: `${stage?.id ?? ""}`,
    title: `${stage?.title ?? ""}`,
    enabled: stage?.enabled !== false,
  }));

const cloneEducation = (entries) =>
  cloneArray(entries).map((entry) => ({
    subtitle: entry?.subtitle ?? "",
    items: cloneArray(entry?.items).map((item) => ({
      institute: item?.institute ?? "",
      degree: item?.degree ?? "",
    })),
  }));

const cloneObjects = (entries, keys) =>
  cloneArray(entries).map((entry) =>
    keys.reduce((acc, key) => {
      acc[key] = entry?.[key] ?? "";
      return acc;
    }, {})
  );

export const createDefaultEditableData = () => ({
  layout: {
    stages: cloneStages(defaultLayout?.stages),
  },
  customStages: cloneCustomStages(defaultCustomStages),
  profile: {
    name: defaultProfile.name,
    title: cloneArray(defaultProfile.title),
    summary: defaultProfile.summary,
    highlights: cloneArray(defaultProfile.highlights),
    contacts: cloneArray(defaultProfile.contacts).map((contact) => ({
      type: contact?.type ?? "",
      text: contact?.text ?? "",
      href: contact?.href ?? "",
      external: Boolean(contact?.external),
    })),
    avatar: defaultProfile.avatar ?? "",
  },
  badgeName: {
    name: defaultBadgeName.name,
    logo: defaultBadgeName.logo,
    badgeTitle: defaultBadgeName.badgeTitle,
  },
  skills: {
    programming: cloneArray(defaultSkills.programming),
    frontend: cloneArray(defaultSkills.frontend),
    backend: cloneArray(defaultSkills.backend),
    databases: cloneArray(defaultSkills.databases),
    api: cloneArray(defaultSkills.api),
    cloud: cloneArray(defaultSkills.cloud),
  },
  education: cloneEducation(defaultEducation),
  experiences: cloneObjects(defaultExperiences, ["title", "company", "period", "description"]),
  projects: cloneObjects(defaultProjects, ["name", "tech", "description", "link", "image"]),
  services: cloneObjects(defaultServices, ["name", "description"]),
  testimonials: cloneObjects(defaultTestimonials, ["name", "role", "quote"]),
  certifications: cloneObjects(defaultCertifications, ["name", "provider", "link"]),
});

export const createDefaultRenderData = () => ({
  ...createDefaultEditableData(),
  sectionIcons,
  experienceIcons,
  projectIcons,
  contactIcons,
  skillGroupIcons,
  skillIcons,
});

const ensureStringArray = (value, fallback) => {
  const result = cloneArray(value).map((item) => `${item}`.trim()).filter(Boolean);
  return result.length ? result : cloneArray(fallback);
};

const toInitials = (text) =>
  `${text || ""}`
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() || "")
    .join("");

const hydrateSkills = (rawSkills, defaultSkills) => {
  const parsedRaw = rawSkills ?? {};
  const hydrated = Object.keys(defaultSkills).reduce((acc, key) => {
    acc[key] = ensureStringArray(parsedRaw[key], defaultSkills[key]);
    return acc;
  }, {});

  Object.entries(parsedRaw).forEach(([key, value]) => {
    if (key in hydrated) return;
    const customGroup = ensureStringArray(value, []);
    if (customGroup.length) {
      hydrated[key] = customGroup;
    }
  });

  return hydrated;
};

export const hydrateRenderData = (rawData) => {
  const defaults = createDefaultEditableData();
  const data = rawData ?? {};
  const layout = data.layout ?? {};
  const profile = data.profile ?? {};
  const badge = data.badgeName ?? {};
  const skills = data.skills ?? {};
  const resolvedProfileName = profile.name?.trim() || defaults.profile.name;
  const resolvedBadgeName = badge.name?.trim() || resolvedProfileName || defaults.badgeName.name;
  const resolvedBadgeLogo =
    badge.logo?.trim() || toInitials(resolvedBadgeName) || defaults.badgeName.logo;

  const renderData = {
    profile: {
      name: resolvedProfileName,
      title: ensureStringArray(profile.title, defaults.profile.title),
      summary: profile.summary?.trim() || defaults.profile.summary,
      highlights: ensureStringArray(profile.highlights, defaults.profile.highlights),
      contacts: cloneArray(profile.contacts)
        .map((contact) => ({
          type: contact?.type ?? "",
          text: contact?.text ?? "",
          href: contact?.href ?? "",
          external: Boolean(contact?.external),
        }))
        .filter((contact) => contact.type && contact.href && contact.text),
      avatar: profile.avatar?.trim() || defaults.profile.avatar,
    },
    badgeName: {
      name: resolvedBadgeName,
      logo: resolvedBadgeLogo,
      badgeTitle: badge.badgeTitle?.trim() || defaults.badgeName.badgeTitle,
    },
    skills: hydrateSkills(skills, defaults.skills),
    education: cloneEducation(data.education),
    experiences: cloneObjects(data.experiences, ["title", "company", "period", "description"]),
    projects: cloneObjects(data.projects, ["name", "tech", "description", "link", "image"]),
    services: cloneObjects(data.services, ["name", "description"]),
    testimonials: cloneObjects(data.testimonials, ["name", "role", "quote"]),
    certifications: cloneObjects(data.certifications, ["name", "provider", "link"]),
    layout: {
      stages: cloneStages(layout.stages?.length ? layout.stages : defaults.layout.stages),
    },
    customStages: cloneCustomStages(data.customStages),
  };

  if (!renderData.profile.contacts.length) {
    renderData.profile.contacts = cloneArray(defaults.profile.contacts);
  }
  if (!renderData.education.length) {
    renderData.education = cloneEducation(defaults.education);
  }
  if (!renderData.experiences.length) {
    renderData.experiences = cloneObjects(defaults.experiences, ["title", "company", "period", "description"]);
  }
  if (!renderData.projects.length) {
    renderData.projects = cloneObjects(defaults.projects, ["name", "tech", "description", "link", "image"]);
  }
  if (!renderData.services.length) {
    renderData.services = cloneObjects(defaults.services, ["name", "description"]);
  }
  if (!renderData.testimonials.length) {
    renderData.testimonials = cloneObjects(defaults.testimonials, ["name", "role", "quote"]);
  }
  if (!renderData.certifications.length) {
    renderData.certifications = cloneObjects(defaults.certifications, ["name", "provider", "link"]);
  }
  if (!renderData.customStages.length) {
    renderData.customStages = cloneCustomStages(defaults.customStages);
  }

  return {
    ...renderData,
    sectionIcons,
    experienceIcons,
    projectIcons,
    contactIcons,
    skillGroupIcons,
    skillIcons,
  };
};

