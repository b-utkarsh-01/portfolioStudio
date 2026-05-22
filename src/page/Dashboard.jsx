import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";
import { encodePortfolioDataToParam } from "../features/portfolio/urlPortfolio";
import { getMyPortfolioApi, upsertMyPortfolioApi } from "../features/portfolio/portfolioApi";
import { toast } from "react-toastify";
import DashboardForm from "./dashboard/DashboardForm";
import DashboardHeader from "./dashboard/DashboardHeader";
import PublicPortfolioUrlCard from "./dashboard/PublicPortfolioUrlCard";
import { buildFormState, buildPortfolioData } from "./dashboard/formData";

const Dashboard = () => {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const appliedIntentRef = useRef("");

  const [form, setForm] = useState(() => buildFormState());
  const [savedAt, setSavedAt] = useState(null);
  const [statusDetails, setStatusDetails] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;

    const loadPortfolio = async () => {
      try {
        const payload = await getMyPortfolioApi();
        if (!cancelled) {
          const nextData = payload?.portfolio?.data;
          const nextTemplateId = payload?.portfolio?.templateId || "premium-v1";
          const templateIntent = location.state?.templateId || "";

          if (templateIntent && templateIntent !== nextTemplateId && appliedIntentRef.current !== templateIntent) {
            appliedIntentRef.current = templateIntent;
            await upsertMyPortfolioApi({
              templateId: templateIntent,
              data: nextData,
            });
            setForm(buildFormState(nextData, templateIntent));
            setSavedAt(Date.now());
            toast.success("Template applied. You can now edit and publish.");
            navigate("/dashboard", { replace: true });
            return;
          }

          setForm(buildFormState(nextData, nextTemplateId));
        }
      } catch (error) {
        if (!cancelled) {
          toast.error(error.message || "Could not load existing portfolio.");
          setStatusDetails(Array.isArray(error?.details) ? error.details : []);
        }
      }
    };

    loadPortfolio();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, location.state, navigate]);

  const profileUrl = useMemo(
    () => (currentUser?.username ? `/u/${currentUser.username}` : "/"),
    [currentUser?.username]
  );

  const urlDataPortfolioPath = useMemo(() => {
    const encoded = encodePortfolioDataToParam(buildPortfolioData(form));
    if (!encoded) return "";
    return `/portfolio/${encoded}?templateId=${encodeURIComponent(form.templateId || "premium-v1")}`;
  }, [form]);

  const publicPortfolioUrl = useMemo(() => {
    if (!currentUser?.username) return "";
    if (typeof window === "undefined") return profileUrl;
    return `${window.location.origin}${profileUrl}`;
  }, [currentUser?.username, profileUrl]);

  const updateField = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const updateStageTitle = (stageId, title) => {
    setForm((prev) => ({
      ...prev,
      layoutStages: (prev.layoutStages || []).map((stage) =>
        stage.id === stageId ? { ...stage, title } : stage
      ),
    }));
  };

  const toggleStageEnabled = (stageId) => {
    setForm((prev) => ({
      ...prev,
      layoutStages: (prev.layoutStages || []).map((stage) =>
        stage.id === stageId ? { ...stage, enabled: !stage.enabled } : stage
      ),
    }));
  };

  const addCustomStage = () => {
    setForm((prev) => {
      const stages = Array.isArray(prev.layoutStages) ? prev.layoutStages : [];
      const customCount = stages.filter((stage) => `${stage?.id || ""}`.startsWith("custom-")).length;
      const nextIndex = customCount + 1;
      const nextId = `custom-${nextIndex}`;
      const nextStage = {
        id: nextId,
        title: `Custom Stage ${nextIndex}`,
        enabled: true,
      };

      return {
        ...prev,
        layoutStages: [...stages, nextStage],
        customStages: [
          ...(Array.isArray(prev.customStages) ? prev.customStages : []),
          { id: nextId, kind: "paragraph", paragraph: "", cards: [] },
        ],
      };
    });
  };

  const updateCustomStage = (stageId, patch) => {
    setForm((prev) => ({
      ...prev,
      customStages: (() => {
        const current = Array.isArray(prev.customStages) ? prev.customStages : [];
        const existingIndex = current.findIndex((stage) => stage.id === stageId);

        if (existingIndex >= 0) {
          return current.map((stage) => (stage.id === stageId ? { ...stage, ...patch } : stage));
        }

        return [
          ...current,
          {
            id: stageId,
            kind: patch?.kind === "cards" ? "cards" : "paragraph",
            paragraph: patch?.paragraph ?? "",
            cards: Array.isArray(patch?.cards) ? patch.cards : [],
          },
        ];
      })(),
    }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (!isAuthenticated) return;
    setStatusDetails([]);

    try {
      await upsertMyPortfolioApi({
        templateId: form.templateId,
        data: buildPortfolioData(form),
      });
      setSavedAt(Date.now());
      toast.success("Portfolio saved.");
      setStatusDetails([]);
    } catch (error) {
      toast.error(error.message || "Save failed.");
      setStatusDetails(Array.isArray(error?.details) ? error.details : []);
    }
  };

  const handleCopyPublicUrl = async () => {
    try {
      await navigator.clipboard.writeText(publicPortfolioUrl);
      toast.success("Public URL copied.");
    } catch {
      toast.error("Copy failed. URL manually copy kar lo.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const resetToDefault = () => {
    setForm(buildFormState());
    setSavedAt(null);
    setStatusDetails([]);
    toast.success("Reset to default.");
  };

  return (
    <div className="mx-auto w-full max-w-5xl rounded-3xl border border-slate-700 bg-slate-900/60 p-4 sm:p-6">
      <DashboardHeader username={currentUser?.username} profileUrl={profileUrl} onLogout={handleLogout} />

      <PublicPortfolioUrlCard publicPortfolioUrl={publicPortfolioUrl} onCopy={handleCopyPublicUrl} />

      <DashboardForm
        form={form}
        onSubmit={handleSave}
        onFieldChange={updateField}
        onTemplateChange={(event) =>
          setForm((prev) => ({
            ...prev,
            templateId: event.target.value,
          }))
        }
        onStageTitleChange={updateStageTitle}
        onStageToggle={toggleStageEnabled}
        onAddStage={addCustomStage}
        onResetDefaults={resetToDefault}
        onCustomStageChange={updateCustomStage}
        canUsePremium
        urlDataPortfolioPath={urlDataPortfolioPath}
        savedAt={savedAt}
        statusDetails={statusDetails}
      />
    </div>
  );
};

export default Dashboard;
