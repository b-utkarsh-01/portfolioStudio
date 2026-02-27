import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";
import { encodePortfolioDataToParam } from "../features/portfolio/urlPortfolio";
import { getMyPortfolioApi, upsertMyPortfolioApi } from "../features/portfolio/portfolioApi";
import DashboardForm from "./dashboard/DashboardForm";
import DashboardHeader from "./dashboard/DashboardHeader";
import PublicPortfolioUrlCard from "./dashboard/PublicPortfolioUrlCard";
import { buildFormState, buildPortfolioData } from "./dashboard/formData";

const Dashboard = () => {
  const { currentUser, token, logout } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(() => buildFormState());
  const [savedAt, setSavedAt] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    const loadPortfolio = async () => {
      try {
        const payload = await getMyPortfolioApi(token);
        if (!cancelled) {
          const nextData = payload?.portfolio?.data;
          setForm(buildFormState(nextData));
        }
      } catch (error) {
        if (!cancelled) {
          setStatusMessage(error.message || "Could not load existing portfolio.");
        }
      }
    };

    loadPortfolio();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const profileUrl = useMemo(
    () => (currentUser?.username ? `/u/${currentUser.username}` : "/"),
    [currentUser?.username]
  );

  const urlDataPortfolioPath = useMemo(() => {
    const encoded = encodePortfolioDataToParam(buildPortfolioData(form));
    return encoded ? `/portfolio/${encoded}` : "";
  }, [form]);

  const publicPortfolioUrl = useMemo(() => {
    if (!currentUser?.username) return "";
    if (typeof window === "undefined") return profileUrl;
    return `${window.location.origin}${profileUrl}`;
  }, [currentUser?.username, profileUrl]);

  const updateField = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (!token) return;
    setStatusMessage("");

    try {
      await upsertMyPortfolioApi(token, {
        templateId: form.templateId,
        data: buildPortfolioData(form),
      });
      setSavedAt(Date.now());
    } catch (error) {
      setStatusMessage(error.message || "Save failed.");
    }
  };

  const handleCopyPublicUrl = async () => {
    try {
      await navigator.clipboard.writeText(publicPortfolioUrl);
      setStatusMessage("Public URL copied.");
    } catch {
      setStatusMessage("Copy failed. URL manually copy kar lo.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    <div className="mx-auto w-full max-w-5xl rounded-3xl border border-slate-700 bg-slate-900/60 p-4 sm:p-6">
      <DashboardHeader username={currentUser?.username} profileUrl={profileUrl} onLogout={handleLogout} />

      <PublicPortfolioUrlCard publicPortfolioUrl={publicPortfolioUrl} onCopy={handleCopyPublicUrl} />

      <DashboardForm
        form={form}
        onSubmit={handleSave}
        onFieldChange={updateField}
        onTemplateChange={() => setForm((prev) => ({ ...prev, templateId: "portfolio-v1" }))}
        urlDataPortfolioPath={urlDataPortfolioPath}
        savedAt={savedAt}
        statusMessage={statusMessage}
      />
    </div>
  );
};

export default Dashboard;
