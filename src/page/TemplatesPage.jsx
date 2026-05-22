import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";
import { TEMPLATE_CATALOG } from "../features/portfolio/templateCatalog";
import { useEffect, useMemo, useState } from "react";
import { getTemplatesApi } from "../features/portfolio/templateApi";

const TemplatesPage = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();
  const myPortfolioUrl = currentUser?.username ? `/u/${currentUser.username}` : "/auth";
  const [activeTier, setActiveTier] = useState("default");
  const [templates, setTemplates] = useState(TEMPLATE_CATALOG);

  useEffect(() => {
    let cancelled = false;

    const loadTemplates = async () => {
      try {
        const payload = await getTemplatesApi();
        const incomingTemplates = Array.isArray(payload?.templates) ? payload.templates : [];
        if (!cancelled && incomingTemplates.length) {
          setTemplates(incomingTemplates);
        }
      } catch {
        if (!cancelled) {
          setTemplates(TEMPLATE_CATALOG);
        }
      }
    };

    loadTemplates();

    return () => {
      cancelled = true;
    };
  }, []);

  const visibleTemplates = useMemo(
    () => templates.filter((template) => template.tier === activeTier),
    [activeTier, templates]
  );

  const modeButtonClass = (tier) =>
    [
      "rounded-xl px-4 py-2 text-left text-2xl font-medium transition-colors sm:text-3xl",
      activeTier === tier
        ? "border border-slate-200 text-slate-100"
        : "border border-transparent text-slate-300 hover:text-slate-100",
    ].join(" ");

  const handleUseTemplate = (templateId) => {
    if (isAuthenticated) {
      navigate("/dashboard", { state: { templateId, fromTemplates: true } });
      return;
    }

    navigate("/auth", {
      state: {
        from: { pathname: "/dashboard", state: { templateId } },
        templateId,
      },
    });
  };

  return (
    <section className="space-y-8">
      <h1 className="text-center text-3xl font-semibold text-slate-100 sm:text-5xl">
        Get Your First Impression
      </h1>

      <div className="grid gap-5 pb-[10px] lg:grid-cols-[220px_1px_minmax(0,1fr)]">
        <aside className="px-1 py-2 flex">
          <div className="flex flex-col justify-center gap-3">
            <button
              type="button"
              onClick={() => setActiveTier("premium")}
              className={modeButtonClass("premium")}
            >
              Premium
            </button>
            <button
              type="button"
              onClick={() => setActiveTier("default")}
              className={modeButtonClass("default")}
            >
              Default
            </button>
          </div>
        </aside>

        <div className="hidden h-full min-h-[420px] rounded-full bg-slate-600/70 lg:block" />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {activeTier === "default" && visibleTemplates.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 text-slate-300">
              Default templates are coming soon.
            </div>
          ) : null}
          {visibleTemplates.map((template, index) => (
            <article key={template.id} className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
              <p className="text-xs uppercase tracking-wide text-orange-300">
                Template {`${index + 1}`.padStart(2, "0")} | {template.tier}
              </p>
              <h2 className="mt-2 text-xl font-semibold text-slate-100">{template.name}</h2>
              <p className="mt-2 min-h-16 text-sm text-slate-300">{template.description}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  to={`/templates/portfolio-v1?templateId=${encodeURIComponent(template.id)}`}
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
                <button
                  type="button"
                  onClick={() => handleUseTemplate(template.id)}
                  className="rounded-md bg-orange-500 px-3 py-2 text-sm font-medium text-white hover:bg-orange-400"
                >
                  Use Template
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TemplatesPage;
