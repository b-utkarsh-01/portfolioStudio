import { Plus, Trash2 } from "lucide-react";

const StageSidebar = ({ stages, stageIndex, setStageIndex, onStageToggle, onAddStage, onResetDefaults }) => (
  <aside className="rounded-2xl border border-slate-700 bg-slate-950/40 p-3">
    <div className="mb-2 flex items-center justify-between gap-2 px-2">
      <p className="text-xs uppercase tracking-wide text-slate-400">Stages</p>
      <button
        type="button"
        onClick={onResetDefaults}
        className="rounded-md border border-slate-600 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-200 hover:bg-slate-800"
        title="Reset all stages and fields to default values"
      >
        Refresh
      </button>
    </div>
    <div className="space-y-2">
      {stages.map((stage, index) => (
        <div
          key={stage.key || `${index}`}
          className={[
            "w-full rounded-lg border px-3 py-2 text-sm transition-colors",
            index === stageIndex
              ? "border-orange-400 bg-orange-500/10 text-orange-200"
              : "border-slate-700 text-slate-200 hover:bg-slate-800",
            stage.enabled ? "" : "opacity-60",
          ].join(" ")}
        >
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setStageIndex(index)}
              className="min-w-0 flex-1 truncate text-left"
            >
              {index + 1}. {stage.label}
            </button>
            <button
              type="button"
              title={stage.enabled ? "Delete/Hide stage in portfolio" : "Restore stage in portfolio"}
              onClick={() => onStageToggle?.(stage.key)}
              className={[
                "rounded-md border p-1.5 transition-colors",
                stage.enabled
                  ? "border-rose-500/60 text-rose-300 hover:bg-rose-500/20"
                  : "border-emerald-500/60 text-emerald-300 hover:bg-emerald-500/20",
              ].join(" ")}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
    <button
      type="button"
      onClick={onAddStage}
      className="mt-3 flex w-full items-center justify-center rounded-lg border border-slate-700 py-2 text-slate-200 hover:bg-slate-800"
      title="Add new stage"
    >
      <Plus className="h-4 w-4" />
    </button>
  </aside>
);

export default StageSidebar;
