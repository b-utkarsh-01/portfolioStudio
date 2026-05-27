import { defaultTemplates, DefaultPortfolioRenderer } from "portfolio-studio-default";
import {
  premiumTemplates,
  PremiumPortfolioRenderer,
  PortfolioDataProvider,
  TemplateV1Layout,
} from "portfolio-studio-premium";
import AiDynamicTemplateRenderer from "./aiDynamic/AiDynamicTemplateRenderer";

export const TEMPLATE_CATALOG = [
  ...(Array.isArray(defaultTemplates) ? defaultTemplates : []),
  ...(Array.isArray(premiumTemplates) ? premiumTemplates : []),
];

export const getTemplateById = (templateId) =>
  TEMPLATE_CATALOG.find((template) => template?.id === templateId) || TEMPLATE_CATALOG[0] || null;

const TEMPLATE_ID_ALIASES = {
  "premium-nebula": "premium-v1",
  nebula: "premium-v1",
  "default-cyberpunk": "default-v4",
};

const resolveTemplateId = (templateId) => {
  const normalized = `${templateId || ""}`.trim().toLowerCase();
  return TEMPLATE_ID_ALIASES[normalized] || templateId;
};

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
  const resolvedRequestedTemplateId = resolveTemplateId(templateId);
  const renderMode = `${portfolioData?.renderMode || "static"}`.toLowerCase();
  const aiTemplateSpec = portfolioData?.aiTemplateSpec || null;
  const normalizedTemplateId = `${resolvedRequestedTemplateId || ""}`.toLowerCase();
  const isAiTemplate = normalizedTemplateId.startsWith("ai-");
  const isDynamic =
    aiTemplateSpec &&
    typeof aiTemplateSpec === "object" &&
    isAiTemplate &&
    renderMode === "dynamic";

  if (isDynamic) {
    return <AiDynamicTemplateRenderer spec={aiTemplateSpec} portfolioData={portfolioData || {}} />;
  }

  const safeTemplateId = getTemplateById(resolvedRequestedTemplateId)?.id || "default-horizon";
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
