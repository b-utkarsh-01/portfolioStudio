import TemplateV1Layout from "../components/layout/TemplateV1Layout";
import { templateV1PreviewData } from "../features/portfolio/templatePreviewData";
import { getMyPortfolioApi } from "../features/portfolio/portfolioApi";
import { useAuth } from "../features/auth/AuthContext";
import { useEffect, useState } from "react";
import About from "./About";

const TemplateV1PreviewPage = () => {
  const { token } = useAuth();
  const [userPortfolioData, setUserPortfolioData] = useState(null);

  useEffect(() => {
    let cancelled = false;

    if (!token) {
      setUserPortfolioData(null);
      return () => {
        cancelled = true;
      };
    }

    const loadPortfolio = async () => {
      try {
        const payload = await getMyPortfolioApi(token);
        if (!cancelled) {
          setUserPortfolioData(payload?.portfolio?.data ?? null);
        }
      } catch {
        if (!cancelled) {
          setUserPortfolioData(null);
        }
      }
    };

    loadPortfolio();

    return () => {
      cancelled = true;
    };
  }, [token]);

  const portfolioData = userPortfolioData ?? templateV1PreviewData;

  return (
    <TemplateV1Layout showPreviewLabel portfolioData={portfolioData}>
      <About appReady />
    </TemplateV1Layout>
  );
};

export default TemplateV1PreviewPage;
