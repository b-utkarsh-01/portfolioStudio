import { Link } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const getStartedPath = isAuthenticated ? "/templates" : "/auth";

  return (
    <section className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900/40 p-5 sm:space-y-6 sm:rounded-3xl sm:p-12">
      <p className="text-xs uppercase tracking-[0.2em] text-orange-300">Portfolio Builder</p>
      <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-slate-100 sm:text-5xl">
        Build and publish your portfolio in minutes.
      </h1>
      <p className="text-justify max-w-2xl text-lg leading-relaxed text-slate-300 sm:text-xl">
        Portfolio Studio lets you add your resume data, choose a template, and generate a public portfolio link you can share with recruiters.
      </p>

      <div className="grid gap-3 sm:grid-cols-3">
        <article className="rounded-xl border border-slate-700 bg-slate-950/50 p-4">
          <h2 className="text-base font-semibold text-slate-100">1. Add Data</h2>
          <p className="mt-1 text-sm text-slate-300">
            Fill name, summary, skills, education, projects and certifications.
          </p>
        </article>
        <article className="rounded-xl border border-slate-700 bg-slate-950/50 p-4">
          <h2 className="text-base font-semibold text-slate-100">2. Choose Template</h2>
          <p className="mt-1 text-sm text-slate-300">
            Preview template designs and select the one that matches your profile.
          </p>
        </article>
        <article className="rounded-xl border border-slate-700 bg-slate-950/50 p-4">
          <h2 className="text-base font-semibold text-slate-100">3. Publish Link</h2>
          <p className="mt-1 text-sm text-slate-300">
            Get your unique public URL and share it directly in applications.
          </p>
        </article>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          to="/templates"
          className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-400"
        >
          Explore Templates
        </Link>
        <Link
          to={getStartedPath}
          className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
        >
          Get Started
        </Link>
      </div>
    </section>
  );
};

export default HomePage;
