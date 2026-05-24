import { getPreviewDataForTemplateId } from "../features/portfolio/templatePreviewData";
import { getMyPortfolioApi } from "../features/portfolio/portfolioApi";
import { useAuth } from "../features/auth/AuthContext";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import TemplatePortfolioRenderer, {
  getTemplateById,
  TemplatePreviewFrame,
} from "portfolio-template-renderer/src";
import PreviewBackButton from "./PreviewBackButton";

const TemplateV1PreviewPage = () => {
  const { isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const [userPortfolioData, setUserPortfolioData] = useState(null);
  const [isLoadingPortfolio, setIsLoadingPortfolio] = useState(isAuthenticated);
  const requestedTemplateId = searchParams.get("templateId") || "default-v4";
  const resolvedTemplateId = getTemplateById(requestedTemplateId)?.id || "default-v4";

  useEffect(() => {
    let cancelled = false;

    if (!isAuthenticated) {
      setUserPortfolioData(null);
      setIsLoadingPortfolio(false);
      return () => {
        cancelled = true;
      };
    }

    const loadPortfolio = async () => {
      setIsLoadingPortfolio(true);
      try {
        const payload = await getMyPortfolioApi();
        if (!cancelled) {
          setUserPortfolioData(payload?.portfolio?.data ?? null);
        }
      } catch {
        if (!cancelled) {
          setUserPortfolioData(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingPortfolio(false);
        }
      }
    };

    loadPortfolio();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  const portfolioData =
    isAuthenticated && userPortfolioData
      ? userPortfolioData
      : getPreviewDataForTemplateId(resolvedTemplateId);
  const templateMeta = getTemplateById(resolvedTemplateId);
  const previewTheme = templateMeta?.tier === "premium" ? "premium" : "neutral";
  const fallbackPath = `/templates?tier=${encodeURIComponent(previewTheme)}`;

  if (isAuthenticated && isLoadingPortfolio) {
    return (
      <div className="mx-auto max-w-4xl py-20 text-center text-slate-300">
        Loading your portfolio data...
      </div>
    );
  }

  const content = (
    <TemplatePortfolioRenderer
      appReady
      templateId={resolvedTemplateId}
      portfolioData={portfolioData}
    />
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


