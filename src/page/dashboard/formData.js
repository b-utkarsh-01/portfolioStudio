import { createDefaultEditableData } from "../../features/portfolio/portfolioData";

const splitCsv = (value) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const toCsv = (list) => (Array.isArray(list) ? list.join(", ") : "");
const sanitizeText = (value) => `${value ?? ""}`.trim();
const ensurePhoneHref = (text, href) => {
  const safeHref = sanitizeText(href);
  if (safeHref) return safeHref;
  const digits = sanitizeText(text).replace(/[^\d+]/g, "");
  return digits ? `tel:${digits}` : "";
};
const ensureEmailHref = (text, href) => {
  const safeHref = sanitizeText(href);
  if (safeHref) return safeHref;
  const email = sanitizeText(text);
  return email ? `mailto:${email}` : "";
};
const ensureGithubHref = (text, href) => {
  const safeHref = sanitizeText(href);
  if (safeHref) return safeHref;
  const raw = sanitizeText(text);
  if (!raw) return "";
  return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
};
const KNOWN_SKILL_GROUPS = ["programming", "frontend", "backend", "databases", "api", "cloud"];
const createSkillGroupId = () =>
  `skill-group-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
const createWorkItemId = () =>
  `work-item-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
const createCollectionItemId = () =>
  `collection-item-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

const additionalSkillsToLines = (skills) =>
  Object.entries(skills ?? {})
    .filter(([group, list]) => !KNOWN_SKILL_GROUPS.includes(group) && Array.isArray(list) && list.length)
    .map(([group, list]) => `${group} | ${toCsv(list)}`)
    .join("\n");

const additionalSkillsToGroups = (skills) =>
  Object.entries(skills ?? {})
    .filter(([group, list]) => !KNOWN_SKILL_GROUPS.includes(group) && Array.isArray(list))
    .map(([group, list]) => ({
      id: createSkillGroupId(),
      name: group,
      skills: list.filter(Boolean),
    }));

const linesToAdditionalSkills = (value) =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .reduce((acc, line) => {
      const pipeIndex = line.indexOf("|");
      const colonIndex = line.indexOf(":");
      const separatorIndex =
        pipeIndex >= 0 && colonIndex >= 0 ? Math.min(pipeIndex, colonIndex) : Math.max(pipeIndex, colonIndex);

      if (separatorIndex < 1) return acc;

      const rawGroup = line.slice(0, separatorIndex).trim();
      const rawItems = line.slice(separatorIndex + 1).trim();
      if (!rawGroup || KNOWN_SKILL_GROUPS.includes(rawGroup)) return acc;

      const parsedItems = splitCsv(rawItems);
      if (parsedItems.length) {
        acc[rawGroup] = parsedItems;
      }
      return acc;
    }, {});

const arrayToLines = (list, fields) =>
  (Array.isArray(list) ? list : [])
    .map((item) => fields.map((field) => item?.[field] ?? "").join(" | "))
    .join("\n");

const linesToArray = (value, fields) =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const chunks = line.split("|").map((chunk) => chunk.trim());
      return fields.reduce((acc, field, index) => {
        acc[field] = chunks[index] ?? "";
        return acc;
      }, {});
    });

const educationToLines = (entries) =>
  (Array.isArray(entries) ? entries : [])
    .map((entry) => {
      const first = entry?.items?.[0] ?? {};
      return [entry?.subtitle ?? "", first.institute ?? "", first.degree ?? ""].join(" | ");
    })
    .join("\n");

const linesToEducation = (value) =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [subtitle = "", institute = "", degree = ""] = line
        .split("|")
        .map((part) => part.trim());
      return {
        subtitle,
        items: [{ institute, degree }],
      };
    });

const educationToItems = (entries) =>
  (Array.isArray(entries) ? entries : []).map((entry) => {
    const first = entry?.items?.[0] ?? {};
    return {
      id: createWorkItemId(),
      subtitle: `${entry?.subtitle ?? ""}`,
      institute: `${first?.institute ?? ""}`,
      degree: `${first?.degree ?? ""}`,
    };
  });

const experiencesToItems = (entries) =>
  (Array.isArray(entries) ? entries : []).map((entry) => ({
    id: createWorkItemId(),
    title: `${entry?.title ?? ""}`,
    company: `${entry?.company ?? ""}`,
    period: `${entry?.period ?? ""}`,
    description: `${entry?.description ?? ""}`,
  }));

const projectsToItems = (entries) =>
  (Array.isArray(entries) ? entries : []).map((entry) => ({
    id: createWorkItemId(),
    name: `${entry?.name ?? ""}`,
    tech: `${entry?.tech ?? ""}`,
    description: `${entry?.description ?? ""}`,
    link: `${entry?.link ?? ""}`,
  }));

const contactsToItems = (contacts) =>
  (Array.isArray(contacts) ? contacts : []).map((item) => ({
    id: createCollectionItemId(),
    type: `${item?.type ?? ""}`,
    text: `${item?.text ?? ""}`,
    href: `${item?.href ?? ""}`,
    external: Boolean(item?.external),
  }));

const servicesToItems = (entries) =>
  (Array.isArray(entries) ? entries : []).map((item) => ({
    id: createCollectionItemId(),
    name: `${item?.name ?? ""}`,
    description: `${item?.description ?? ""}`,
  }));

const testimonialsToItems = (entries) =>
  (Array.isArray(entries) ? entries : []).map((item) => ({
    id: createCollectionItemId(),
    name: `${item?.name ?? ""}`,
    role: `${item?.role ?? ""}`,
    quote: `${item?.quote ?? ""}`,
  }));

const certificationsToItems = (entries) =>
  (Array.isArray(entries) ? entries : []).map((item) => ({
    id: createCollectionItemId(),
    name: `${item?.name ?? ""}`,
    provider: `${item?.provider ?? ""}`,
    link: `${item?.link ?? ""}`,
  }));

export const buildFormState = (portfolioData, templateId = "premium-v1") => {
  const base = portfolioData ?? createDefaultEditableData();
  const fallbackLayoutStages = createDefaultEditableData().layout?.stages ?? [];
  const baseCustomStages = Array.isArray(base?.customStages) ? base.customStages : [];
  const profile = base?.profile ?? {};
  const badge = base?.badgeName ?? {};
  const skills = base?.skills ?? {};
  const contacts = Array.isArray(profile.contacts) ? profile.contacts : [];

  return {
    templateId,
    name: profile.name ?? "",
    titles: (profile.title ?? []).join("\n"),
    summary: profile.summary ?? "",
    highlights: toCsv(profile.highlights),
    phone: contacts.find((item) => item.type === "phone")?.text ?? "",
    phoneHref: contacts.find((item) => item.type === "phone")?.href ?? "",
    email: contacts.find((item) => item.type === "email")?.text ?? "",
    emailHref: contacts.find((item) => item.type === "email")?.href ?? "",
    github: contacts.find((item) => item.type === "github")?.text ?? "",
    githubHref: contacts.find((item) => item.type === "github")?.href ?? "",
    badgeName: badge.name ?? "",
    badgeLogo: badge.logo ?? "",
    badgeTitle: badge.badgeTitle ?? "",
    skillsProgramming: toCsv(skills.programming),
    skillsFrontend: toCsv(skills.frontend),
    skillsBackend: toCsv(skills.backend),
    skillsDatabases: toCsv(skills.databases),
    skillsApi: toCsv(skills.api),
    skillsCloud: toCsv(skills.cloud),
    skillsAdditional: additionalSkillsToLines(skills),
    skillsAdditionalGroups: additionalSkillsToGroups(skills),
    education: educationToLines(base?.education),
    experiences: arrayToLines(base?.experiences, ["title", "company", "period", "description"]),
    projects: arrayToLines(base?.projects, ["name", "tech", "description", "link"]),
    educationItems: educationToItems(base?.education),
    experienceItems: experiencesToItems(base?.experiences),
    projectItems: projectsToItems(base?.projects),
    services: arrayToLines(base?.services, ["name", "description"]),
    testimonials: arrayToLines(base?.testimonials, ["name", "role", "quote"]),
    certifications: arrayToLines(base?.certifications, ["name", "provider", "link"]),
    contactItems: contactsToItems(profile.contacts),
    serviceItems: servicesToItems(base?.services),
    testimonialItems: testimonialsToItems(base?.testimonials),
    certificationItems: certificationsToItems(base?.certifications),
    layoutStages: Array.isArray(base?.layout?.stages) && base.layout.stages.length
      ? base.layout.stages.map((stage) => ({
          id: `${stage?.id ?? ""}`,
          title: `${stage?.title ?? ""}`,
          enabled: stage?.enabled !== false,
        }))
      : fallbackLayoutStages.map((stage) => ({
          id: `${stage?.id ?? ""}`,
          title: `${stage?.title ?? ""}`,
          enabled: stage?.enabled !== false,
        })),
    customStages: baseCustomStages.map((stage) => ({
      id: `${stage?.id ?? ""}`,
      kind: stage?.kind === "cards" ? "cards" : "paragraph",
      paragraph: `${stage?.paragraph ?? ""}`,
      cards: Array.isArray(stage?.cards)
        ? stage.cards.map((item) => ({
            title: `${item?.title ?? ""}`,
            subtitle: `${item?.subtitle ?? ""}`,
            description: `${item?.description ?? ""}`,
            link: `${item?.link ?? ""}`,
          }))
        : [],
    })),
  };
};

export const buildPortfolioData = (form) => {
  const additionalSkillGroupsFromCards = (Array.isArray(form.skillsAdditionalGroups) ? form.skillsAdditionalGroups : [])
    .reduce((acc, group) => {
      const key = `${group?.name ?? ""}`.trim();
      if (!key || KNOWN_SKILL_GROUPS.includes(key)) return acc;

      const values = (Array.isArray(group?.skills) ? group.skills : [])
        .map((item) => `${item ?? ""}`.trim())
        .filter(Boolean);

      if (values.length) {
        acc[key] = values;
      }
      return acc;
    }, {});

  const additionalSkillGroupsFromLines = linesToAdditionalSkills(form.skillsAdditional ?? "");
  const additionalSkillGroups =
    Object.keys(additionalSkillGroupsFromCards).length > 0
      ? additionalSkillGroupsFromCards
      : additionalSkillGroupsFromLines;

  const educationFromItems = (Array.isArray(form.educationItems) ? form.educationItems : [])
    .map((item) => ({
      subtitle: `${item?.subtitle ?? ""}`.trim(),
      items: [
        {
          institute: `${item?.institute ?? ""}`.trim(),
          degree: `${item?.degree ?? ""}`.trim(),
        },
      ],
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
    }))
    .filter((item) => item.name || item.tech || item.description || item.link);

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

  return {
    profile: {
      name: form.name.trim(),
      title: form.titles
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
      summary: form.summary.trim(),
      highlights: splitCsv(form.highlights),
      contacts:
        contactsFromItems.length > 0
          ? contactsFromItems
          : [
              phoneText && phoneHref
                ? { type: "phone", text: phoneText, href: phoneHref }
                : null,
              emailText && emailHref
                ? { type: "email", text: emailText, href: emailHref }
                : null,
              githubText && githubHref
                ? {
                    type: "github",
                    text: githubText,
                    href: githubHref,
                    external: true,
                  }
                : null,
            ].filter(Boolean),
    },
    badgeName: {
      name: form.badgeName.trim(),
      logo: form.badgeLogo.trim(),
      badgeTitle: form.badgeTitle.trim(),
    },
    skills: {
      ...additionalSkillGroups,
    },
    education: educationFromItems.length ? educationFromItems : linesToEducation(form.education ?? ""),
    experiences: experiencesFromItems.length
      ? experiencesFromItems
      : linesToArray(form.experiences ?? "", ["title", "company", "period", "description"]),
    projects: projectsFromItems.length
      ? projectsFromItems
      : linesToArray(form.projects ?? "", ["name", "tech", "description", "link"]),
    services: servicesFromItems.length
      ? servicesFromItems
      : linesToArray(form.services, ["name", "description"]),
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
      kind: stage?.kind === "cards" ? "cards" : "paragraph",
      paragraph: `${stage?.paragraph ?? ""}`.trim(),
      cards: (Array.isArray(stage?.cards) ? stage.cards : [])
        .map((item) => ({
          title: `${item?.title ?? ""}`.trim(),
          subtitle: `${item?.subtitle ?? ""}`.trim(),
          description: `${item?.description ?? ""}`.trim(),
          link: `${item?.link ?? ""}`.trim(),
        }))
        .filter((item) => item.title || item.subtitle || item.description || item.link),
    })),
  };
};
