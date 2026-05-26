import { pickFirst, toArray } from "./helpers";

const sanitizeHeroSummary = (raw = "", profileName = "") => {
  const name = `${profileName || ""}`.trim();
  let text = `${raw || ""}`
    .replace(/\s+/g, " ")
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, " ")
    .replace(/(?:\+?\d[\d\s-]{8,}\d)/g, " ")
    .replace(/\b(linkedin|github|leetcode|education|experience|projects|contact)\b\s*:?/gi, " ")
    .replace(/\s+([,.:;!?])/g, "$1")
    .trim();

  if (name) {
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    text = text.replace(new RegExp(`^${escaped}\\s*`, "i"), "").trim();
    text = text.replace(new RegExp(`\\b${escaped}\\b`, "ig"), "").trim();
  }

  const sentences = text
    .split(/(?<=[.?!])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 20);
  const compact = (sentences.slice(0, 2).join(" ") || text).trim();
  return compact.slice(0, 220);
};

const SectionTitle = ({ label, palette }) => (
  <h2 style={{ marginTop: 0, display: "flex", alignItems: "center", gap: "8px", color: palette.heading || palette.text }}>
    <svg aria-hidden viewBox="0 0 20 20" width="16" height="16">
      <circle cx="10" cy="10" r="8" fill={`${palette.accent || palette.primary || "#22d3ee"}33`} />
      <path d="M5 10h10M10 5v10" stroke={palette.accent || palette.primary || "#22d3ee"} strokeWidth="1.6" />
    </svg>
    <span>{label}</span>
  </h2>
);

