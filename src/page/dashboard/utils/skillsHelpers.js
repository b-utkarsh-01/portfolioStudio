import { splitCsv, toCsv } from "./generalHelpers";

export const KNOWN_SKILL_GROUPS = ["programming", "frontend", "backend", "databases", "api", "cloud"];

export const createSkillGroupId = () =>
  `skill-group-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

export const additionalSkillsToLines = (skills) =>
  Object.entries(skills ?? {})
    .filter(([group, list]) => !KNOWN_SKILL_GROUPS.includes(group) && Array.isArray(list) && list.length)
    .map(([group, list]) => `${group} | ${toCsv(list)}`)
    .join("\n");

export const additionalSkillsToGroups = (skills) =>
  Object.entries(skills ?? {})
    .filter(([group, list]) => !KNOWN_SKILL_GROUPS.includes(group) && Array.isArray(list))
    .map(([group, list]) => ({
      id: createSkillGroupId(),
      name: group,
      skills: list.filter(Boolean),
    }));

export const linesToAdditionalSkills = (value) =>
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
