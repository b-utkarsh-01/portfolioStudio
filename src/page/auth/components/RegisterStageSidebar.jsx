const RegisterStageSidebar = ({ stages, stageIndex, onSelectStage }) => (
  <aside className="rounded-2xl border border-slate-700 bg-slate-950/40 p-3">
    <p className="mb-2 px-2 text-xs uppercase tracking-wide text-slate-400">Stages</p>
    <div className="space-y-2">
      {stages.map((stage, index) => (
        <button
          key={stage.key}
          type="button"
          onClick={() => onSelectStage(index)}
          className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
            index === stageIndex
              ? "border-orange-400 bg-orange-500/10 text-orange-200"
              : "border-slate-700 text-slate-200 hover:bg-slate-800"
          }`}
        >
          {index + 1}. {stage.label}
        </button>
      ))}
    </div>
  </aside>
);

export default RegisterStageSidebar;
