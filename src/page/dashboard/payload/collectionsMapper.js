import { linesToArray } from "../formDataHelpers";

export const mapCollections = (form) => {
  const layoutStageTitleById = new Map(
    (Array.isArray(form.layoutStages) ? form.layoutStages : []).map((stage) => [
      `${stage?.id ?? ""}`.trim(),
      `${stage?.title ?? ""}`.trim(),
    ])
  );

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

  return {
    contactsFromItems,
    services: servicesFromItems.length ? servicesFromItems : linesToArray(form.services, ["name", "description"]),
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
      title:
        `${layoutStageTitleById.get(`${stage?.id ?? ""}`.trim()) || ""}`.trim() ||
        `${stage?.title ?? ""}`.trim() ||
        "Custom Stage",
      kind: stage?.kind === "cards" ? "cards" : "paragraph",
      paragraph: `${stage?.paragraph ?? ""}`.trim(),
      cards: (Array.isArray(stage?.cards) ? stage.cards : [])
        .map((item) => ({
          title: `${item?.title ?? ""}`.trim(),
          subtitle: `${item?.subtitle ?? ""}`.trim(),
          description: `${item?.description ?? ""}`.trim(),
          link: `${item?.link ?? ""}`.trim(),
          image: `${item?.image ?? ""}`.trim(),
        }))
        .filter((item) => item.title || item.subtitle || item.description || item.link || item.image),
    })),
  };
};
