import {
  PremiumPortfolioRenderer,
  PortfolioDataProvider,
} from "portfolio-studio-premium";

const PremiumRendererWrapper = ({ appReady, templateId, portfolioData }) => (
  <PortfolioDataProvider value={portfolioData || null}>
    <PremiumPortfolioRenderer appReady={appReady} templateId={templateId} />
  </PortfolioDataProvider>
);

export default PremiumRendererWrapper;
