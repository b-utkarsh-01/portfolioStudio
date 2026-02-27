import { Link } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";

const TemplatesPage = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const myPortfolioUrl = currentUser?.username ? `/u/${currentUser.username}` : "/auth";

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-semibold text-slate-100 sm:text-4xl">Templates</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        <article className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
          <p className="text-xs uppercase tracking-wide text-orange-300">Template 01</p>
          <h2 className="mt-2 text-xl font-semibold text-slate-100">Portfolio v1</h2>
          <p className="mt-2 text-sm text-slate-300">
            Existing animated portfolio design with sections for hero, skills, projects and more.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              to="/templates/portfolio-v1"
              className="rounded-md border border-slate-600 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800"
            >
              Dummy Preview
            </Link>
            <Link
              to={myPortfolioUrl}
              className="rounded-md border border-emerald-500/60 px-3 py-2 text-sm text-emerald-300 hover:bg-emerald-500/10"
            >
              {isAuthenticated ? "Preview With My Data" : "Login For Live Preview"}
            </Link>
            <Link
              to="/auth"
              className="rounded-md bg-orange-500 px-3 py-2 text-sm font-medium text-white hover:bg-orange-400"
            >
              Use Template
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
};

export default TemplatesPage;
