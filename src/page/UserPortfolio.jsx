import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import About from "./About";
import { getPortfolioByUsernameApi } from "../features/portfolio/portfolioApi";
import TemplateV1Layout from "../templates/TemplateV1Layout";

const UserPortfolio = ({ appReady, withTemplateLayout = false }) => {
  const { username = "" } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadPortfolio = async () => {
      try {
        const payload = await getPortfolioByUsernameApi(username);
        if (!cancelled) {
          setPortfolio(payload.portfolio ?? null);
        }
      } catch {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadPortfolio();
    return () => {
      cancelled = true;
    };
  }, [username]);

  if (loading) {
    const loadingView = (
      <div className="mx-auto max-w-4xl py-20 text-center text-slate-300">Loading...</div>
    );
    return withTemplateLayout ? (
      <TemplateV1Layout portfolioData={portfolio?.data}>{loadingView}</TemplateV1Layout>
    ) : (
      loadingView
    );
  }

  if (notFound || !portfolio?.data) {
    return <Navigate to="/" replace />;
  }

  const content = <About appReady={appReady} templateId={portfolio?.templateId || "premium-v1"} />;

  return withTemplateLayout ? (
    <TemplateV1Layout portfolioData={portfolio.data} templateId={portfolio.templateId}>
      {content}
    </TemplateV1Layout>
  ) : (
    content
  );
};

export default UserPortfolio;
