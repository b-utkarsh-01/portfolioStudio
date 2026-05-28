import { KNOWN_SKILL_GROUPS, linesToAdditionalSkills, splitCsv } from "../formDataHelpers";

export const mapSkills = (form) => {
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

  return {
    skills: {
      programming: splitCsv(form.skillsProgramming ?? ""),
      frontend: splitCsv(form.skillsFrontend ?? ""),
      backend: splitCsv(form.skillsBackend ?? ""),
      databases: splitCsv(form.skillsDatabases ?? ""),
      api: splitCsv(form.skillsApi ?? ""),
      cloud: splitCsv(form.skillsCloud ?? ""),
      ...additionalSkillGroups,
    },
  };
};
