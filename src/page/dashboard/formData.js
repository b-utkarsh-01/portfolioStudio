import { createDefaultEditableData } from "../../features/portfolio/portfolioData";

const splitCsv = (value) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const toCsv = (list) => (Array.isArray(list) ? list.join(", ") : "");
const KNOWN_SKILL_GROUPS = ["programming", "frontend", "backend", "databases", "api", "cloud"];

const additionalSkillsToLines = (skills) =>
  Object.entries(skills ?? {})
    .filter(([group, list]) => !KNOWN_SKILL_GROUPS.includes(group) && Array.isArray(list) && list.length)
    .map(([group, list]) => `${group} | ${toCsv(list)}`)
    .join("\n");

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

export const buildFormState = (portfolioData) => {
  const base = portfolioData ?? createDefaultEditableData();
  const profile = base?.profile ?? {};
  const badge = base?.badgeName ?? {};
  const skills = base?.skills ?? {};
  const contacts = Array.isArray(profile.contacts) ? profile.contacts : [];

  return {
    templateId: "portfolio-v1",
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
    education: educationToLines(base?.education),
    experiences: arrayToLines(base?.experiences, ["title", "company", "period", "description"]),
    projects: arrayToLines(base?.projects, ["name", "tech", "description", "link"]),
    certifications: arrayToLines(base?.certifications, ["name", "provider", "link"]),
  };
};

export const buildPortfolioData = (form) => {
  const additionalSkillGroups = linesToAdditionalSkills(form.skillsAdditional);

  return {
    profile: {
      name: form.name.trim(),
      title: form.titles
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
      summary: form.summary.trim(),
      highlights: splitCsv(form.highlights),
      contacts: [
        form.phone && form.phoneHref
          ? { type: "phone", text: form.phone.trim(), href: form.phoneHref.trim() }
          : null,
        form.email && form.emailHref
          ? { type: "email", text: form.email.trim(), href: form.emailHref.trim() }
          : null,
        form.github && form.githubHref
          ? {
              type: "github",
              text: form.github.trim(),
              href: form.githubHref.trim(),
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
      programming: splitCsv(form.skillsProgramming),
      frontend: splitCsv(form.skillsFrontend),
      backend: splitCsv(form.skillsBackend),
      databases: splitCsv(form.skillsDatabases),
      api: splitCsv(form.skillsApi),
      cloud: splitCsv(form.skillsCloud),
      ...additionalSkillGroups,
    },
    education: linesToEducation(form.education),
    experiences: linesToArray(form.experiences, ["title", "company", "period", "description"]),
    projects: linesToArray(form.projects, ["name", "tech", "description", "link"]),
    certifications: linesToArray(form.certifications, ["name", "provider", "link"]),
  };
};
