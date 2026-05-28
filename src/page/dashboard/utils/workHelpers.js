export const createWorkItemId = () =>
  `work-item-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

export const createCollectionItemId = () =>
  `collection-item-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

export const arrayToLines = (list, fields) =>
  (Array.isArray(list) ? list : [])
    .map((item) => fields.map((field) => item?.[field] ?? "").join(" | "))
    .join("\n");

export const linesToArray = (value, fields) =>
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

export const educationToLines = (entries) =>
  (Array.isArray(entries) ? entries : [])
    .map((entry) => {
      const first = entry?.items?.[0] ?? {};
      return [entry?.subtitle ?? "", first.institute ?? "", first.degree ?? ""].join(" | ");
    })
    .join("\n");

export const linesToEducation = (value) =>
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

export const educationToItems = (entries) =>
  (Array.isArray(entries) ? entries : []).map((entry) => {
    const first = entry?.items?.[0] ?? {};
    return {
      id: createWorkItemId(),
      subtitle: `${entry?.subtitle ?? ""}`,
      institute: `${first?.institute ?? ""}`,
      degree: `${first?.degree ?? ""}`,
    };
  });

export const experiencesToItems = (entries) =>
  (Array.isArray(entries) ? entries : []).map((entry) => ({
    id: createWorkItemId(),
    title: `${entry?.title ?? ""}`,
    company: `${entry?.company ?? ""}`,
    period: `${entry?.period ?? ""}`,
    description: `${entry?.description ?? ""}`,
  }));

export const projectsToItems = (entries) =>
  (Array.isArray(entries) ? entries : []).map((entry) => ({
    id: createWorkItemId(),
    name: `${entry?.name ?? ""}`,
    tech: `${entry?.tech ?? ""}`,
    description: `${entry?.description ?? ""}`,
    link: `${entry?.link ?? ""}`,
    image: `${entry?.image ?? ""}`,
  }));

export const contactsToItems = (contacts) =>
  (Array.isArray(contacts) ? contacts : []).map((item) => ({
    id: createCollectionItemId(),
    type: `${item?.type ?? ""}`,
    text: `${item?.text ?? ""}`,
    href: `${item?.href ?? ""}`,
    external: Boolean(item?.external),
  }));

export const servicesToItems = (entries) =>
  (Array.isArray(entries) ? entries : []).map((item) => ({
    id: createCollectionItemId(),
    name: `${item?.name ?? ""}`,
    description: `${item?.description ?? ""}`,
  }));

export const testimonialsToItems = (entries) =>
  (Array.isArray(entries) ? entries : []).map((item) => ({
    id: createCollectionItemId(),
    name: `${item?.name ?? ""}`,
    role: `${item?.role ?? ""}`,
    quote: `${item?.quote ?? ""}`,
  }));

export const certificationsToItems = (entries) =>
  (Array.isArray(entries) ? entries : []).map((item) => ({
    id: createCollectionItemId(),
    name: `${item?.name ?? ""}`,
    provider: `${item?.provider ?? ""}`,
    link: `${item?.link ?? ""}`,
  }));
