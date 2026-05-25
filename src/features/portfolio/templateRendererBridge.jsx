import { defaultTemplates, DefaultPortfolioRenderer } from "portfolio-studio-default";
import {
  premiumTemplates,
  PremiumPortfolioRenderer,
  PortfolioDataProvider,
  TemplateV1Layout,
} from "portfolio-studio-premium";

export const TEMPLATE_CATALOG = [
  ...(Array.isArray(defaultTemplates) ? defaultTemplates : []),
  ...(Array.isArray(premiumTemplates) ? premiumTemplates : []),
];

export const getTemplateById = (templateId) =>
  TEMPLATE_CATALOG.find((template) => template?.id === templateId) || TEMPLATE_CATALOG[0] || null;

export const TemplatePreviewFrame = ({
  templateId,
  portfolioData,
  showPreviewLabel = false,
  children,
}) => {
  if (templateId !== "premium-v1") return children;

  return (
    <TemplateV1Layout
      showPreviewLabel={showPreviewLabel}
      portfolioData={portfolioData}
      templateId={templateId}
    >
      {children}
    </TemplateV1Layout>
  );
};

const TemplatePortfolioRenderer = ({ appReady, templateId = "default-horizon", portfolioData = null }) => {
  const safeTemplateId = getTemplateById(templateId)?.id || "default-horizon";
  const isDefaultTemplate = `${safeTemplateId}`.startsWith("default-");

  if (isDefaultTemplate) {
    return <DefaultPortfolioRenderer templateId={safeTemplateId} data={portfolioData || null} />;
  }

  return (
    <PortfolioDataProvider value={portfolioData || null}>
      <PremiumPortfolioRenderer appReady={appReady} templateId={safeTemplateId} />
    </PortfolioDataProvider>
  );
};

export default TemplatePortfolioRenderer;
