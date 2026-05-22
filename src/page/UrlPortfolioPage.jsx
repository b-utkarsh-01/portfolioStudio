import { Navigate, useParams, useSearchParams } from "react-router-dom";
import TemplateV1Layout from "../templates/TemplateV1Layout";
import { decodePortfolioDataFromParam } from "../features/portfolio/urlPortfolio";
import About from "./About";

const UrlPortfolioPage = ({ appReady = true }) => {
  const { payload = "" } = useParams();
  const [searchParams] = useSearchParams();
  const encodedData = payload;
  const portfolioData = decodePortfolioDataFromParam(encodedData);
  const templateId = searchParams.get("templateId") || "premium-v1";

  if (!portfolioData) {
    return <Navigate to="/" replace />;
  }

  return (
    <TemplateV1Layout portfolioData={portfolioData} templateId={templateId}>
      <About appReady={appReady} templateId={templateId} />
    </TemplateV1Layout>
  );
};

export default UrlPortfolioPage;
