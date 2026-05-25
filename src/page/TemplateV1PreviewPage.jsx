import { getPreviewDataForTemplateId } from "../features/portfolio/templatePreviewData";
import { Suspense, lazy, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PreviewBackButton from "./PreviewBackButton";
import LoadingState from "../layout/LoadingState";

const TemplatePortfolioRenderer = lazy(() => import("../features/portfolio/templateRendererBridge"));
const PassthroughFrame = ({ children }) => <>{children}</>;

const TemplateV1PreviewPage = () => {
  const [searchParams] = useSearchParams();
  const [TemplatePreviewFrame, setTemplatePreviewFrame] = useState(() => PassthroughFrame);
  const [resolvedTemplateId, setResolvedTemplateId] = useState("default-v4");
  const requestedTemplateId = searchParams.get("templateId") || "default-v4";

  useEffect(() => {
    let cancelled = false;
    const loadRendererApi = async () => {
      const renderer = await import("../features/portfolio/templateRendererBridge");
      if (cancelled) return;
      setResolvedTemplateId(renderer.getTemplateById(requestedTemplateId)?.id || "default-v4");
      setTemplatePreviewFrame(() => renderer.TemplatePreviewFrame || PassthroughFrame);
    };
    loadRendererApi();
    return () => {
      cancelled = true;
    };
  }, [requestedTemplateId]);

  const portfolioData = getPreviewDataForTemplateId(resolvedTemplateId);
  const previewTheme = resolvedTemplateId.startsWith("premium-") ? "premium" : "neutral";
  const fallbackPath = `/templates?tier=${encodeURIComponent(previewTheme)}`;

  const content = (
    <Suspense fallback={<LoadingState title="Loading preview..." subtitle="Preparing the live template preview." compact />}>
      <TemplatePortfolioRenderer
        appReady
        templateId={resolvedTemplateId}
        portfolioData={portfolioData}
      />
    </Suspense>
  );

  if (previewTheme === "premium") {
    return (
      <>
        <PreviewBackButton fallbackPath={fallbackPath} />
        <TemplatePreviewFrame
          templateId={resolvedTemplateId}
          portfolioData={portfolioData}
          showPreviewLabel={false}
        >
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

export default TemplateV1PreviewPage;
