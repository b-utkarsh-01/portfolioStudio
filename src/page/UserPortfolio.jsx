import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import TemplatePortfolioRenderer, { TemplatePreviewFrame } from "portfolio-template-renderer";
import { getTemplateById } from "../features/portfolio/templateCatalog";
import { getPortfolioByUsernameApi } from "../features/portfolio/portfolioApi";

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
    return loadingView;
  }

  if (notFound || !portfolio?.data) {
    return <Navigate to="/" replace />;
  }

  const resolvedTemplateId = getTemplateById(portfolio?.templateId || "default-v4")?.id || "default-v4";
  const previewTheme = resolvedTemplateId.startsWith("premium-") ? "premium" : "neutral";
  const content = (
    <TemplatePortfolioRenderer
      appReady={appReady}
      templateId={resolvedTemplateId}
      portfolioData={portfolio.data}
    />
  );

  if (!withTemplateLayout) return content;

  if (previewTheme === "premium") {
    return (
      <TemplatePreviewFrame
        templateId={resolvedTemplateId}
        portfolioData={portfolio.data}
        showPreviewLabel={false}
      >
        {content}
      </TemplatePreviewFrame>
    );
  }

  return (
    <>
      {content}
    </>
  );
};

export default UserPortfolio;


