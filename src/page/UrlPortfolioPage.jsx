import { Navigate, useParams, useSearchParams } from "react-router-dom";
import { decodePortfolioDataFromParam } from "../features/portfolio/urlPortfolio";
import TemplatePortfolioRenderer, {
  getTemplateById,
  TemplatePreviewFrame,
} from "portfolio-template-renderer/src";
import PreviewBackButton from "./PreviewBackButton";

const UrlPortfolioPage = ({ appReady = true }) => {
  const { payload = "" } = useParams();
  const [searchParams] = useSearchParams();
  const encodedData = payload;
  const portfolioData = decodePortfolioDataFromParam(encodedData);
  const requestedTemplateId = searchParams.get("templateId") || "default-v4";
  const templateMeta = getTemplateById(requestedTemplateId);
  const templateId = templateMeta?.id || "default-v4";
  const previewTheme = templateMeta?.tier === "premium" ? "premium" : "neutral";
  const fallbackPath = `/templates?tier=${encodeURIComponent(previewTheme)}`;

  if (!portfolioData) {
    return <Navigate to="/" replace />;
  }

  const content = (
    <TemplatePortfolioRenderer
      appReady={appReady}
      templateId={templateId}
      portfolioData={portfolioData}
    />
  );

  if (previewTheme === "premium") {
    return (
      <>
        <PreviewBackButton fallbackPath={fallbackPath} />
        <TemplatePreviewFrame templateId={templateId} portfolioData={portfolioData} showPreviewLabel={false}>
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


