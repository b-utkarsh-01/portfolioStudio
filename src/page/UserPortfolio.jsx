import { Suspense, lazy, useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { normalizePortfolioForRender } from "../features/portfolio/defensivePortfolio";
import { getTemplateById } from "../features/portfolio/templateRendererBridge";
import { getPortfolioBySlugApi, getPortfolioByUsernameApi } from "../features/portfolio/portfolioApi";
import LoadingState from "../layout/LoadingState";

const TemplatePortfolioRenderer = lazy(() => import("../features/portfolio/templateRendererBridge"));
const PassthroughFrame = ({ children }) => <>{children}</>;

const UserPortfolio = ({ appReady, withTemplateLayout = false, lookupBy = "username" }) => {
  const { username = "", slug = "" } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [resolvedTemplateId, setResolvedTemplateId] = useState("default-v4");
  const [TemplatePreviewFrame, setTemplatePreviewFrame] = useState(() => PassthroughFrame);

  useEffect(() => {
    let cancelled = false;

    const loadPortfolio = async () => {
      try {
        const payload =
          lookupBy === "slug" ? await getPortfolioBySlugApi(slug) : await getPortfolioByUsernameApi(username);
        if (!cancelled) {
          setPortfolio(payload.portfolio ?? null);
        }
      } catch (error) {
        if (cancelled) return;
        if (error?.code === "PORTFOLIO_PRIVATE" || error?.status === 403) {
          setIsPrivate(true);
          return;
        }
        setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadPortfolio();
    return () => {
      cancelled = true;
    };
  }, [lookupBy, slug, username]);

  useEffect(() => {
    let cancelled = false;
    const loadTemplateInfo = async () => {
      const templateId = portfolio?.templateId || "default-v4";
      const [templateMeta, renderer] = await Promise.all([
        getTemplateById(templateId),
        import("../features/portfolio/templateRendererBridge"),
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

  if (isPrivate) {
    return <Navigate to="/portfolio-private" replace />;
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
        portfolioData={{
          ...normalizePortfolioForRender(portfolio.data),
          renderMode: portfolio?.renderMode || "static",
          aiTemplateSpec: portfolio?.aiTemplateSpec || null,
        }}
      />
    </Suspense>
  );

  if (!withTemplateLayout) return content;

  if (previewTheme === "premium") {
    return (
      <TemplatePreviewFrame
        templateId={resolvedTemplateId}
        portfolioData={{
          ...normalizePortfolioForRender(portfolio.data),
          renderMode: portfolio?.renderMode || "static",
          aiTemplateSpec: portfolio?.aiTemplateSpec || null,
        }}
        showPreviewLabel={false}
      >
        {content}
      </TemplatePreviewFrame>
    );
  }

  return <>{content}</>;
};

export default UserPortfolio;
