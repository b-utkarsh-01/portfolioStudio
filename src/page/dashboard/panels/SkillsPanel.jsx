import Field from "../Field";
import { inputClassName } from "../dashboardFormConfig";
import { Trash2 } from "lucide-react";

const SkillsPanel = ({
  form,
  onSkillGroupAdd,
  onSkillGroupRemove,
  onSkillGroupNameChange,
  onSkillAdd,
  onSkillRemove,
  onSkillChange,
}) => (
  <>
    <section className="rounded-xl border border-slate-700 bg-slate-900/30 p-4">
      <div className="mb-3">
        <div>
          <p className="text-sm font-semibold text-slate-100">Add Skills</p>
          <p className="text-xs text-slate-400">Create skill sections like DevOps, Data Science, Security, and add skills inside each one.</p>
        </div>
      </div>

      <div className="space-y-3">
        {(Array.isArray(form.skillsAdditionalGroups) ? form.skillsAdditionalGroups : []).map((group) => (
          <div key={group.id} className="rounded-lg border border-slate-700 bg-slate-950/40 p-3">
            <div className="mb-3 flex items-center justify-between gap-2">
              <input
                value={group.name}
                onChange={(event) => onSkillGroupNameChange?.(group.id, event.target.value)}
                placeholder="Section Name (e.g., Frontend)"
                className={`${inputClassName} mt-0`}
              />
              <button
                type="button"
                onClick={() => onSkillGroupRemove?.(group.id)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-rose-500/70 text-rose-300 hover:bg-rose-500/20 hover:text-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400/60"
                aria-label="Remove section"
                title="Remove section"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2">
              {(Array.isArray(group.skills) ? group.skills : []).map((skill, index) => (
                <div key={`${group.id}-${index}`} className="flex items-center gap-2">
                  <input
                    value={skill}
                    onChange={(event) => onSkillChange?.(group.id, index, event.target.value)}
                    placeholder="Skill name (e.g., HTML)"
                    className={`${inputClassName} mt-0`}
                  />
                  <button
                    type="button"
                    onClick={() => onSkillRemove?.(group.id, index)}
                    className="rounded-lg border border-slate-600 px-3 py-2 text-xs text-slate-300 hover:border-rose-500/70 hover:bg-rose-500/20 hover:text-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400/50"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <div className=" flex justify-center">
            <button
              type="button"
              onClick={() => onSkillAdd?.(group.id)}
              className="mt-3 rounded-lg border border-slate-500 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 w-[70%] "
            >
              + Add Skills
            </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3">
        <button
          type="button"
          onClick={onSkillGroupAdd}
          className="w-full rounded-lg border border-cyan-400/60 px-3 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/10"
        >
          + Add Section
        </button>
      </div>
    </section>
  </>
);

export default SkillsPanel;
