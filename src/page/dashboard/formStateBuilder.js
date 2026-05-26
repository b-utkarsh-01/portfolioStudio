import { createDefaultEditableData } from "../../features/portfolio/portfolioData";
import {
  additionalSkillsToGroups,
  additionalSkillsToLines,
  arrayToLines,
  certificationsToItems,
  contactsToItems,
  educationToItems,
  educationToLines,
  experiencesToItems,
  projectsToItems,
  servicesToItems,
  testimonialsToItems,
  toCsv,
} from "./formDataHelpers";

export const buildFormState = (portfolioData, templateId = "premium-v1") => {
  const base = portfolioData ?? createDefaultEditableData();
  const fallbackLayoutStages = createDefaultEditableData().layout?.stages ?? [];
  const baseCustomStages = Array.isArray(base?.customStages) ? base.customStages : [];
  const profile = base?.profile ?? {};
  const skills = base?.skills ?? {};
  const contacts = Array.isArray(profile.contacts) ? profile.contacts : [];
  const mergeRequiredStages = (incomingStages, fallbackStages) => {
    const fallback = Array.isArray(fallbackStages) ? fallbackStages : [];
    const incoming = Array.isArray(incomingStages) ? incomingStages : [];
    const incomingMap = new Map(incoming.map((stage) => [`${stage?.id || ""}`, stage]));
    const merged = fallback.map((stage) => {
      const id = `${stage?.id ?? ""}`;
      const current = incomingMap.get(id);
      return {
        id,
        title: `${current?.title ?? stage?.title ?? ""}`,
        enabled: current?.enabled !== false,
      };
    });
    const extra = incoming
      .filter((stage) => {
        const id = `${stage?.id || ""}`;
        return id && !fallback.some((fallbackStage) => `${fallbackStage?.id || ""}` === id);
      })
      .map((stage) => ({
        id: `${stage?.id ?? ""}`,
        title: `${stage?.title ?? ""}`,
        enabled: stage?.enabled !== false,
      }));
    return [...merged, ...extra];
  };

  return {
    templateId,
    slug: "",
    visibility: "public",
    name: profile.name ?? "",
    titles: (profile.title ?? []).join("\n"),
    summary: profile.summary ?? "",
    avatar: profile.avatar ?? "",
    highlights: toCsv(profile.highlights),
    phone: contacts.find((item) => item.type === "phone")?.text ?? "",
    phoneHref: contacts.find((item) => item.type === "phone")?.href ?? "",
    email: contacts.find((item) => item.type === "email")?.text ?? "",
    emailHref: contacts.find((item) => item.type === "email")?.href ?? "",
    github: contacts.find((item) => item.type === "github")?.text ?? "",
    githubHref: contacts.find((item) => item.type === "github")?.href ?? "",
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
    projects: arrayToLines(base?.projects, ["name", "tech", "description", "link", "image"]),
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
    layoutStages: mergeRequiredStages(base?.layout?.stages, fallbackLayoutStages),
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
            image: `${item?.image ?? ""}`,
          }))
        : [],
    })),
  };
};
