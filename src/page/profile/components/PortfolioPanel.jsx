import React from "react";
import {
  Plus,
  Trash2,
  Sparkles,
  Search,
  Phone,
  Mail,
  Link as LinkIcon,
  Github,
  Linkedin,
  Globe,
  User,
  FileText,
  Briefcase,
  Share2,
} from "lucide-react";
import LoadingState from "../../../layout/LoadingState";
import ImageInputWithUpload from "../../../layout/components/ImageInputWithUpload";

const fieldClass =
  "w-full min-w-0 rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-100 outline-none transition focus:border-orange-400 focus:ring-1 focus:ring-orange-400/30";

const InlineListEditor = ({ title, addLabel, items, placeholder, onAdd, onChange, onRemove }) => (
  <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3.5 sm:p-4 min-w-0">
    <div className="mb-2.5">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
    </div>
    <div className="space-y-2.5 min-w-0">
      {items.map((item, index) => (
        <div key={`${title}-${index}`} className="flex gap-2 min-w-0">
          <input
            value={item}
            onChange={(event) => onChange(index, event.target.value)}
            placeholder={placeholder}
            className={`${fieldClass} min-w-0 flex-1`}
          />
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="inline-flex shrink-0 items-center justify-center rounded-xl border border-rose-500/40 px-3 py-2 text-rose-300 transition hover:bg-rose-500/10"
            title="Remove item"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
    <div className="mt-3">
      <button
        type="button"
        onClick={onAdd}
        className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-cyan-500/40 bg-cyan-500/5 px-3 py-2.5 text-xs font-semibold text-cyan-300 transition hover:bg-cyan-500/10 hover:border-cyan-400"
      >
        <Plus className="h-3.5 w-3.5" />
        {addLabel}
      </button>
    </div>
  </div>
);

const panelContainerClass =
  "flex h-full min-h-0 min-w-0 w-full overflow-hidden flex-col rounded-2xl sm:rounded-3xl border border-slate-800 bg-slate-900/60 p-4 sm:p-6 shadow-xl backdrop-blur-xl";

const contactIcon = (type = "") => {
  const normalized = `${type}`.toLowerCase();
  if (normalized === "phone") return <Phone className="h-4 w-4 text-emerald-400" />;
  if (normalized === "email") return <Mail className="h-4 w-4 text-cyan-400" />;
  if (normalized === "github") return <Github className="h-4 w-4 text-slate-200" />;
  if (normalized === "linkedin") return <Linkedin className="h-4 w-4 text-blue-400" />;
  if (normalized === "website") return <Globe className="h-4 w-4 text-indigo-400" />;
  return <LinkIcon className="h-4 w-4 text-slate-400" />;
};

const PortfolioPanel = ({
  loading,
  editing,
  portfolioData,
  titleLine,
  contactLine,
  draft,
  activeStage,
  onDraftChange,
  addTitleItem,
  updateTitleItem,
  removeTitleItem,
  addHighlightItem,
  updateHighlightItem,
  removeHighlightItem,
  addContactItem,
  updateContactItem,
  removeContactItem,
}) => {
  if (loading) {
    return <LoadingState title="Loading profile data..." subtitle="Syncing your portfolio information." compact />;
  }

  // 1. Profile / Bio Tab
  if (activeStage === "profile") {
    const rawTitles = Array.isArray(portfolioData?.profile?.title)
      ? portfolioData.profile.title
      : portfolioData?.profile?.title
      ? [portfolioData.profile.title]
      : [];

    if (!editing) {
      return (
        <div className={panelContainerClass}>
          <div className="shrink-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border-b border-slate-800/80 pb-3 sm:pb-4 mb-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-orange-400 shrink-0" />
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-200">
                Portfolio Profile & Bio
              </h2>
            </div>
            <span className="text-[11px] sm:text-xs text-slate-500">Public presentation</span>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto frontend-scrollbar pr-1 sm:pr-2 space-y-6">
            <div className="flex items-center gap-3.5 sm:gap-4">
              {portfolioData?.profile?.avatar ? (
                <img
                  src={portfolioData.profile.avatar}
                  alt={portfolioData.profile.name || "Avatar"}
                  className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl border border-slate-700 object-cover shadow-md shrink-0"
                />
              ) : null}
              <div className="min-w-0">
                <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold block">
                  Full Display Name
                </span>
                <p className="mt-0.5 text-base sm:text-lg font-bold text-slate-100 truncate">
                  {portfolioData?.profile?.name || "No name set"}
                </p>
              </div>
            </div>

            <div>
              <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold block mb-2">
                Headline Roles & Titles
              </span>
              {rawTitles.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {rawTitles.map((title, idx) => (
                    <span
                      key={`title-chip-${idx}`}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-200"
                    >
                      <Briefcase className="h-3 w-3 text-cyan-400 shrink-0" />
                      <span>{title}</span>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">No titles added yet.</p>
              )}
            </div>

            <div>
              <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold block mb-2">
                About / Professional Summary
              </span>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <p className="text-sm leading-relaxed text-slate-300 whitespace-pre-wrap">
                  {portfolioData?.profile?.summary || "No summary provided yet. Click 'Edit Details' above to add your bio."}
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={panelContainerClass}>
        <div className="shrink-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border-b border-slate-800/80 pb-3 sm:pb-4 mb-4">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-orange-400 shrink-0" />
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-200">
              Edit Portfolio Bio
            </h2>
          </div>
          <span className="text-[11px] sm:text-xs text-orange-400 font-semibold">Editing Mode</span>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto frontend-scrollbar pr-1 sm:pr-2 space-y-5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Full Name
            <input
              value={draft?.profile?.name || ""}
              onChange={(event) => onDraftChange("profile.name", event.target.value)}
              placeholder="e.g. John Doe"
              className={`mt-1.5 ${fieldClass}`}
            />
          </label>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Avatar Image (URL or Upload JPG)
            </label>
            <ImageInputWithUpload
              value={draft?.profile?.avatar || ""}
              onChange={(e) => onDraftChange("profile.avatar", e.target.value)}
              placeholder="Paste image URL or upload JPG..."
              maxDimension={600}
            />
          </div>

          <InlineListEditor
            title="Headline Roles / Titles"
            addLabel="Add Title"
            items={Array.isArray(draft?.profile?.title) ? draft.profile.title : [""]}
            placeholder="e.g. Senior Full Stack Engineer"
            onAdd={addTitleItem}
            onChange={updateTitleItem}
            onRemove={removeTitleItem}
          />

          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Professional Summary
            <textarea
              rows={4}
              value={draft?.profile?.summary || ""}
              onChange={(event) => onDraftChange("profile.summary", event.target.value)}
              placeholder="Write a brief overview of your background, technical focus, and achievements..."
              className={`mt-1.5 ${fieldClass}`}
            />
          </label>
        </div>
      </div>
    );
  }

  // 2. Highlights Tab
  if (activeStage === "highlights") {
    const highlights = (Array.isArray(portfolioData?.profile?.highlights) ? portfolioData.profile.highlights : [])
      .map((item) => `${item || ""}`.trim())
      .filter(Boolean);

    return (
      <div className={panelContainerClass}>
        <div className="shrink-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border-b border-slate-800/80 pb-3 sm:pb-4 mb-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-amber-400 shrink-0" />
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-200">
              Key Career Highlights
            </h2>
          </div>
          <span className="text-[11px] sm:text-xs text-slate-500">Badges & quick metrics</span>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto frontend-scrollbar pr-1 sm:pr-2 space-y-4">
          {!editing ? (
            highlights.length ? (
              <div className="space-y-4">
                <p className="text-xs text-slate-400">
                  These highlight badges are displayed prominently in your portfolio hero section:
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {highlights.map((item, index) => (
                    <span
                      key={`highlight-chip-${index}`}
                      className="inline-flex items-center gap-2 rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 to-slate-900 px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs font-semibold text-cyan-200 shadow-sm"
                    >
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] shrink-0">
                        ★
                      </span>
                      <span>{item}</span>
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 p-6 sm:p-8 text-center">
                <Search className="mx-auto h-8 w-8 text-slate-600 mb-2" />
                <p className="text-sm font-medium text-slate-400">No highlights added yet.</p>
                <p className="text-xs text-slate-500 mt-1">
                  Click "Edit Details" above to add badges like "5+ Years Experience" or "Open Source Maintainer".
                </p>
              </div>
            )
          ) : (
            <InlineListEditor
              title="Highlights & Metric Badges"
              addLabel="Add Highlight"
              items={Array.isArray(draft?.profile?.highlights) ? draft.profile.highlights : [""]}
              placeholder="e.g. 5+ Years Experience"
              onAdd={addHighlightItem}
              onChange={updateHighlightItem}
              onRemove={removeHighlightItem}
            />
          )}
        </div>
      </div>
    );
  }

  // 3. Contacts & Socials Tab
  if (activeStage === "contacts") {
    const contacts = (Array.isArray(portfolioData?.profile?.contacts) ? portfolioData.profile.contacts : [])
      .filter((item) => `${item?.text || ""}`.trim() || `${item?.href || ""}`.trim());

    return (
      <div className={panelContainerClass}>
        <div className="shrink-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border-b border-slate-800/80 pb-3 sm:pb-4 mb-4">
          <div className="flex items-center gap-2">
            <Share2 className="h-4 w-4 text-cyan-400 shrink-0" />
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-200">
              Contact & Social Channels
            </h2>
          </div>
          <span className="text-[11px] sm:text-xs text-slate-500">Public links & reachability</span>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto frontend-scrollbar pr-1 sm:pr-2 space-y-4">
          {!editing ? (
            contacts.length ? (
              <div className="grid gap-3 sm:grid-cols-2 min-w-0">
                {contacts.map((item, index) => (
                  <div
                    key={`contact-view-${index}`}
                    className="rounded-2xl border border-slate-800 bg-slate-950/50 p-3.5 sm:p-4 transition hover:border-slate-700 hover:bg-slate-900/30 min-w-0"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                        {contactIcon(item?.type)}
                        {item?.type || "Contact"}
                      </span>
                      {item?.external && (
                        <span className="text-[10px] text-slate-500 bg-slate-800/60 px-1.5 py-0.5 rounded">
                          External
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-slate-100 break-all">{item?.text || "-"}</p>
                    {item?.href && (
                      <a
                        href={item.href}
                        target={item.external ? "_blank" : undefined}
                        rel={item.external ? "noreferrer" : undefined}
                        className="mt-2 block text-xs text-cyan-400 hover:text-cyan-300 hover:underline break-all"
                      >
                        {item.href}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 p-6 sm:p-8 text-center">
                <Share2 className="mx-auto h-8 w-8 text-slate-600 mb-2" />
                <p className="text-sm font-medium text-slate-400">No contact links added yet.</p>
                <p className="text-xs text-slate-500 mt-1">
                  Click "Edit Details" above to connect your GitHub, Email, LinkedIn, or Website.
                </p>
              </div>
            )
          ) : (
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3.5 sm:p-4 space-y-3 min-w-0">
              <div className="mb-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Contact Channels
                </p>
              </div>
              <div className="space-y-3 min-w-0">
                {(Array.isArray(draft?.profile?.contacts) ? draft.profile.contacts : []).map((contact, index) => (
                  <div
                    key={`contact-${index}`}
                    className="grid gap-2.5 rounded-xl border border-slate-800/80 bg-slate-900/50 p-3 sm:grid-cols-[140px_minmax(0,1fr)_minmax(0,1fr)_auto] min-w-0"
                  >
                    <div>
                      <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">
                        Type
                      </label>
                      <input
                        value={contact?.type || ""}
                        onChange={(event) => updateContactItem(index, "type", event.target.value)}
                        placeholder="e.g. github, email"
                        className={fieldClass}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">
                        Label Text
                      </label>
                      <input
                        value={contact?.text || ""}
                        onChange={(event) => updateContactItem(index, "text", event.target.value)}
                        placeholder="e.g. github.com/username"
                        className={fieldClass}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">
                        Target Link / URL
                      </label>
                      <input
                        value={contact?.href || ""}
                        onChange={(event) => updateContactItem(index, "href", event.target.value)}
                        placeholder="https://..."
                        className={fieldClass}
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => removeContactItem(index)}
                        className="inline-flex h-[42px] items-center justify-center rounded-xl border border-rose-500/40 px-3 text-rose-300 transition hover:bg-rose-500/10 shrink-0"
                        title="Remove contact"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={addContactItem}
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-cyan-500/40 bg-cyan-500/5 px-3 py-2.5 text-xs font-semibold text-cyan-300 transition hover:bg-cyan-500/10 hover:border-cyan-400"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Contact Channel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default PortfolioPanel;
