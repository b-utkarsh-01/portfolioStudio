import { Link } from "react-router-dom";

const PortfolioPrivatePage = () => {
  return (
    <div className="relative flex min-h-dvh w-full items-center justify-center overflow-x-hidden overflow-y-auto bg-slate-950 px-4 py-10 sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(14,165,233,0.18),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(249,115,22,0.16),transparent_40%)]" />
      <section className="relative z-10 w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900/80 p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Access Restricted</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-100 sm:text-3xl">This Portfolio Is Private</h1>
        <p className="mt-3 text-sm text-slate-300 sm:text-base">
          The owner has set this portfolio visibility to private, so it is not available publicly.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/"
            className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-400"
          >
            Go Home
          </Link>
          <Link to="/templates" className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-200">
            Browse Templates
          </Link>
        </div>
      </section>
    </div>
  );
};

export default PortfolioPrivatePage;
