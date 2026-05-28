import React from "react";
import { inputClassName } from "../dashboardFormConfig";
import { Trash2 } from "lucide-react";

const emptyProject = { name: "", tech: "", description: "", link: "" };

const removeBtnClass =
  "inline-flex h-10 w-10 items-center justify-center rounded-lg border border-rose-500/70 text-rose-300 hover:bg-rose-500/20 hover:text-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400/60";

const ProjectsTab = ({ form, onWorkItemAdd, onWorkItemRemove, onWorkItemChange }) => {
  const projectItems = Array.isArray(form.projectItems) ? form.projectItems : [];

  return (
    <section className="rounded-xl border border-slate-700 bg-slate-900/30 p-4">
      <div className="mb-3">
        <div>
          <p className="text-sm font-semibold text-slate-100">Projects</p>
          <p className="text-xs text-slate-400">Add project cards with tech, description and link.</p>
        </div>
      </div>
      <div className="space-y-3">
        {projectItems.map((item) => (
          <div key={item.id} className="rounded-lg border border-slate-700 bg-slate-950/40 p-3">
            <div className="mb-3 flex items-center justify-between gap-2">
              <input
                value={item.name}
                onChange={(event) =>
                  onWorkItemChange?.("projectItems", item.id, "name", event.target.value)
                }
                placeholder="Project Name"
                className={`${inputClassName} mt-0`}
              />
              <button
                type="button"
                onClick={() => onWorkItemRemove?.("projectItems", item.id)}
                className={removeBtnClass}
                title="Remove project"
                aria-label="Remove project"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <input
              value={item.tech}
              onChange={(event) =>
                onWorkItemChange?.("projectItems", item.id, "tech", event.target.value)
              }
              placeholder="Tech Stack"
              className={`${inputClassName} mt-0`}
            />
            <textarea
              value={item.description}
              onChange={(event) =>
                onWorkItemChange?.("projectItems", item.id, "description", event.target.value)
              }
              rows={3}
              placeholder="Description"
              className={`${inputClassName} mt-2`}
            />
            <input
              value={item.link}
              onChange={(event) =>
                onWorkItemChange?.("projectItems", item.id, "link", event.target.value)
              }
              placeholder="Project Link (optional)"
              className={`${inputClassName} mt-2`}
            />
            <input
              value={item.image || ""}
              onChange={(event) =>
                onWorkItemChange?.("projectItems", item.id, "image", event.target.value)
              }
              placeholder="Project Image URL (optional)"
              className={`${inputClassName} mt-2`}
            />
          </div>
        ))}
      </div>
      <div className="mt-3">
        <button
          type="button"
          onClick={() => onWorkItemAdd?.("projectItems", emptyProject)}
          className="w-full rounded-lg border border-cyan-400/60 px-3 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/10"
        >
          + Add Project
        </button>
      </div>
    </section>
  );
};

export default ProjectsTab;
