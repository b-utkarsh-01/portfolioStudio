import { useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";
import { encodePortfolioDataToParam } from "../features/portfolio/urlPortfolio";
import { getMyPortfolioApi, upsertMyPortfolioApi } from "../features/portfolio/portfolioApi";
import { toast } from "react-toastify";
import DashboardForm from "./dashboard/DashboardForm";
import DashboardHeader from "./dashboard/DashboardHeader";
import PublicPortfolioUrlCard from "./dashboard/PublicPortfolioUrlCard";
import { buildFormState, buildPortfolioData } from "./dashboard/formData";
import useDashboardFormState from "./dashboard/useDashboardFormState";

const Dashboard = () => {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const appliedIntentRef = useRef("");

  const { form, setForm, savedAt, setSavedAt, statusDetails, setStatusDetails, handlers } = useDashboardFormState();

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
            setSavedAt(null);
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
  }, [isAuthenticated, location.state, navigate, setForm, setSavedAt, setStatusDetails]);

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

  const handleSave = async (event) => {
    if (event?.preventDefault) event.preventDefault();
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
    handlers.resetToDefault();
    toast.success("Reset to default.");
  };

  return (
    <div className="mx-auto flex h-[calc(100dvh-170px)] min-h-0 w-full flex-col overflow-hidden rounded-3xl border border-slate-700 bg-slate-900/60 p-4 sm:h-[calc(100dvh-150px)]">
      <DashboardHeader username={currentUser?.username} profileUrl={profileUrl} onLogout={handleLogout} />

      {savedAt ? (
        <PublicPortfolioUrlCard publicPortfolioUrl={publicPortfolioUrl} onCopy={handleCopyPublicUrl} />
      ) : null}

      <div className="min-h-0 flex-1 overflow-hidden">
        <DashboardForm
          form={form}
          onSubmit={handleSave}
          onFieldChange={handlers.updateField}
          onSkillGroupAdd={handlers.addSkillGroup}
          onSkillGroupRemove={handlers.removeSkillGroup}
          onSkillGroupNameChange={handlers.updateSkillGroupName}
          onSkillAdd={handlers.addSkillToGroup}
          onSkillRemove={handlers.removeSkillFromGroup}
          onSkillChange={handlers.updateSkillInGroup}
          onWorkItemAdd={handlers.addWorkItem}
          onWorkItemRemove={handlers.removeWorkItem}
          onWorkItemChange={handlers.updateWorkItemField}
          onCollectionItemAdd={handlers.addCollectionItem}
          onCollectionItemRemove={handlers.removeCollectionItem}
          onCollectionItemChange={handlers.updateCollectionItemField}
          onStageTitleChange={handlers.updateStageTitle}
          onStageToggle={handlers.toggleStageEnabled}
          onAddStage={handlers.addCustomStage}
          onResetDefaults={resetToDefault}
          onCustomStageChange={handlers.updateCustomStage}
          urlDataPortfolioPath={urlDataPortfolioPath}
          savedAt={savedAt}
          statusDetails={statusDetails}
        />
      </div>
    </div>
  );
};

export default Dashboard;
