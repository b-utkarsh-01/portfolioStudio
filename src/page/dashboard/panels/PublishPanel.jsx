import { Trash2, Rocket, Globe } from "lucide-react";
import { inputClassName } from "../dashboardFormConfig";

const emptyCertification = { name: "", provider: "", link: "" };
const removeBtnClass =
  "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-rose-500/70 text-rose-300 hover:bg-rose-500/20 hover:text-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400/60 transition";

const PublishPanel = ({
  form,
  onCollectionItemAdd,
  onCollectionItemRemove,
  onCollectionItemChange,
  onFieldChange,
  onPublish,
  onUnpublish,
  publishing,
  unpublishing,
  publishStatus,
  onOpenPublish,
}) => {
  const certifications = Array.isArray(form.certificationItems) ? form.certificationItems : [];
  const isPublished = publishStatus?.status === "published";

  return (
    <div className="space-y-5 min-w-0">
      <section className="rounded-xl border border-slate-700 bg-slate-900/30 p-3.5 sm:p-4 min-w-0">
        <div className="mb-3">
          <div>
            <p className="text-sm font-semibold text-slate-100">Certifications & Licenses</p>
            <p className="text-xs text-slate-400">Add certification cards with name, provider and credential link.</p>
          </div>
        </div>
        <div className="space-y-3 min-w-0">
          {certifications.map((item) => (
            <div key={item.id} className="rounded-lg border border-slate-700 bg-slate-950/40 p-3 min-w-0">
              <div className="mb-3 flex items-center justify-between gap-2 min-w-0">
                <input
                  value={item.name}
                  onChange={(event) =>
                    onCollectionItemChange?.("certificationItems", item.id, "name", event.target.value)
                  }
                  placeholder="Certification name (e.g. AWS Solutions Architect)"
                  className={`${inputClassName} mt-0 min-w-0 flex-1`}
                />
                <button
                  type="button"
                  onClick={() => onCollectionItemRemove?.("certificationItems", item.id)}
                  className={removeBtnClass}
                  title="Remove certification"
                  aria-label="Remove certification"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="grid gap-2 sm:grid-cols-2 min-w-0">
                <input
                  value={item.provider}
                  onChange={(event) =>
                    onCollectionItemChange?.("certificationItems", item.id, "provider", event.target.value)
                  }
                  placeholder="Issuing Organization (e.g. Amazon Web Services)"
                  className={`${inputClassName} mt-0 min-w-0`}
                />
                <input
                  value={item.link}
                  onChange={(event) =>
                    onCollectionItemChange?.("certificationItems", item.id, "link", event.target.value)
                  }
                  placeholder="Verification Link (e.g. https://...)"
                  className={`${inputClassName} mt-0 min-w-0`}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3">
          <button
            type="button"
            onClick={() => onCollectionItemAdd?.("certificationItems", emptyCertification)}
            className="w-full rounded-lg border border-cyan-400/60 px-3 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/10 transition"
          >
            + Add Certification
          </button>
        </div>
      </section>

      {/* Dedicated Publish & Go Live Quick Card */}
      {/* <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/15 p-4 sm:p-5 min-w-0">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-3 border-b border-emerald-500/20 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
              <Rocket className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-bold text-slate-100">Live Website Publishing</p>
              <p className="text-xs text-slate-400">Manage slug, visibility, and take your portfolio online</p>
            </div>
          </div>
          {onOpenPublish && (
            <button
              type="button"
              onClick={onOpenPublish}
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 transition self-start sm:self-auto"
            >
              <span>Open Publish Modal</span>
            </button>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 min-w-0">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Public URL Slug</label>
            <input
              value={form.slug || ""}
              onChange={onFieldChange?.("slug")}
              placeholder="e.g. john-doe"
              className={`${inputClassName} mt-0 font-mono`}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Visibility</label>
            <select
              value={form.visibility || "public"}
              onChange={onFieldChange?.("visibility")}
              className={`${inputClassName} mt-0`}
            >
              <option value="public">Public (Anyone can view)</option>
              <option value="private">Private (Offline / Draft)</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onPublish}
              disabled={publishing}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 shadow-md shadow-emerald-500/20 transition disabled:opacity-60 active:scale-95"
            >
              <Rocket className="h-3.5 w-3.5" />
              <span>{publishing ? "Publishing..." : isPublished ? "Update Live Site" : "Publish Live"}</span>
            </button>
            {isPublished && (
              <button
                type="button"
                onClick={onUnpublish}
                disabled={unpublishing}
                className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-3.5 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 transition disabled:opacity-50 active:scale-95"
              >
                {unpublishing ? "Updating..." : "Unpublish"}
              </button>
            )}
          </div>

          <p className="text-xs font-mono text-slate-400">
            Status: <span className={isPublished ? "text-emerald-400 font-semibold" : "text-slate-400"}>{publishStatus?.status || "draft"}</span> | Slug:{" "}
            <span className="text-cyan-300">{publishStatus?.slug || form.slug || "-"}</span>
          </p>
        </div>
      </div> */}
    </div>
  );
};

export default PublishPanel;
