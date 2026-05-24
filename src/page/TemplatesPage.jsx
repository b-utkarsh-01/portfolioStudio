import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";
import { TEMPLATE_CATALOG } from "../features/portfolio/templateCatalog";
import { useMemo, useState } from "react";

const TemplatesPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTier = searchParams.get("tier");
  const isValidTier = initialTier === "default" || initialTier === "premium" || initialTier === "ai";
  const [activeTier, setActiveTier] = useState(isValidTier ? initialTier : "default");
  const [templates] = useState(TEMPLATE_CATALOG);

  const handleTierChange = (tier) => {
    setActiveTier(tier);
    setSearchParams({ tier });
  };

  const visibleTemplates = useMemo(
    () =>
      templates.filter(
        (template) =>
          template &&
          typeof template.id === "string" &&
          typeof template.tier === "string" &&
          template.tier === activeTier
      ),
    [activeTier, templates]
  );
  const showComingSoonBanner = activeTier === "ai" || visibleTemplates.length === 0;

  const comingSoonContent = useMemo(() => {
    if (activeTier === "ai") {
      return {
        title: "AI Portfolio Builder",
        description: "One-click AI-generated portfolios are in progress.",
      };
    }

    if (activeTier === "default") {
      return {
        title: "Default Templates",
        description: "New default templates are being prepared for release.",
      };
    }

    return {
      title: "Premium Templates",
      description: "More premium templates are being prepared for release.",
    };
  }, [activeTier]);

  const modeButtonClass = (tier) =>
    [
      "relative rounded-xl px-3 py-2 text-left text-xl font-medium transition-all duration-200 sm:text-2xl",
      activeTier === tier
        ? "border border-slate-100/80 bg-slate-900/70 text-slate-50 shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_10px_30px_rgba(0,0,0,0.35)] scale-[1.02]"
        : "border border-transparent text-slate-300 hover:text-slate-100 hover:bg-slate-900/35",
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
    <section className="space-y-6 lg:h-[calc(100vh-170px)] lg:overflow-hidden">
      <h1 className="text-center text-3xl font-semibold text-slate-100 sm:text-5xl">
        Get Your First Impression
      </h1>

      <div className="grid gap-5 pb-[10px] lg:h-[calc(100%-88px)] lg:grid-cols-[160px_1px_minmax(0,1fr)] lg:overflow-hidden">
        <aside className="px-1 py-2 flex lg:sticky lg:top-0 lg:h-full lg:items-center">
          <div className="flex flex-col justify-center gap-2">
            <button
              type="button"
              onClick={() => handleTierChange("ai")}
              className={modeButtonClass("ai")}
            >
              {activeTier === "ai" ? (
                <span className="absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r bg-cyan-300" />
              ) : null}
              AI
            </button>
            <button
              type="button"
              onClick={() => handleTierChange("premium")}
              className={modeButtonClass("premium")}
            >
              {activeTier === "premium" ? (
                <span className="absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r bg-orange-300" />
              ) : null}
              Premium
            </button>
            <button
              type="button"
              onClick={() => handleTierChange("default")}
              className={modeButtonClass("default")}
            >
              {activeTier === "default" ? (
                <span className="absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r bg-emerald-300" />
              ) : null}
              Default
            </button>
          </div>
        </aside>

        <div className="hidden h-full min-h-[420px] rounded-full bg-slate-600/70 lg:block" />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:overflow-y-auto lg:pr-2">
          {showComingSoonBanner ? (
            <div className="sm:col-span-2 lg:col-span-3 rounded-2xl border border-slate-700 bg-slate-900/60 p-7 text-center min-h-[220px] flex flex-col items-center justify-center">
              <p className="text-xs uppercase tracking-[0.2em] text-orange-300">Coming Soon</p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-100">
                {comingSoonContent.title}
              </h2>
              <p className="mt-2 text-slate-300">
                {comingSoonContent.description}
              </p>
            </div>
          ) : null}
          {!showComingSoonBanner && visibleTemplates.map((template, index) => (
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
