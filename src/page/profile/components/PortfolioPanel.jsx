import { Plus, Trash2, Sparkles, Phone, Mail, Link as LinkIcon } from "lucide-react";
import LoadingState from "../../../layout/LoadingState";

const fieldClass = "w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-orange-400";

const InlineListEditor = ({ title, addLabel, items, placeholder, onAdd, onChange, onRemove }) => (
  <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-3">
    <div className="mb-2">
      <p className="text-sm text-slate-200">{title}</p>
    </div>
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={`${title}-${index}`} className="flex gap-2">
          <input value={item} onChange={(event) => onChange(index, event.target.value)} placeholder={placeholder} className={fieldClass} />
          <button type="button" onClick={() => onRemove(index)} className="inline-flex items-center justify-center rounded-lg border border-rose-500 px-3 py-2 text-rose-300 hover:bg-rose-500/10">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
    <div className="mt-3">
      <button type="button" onClick={onAdd} className="inline-flex w-full items-center justify-center gap-1 rounded-lg border border-cyan-500 px-2.5 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/10">
        <Plus className="h-3.5 w-3.5" />
        {addLabel}
      </button>
    </div>
  </div>
);

const sectionCard = "rounded-2xl border border-slate-700 bg-slate-900/60 p-4";

const contactIcon = (type = "") => {
  const normalized = `${type}`.toLowerCase();
  if (normalized === "phone") return <Phone className="h-4 w-4" />;
  if (normalized === "email") return <Mail className="h-4 w-4" />;
  return <LinkIcon className="h-4 w-4" />;
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
    return <LoadingState title="Loading portfolio data..." subtitle="Syncing your editable profile information." compact />;
  }

  if (activeStage === "profile") {
    if (!editing) {
      return (
        <div className={sectionCard}>
          <h2 className="text-sm uppercase tracking-wide text-slate-400">Profile</h2>
          <p className="mt-2 text-slate-100"><span className="text-slate-400">Name:</span> {portfolioData?.profile?.name || "-"}</p>
          <p className="mt-1 text-slate-100"><span className="text-slate-400">Titles:</span> {titleLine || "-"}</p>
          <p className="mt-1 text-slate-100"><span className="text-slate-400">Summary:</span> {portfolioData?.profile?.summary || "-"}</p>
        </div>
      );
    }

    return (
      <div className={sectionCard}>
        <h2 className="mb-3 text-sm uppercase tracking-wide text-slate-400">Profile</h2>
        <div className="grid gap-3">
          <label className="text-sm text-slate-200">Name
            <input value={draft?.profile?.name || ""} onChange={(event) => onDraftChange("profile.name", event.target.value)} className={`mt-1 ${fieldClass}`} />
          </label>
          <InlineListEditor
            title="Titles"
            addLabel="Add Title"
            items={Array.isArray(draft?.profile?.title) ? draft.profile.title : [""]}
            placeholder="Title (e.g., Full Stack Developer)"
            onAdd={addTitleItem}
            onChange={updateTitleItem}
            onRemove={removeTitleItem}
          />
          <label className="text-sm text-slate-200">Summary
            <textarea rows={4} value={draft?.profile?.summary || ""} onChange={(event) => onDraftChange("profile.summary", event.target.value)} className={`mt-1 ${fieldClass}`} />
          </label>
        </div>
      </div>
    );
  }

  if (activeStage === "highlights") {
    const highlights = (Array.isArray(portfolioData?.profile?.highlights) ? portfolioData.profile.highlights : [])
      .map((item) => `${item || ""}`.trim())
      .filter(Boolean);

    return (
      <div className={sectionCard}>
        <h2 className="mb-3 text-sm uppercase tracking-wide text-slate-400">Highlights</h2>
        {!editing ? (
          highlights.length ? (
            <div className="flex flex-wrap gap-2">
              {highlights.map((item, index) => (
                <span
                  key={`highlight-chip-${index}`}
                  className="inline-flex items-center gap-1 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 text-sm font-medium text-cyan-200"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  {item}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-slate-400">No highlights added yet.</p>
          )
        ) : (
          <InlineListEditor
            title="Highlights"
            addLabel="Add Highlight"
            items={Array.isArray(draft?.profile?.highlights) ? draft.profile.highlights : [""]}
            placeholder="Highlight (e.g., Node.js)"
            onAdd={addHighlightItem}
            onChange={updateHighlightItem}
            onRemove={removeHighlightItem}
          />
        )}
      </div>
    );
  }

  if (activeStage === "contacts") {
    const contacts = (Array.isArray(portfolioData?.profile?.contacts) ? portfolioData.profile.contacts : [])
      .filter((item) => `${item?.text || ""}`.trim() || `${item?.href || ""}`.trim());

    return (
      <div className={sectionCard}>
        <h2 className="mb-3 text-sm uppercase tracking-wide text-slate-400">Contacts</h2>
        {!editing ? (
          contacts.length ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {contacts.map((item, index) => (
                <div key={`contact-view-${index}`} className="rounded-xl border border-slate-700 bg-slate-950/50 p-3">
                  <div className="mb-1 inline-flex items-center gap-1.5 text-xs uppercase tracking-wide text-slate-400">
                    {contactIcon(item?.type)}
                    {item?.type || "contact"}
                  </div>
                  <p className="text-slate-100 break-all">{item?.text || "-"}</p>
                  {item?.href ? (
                    <a
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noreferrer" : undefined}
                      className="mt-1 block text-xs text-cyan-300 hover:text-cyan-200 break-all"
                    >
                      {item.href}
                    </a>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400">No contacts added yet.</p>
          )
        ) : (
          <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-3">
            <div className="mb-2">
              <p className="text-sm text-slate-200">Contacts</p>
            </div>
            <div className="space-y-2">
              {(Array.isArray(draft?.profile?.contacts) ? draft.profile.contacts : []).map((contact, index) => (
                <div key={`contact-${index}`} className="grid gap-2 sm:grid-cols-[140px_minmax(0,1fr)_minmax(0,1fr)_auto]">
                  <input value={contact?.type || ""} onChange={(event) => updateContactItem(index, "type", event.target.value)} placeholder="eg. phone" className={fieldClass} />
                  <input value={contact?.text || ""} onChange={(event) => updateContactItem(index, "text", event.target.value)} placeholder="display text" className={fieldClass} />
                  <input value={contact?.href || ""} onChange={(event) => updateContactItem(index, "href", event.target.value)} placeholder="href (tel:, mailto:, https://)" className={fieldClass} />
                  <button type="button" onClick={() => removeContactItem(index)} className="inline-flex items-center justify-center rounded-lg border border-rose-500 px-3 py-2 text-rose-300 hover:bg-rose-500/10">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-3">
              <button type="button" onClick={addContactItem} className="inline-flex w-full items-center justify-center gap-1 rounded-lg border border-cyan-500 px-2.5 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/10">
                <Plus className="h-3.5 w-3.5" />
                Add Contact
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={sectionCard}>
      <h2 className="text-sm uppercase tracking-wide text-slate-400">Saved Portfolio</h2>
      <p className="mt-2 text-slate-100"><span className="text-slate-400">Name:</span> {portfolioData?.profile?.name || "-"}</p>
      <p className="mt-1 text-slate-100"><span className="text-slate-400">Titles:</span> {titleLine || "-"}</p>
      <p className="mt-1 text-slate-100"><span className="text-slate-400">Summary:</span> {portfolioData?.profile?.summary || "-"}</p>
      <p className="mt-1 text-slate-100"><span className="text-slate-400">Contacts:</span> {contactLine || "-"}</p>
    </div>
  );
};

export default PortfolioPanel;
