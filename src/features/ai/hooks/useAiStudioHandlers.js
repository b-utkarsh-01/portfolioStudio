import { toast } from "react-toastify";
import {
  applyAiTemplateApi,
  generateAiTemplateFromTextApi,
  generateAiTemplateFromUploadApi,
} from "../aiApi";
import { defaultStructuredResume } from "../aiStudioDefaults";

export const useAiStudioHandlers = ({
  navigate,
  applyRedirectPath,
  generating,
  isRunning,
  retryAfterSeconds,
  setGenerating,
  setDraft,
  setTemplateSpec,
  setStyleIntent,
  setProvider,
  setValidationErrors,
  setGenerateError,
  setStatus,
  designControls,
  inputMode,
  resumeFile,
  templateId,
  visibleResumeSubStages,
  structuredResume,
  skillSections,
  educationItems,
  experienceItems,
  projectItems,
  customResumeStageContent,
  setJobId,
  setRetryAfterSeconds,
  draft,
  templateSpec,
  setApplying,
  applying,
  jobId,
  setResumeSubStages,
  defaultStages,
  setResumeSubStage,
  setCustomResumeStageCount,
  setStructuredResume,
  setSkillSections,
  setEducationItems,
  setExperienceItems,
  setProjectItems,
  setCustomResumeStageContent,
  customResumeStageCount,
}) => {
  const handleToggleResumeSubStage = (stageKey) => {
    setResumeSubStages((prev) =>
      prev.map((stage) => (stage.key === stageKey ? { ...stage, enabled: !stage.enabled } : stage))
    );
  };

  const handleAddResumeSubStage = () => {
    const next = customResumeStageCount + 1;
    const key = `custom-${next}`;
    setCustomResumeStageCount(next);
    setResumeSubStages((prev) => [...prev, { key, label: `Custom Stage ${next}`, enabled: true }]);
    setCustomResumeStageContent((prev) => ({ ...prev, [key]: { kind: "paragraph", paragraph: "", cards: [] } }));
  };

  const handleResetResumeForm = () => {
    setResumeSubStages(defaultStages);
    setResumeSubStage(0);
    setCustomResumeStageCount(0);
    setStructuredResume(defaultStructuredResume);
    setSkillSections([{ id: "skill-sec-1", name: "", skills: [""] }]);
    setEducationItems([{ year: "", institute: "", degree: "" }]);
    setExperienceItems([{ title: "", company: "", period: "", description: "" }]);
    setProjectItems([{ name: "", tech: "", description: "", link: "" }]);
    setCustomResumeStageContent({});
    toast.success("Resume form reset to default.");
  };

  const handleGenerate = async () => {
    if (generating || isRunning || retryAfterSeconds > 0) return;
    try {
      setGenerating(true);
      setDraft(null);
      setTemplateSpec(null);
      setStyleIntent(null);
      setProvider("");
      setValidationErrors([]);
      setGenerateError("");
      setStatus("queueing");
      const cleanedIdea = `Style preset: ${designControls.stylePreset}.`;
      const compiledControls = {
        ...designControls,
        variationSeed: `${designControls.variationSeed || ""}`.trim(),
      };
      let response;

      if (inputMode === "upload") {
        if (!resumeFile) {
          toast.error("Resume file is required.");
          return;
        }
        const allowedTypes = ["text/plain", "application/pdf"];
        const fileName = `${resumeFile?.name || ""}`.toLowerCase();
        const isAllowed =
          allowedTypes.includes(`${resumeFile?.type || ""}`) ||
          fileName.endsWith(".txt") ||
          fileName.endsWith(".pdf");
        if (!isAllowed) {
          toast.error("Only .txt and .pdf files are accepted.");
          return;
        }
        response = await generateAiTemplateFromUploadApi(resumeFile, {
          templateId,
          ideaPrompt: cleanedIdea,
          designControls: compiledControls,
        });
      } else {
        if (!visibleResumeSubStages.length) {
          toast.error("Enable at least one resume sub-stage.");
          return;
        }
        const structuredText = [
          visibleResumeSubStages.some((s) => s.key === "profile") && structuredResume.name ? `Name: ${structuredResume.name}` : "",
          visibleResumeSubStages.some((s) => s.key === "profile") && structuredResume.email ? `Email: ${structuredResume.email}` : "",
          visibleResumeSubStages.some((s) => s.key === "profile") && structuredResume.phone ? `Phone: ${structuredResume.phone}` : "",
          visibleResumeSubStages.some((s) => s.key === "profile") && structuredResume.summary ? `Summary:\n${structuredResume.summary}` : "",
          visibleResumeSubStages.some((s) => s.key === "skills")
            ? `Skills:\n${skillSections.map((section) => {
                const sectionName = `${section?.name || ""}`.trim();
                const skills = (Array.isArray(section?.skills) ? section.skills : []).map((x) => `${x || ""}`.trim()).filter(Boolean);
                if (!sectionName && !skills.length) return "";
                return [sectionName ? `Section: ${sectionName}` : "", ...skills].filter(Boolean).join("\n");
              }).filter(Boolean).join("\n\n")}`
            : "",
          visibleResumeSubStages.some((s) => s.key === "education")
            ? `Education:\n${educationItems.map((x) => `${x.year || ""} | ${x.institute || ""} | ${x.degree || ""}`.trim()).filter(Boolean).join("\n")}`
            : "",
          visibleResumeSubStages.some((s) => s.key === "projects")
            ? `Experience:\n${experienceItems.map((x) => [x.title, x.company, x.period, x.description].filter(Boolean).join(" | ")).filter(Boolean).join("\n")}`
            : "",
          visibleResumeSubStages.some((s) => s.key === "projects")
            ? `Projects:\n${projectItems.map((x) => [x.name, x.tech, x.description, x.link].filter(Boolean).join(" | ")).filter(Boolean).join("\n")}`
            : "",
          ...visibleResumeSubStages.filter((stage) => stage.key.startsWith("custom-")).map((stage) => {
            const cfg = customResumeStageContent?.[stage.key];
            if (!cfg) return "";
            if (cfg.kind === "cards") {
              const cardsText = (cfg.cards || []).map((card) => [card.title, card.subtitle, card.description, card.link].filter(Boolean).join(" | ")).filter(Boolean).join("\n");
              return cardsText ? `${stage.label}:\n${cardsText}` : "";
            }
            const paragraph = `${cfg.paragraph || ""}`.trim();
            return paragraph ? `${stage.label}:\n${paragraph}` : "";
          }),
        ].filter(Boolean).join("\n\n");
        const trimmed = `${structuredText || ""}`.trim();
        if (!trimmed) {
          toast.error("Resume text is required.");
          return;
        }
        response = await generateAiTemplateFromTextApi(trimmed, {
          templateId,
          ideaPrompt: cleanedIdea,
          designControls: compiledControls,
        });
      }

      setJobId(`${response?.jobId || ""}`);
      setStatus(response?.status || "queued");
      toast.success("AI generation started.");
    } catch (error) {
      if (error?.status === 429 || error?.code === "RATE_LIMITED") {
        setGenerateError("Rate limit hit: 1 hour me max 5 AI generate requests allowed hain. Thoda wait karke retry karo.");
        setRetryAfterSeconds(30);
      } else if (error?.status === 401 || error?.code === "UNAUTHORIZED") {
        setGenerateError("Session expired. Please login again, then retry.");
      } else {
        setGenerateError(error?.message || "Failed to start AI generation.");
      }
      toast.error(error?.message || "Failed to start AI generation.");
      setStatus("failed");
    } finally {
      setGenerating(false);
    }
  };

  const handleApply = async () => {
    if (!draft) {
      toast.error("No generated draft available.");
      return;
    }
    if (!templateSpec) {
      toast.error("Template spec missing. Restart backend + AI worker, then Generate Draft again.");
      return;
    }
    try {
      setApplying(true);
      const safeSpec = JSON.parse(JSON.stringify(templateSpec));
      safeSpec.theme = safeSpec.theme || {};
      safeSpec.theme.palette = safeSpec.theme.palette || {};
      safeSpec.components = safeSpec.components || {};
      safeSpec.components.visuals = safeSpec.components.visuals || {};
      safeSpec.theme.palette.primary = designControls.primaryColor || safeSpec.theme.palette.primary;
      safeSpec.theme.palette.secondary = designControls.secondaryColor || safeSpec.theme.palette.secondary;
      safeSpec.theme.palette.accent = designControls.accentColor || safeSpec.theme.palette.accent;
      safeSpec.theme.palette.background = designControls.backgroundColor || safeSpec.theme.palette.background;
      safeSpec.theme.palette.surface = designControls.surfaceColor || safeSpec.theme.palette.surface;
      if (designControls.themeMode === "light" || designControls.themeMode === "dark") {
        safeSpec.theme.palette.mode = designControls.themeMode;
      }
      safeSpec.components.visuals.enabled = designControls.graphics === "yes";
      await applyAiTemplateApi(draft, safeSpec, jobId);
      toast.success("AI draft applied.");
      navigate(applyRedirectPath, { state: { focusStage: "publish", fromAiApply: true } });
    } catch (error) {
      toast.error(error?.message || "Failed to apply AI draft.");
    } finally {
      setApplying(false);
    }
  };

  const handleCopyJobId = async () => {
    if (!jobId) return;
    try {
      await navigator.clipboard.writeText(jobId);
      toast.success("Job ID copied.");
    } catch {
      toast.error("Unable to copy Job ID.");
    }
  };

  return {
    handleToggleResumeSubStage,
    handleAddResumeSubStage,
    handleResetResumeForm,
    handleGenerate,
    handleApply,
    handleCopyJobId,
  };
};

