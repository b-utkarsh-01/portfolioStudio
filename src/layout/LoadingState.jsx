const LoadingState = ({
  title = "Loading...",
  subtitle = "Please wait while we prepare your view.",
  compact = false,
}) => {
  const innerClass = compact
    ? "mx-auto w-full max-w-2xl px-4"
    : "mx-auto w-full max-w-3xl px-4";

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.14),transparent_45%),radial-gradient(circle_at_80%_15%,rgba(59,130,246,0.12),transparent_40%),linear-gradient(180deg,#020617_0%,#0b1120_100%)]" />
      <div className="relative flex min-h-screen items-center justify-center">
        <div className={innerClass}>
          <div className="rounded-2xl border border-slate-700/80 bg-slate-900/70 p-6 text-center shadow-[0_0_0_1px_rgba(148,163,184,0.08),0_20px_45px_-25px_rgba(8,47,73,0.85)] backdrop-blur">
            <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-cyan-400/40 bg-cyan-500/10">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-300 border-t-transparent" />
            </div>
            <p className="text-base font-semibold text-slate-100">{title}</p>
            <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
