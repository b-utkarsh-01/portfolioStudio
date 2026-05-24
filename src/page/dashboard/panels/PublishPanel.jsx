import { Trash2 } from "lucide-react";
import { inputClassName } from "../dashboardFormConfig";

const emptyCertification = { name: "", provider: "", link: "" };
const removeBtnClass =
  "inline-flex h-10 w-10 items-center justify-center rounded-lg border border-rose-500/70 text-rose-300 hover:bg-rose-500/20 hover:text-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400/60";

const PublishPanel = ({ form, onCollectionItemAdd, onCollectionItemRemove, onCollectionItemChange }) => {
  const certifications = Array.isArray(form.certificationItems) ? form.certificationItems : [];

  return (
    <>
      <section className="rounded-xl border border-slate-700 bg-slate-900/30 p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-100">Certifications</p>
            <p className="text-xs text-slate-400">Add certification cards with provider and optional link.</p>
          </div>
          <button
            type="button"
            onClick={() => onCollectionItemAdd?.("certificationItems", emptyCertification)}
            className="rounded-lg border border-cyan-400/60 px-3 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/10"
          >
            + Add Certification
          </button>
        </div>
        <div className="space-y-3">
          {certifications.map((item) => (
            <div key={item.id} className="rounded-lg border border-slate-700 bg-slate-950/40 p-3">
              <div className="mb-3 flex items-center justify-between gap-2">
                <input
                  value={item.name}
                  onChange={(event) =>
                    onCollectionItemChange?.("certificationItems", item.id, "name", event.target.value)
                  }
                  placeholder="Certification name"
                  className={`${inputClassName} mt-0`}
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
              <div className="grid gap-2 sm:grid-cols-2">
                <input
                  value={item.provider}
                  onChange={(event) =>
                    onCollectionItemChange?.("certificationItems", item.id, "provider", event.target.value)
                  }
                  placeholder="Provider"
                  className={`${inputClassName} mt-0`}
                />
                <input
                  value={item.link}
                  onChange={(event) =>
                    onCollectionItemChange?.("certificationItems", item.id, "link", event.target.value)
                  }
                  placeholder="Link (optional) e.g. https://certificate.com"
                  className={`${inputClassName} mt-0`}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="rounded-xl border border-slate-700 bg-slate-950/40 p-4">
        <p className="text-sm text-slate-300">Final step: Save your portfolio first, then preview via URL data.</p>
      </div>
    </>
  );
};

export default PublishPanel;
