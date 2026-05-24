import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./features/auth/AuthContext";
import MarketingLayout from "./layout/MarketingLayout";
import ProtectedRoute from "./routing/ProtectedRoute";
import Auth from "./page/Auth";
import Dashboard from "./page/Dashboard";
import ProfilePage from "./page/ProfilePage";
import TemplateV1PreviewPage from "./page/TemplateV1PreviewPage";
import UserPortfolio from "./page/UserPortfolio";
import UrlPortfolioPage from "./page/UrlPortfolioPage";
import HomePage from "./page/HomePage";
import ProductAboutPage from "./page/ProductAboutPage";
import TemplatesPage from "./page/TemplatesPage";
import { ToastContainer } from "react-toastify";

const App = () => (
  <AuthProvider>
    <>
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
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="/templates/portfolio-v1" element={<TemplateV1PreviewPage />} />
        <Route path="/u/:username" element={<UserPortfolio appReady withTemplateLayout />} />
        <Route path="/portfolio/:payload" element={<UrlPortfolioPage appReady />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={2200} theme="dark" />
    </>
  </AuthProvider>
);

export default App;

