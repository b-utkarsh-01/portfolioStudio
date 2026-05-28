import React from "react";
import { inputClassName } from "../dashboardFormConfig";
import { Trash2 } from "lucide-react";

const emptyExperience = { title: "", company: "", period: "", description: "" };

const removeBtnClass =
  "inline-flex h-10 w-10 items-center justify-center rounded-lg border border-rose-500/70 text-rose-300 hover:bg-rose-500/20 hover:text-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400/60";

const ExperienceTab = ({ form, onWorkItemAdd, onWorkItemRemove, onWorkItemChange }) => {
  const experienceItems = Array.isArray(form.experienceItems) ? form.experienceItems : [];

  return (
    <section className="rounded-xl border border-slate-700 bg-slate-900/30 p-4">
      <div className="mb-3">
        <div>
          <p className="text-sm font-semibold text-slate-100">Experience</p>
          <p className="text-xs text-slate-400">Add your work/internship experience.</p>
        </div>
      </div>
      <div className="space-y-3">
        {experienceItems.map((item) => (
          <div key={item.id} className="rounded-lg border border-slate-700 bg-slate-950/40 p-3">
            <div className="mb-3 flex items-center justify-between gap-2">
              <input
                value={item.title}
                onChange={(event) =>
                  onWorkItemChange?.("experienceItems", item.id, "title", event.target.value)
                }
                placeholder="Role / Title"
                className={`${inputClassName} mt-0`}
              />
              <button
                type="button"
                onClick={() => onWorkItemRemove?.("experienceItems", item.id)}
                className={removeBtnClass}
                title="Remove experience"
                aria-label="Remove experience"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <input
                value={item.company}
                onChange={(event) =>
                  onWorkItemChange?.("experienceItems", item.id, "company", event.target.value)
                }
                placeholder="Company"
                className={`${inputClassName} mt-0`}
              />
              <input
                value={item.period}
                onChange={(event) =>
                  onWorkItemChange?.("experienceItems", item.id, "period", event.target.value)
                }
                placeholder="Period (e.g., 2023 - 2024)"
                className={`${inputClassName} mt-0`}
              />
            </div>
            <textarea
              value={item.description}
              onChange={(event) =>
                onWorkItemChange?.("experienceItems", item.id, "description", event.target.value)
              }
              rows={3}
              placeholder="Description"
              className={`${inputClassName} mt-2`}
            />
          </div>
        ))}
      </div>
      <div className="mt-3">
        <button
          type="button"
          onClick={() => onWorkItemAdd?.("experienceItems", emptyExperience)}
          className="w-full rounded-lg border border-cyan-400/60 px-3 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/10"
        >
          + Add Experience
        </button>
      </div>
    </section>
  );
};

export default ExperienceTab;
