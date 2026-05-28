import { lazy, Suspense, useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AuthProvider } from "./features/auth/AuthContext";
import MarketingLayout from "./layout/MarketingLayout";
import LoadingState from "./layout/LoadingState";
import ProtectedRoute from "./routing/ProtectedRoute";
import { ToastContainer } from "react-toastify";

const Auth = lazy(() => import("./page/Auth"));
const ForgotPasswordPage = lazy(() => import("./page/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./page/ResetPasswordPage"));
const Dashboard = lazy(() => import("./page/Dashboard"));
const ProfilePage = lazy(() => import("./page/ProfilePage"));
const TemplateV1PreviewPage = lazy(() => import("./page/TemplateV1PreviewPage"));
const UserPortfolio = lazy(() => import("./page/UserPortfolio"));
const UrlPortfolioPage = lazy(() => import("./page/UrlPortfolioPage"));
const MyPortfolioPreviewPage = lazy(() => import("./page/MyPortfolioPreviewPage"));
const PortfolioPrivatePage = lazy(() => import("./page/PortfolioPrivatePage"));
const HomePage = lazy(() => import("./page/HomePage"));
const ProductAboutPage = lazy(() => import("./page/ProductAboutPage"));
const TemplatesPage = lazy(() => import("./page/TemplatesPage"));
const AiStudioPage = lazy(() => import("./page/AiStudioPage"));

const DEFAULT_DESCRIPTION =
  "Portfolio Studio helps developers and students create and publish professional portfolio websites quickly.";

const RouteSeo = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    if (path === "/") document.title = "Portfolio Studio | Build Portfolio Website";
    else if (path === "/templates") document.title = "Templates | Portfolio Studio";
    else if (path === "/about") document.title = "About | Portfolio Studio";
    else if (path.startsWith("/u/") || path.startsWith("/p/")) document.title = "Portfolio | Portfolio Studio";
    else document.title = "Portfolio Studio";

    const descriptionTag = document.querySelector('meta[name="description"]');
    if (descriptionTag) descriptionTag.setAttribute("content", DEFAULT_DESCRIPTION);

    const isTemplateRenderRoute =
      path === "/templates/portfolio-v1" ||
      path.startsWith("/u/") ||
      path.startsWith("/p/") ||
      path.startsWith("/portfolio/");

    const targets = [document.documentElement, document.body];
    if (isTemplateRenderRoute) {
      targets.forEach((el) => el.classList.remove("app-scrollbar"));
    } else {
      targets.forEach((el) => el.classList.add("app-scrollbar"));
    }
  }, [location.pathname]);

  return null;
};

const App = () => (
  <AuthProvider>
    <Suspense fallback={<LoadingState title="Loading app..." subtitle="Setting up your workspace." />}>
      <RouteSeo />
      <Routes>
        <Route element={<MarketingLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<ProductAboutPage />} />
          <Route path="/templates" element={<TemplatesPage />} />
          <Route
            path="/ai-studio"
            element={
              <ProtectedRoute>
                <AiStudioPage />
              </ProtectedRoute>
            }
          />
          <Route path="/auth" element={<Auth />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
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
        <Route path="/p/:slug" element={<UserPortfolio appReady withTemplateLayout lookupBy="slug" />} />
        <Route path="/portfolio-private" element={<PortfolioPrivatePage />} />
        <Route path="/portfolio/:payload" element={<UrlPortfolioPage appReady />} />
        <Route
          path="/my-preview"
          element={
            <ProtectedRoute>
              <MyPortfolioPreviewPage appReady />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={2200} theme="dark" />
    </Suspense>
  </AuthProvider>
);

export default App;

