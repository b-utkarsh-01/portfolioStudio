import { CircleArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Galaxy from "../Galaxy";
import TargetCursor from "../TargetCursor";
import Navbar from "./Navbar";
import { PortfolioDataProvider } from "../../features/portfolio/PortfolioDataContext";

const TemplateV1Layout = ({ children, showPreviewLabel = false, portfolioData }) => {
  return (
    <PortfolioDataProvider value={portfolioData}>
      <div className="relative min-h-screen overflow-x-hidden bg-[#02071b] text-white">
        <div className="pointer-events-none fixed inset-0 z-0">
          <Galaxy
            className="h-full w-full"
            trackGlobalMouse
            density={1.1}
            glowIntensity={0.55}
            saturation={0.7}
            hueShift={280}
            transparent={false}
          />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
          {showPreviewLabel ? (
            <div className="mb-4 flex  items-center gap-2 sm:gap-3">
              <Link
                to="/templates"
                className="cursor-target cursor-none inline-flex items-center gap-2 rounded-lg border border-slate-600 bg-slate-900/60 px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-800"
              >
                <CircleArrowLeft className="h-4 w-4" />
                Back
              </Link>
              <p className="text-center w-[80%] text-sm text-slate-300">Template 1 Preview</p>
            </div>
          ) : null}
          {children}
        </div>

        <TargetCursor />
        <Navbar />
      </div>
    </PortfolioDataProvider>
  );
};

export default TemplateV1Layout;
