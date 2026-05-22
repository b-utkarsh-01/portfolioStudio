import TemplateV1Layout from "../templates/TemplateV1Layout";
import { templateV1PreviewData } from "../features/portfolio/templatePreviewData";
import { getMyPortfolioApi } from "../features/portfolio/portfolioApi";
import { useAuth } from "../features/auth/AuthContext";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import About from "./About";

const TemplateV1PreviewPage = () => {
  const { isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const [userPortfolioData, setUserPortfolioData] = useState(null);
  const templateId = searchParams.get("templateId") || "premium-v1";

  useEffect(() => {
    let cancelled = false;

    if (!isAuthenticated) {
      setUserPortfolioData(null);
      return () => {
        cancelled = true;
      };
    }

    const loadPortfolio = async () => {
      try {
        const payload = await getMyPortfolioApi();
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
  }, [isAuthenticated]);

  const portfolioData = userPortfolioData ?? templateV1PreviewData;

  return (
    <TemplateV1Layout showPreviewLabel portfolioData={portfolioData} templateId={templateId}>
      <About appReady templateId={templateId} />
    </TemplateV1Layout>
  );
};

export default TemplateV1PreviewPage;
