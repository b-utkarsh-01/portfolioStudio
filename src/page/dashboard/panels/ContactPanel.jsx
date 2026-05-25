import { Trash2 } from "lucide-react";
import { inputClassName } from "../dashboardFormConfig";

const emptyContact = { type: "", text: "", href: "", external: false };
const removeBtnClass =
  "inline-flex h-10 w-10 items-center justify-center rounded-lg border border-rose-500/70 text-rose-300 hover:bg-rose-500/20 hover:text-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400/60";

const ContactPanel = ({ form, onCollectionItemAdd, onCollectionItemRemove, onCollectionItemChange }) => {
  const items = Array.isArray(form.contactItems) ? form.contactItems : [];

  return (
    <section className="rounded-xl border border-slate-700 bg-slate-900/30 p-4">
      <div className="mb-3">
        <div>
          <p className="text-sm font-semibold text-slate-100">Contact Links</p>
          <p className="text-xs text-slate-400">Add phone, email, github or any profile link as contact cards.</p>
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-lg border border-slate-700 bg-slate-950/40 p-3">
            <div className="grid gap-2 lg:grid-cols-[110px_minmax(0,1fr)_minmax(0,1fr)_150px_auto]">
              <input
                value={item.type}
                onChange={(event) => onCollectionItemChange?.("contactItems", item.id, "type", event.target.value)}
                placeholder="eg. Phone"
                className={`${inputClassName} mt-0`}
              />
              <input
                value={item.text}
                onChange={(event) => onCollectionItemChange?.("contactItems", item.id, "text", event.target.value)}
                placeholder="Text (e.g. +91 98765...)"
                className={`${inputClassName} mt-0`}
              />
              <input
                value={item.href}
                onChange={(event) => onCollectionItemChange?.("contactItems", item.id, "href", event.target.value)}
                placeholder="URL (tel:/mailto:/https://)"
                className={`${inputClassName} mt-0`}
              />
              <label className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={Boolean(item.external)}
                  onChange={(event) =>
                    onCollectionItemChange?.("contactItems", item.id, "external", event.target.checked)
                  }
                />
                Open In New Tab
              </label>
              <button
                type="button"
                onClick={() => onCollectionItemRemove?.("contactItems", item.id)}
                className={removeBtnClass}
                title="Remove contact"
                aria-label="Remove contact"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3">
        <button
          type="button"
          onClick={() => onCollectionItemAdd?.("contactItems", emptyContact)}
          className="w-full rounded-lg border border-cyan-400/60 px-3 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/10"
        >
          + Add Contact
        </button>
      </div>
    </section>
  );
};

export default ContactPanel;
