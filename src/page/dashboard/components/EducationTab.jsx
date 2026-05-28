import React from "react";
import { inputClassName } from "../dashboardFormConfig";
import { Trash2 } from "lucide-react";

const emptyEducation = { subtitle: "", institute: "", degree: "" };

const removeBtnClass =
  "inline-flex h-10 w-10 items-center justify-center rounded-lg border border-rose-500/70 text-rose-300 hover:bg-rose-500/20 hover:text-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400/60";

const EducationTab = ({ form, onWorkItemAdd, onWorkItemRemove, onWorkItemChange }) => {
  const educationItems = Array.isArray(form.educationItems) ? form.educationItems : [];

  return (
    <section className="rounded-xl border border-slate-700 bg-slate-900/30 p-4">
      <div className="mb-3">
        <div>
          <p className="text-sm font-semibold text-slate-100">Education</p>
          <p className="text-xs text-slate-400">Add your degree/college details as cards.</p>
        </div>
      </div>
      <div className="space-y-3">
        {educationItems.map((item) => (
          <div key={item.id} className="rounded-lg border border-slate-700 bg-slate-950/40 p-3">
            <div className="mb-3 flex items-center justify-between gap-2">
              <input
                value={item.subtitle}
                onChange={(event) =>
                  onWorkItemChange?.("educationItems", item.id, "subtitle", event.target.value)
                }
                placeholder="Subtitle (e.g., Expected Graduation: 2026)"
                className={`${inputClassName} mt-0`}
              />
              <button
                type="button"
                onClick={() => onWorkItemRemove?.("educationItems", item.id)}
                className={removeBtnClass}
                title="Remove education"
                aria-label="Remove education"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <input
                value={item.institute}
                onChange={(event) =>
                  onWorkItemChange?.("educationItems", item.id, "institute", event.target.value)
                }
                placeholder="Institute / University"
                className={`${inputClassName} mt-0`}
              />
              <input
                value={item.degree}
                onChange={(event) =>
                  onWorkItemChange?.("educationItems", item.id, "degree", event.target.value)
                }
                placeholder="Degree (e.g., B.Tech in Computer Science)"
                className={`${inputClassName} mt-0`}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3">
        <button
          type="button"
          onClick={() => onWorkItemAdd?.("educationItems", emptyEducation)}
          className="w-full rounded-lg border border-cyan-400/60 px-3 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/10"
        >
          + Add Education
        </button>
      </div>
    </section>
  );
};

export default EducationTab;
