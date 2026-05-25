import { Navigate, useParams, useSearchParams } from "react-router-dom";
import { decodePortfolioDataFromParam } from "../features/portfolio/urlPortfolio";
import { Suspense, lazy, useEffect, useState } from "react";
import PreviewBackButton from "./PreviewBackButton";
import LoadingState from "../layout/LoadingState";

const TemplatePortfolioRenderer = lazy(() => import("../features/portfolio/templateRendererBridge"));
const PassthroughFrame = ({ children }) => <>{children}</>;

const UrlPortfolioPage = ({ appReady = true }) => {
  const { payload = "" } = useParams();
  const [searchParams] = useSearchParams();
  const [resolvedTemplateId, setResolvedTemplateId] = useState("default-v4");
  const [previewTier, setPreviewTier] = useState("neutral");
  const [TemplatePreviewFrame, setTemplatePreviewFrame] = useState(() => PassthroughFrame);
  const encodedData = payload;
  const portfolioData = decodePortfolioDataFromParam(encodedData);
  const requestedTemplateId = searchParams.get("templateId") || "default-v4";
  useEffect(() => {
    let cancelled = false;
    const loadRendererApi = async () => {
      const renderer = await import("../features/portfolio/templateRendererBridge");
      if (cancelled) return;
      const templateMeta = renderer.getTemplateById(requestedTemplateId);
      setResolvedTemplateId(templateMeta?.id || "default-v4");
      setPreviewTier(templateMeta?.tier === "premium" ? "premium" : "neutral");
      setTemplatePreviewFrame(() => renderer.TemplatePreviewFrame || PassthroughFrame);
    };
    loadRendererApi();
    return () => {
      cancelled = true;
    };
  }, [requestedTemplateId]);

  const previewTheme = previewTier;
  const fallbackPath = `/templates?tier=${encodeURIComponent(previewTheme)}`;

  if (!portfolioData) {
    return <Navigate to="/" replace />;
  }

  const content = (
    <Suspense fallback={<LoadingState title="Loading preview..." subtitle="Building shared portfolio preview." compact />}>
      <TemplatePortfolioRenderer
        appReady={appReady}
        templateId={resolvedTemplateId}
        portfolioData={portfolioData}
      />
    </Suspense>
  );

  if (previewTheme === "premium") {
    return (
      <>
        <PreviewBackButton fallbackPath={fallbackPath} />
        <TemplatePreviewFrame templateId={resolvedTemplateId} portfolioData={portfolioData} showPreviewLabel={false}>
          {content}
        </TemplatePreviewFrame>
      </>
    );
  }

  return (
    <>
      <PreviewBackButton fallbackPath={fallbackPath} />
      {content}
    </>
  );
};

export default UrlPortfolioPage;


