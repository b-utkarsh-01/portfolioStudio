const splitCsv = (value) =>
  `${value ?? ""}`
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
  `${value ?? ""}`
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
      if (parsedItems.length) acc[rawGroup] = parsedItems;
      return acc;
    }, {});

const arrayToLines = (list, fields) =>
  (Array.isArray(list) ? list : [])
    .map((item) => fields.map((field) => item?.[field] ?? "").join(" | "))
    .join("\n");

const linesToArray = (value, fields) =>
  `${value ?? ""}`
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
  `${value ?? ""}`
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [subtitle = "", institute = "", degree = ""] = line.split("|").map((part) => part.trim());
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
    image: `${entry?.image ?? ""}`,
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

export {
  KNOWN_SKILL_GROUPS,
  additionalSkillsToGroups,
  additionalSkillsToLines,
  arrayToLines,
  certificationsToItems,
  contactsToItems,
  educationToItems,
  educationToLines,
  ensureEmailHref,
  ensureGithubHref,
  ensurePhoneHref,
  experiencesToItems,
  linesToAdditionalSkills,
  linesToArray,
  linesToEducation,
  projectsToItems,
  sanitizeText,
  servicesToItems,
  splitCsv,
  testimonialsToItems,
  toCsv,
};
