import { Suspense, lazy, useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { getTemplateById } from "../features/portfolio/templateCatalog";
import { getPortfolioByUsernameApi } from "../features/portfolio/portfolioApi";
import LoadingState from "../layout/LoadingState";

const TemplatePortfolioRenderer = lazy(() => import("portfolio-template-renderer"));
const PassthroughFrame = ({ children }) => <>{children}</>;

const UserPortfolio = ({ appReady, withTemplateLayout = false }) => {
  const { username = "" } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [resolvedTemplateId, setResolvedTemplateId] = useState("default-v4");
  const [TemplatePreviewFrame, setTemplatePreviewFrame] = useState(() => PassthroughFrame);

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

  useEffect(() => {
    let cancelled = false;
    const loadTemplateInfo = async () => {
      const templateId = portfolio?.templateId || "default-v4";
      const [templateMeta, renderer] = await Promise.all([
        getTemplateById(templateId),
        import("portfolio-template-renderer"),
      ]);
      if (cancelled) return;
      setResolvedTemplateId(templateMeta?.id || "default-v4");
      setTemplatePreviewFrame(() => renderer.TemplatePreviewFrame || PassthroughFrame);
    };
    loadTemplateInfo();
    return () => {
      cancelled = true;
    };
  }, [portfolio?.templateId]);

  if (loading) {
    return <LoadingState title="Loading portfolio..." subtitle="Fetching profile details and template settings." />;
  }

  if (notFound || !portfolio?.data) {
    return <Navigate to="/" replace />;
  }

  const previewTheme = resolvedTemplateId.startsWith("premium-") ? "premium" : "neutral";
  const content = (
    <Suspense fallback={<LoadingState title="Loading portfolio view..." subtitle="Rendering your selected template." />}>
      <TemplatePortfolioRenderer
        appReady={appReady}
        templateId={resolvedTemplateId}
        portfolioData={portfolio.data}
      />
    </Suspense>
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

  return <>{content}</>;
};

export default UserPortfolio;
