const AiStageSidebar = ({ stages, stageIndex, setStageIndex }) => (
  <aside className="flex h-full min-h-0 flex-col rounded-2xl border border-slate-700 bg-slate-950/40 p-3">
    <p className="px-2 text-xs uppercase tracking-wide text-slate-400">AI Stages</p>
    <div className="mt-2 space-y-2">
      {stages.map((stage, index) => (
        <button
          key={stage.key}
          type="button"
          onClick={() => setStageIndex(index)}
          className={[
            "w-full rounded-lg border px-3 py-2 text-left text-sm transition-colors",
            stageIndex === index
              ? "border-cyan-400 bg-cyan-500/10 text-cyan-200"
              : "border-slate-700 text-slate-200 hover:bg-slate-800",
          ].join(" ")}
        >
          {index + 1}. {stage.label}
        </button>
      ))}
    </div>
  </aside>
);

export default AiStageSidebar;
