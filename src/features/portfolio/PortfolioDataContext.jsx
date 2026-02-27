import { createContext, useContext, useMemo } from "react";
import { createDefaultRenderData, hydrateRenderData } from "./portfolioData";

const PortfolioDataContext = createContext(createDefaultRenderData());

export const PortfolioDataProvider = ({ value, children }) => {
  const data = useMemo(() => {
    if (!value) return createDefaultRenderData();
    return hydrateRenderData(value);
  }, [value]);

  return <PortfolioDataContext.Provider value={data}>{children}</PortfolioDataContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const usePortfolioData = () => useContext(PortfolioDataContext);
