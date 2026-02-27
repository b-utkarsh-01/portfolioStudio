import { Navigate, useParams } from "react-router-dom";
import TemplateV1Layout from "../components/layout/TemplateV1Layout";
import { decodePortfolioDataFromParam } from "../features/portfolio/urlPortfolio";
import About from "./About";

const UrlPortfolioPage = ({ appReady = true }) => {
  const { payload = "" } = useParams();
  const encodedData = payload;
  const portfolioData = decodePortfolioDataFromParam(encodedData);

  if (!portfolioData) {
    return <Navigate to="/" replace />;
  }

  return (
    <TemplateV1Layout portfolioData={portfolioData}>
      <About appReady={appReady} />
    </TemplateV1Layout>
  );
};

export default UrlPortfolioPage;
