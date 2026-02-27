import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./features/auth/AuthContext";
import ProtectedRoute from "./components/routing/ProtectedRoute";
import MarketingLayout from "./components/layout/MarketingLayout";
import Auth from "./page/Auth";
import Dashboard from "./page/Dashboard";
import TemplateV1PreviewPage from "./page/TemplateV1PreviewPage";
import UserPortfolio from "./page/UserPortfolio";
import UrlPortfolioPage from "./page/UrlPortfolioPage";
import HomePage from "./page/HomePage";
import ProductAboutPage from "./page/ProductAboutPage";
import TemplatesPage from "./page/TemplatesPage";

const App = () => (
  <AuthProvider>
    <Routes>
      <Route element={<MarketingLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<ProductAboutPage />} />
        <Route path="/templates" element={<TemplatesPage />} />
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="/templates/portfolio-v1" element={<TemplateV1PreviewPage />} />
      <Route path="/u/:username" element={<UserPortfolio appReady withTemplateLayout />} />
      <Route path="/portfolio/:payload" element={<UrlPortfolioPage appReady />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </AuthProvider>
);

export default App;
