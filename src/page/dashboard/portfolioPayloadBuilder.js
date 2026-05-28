import { mapProfile } from "./payload/profileMapper";
import { mapSkills } from "./payload/skillsMapper";
import { mapWork } from "./payload/workMapper";
import { mapCollections } from "./payload/collectionsMapper";

export const buildPortfolioData = (form) => {
  const collectionsPayload = mapCollections(form);
  const profilePayload = mapProfile(form, collectionsPayload.contactsFromItems);
  const skillsPayload = mapSkills(form);
  const workPayload = mapWork(form);

  // Exclude contactsFromItems internal property before returning
  // eslint-disable-next-line no-unused-vars
  const { contactsFromItems, ...cleanedCollections } = collectionsPayload;

  return {
    ...profilePayload,
    ...skillsPayload,
    ...workPayload,
    ...cleanedCollections,
  };
};
