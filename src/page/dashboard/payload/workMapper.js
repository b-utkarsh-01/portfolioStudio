import { linesToEducation, linesToArray } from "../formDataHelpers";

export const mapWork = (form) => {
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

  return {
    education: educationFromItems.length ? educationFromItems : linesToEducation(form.education ?? ""),
    experiences: experiencesFromItems.length
      ? experiencesFromItems
      : linesToArray(form.experiences ?? "", ["title", "company", "period", "description"]),
    projects: projectsFromItems.length
      ? projectsFromItems
      : linesToArray(form.projects ?? "", ["name", "tech", "description", "link", "image"]),
  };
};
