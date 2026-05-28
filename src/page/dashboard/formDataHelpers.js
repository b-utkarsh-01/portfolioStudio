export {
  splitCsv,
  toCsv,
  sanitizeText,
} from "./utils/generalHelpers";

export {
  ensurePhoneHref,
  ensureEmailHref,
  ensureGithubHref,
} from "./utils/contactHelpers";

export {
  KNOWN_SKILL_GROUPS,
  createSkillGroupId,
  additionalSkillsToLines,
  additionalSkillsToGroups,
  linesToAdditionalSkills,
} from "./utils/skillsHelpers";

export {
  createWorkItemId,
  createCollectionItemId,
  arrayToLines,
  linesToArray,
  educationToLines,
  linesToEducation,
  educationToItems,
  experiencesToItems,
  projectsToItems,
  contactsToItems,
  servicesToItems,
  testimonialsToItems,
  certificationsToItems,
} from "./utils/workHelpers";
