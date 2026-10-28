import { Plus, Trash2, RotateCcw } from "lucide-react";

const StageSidebar = ({ stages, stageIndex, setStageIndex, onStageToggle, onAddStage, onResetDefaults }) => {
  return (
    <>
      {/* Mobile Stages View: Horizontal Scrollable Bar */}
      <div className="lg:hidden w-full min-w-0 overflow-hidden rounded-2xl border border-slate-700 bg-slate-950/60 p-3">
        <div className="flex items-center justify-between gap-2 mb-2 px-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-orange-400">Stages</span>
            <span className="text-[11px] text-slate-400">
              ({stageIndex + 1}/{stages.length})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onAddStage}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 text-[11px] font-semibold text-slate-300 hover:bg-slate-800 transition active:scale-95"
              title="Add custom stage"
            >
              <Plus className="h-3 w-3" />
              <span>Add</span>
            </button>
            <button
              type="button"
              onClick={onResetDefaults}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] font-semibold text-slate-400 hover:text-slate-200 transition"
              title="Reset all stages"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Horizontal scroll pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 min-w-0">
          {stages.map((stage, index) => {
            const isCurrent = index === stageIndex;
            return (
              <div
                key={stage.key || `${index}`}
                className={`flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                  isCurrent
                    ? "border-orange-500 bg-orange-500/15 text-orange-200 shadow-sm"
                    : "border-slate-800 bg-slate-900/60 text-slate-300 hover:bg-slate-800"
                } ${stage.enabled ? "" : "opacity-50"}`}
              >
                <button
                  type="button"
                  onClick={() => setStageIndex(index)}
                  className="flex items-center gap-1"
                >
                  <span className={isCurrent ? "text-orange-400" : "text-slate-500"}>{index + 1}.</span>
                  <span className="max-w-[120px] truncate">{stage.label}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onStageToggle?.(stage.key)}
                  className={`ml-1 rounded p-0.5 transition ${
                    stage.enabled ? "text-rose-400 hover:text-rose-300" : "text-emerald-400 hover:text-emerald-300"
                  }`}
                  title={stage.enabled ? "Hide stage in portfolio" : "Restore stage in portfolio"}
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Desktop Stages View: Full Vertical Sidebar */}
      <aside className="hidden lg:flex min-h-0 min-w-0 flex-col rounded-2xl border border-slate-700 bg-slate-950/40 p-3 h-full">
        <div className="mb-2 flex items-center justify-between gap-2 px-2">
          <p className="text-xs uppercase tracking-wide text-slate-400 font-semibold">Stages</p>
          <button
            type="button"
            onClick={onResetDefaults}
            className="rounded-md border border-slate-600 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-200 hover:bg-slate-800 transition"
            title="Reset all stages and fields to default values"
          >
            Refresh
          </button>
        </div>
        <div className="space-y-2 flex-1 min-h-0 overflow-y-auto pr-1 frontend-scrollbar">
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
          className="mt-3 flex w-full items-center justify-center rounded-lg border border-slate-700 py-2 text-slate-200 hover:bg-slate-800 transition"
          title="Add new stage"
        >
          <Plus className="h-4 w-4" />
        </button>
      </aside>
    </>
  );
};

export default StageSidebar;
