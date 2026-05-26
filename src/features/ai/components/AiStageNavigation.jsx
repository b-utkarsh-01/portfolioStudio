const AiStageNavigation = ({
  isPasteTextMode,
  isResumeSubStageLast,
  stageIndex,
  setStageIndex,
  stages,
}) => (
  <div
    className={[
      "pt-4 flex items-center gap-2",
      isPasteTextMode && !isResumeSubStageLast ? "hidden" : "",
    ].join(" ")}
  >
    <button
      type="button"
      disabled={stageIndex === 0}
      onClick={() => setStageIndex((prev) => Math.max(0, prev - 1))}
      className="rounded-md border border-slate-600 px-3 py-2 text-sm text-slate-200 disabled:opacity-50"
    >
      Back
    </button>
    <button
      type="button"
      disabled={stageIndex === stages.length - 1}
      onClick={() => setStageIndex((prev) => Math.min(stages.length - 1, prev + 1))}
      className="rounded-md bg-slate-700 px-3 py-2 text-sm font-semibold text-slate-100 disabled:opacity-50"
    >
      Next
    </button>
  </div>
);

export default AiStageNavigation;
