import React from "react";
import { inputClassName } from "../dashboardFormConfig";
import { Trash2 } from "lucide-react";
import ImageInputWithUpload from "../../../layout/components/ImageInputWithUpload";

const emptyProject = { name: "", tech: "", description: "", link: "", image: "" };

const ProjectsTab = ({ form, onWorkItemAdd, onWorkItemRemove, onWorkItemChange }) => {
  return (
    <div>
      <div className="space-y-4">
        {(form.projectItems || []).map((item, index) => (
          <div
            key={item.id || `project-${index}`}
            className="rounded-xl border border-slate-700 bg-slate-900/30 p-4"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-200">
                Project {index + 1}
              </span>
              <button
                type="button"
                onClick={() => onWorkItemRemove?.("projectItems", item.id)}
                className="rounded-lg border border-rose-500/60 p-2 text-rose-300 hover:bg-rose-500/10"
                title="Remove project"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <input
              value={item.name}
              onChange={(event) =>
                onWorkItemChange?.("projectItems", item.id, "name", event.target.value)
              }
              placeholder="Project Name"
              className={inputClassName}
            />
            <input
              value={item.tech}
              onChange={(event) =>
                onWorkItemChange?.("projectItems", item.id, "tech", event.target.value)
              }
              placeholder="Technologies (comma-separated)"
              className={`${inputClassName} mt-2`}
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
            <div className="mt-2.5">
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Project Image (URL or JPG Upload)
              </label>
              <ImageInputWithUpload
                value={item.image || ""}
                onChange={(event) =>
                  onWorkItemChange?.("projectItems", item.id, "image", event.target.value)
                }
                placeholder="Project Image URL or upload JPG..."
                maxDimension={900}
              />
            </div>
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
    </div>
  );
};

export default ProjectsTab;
