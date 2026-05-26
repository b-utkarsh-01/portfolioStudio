import { buildSections, buildSkillGroups, buildStyles, toArray } from "./helpers";
import { renderSection } from "./sections";

const SvgVisualLayer = ({ palette, motif = "grid" }) => {
  const stroke = palette?.accent || palette?.primary || "#22d3ee";
  const fill = `${stroke}2f`;

  if (motif === "none") return null;

  if (motif === "blob") {
    return (
      <svg aria-hidden viewBox="0 0 1200 1000" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
        <path d="M80,230 C150,20 360,20 470,170 C580,320 760,300 860,170 C960,40 1130,60 1200,240 L1200,0 L0,0 L0,320 C35,320 60,300 80,230 Z" fill={fill} opacity="1" />
        <path d="M0,840 C120,760 290,700 420,760 C550,820 720,930 900,860 C1040,810 1120,830 1200,900 L1200,1000 L0,1000 Z" fill={`${stroke}22`} />
        <circle cx="1020" cy="210" r="78" fill={`${stroke}26`} />
        <circle cx="210" cy="760" r="62" fill={`${stroke}22`} />
      </svg>
    );
  }

  if (motif === "circuit") {
    return (
      <svg aria-hidden viewBox="0 0 1200 1000" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
        <g stroke={stroke} strokeWidth="1.8" fill="none" opacity="0.72">
          <path d="M40 40 H300 V120 H560" />
          <path d="M190 80 H470 V180 H760" />
          <path d="M700 40 H980 V130 H1160" />
          <path d="M90 420 H320 V520 H560" />
          <path d="M460 620 H760 V730 H1080" />
          <path d="M180 860 H500 V940 H780" />
          <circle cx="300" cy="120" r="4" fill={stroke} />
          <circle cx="560" cy="120" r="4" fill={stroke} />
          <circle cx="760" cy="180" r="4" fill={stroke} />
          <circle cx="980" cy="130" r="4" fill={stroke} />
          <circle cx="320" cy="520" r="4" fill={stroke} />
          <circle cx="560" cy="520" r="4" fill={stroke} />
          <circle cx="760" cy="730" r="4" fill={stroke} />
          <circle cx="500" cy="940" r="4" fill={stroke} />
        </g>
      </svg>
    );
  }

  return (
    <svg aria-hidden viewBox="0 0 1200 1000" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
      <defs>
        <pattern id="ai-grid-pattern" width="34" height="34" patternUnits="userSpaceOnUse">
          <path d="M 34 0 L 0 0 0 34" fill="none" stroke={stroke} strokeOpacity="0.4" strokeWidth="1.3" />
        </pattern>
      </defs>
      <rect width="1200" height="1000" fill="url(#ai-grid-pattern)" opacity="1" />
      <circle cx="1020" cy="130" r="90" fill={`${stroke}18`} />
      <circle cx="140" cy="860" r="70" fill={`${stroke}14`} />
    </svg>
  );
};

const SectionSvgDecor = ({ palette, motif = "grid", pack = "a", index = 0 }) => {
  const color = palette?.accent || palette?.primary || "#22d3ee";
  const phase = (index + (pack.charCodeAt(0) % 5)) % 3;

  if (motif === "none") return null;

  if (motif === "circuit") {
    return (
      <svg aria-hidden viewBox="0 0 100 24" style={{ position: "absolute", top: 8, right: 10, width: 104, height: 24, opacity: 0.85, pointerEvents: "none" }}>
        <path d="M2 12 H30 V4 H55 V18 H88" stroke={color} strokeWidth="1.5" fill="none" />
        <circle cx="30" cy="4" r="2" fill={color} />
        <circle cx="55" cy="18" r="2" fill={color} />
      </svg>
    );
  }

  if (motif === "blob") {
    return (
      <svg aria-hidden viewBox="0 0 84 24" style={{ position: "absolute", top: 8, right: 10, width: 100, height: 26, opacity: 0.9, pointerEvents: "none" }}>
        <path
          d={
            phase === 0
              ? "M4 16 C14 2, 36 2, 44 14 C52 24, 70 22, 80 12"
              : phase === 1
                ? "M2 12 C12 22, 34 22, 42 10 C50 0, 72 4, 82 14"
                : "M4 14 C16 4, 34 10, 44 18 C56 24, 72 18, 82 8"
          }
          stroke={color}
          strokeWidth="2"
          fill="none"
        />
      </svg>
    );
  }

  return (
    <svg aria-hidden viewBox="0 0 84 24" style={{ position: "absolute", top: 8, right: 10, width: 100, height: 26, opacity: 0.8, pointerEvents: "none" }}>
      <path d="M0 0 H84 M0 12 H84 M0 24 H84" stroke={color} strokeWidth="1" />
      <path d="M0 0 V24 M28 0 V24 M56 0 V24 M84 0 V24" stroke={color} strokeWidth="0.8" />
    </svg>
  );
};

