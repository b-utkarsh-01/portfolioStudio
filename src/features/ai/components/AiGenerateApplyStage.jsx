const AiGenerateApplyStage = ({
  jobId,
  status,
  provider,
  progress,
  isRunning,
  thinkingLabel,
  thinkingTick,
  validationErrors,
  styleIntent,
  handleCopyJobId,
  handleGenerate,
  generating,
  retryAfterSeconds,
  handleApply,
  draft,
  applying,
  generateError,
}) => (
  <div>
    <div className="mb-3 rounded-lg border border-slate-700 bg-slate-950/50 p-3">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
        <span>Job: {jobId || "-"}</span>
        <span>Status: {status || "-"}</span>
        <span>
          Provider:{" "}
          {provider ? <strong className="text-cyan-300 uppercase">{provider}</strong> : <span>-</span>}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
        <div
          className={[
            "h-full rounded-full transition-all duration-500",
            status === "failed" ? "bg-rose-400" : "bg-cyan-400",
          ].join(" ")}
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-2 text-[11px] text-slate-400">
        {status === "completed"
          ? "Draft ready. Review and apply."
          : status === "failed"
            ? "Generation failed. Please retry."
            : "AI generation in progress..."}
      </p>
      {isRunning ? (
        <div className="mt-2 flex items-center gap-2 text-[11px] text-cyan-300">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-cyan-300" />
          <span>
            {thinkingLabel}
            <span className="inline-block w-5 text-left">{". ".repeat((thinkingTick % 3) + 1).trim()}</span>
          </span>
        </div>
      ) : null}
      {validationErrors.length ? (
        <p className="mt-2 text-[11px] text-amber-300">
          LLM output normalized with fallback ({validationErrors.length} validation issue(s)).
        </p>
      ) : null}
      {styleIntent ? (
        <p className="mt-2 text-[11px] text-cyan-300">
          intent: {styleIntent.mode || "-"} | {styleIntent.layoutStructure || "-"} |{" "}
          {styleIntent.contentMaxWidth || "-"} | {styleIntent.primaryColorName || "-"}
        </p>
      ) : null}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleCopyJobId}
          disabled={!jobId}
          className="rounded-md border border-slate-600 px-2.5 py-1 text-[11px] text-slate-200 disabled:opacity-50"
        >
          Copy Job ID
        </button>
        <span className="text-[11px] text-slate-400">
          Log hint: check backend + worker terminal for this Job ID.
        </span>
      </div>
    </div>
    <div className="mb-3 flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={handleGenerate}
        disabled={generating || isRunning || retryAfterSeconds > 0}
        className="rounded-md bg-cyan-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {generating
          ? "Generating..."
          : retryAfterSeconds > 0
            ? `Retry in ${retryAfterSeconds}s`
            : isRunning
              ? "Generation Running..."
              : "Generate Draft"}
      </button>
      <button
        type="button"
        onClick={handleApply}
        disabled={!draft || applying}
        className="rounded-md border border-cyan-400 px-3 py-2 text-sm font-semibold text-cyan-300 disabled:opacity-60"
      >
        {applying ? "Applying..." : "Apply Draft"}
      </button>
      <span className="text-xs text-slate-400">
        Job: {jobId || "-"} | Status: {status || "-"}
      </span>
    </div>
    {generateError ? (
      <div className="rounded-md border border-rose-500/50 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
        {generateError}
      </div>
    ) : null}
  </div>
);

export default AiGenerateApplyStage;
