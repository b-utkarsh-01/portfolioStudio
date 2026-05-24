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

  const addSkillGroup = () => {
    setForm((prev) => ({
      ...prev,
      skillsAdditionalGroups: [
        ...(Array.isArray(prev.skillsAdditionalGroups) ? prev.skillsAdditionalGroups : []),
        {
          id: `skill-group-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
          name: "",
          skills: [""],
        },
      ],
    }));
  };

  const removeSkillGroup = (groupId) => {
    setForm((prev) => ({
      ...prev,
      skillsAdditionalGroups: (Array.isArray(prev.skillsAdditionalGroups) ? prev.skillsAdditionalGroups : []).filter(
        (group) => group.id !== groupId
      ),
    }));
  };

  const updateSkillGroupName = (groupId, name) => {
    setForm((prev) => ({
      ...prev,
      skillsAdditionalGroups: (Array.isArray(prev.skillsAdditionalGroups) ? prev.skillsAdditionalGroups : []).map(
        (group) => (group.id === groupId ? { ...group, name } : group)
      ),
    }));
  };

  const addSkillToGroup = (groupId) => {
    setForm((prev) => ({
      ...prev,
      skillsAdditionalGroups: (Array.isArray(prev.skillsAdditionalGroups) ? prev.skillsAdditionalGroups : []).map(
        (group) =>
          group.id === groupId
            ? {
                ...group,
                skills: [...(Array.isArray(group.skills) ? group.skills : []), ""],
              }
            : group
      ),
    }));
  };

  const removeSkillFromGroup = (groupId, skillIndex) => {
    setForm((prev) => ({
      ...prev,
      skillsAdditionalGroups: (Array.isArray(prev.skillsAdditionalGroups) ? prev.skillsAdditionalGroups : []).map(
        (group) => {
          if (group.id !== groupId) return group;
          const nextSkills = (Array.isArray(group.skills) ? group.skills : []).filter((_, index) => index !== skillIndex);
          return { ...group, skills: nextSkills.length ? nextSkills : [""] };
        }
      ),
    }));
  };

  const updateSkillInGroup = (groupId, skillIndex, value) => {
    setForm((prev) => ({
      ...prev,
      skillsAdditionalGroups: (Array.isArray(prev.skillsAdditionalGroups) ? prev.skillsAdditionalGroups : []).map(
        (group) => {
          if (group.id !== groupId) return group;
          const nextSkills = [...(Array.isArray(group.skills) ? group.skills : [])];
          nextSkills[skillIndex] = value;
          return { ...group, skills: nextSkills };
        }
      ),
    }));
  };

  const addWorkItem = (collectionKey, emptyItem) => {
    setForm((prev) => ({
      ...prev,
      [collectionKey]: [
        ...(Array.isArray(prev[collectionKey]) ? prev[collectionKey] : []),
        {
          id: `work-item-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
          ...emptyItem,
        },
      ],
    }));
  };

  const removeWorkItem = (collectionKey, itemId) => {
    setForm((prev) => ({
      ...prev,
      [collectionKey]: (Array.isArray(prev[collectionKey]) ? prev[collectionKey] : []).filter(
        (item) => item.id !== itemId
      ),
    }));
  };

  const updateWorkItemField = (collectionKey, itemId, field, value) => {
    setForm((prev) => ({
      ...prev,
      [collectionKey]: (Array.isArray(prev[collectionKey]) ? prev[collectionKey] : []).map((item) =>
        item.id === itemId ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addCollectionItem = (collectionKey, emptyItem) => {
    setForm((prev) => ({
      ...prev,
      [collectionKey]: [
        ...(Array.isArray(prev[collectionKey]) ? prev[collectionKey] : []),
        {
          id: `collection-item-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
          ...emptyItem,
        },
      ],
    }));
  };

  const removeCollectionItem = (collectionKey, itemId) => {
    setForm((prev) => ({
      ...prev,
      [collectionKey]: (Array.isArray(prev[collectionKey]) ? prev[collectionKey] : []).filter(
        (item) => item.id !== itemId
      ),
    }));
  };

  const updateCollectionItemField = (collectionKey, itemId, field, value) => {
    setForm((prev) => ({
      ...prev,
      [collectionKey]: (Array.isArray(prev[collectionKey]) ? prev[collectionKey] : []).map((item) =>
        item.id === itemId ? { ...item, [field]: value } : item
      ),
    }));
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
    setForm(buildFormState());
    setSavedAt(null);
    setStatusDetails([]);
    toast.success("Reset to default.");
  };

  return (
    <div className="mx-auto w-full rounded-3xl border border-slate-700 bg-slate-900/60 p-4">
      <DashboardHeader username={currentUser?.username} profileUrl={profileUrl} onLogout={handleLogout} />

      {savedAt ? (
        <PublicPortfolioUrlCard publicPortfolioUrl={publicPortfolioUrl} onCopy={handleCopyPublicUrl} />
      ) : null}

      <DashboardForm
        form={form}
        onSubmit={handleSave}
        onFieldChange={updateField}
        onSkillGroupAdd={addSkillGroup}
        onSkillGroupRemove={removeSkillGroup}
        onSkillGroupNameChange={updateSkillGroupName}
        onSkillAdd={addSkillToGroup}
        onSkillRemove={removeSkillFromGroup}
        onSkillChange={updateSkillInGroup}
        onWorkItemAdd={addWorkItem}
        onWorkItemRemove={removeWorkItem}
        onWorkItemChange={updateWorkItemField}
        onCollectionItemAdd={addCollectionItem}
        onCollectionItemRemove={removeCollectionItem}
        onCollectionItemChange={updateCollectionItemField}
        onStageTitleChange={updateStageTitle}
        onStageToggle={toggleStageEnabled}
        onAddStage={addCustomStage}
        onResetDefaults={resetToDefault}
        onCustomStageChange={updateCustomStage}
        urlDataPortfolioPath={urlDataPortfolioPath}
        savedAt={savedAt}
        statusDetails={statusDetails}
      />
    </div>
  );
};

export default Dashboard;