export const renderSection = ({ section, ctx }) => {
  const {
    palette,
    cardStyle,
    profile,
    skillGroups,
    experiences,
    projects,
    education,
    contacts,
    customStages,
  } = ctx;

  switch (`${section?.type || ""}`) {
    case "hero":
      {
        const rawSummary = pickFirst(profile?.summary, profile?.bio, profile?.about, profile?.description, "AI-generated dynamic portfolio");
        const cleanSummary = sanitizeHeroSummary(rawSummary, profile?.name)
          .split(/preferred style:/i)[0]
          .trim();
        const finalSummary =
          cleanSummary || pickFirst(toArray(profile?.title)[0], "Portfolio generated from resume.");
      return (
        <section key={section.id} style={cardStyle}>
          <h1
            style={{
              margin: 0,
              color: palette.heading || palette.text || "#e2e8f0",
              fontSize: "clamp(1.4rem, 2.2vw, 2.1rem)",
              letterSpacing: "0.01em",
              fontWeight: 700,
            }}
          >
            {profile?.name || "Portfolio"}
          </h1>
          <p style={{ margin: "8px 0 0 0", color: palette.text || "#e2e8f0" }}>
            {finalSummary}
          </p>
        </section>
      );
      }
    case "skills":
      return (
        <section key={section.id} style={cardStyle}>
          <SectionTitle label="Skills" palette={palette} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {skillGroups.flatMap((group) => group?.items || []).map((item, idx) => (
              <span
                key={`${section.id}-skill-${idx}`}
                style={{
                  border: `1px solid ${palette.primary || palette.border || "#334155"}`,
                  background: `${palette.primary || "#22d3ee"}18`,
                  borderRadius: "999px",
                  padding: "6px 10px",
                  fontSize: "13px",
                }}
              >
                {item}
              </span>
            ))}
          </div>
        </section>
      );
    case "experience":
      return (
        <section key={section.id} style={cardStyle}>
          <SectionTitle label="Experience" palette={palette} />
          {experiences.map((item, idx) => (
            <div key={`${section.id}-exp-${idx}`} style={{ marginBottom: "10px" }}>
              <strong style={{ color: palette.heading || palette.text }}>{pickFirst(item?.role, item?.title, "Role")}</strong>
              <div style={{ color: palette.text }}>{pickFirst(item?.company, item?.organization, item?.org)}</div>
              <div style={{ color: palette.textMuted || palette.text, fontSize: "12px" }}>
                {pickFirst(
                  item?.period,
                  item?.duration,
                  item?.timeline,
                  item?.subtitle,
                  item?.date,
                  item?.dates,
                  item?.timeframe,
                  item?.startDate && item?.endDate ? `${item.startDate} - ${item.endDate}` : "",
                  item?.startDate
                )}
              </div>
              <p style={{ margin: "4px 0 0 0", color: palette.text }}>{pickFirst(item?.description, item?.summary, item?.details)}</p>
            </div>
          ))}
          {!experiences.length ? <p style={{ color: palette.textMuted || palette.text }}>No experience entries.</p> : null}
        </section>
      );
    case "projects":
      return (
        <section key={section.id} style={cardStyle}>
          <SectionTitle label="Projects" palette={palette} />
          {projects.map((item, idx) => (
            <div key={`${section.id}-proj-${idx}`} style={{ marginBottom: "10px" }}>
              <strong style={{ color: palette.heading || palette.text }}>{pickFirst(item?.title, item?.name, "Project")}</strong>
              <div style={{ color: palette.textMuted || palette.text, fontSize: "12px" }}>
                {pickFirst(
                  item?.tech,
                  item?.stack,
                  Array.isArray(item?.techStack) ? item.techStack.join(", ") : "",
                  item?.tags
                )}
              </div>
              <p style={{ margin: "4px 0 0 0", color: palette.text }}>{pickFirst(item?.description, item?.summary, item?.details)}</p>
              {pickFirst(item?.link, item?.url) ? (
                <a
                  href={pickFirst(item?.link, item?.url)}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: palette.accent || "#22d3ee", fontSize: "12px" }}
                >
                  {pickFirst(item?.link, item?.url)}
                </a>
              ) : null}
            </div>
          ))}
          {!projects.length ? <p style={{ color: palette.textMuted || palette.text }}>No projects entries.</p> : null}
        </section>
      );
    case "education":
      return (
        <section key={section.id} style={cardStyle}>
          <SectionTitle label="Education" palette={palette} />
          {education.map((item, idx) => {
            const nestedItems = toArray(item?.items);
            if (nestedItems.length) {
              return (
                <div key={`${section.id}-edu-${idx}`} style={{ marginBottom: "10px" }}>
                  <div style={{ color: palette.textMuted || palette.text, fontSize: "12px", marginBottom: "4px" }}>
                    {pickFirst(item?.subtitle, item?.year, item?.period)}
                  </div>
                  {nestedItems.map((entry, entryIdx) => (
                    <div key={`${section.id}-edu-${idx}-${entryIdx}`} style={{ marginBottom: "6px" }}>
                      <strong style={{ color: palette.heading || palette.text }}>{pickFirst(entry?.institution, entry?.school, entry?.institute, "Institute")}</strong>
                      <div style={{ color: palette.text }}>{pickFirst(entry?.degree, entry?.title, entry?.program)}</div>
                    </div>
                  ))}
                </div>
              );
            }
            return (
              <div key={`${section.id}-edu-${idx}`} style={{ marginBottom: "8px" }}>
                <strong style={{ color: palette.heading || palette.text }}>{pickFirst(item?.institution, item?.school, item?.institute, "Institute")}</strong>
                <div style={{ color: palette.text }}>{pickFirst(item?.degree, item?.title, item?.program, item?.field)}</div>
                <div style={{ color: palette.textMuted || palette.text, fontSize: "12px" }}>{pickFirst(item?.subtitle, item?.year, item?.period)}</div>
              </div>
            );
          })}
          {!education.length ? <p style={{ color: palette.textMuted || palette.text }}>No education entries.</p> : null}
        </section>
      );
    case "contact":
      return (
        <section key={section.id} style={cardStyle}>
          <SectionTitle label="Contact" palette={palette} />
          {contacts.map((contact, idx) => (
            <div key={`${section.id}-contact-${idx}`} style={{ marginBottom: "6px" }}>
              <strong style={{ textTransform: "capitalize", marginRight: "6px" }}>{pickFirst(contact?.type, "contact")}:</strong>
              {pickFirst(contact?.href) ? (
                <a
                  href={pickFirst(contact?.href)}
                  target={contact?.external ? "_blank" : undefined}
                  rel={contact?.external ? "noreferrer" : undefined}
                  style={{ color: palette.accent || "#22d3ee" }}
                >
                  {pickFirst(contact?.text, contact?.href)}
                </a>
              ) : (
                <span>{pickFirst(contact?.text)}</span>
              )}
            </div>
          ))}
          {!contacts.length && (profile?.email || profile?.phone) ? (
            <div>
              {profile?.email ? <div>{profile.email}</div> : null}
              {profile?.phone ? <div>{profile.phone}</div> : null}
            </div>
          ) : null}
          {!contacts.length && !profile?.email && !profile?.phone ? (
            <p style={{ opacity: 0.75 }}>No contact details available.</p>
          ) : null}
        </section>
      );
    case "custom":
      {
        const normalizedId = `${section?.id || ""}`.toLowerCase();
        const normalizedSectionLabel = normalizedId.replace(/^custom-/, "").replace(/-/g, " ").trim();
        const matchedStages = toArray(customStages).filter((stage) => {
          const stageId = `${stage?.id || ""}`.toLowerCase();
          const stageName = `${stage?.name || ""}`.toLowerCase();
          if (!stageId && !stageName) return false;
          if (stageId === normalizedId) return true;
          if (stageName && normalizedSectionLabel && stageName.includes(normalizedSectionLabel)) return true;
          if (normalizedId === "custom-auto") return true;
          return false;
        });
        const fallbackAchievements = [];

        const hasMatchedContent =
          matchedStages.some((stage) => {
            if (stage?.kind === "cards") {
              return toArray(stage?.cards).some((card) =>
                `${card?.title || card?.subtitle || card?.description || ""}`.trim()
              );
            }
            return `${stage?.paragraph || stage?.description || ""}`.trim();
          }) || fallbackAchievements.length;

        if (!hasMatchedContent) return null;

        return (
          <section key={section.id} style={cardStyle}>
            <SectionTitle
              label={section?.id?.replace(/^custom-/, "").replace(/-/g, " ") || "Custom"}
              palette={palette}
            />
            {matchedStages.map((stage, idx) =>
              stage?.kind === "cards" ? (
                <div key={`${section.id}-cards-${idx}`} style={{ display: "grid", gap: "10px" }}>
                  {toArray(stage?.cards).map((card, cIdx) => (
                    <div
                      key={`${section.id}-card-${cIdx}`}
                      style={{
                        border: `1px solid ${palette.border || "#334155"}`,
                        borderRadius: "10px",
                        padding: "10px",
                      }}
                    >
                      <strong>{pickFirst(card?.title, "Card")}</strong>
                      <div style={{ color: palette.text }}>{pickFirst(card?.subtitle)}</div>
                      <p style={{ margin: "6px 0 0 0", color: palette.text }}>{pickFirst(card?.description)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p key={`${section.id}-para-${idx}`} style={{ margin: 0, color: palette.text }}>
                  {pickFirst(stage?.paragraph, stage?.description, "Custom section content")}
                </p>
              )
            )}
            {!matchedStages.length && fallbackAchievements.length ? (
              <ul style={{ margin: 0, paddingLeft: "18px" }}>
                {fallbackAchievements.map((item, idx) => (
                  <li key={`${section.id}-hl-${idx}`} style={{ marginBottom: "4px", color: palette.text }}>
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}
            {!matchedStages.length && !fallbackAchievements.length ? (
              <p style={{ margin: 0, color: palette.textMuted || palette.text }}>No custom content available.</p>
            ) : null}
          </section>
        );
      }
    default:
      return null;
  }
};