const AiDynamicTemplateRenderer = ({ spec, portfolioData }) => {
  const palette = spec?.theme?.palette || {};
  const profile = portfolioData?.profile || {};
  const skillGroups = buildSkillGroups(portfolioData?.skills);
  const experiences = toArray(portfolioData?.experiences);
  const projects = toArray(portfolioData?.projects);
  const education = toArray(portfolioData?.education);
  const contactsFromProfile = [
    profile?.email ? { type: "email", text: profile.email, href: `mailto:${profile.email}` } : null,
    profile?.phone ? { type: "phone", text: profile.phone } : null,
    profile?.website ? { type: "website", text: profile.website, href: profile.website, external: true } : null,
    profile?.github ? { type: "github", text: profile.github, href: profile.github, external: true } : null,
    profile?.linkedin ? { type: "linkedin", text: profile.linkedin, href: profile.linkedin, external: true } : null,
    profile?.twitter ? { type: "twitter", text: profile.twitter, href: profile.twitter, external: true } : null,
  ].filter(Boolean);
  const contacts = [...toArray(profile?.contacts), ...contactsFromProfile];
  const customStages = toArray(portfolioData?.customStages);
  const sections = buildSections({
    sections: spec?.sections,
    education,
    contacts,
    profile,
    customStages,
    skillGroups,
    experiences,
    projects,
  });
  const { shellStyle, cardStyle, palette: resolvedPalette } = buildStyles(palette, spec?.theme || {});
  const structure = `${spec?.layout?.structure || "single-page"}`.toLowerCase();
  const visuals = spec?.components?.visuals || {};
  const motif = `${visuals?.motif || "grid"}`.toLowerCase();
  const contentMaxWidth = `${spec?.theme?.spacing?.contentMaxWidth || "standard"}`.toLowerCase();

  const widthByMax = {
    narrow: 860,
    standard: 1100,
    wide: 1320,
    full: null,
  };
  const computedMaxWidth = Object.prototype.hasOwnProperty.call(widthByMax, contentMaxWidth)
    ? widthByMax[contentMaxWidth]
    : 1100;

  const ctx = {
    palette: resolvedPalette,
    cardStyle,
    profile,
    skillGroups,
    experiences,
    projects,
    education,
    contacts,
    customStages,
  };

  const rawRenderedSections = sections.length
    ? sections.map((section) => renderSection({ section, ctx }))
    : [<section key="empty" style={cardStyle}>No AI sections available.</section>];
  const renderedSections = rawRenderedSections
    .filter(Boolean)
    .map((node, index) => (
      <div key={`sec-wrap-${index}`} style={{ position: "relative" }}>
        {visuals?.enabled && visuals?.sectionDecorations ? (
          <SectionSvgDecor
            palette={resolvedPalette}
            motif={motif}
            pack={`${visuals?.pack || "a"}`}
            index={index}
          />
        ) : null}
        {node}
      </div>
    ));

  const renderByStructure = () => {
    if (structure === "split-screen") {
      return (
        <div style={{ display: "grid", gap: "14px", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
          <div>{renderedSections.slice(0, Math.ceil(renderedSections.length / 2))}</div>
          <div>{renderedSections.slice(Math.ceil(renderedSections.length / 2))}</div>
        </div>
      );
    }

    if (structure === "bento-flow") {
      return (
        <div
          style={{
            display: "grid",
            gap: "14px",
            gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
            alignItems: "start",
          }}
        >
          {renderedSections}
        </div>
      );
    }

    if (structure === "magazine-stack") {
      return (
        <div style={{ display: "grid", gap: "10px" }}>
          {renderedSections.map((node, idx) => (
        <div
          key={`mag-${idx}`}
          style={{
                borderLeft: `3px solid ${resolvedPalette.accent || "#22d3ee"}`,
                paddingLeft: "8px",
              }}
            >
              {node}
            </div>
          ))}
        </div>
      );
    }

    return <div>{renderedSections}</div>;
  };

  const shellWithStylePreset =
    motif === "blob"
      ? {
          ...shellStyle,
          background: `radial-gradient(circle at 10% 20%, ${(resolvedPalette?.primary || "#ef4444")}40 0%, transparent 35%), radial-gradient(circle at 90% 80%, ${(resolvedPalette?.secondary || resolvedPalette?.accent || "#f97316")}34 0%, transparent 40%), ${resolvedPalette?.background || "#020617"}`,
        }
      : shellStyle;

  return (
    <div style={{ ...shellWithStylePreset, position: "relative", overflow: "hidden" }}>
      {visuals?.enabled ? <SvgVisualLayer palette={resolvedPalette} motif={motif} /> : null}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: computedMaxWidth || "100%",
          width: "100%",
          margin: "0 auto",
          padding: "28px 20px 44px 20px",
        }}
      >
        {renderByStructure()}
      </div>
    </div>
  );
};

export default AiDynamicTemplateRenderer;
