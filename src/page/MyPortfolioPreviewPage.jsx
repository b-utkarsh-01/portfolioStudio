import { Suspense, lazy, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import LoadingState from "../layout/LoadingState";
import { getMyPortfolioApi } from "../features/portfolio/portfolioApi";
import { normalizePortfolioForRender } from "../features/portfolio/defensivePortfolio";
import PreviewBackButton from "./PreviewBackButton";

const TemplatePortfolioRenderer = lazy(() => import("../features/portfolio/templateRendererBridge"));
const PassthroughFrame = ({ children }) => <>{children}</>;

const MyPortfolioPreviewPage = ({ appReady = true }) => {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [resolvedTemplateId, setResolvedTemplateId] = useState("default-v4");
  const [previewTier, setPreviewTier] = useState("neutral");
  const [TemplatePreviewFrame, setTemplatePreviewFrame] = useState(() => PassthroughFrame);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const payload = await getMyPortfolioApi();
        if (!cancelled) setPortfolio(payload?.portfolio || null);
      } catch {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const loadRendererApi = async () => {
      const renderer = await import("../features/portfolio/templateRendererBridge");
      if (cancelled) return;
      const templateId = portfolio?.templateId || "default-v4";
      const templateMeta = renderer.getTemplateById(templateId);
      setResolvedTemplateId(templateMeta?.id || "default-v4");
      setPreviewTier(templateMeta?.tier === "premium" ? "premium" : "neutral");
      setTemplatePreviewFrame(() => renderer.TemplatePreviewFrame || PassthroughFrame);
    };
    loadRendererApi();
    return () => {
      cancelled = true;
    };
  }, [portfolio?.templateId]);

  if (loading) {
    return <LoadingState title="Loading preview..." subtitle="Preparing live portfolio preview." compact />;
  }

  if (notFound || !portfolio?.data) {
    return <Navigate to="/dashboard" replace />;
  }

  const isAiTemplate = `${resolvedTemplateId || ""}`.toLowerCase().startsWith("ai-");
  const renderPayload = {
    ...normalizePortfolioForRender(portfolio.data),
    renderMode: isAiTemplate ? portfolio?.renderMode || "static" : "static",
    aiTemplateSpec: isAiTemplate ? portfolio?.aiTemplateSpec || null : null,
  };

  const content = (
    <Suspense fallback={<LoadingState title="Rendering..." subtitle="Applying latest saved data." compact />}>
      <TemplatePortfolioRenderer appReady={appReady} templateId={resolvedTemplateId} portfolioData={renderPayload} />
    </Suspense>
  );

  if (previewTier === "premium") {
    return (
      <>
        <PreviewBackButton fallbackPath="/dashboard" />
        <div className="fixed right-3 top-3 z-40 rounded-md border border-slate-600 bg-slate-900/90 px-2 py-1 text-[11px] text-slate-200">
          mode: {portfolio?.renderMode || "static"} | spec: {portfolio?.aiTemplateSpec ? "yes" : "no"}
        </div>
        <TemplatePreviewFrame templateId={resolvedTemplateId} portfolioData={renderPayload} showPreviewLabel={false}>
          {content}
        </TemplatePreviewFrame>
      </>
    );
  }

  return (
    <>
      <PreviewBackButton fallbackPath="/dashboard" />
      <div className="fixed right-3 top-3 z-40 rounded-md border border-slate-600 bg-slate-900/90 px-2 py-1 text-[11px] text-slate-200">
        mode: {portfolio?.renderMode || "static"} | spec: {portfolio?.aiTemplateSpec ? "yes" : "no"}
      </div>
      {content}
    </>
  );
};

export default MyPortfolioPreviewPage;
