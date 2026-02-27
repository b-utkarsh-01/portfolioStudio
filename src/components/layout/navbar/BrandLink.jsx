import ShinyText from "../../ShinyText";
import { usePortfolioData } from "../../../features/portfolio/PortfolioDataContext";
import { useLocation } from "react-router-dom";

const BrandLink = () => {
  const { badgeName, profile } = usePortfolioData();
  const { pathname } = useLocation();
  const isTemplatePreview = pathname === "/templates/portfolio-v1";
  const resolvedName = (badgeName?.name || "").trim() || (profile?.name || "").trim() || "Portfolio";
  const brandText = isTemplatePreview ? "Template 1" : resolvedName;

  return (
    <a
      href="#top"
      className="no-cursor-target cursor-none flex h-10 min-w-12 max-w-[44vw] items-center justify-center truncate rounded-xl border border-zinc-600/80 bg-zinc-800 px-3 text-xl font-bold tracking-wide sm:h-12 sm:max-w-[280px] sm:min-w-14 sm:px-4 sm:text-3xl md:max-w-none"
    >
      <ShinyText text={brandText} />
    </a>
  );
};

export default BrandLink;
