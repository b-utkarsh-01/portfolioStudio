import { useEffect } from "react";
import { toast } from "react-toastify";
import { getAiTemplateJobStatusApi } from "../aiApi";
import { getMyPortfolioApi } from "../../portfolio/portfolioApi";

export const useAiStudioEffects = ({
  setTemplateId,
  setDesignControls,
  setInputMode,
  setStructuredResume,
  setResumeSubStages,
  setCustomResumeStageCount,
  setSkillSections,
  setEducationItems,
  setExperienceItems,
  setProjectItems,
  setCustomResumeStageContent,
  jobId,
  setStatus,
  setDraft,
  setTemplateSpec,
  setStyleIntent,
  setProvider,
  setValidationErrors,
  isRunning,
  setThinkingTick,
  retryAfterSeconds,
  setRetryAfterSeconds,
  visibleResumeSubStages,
  resumeSubStage,
  setResumeSubStage,
}) => {
  useEffect(() => {
    let cancelled = false;
    const loadCurrentTemplate = async () => {
      try {
        await getMyPortfolioApi();
        if (!cancelled) setTemplateId("ai-native-v1");
      } catch {
        // keep local default
      }
    };
    loadCurrentTemplate();
    return () => {
      cancelled = true;
    };
  }, [setTemplateId]);

  useEffect(() => {
    let cancelled = false;
    const loadTestSeed = async () => {
      try {
        const response = await fetch("/ai-studio-test-seed.json", { cache: "no-store" });
        if (!response.ok) return;
        const seed = await response.json();
        if (cancelled || !seed || typeof seed !== "object") return;

        if (seed.templateId) setTemplateId(`${seed.templateId}`);
        if (seed.designControls && typeof seed.designControls === "object") {
          setDesignControls((prev) => ({ ...prev, ...seed.designControls }));
        }
        if (seed.inputMode === "upload" || seed.inputMode === "text") setInputMode(seed.inputMode);
        if (seed.structuredResume && typeof seed.structuredResume === "object") {
          setStructuredResume((prev) => ({ ...prev, ...seed.structuredResume }));
        }
        if (Array.isArray(seed.resumeSubStages) && seed.resumeSubStages.length) {
          const sanitized = seed.resumeSubStages
            .map((stage, index) => ({
              key: `${stage?.key || `custom-${index + 1}`}`.trim(),
              label: `${stage?.label || `Stage ${index + 1}`}`.trim(),
              enabled: stage?.enabled !== false,
            }))
            .filter((stage) => stage.key);
          if (sanitized.length) setResumeSubStages(sanitized);
          setCustomResumeStageCount(
            sanitized.filter((stage) => stage.key.startsWith("custom-")).length
          );
        }
        if (Array.isArray(seed.skillSections) && seed.skillSections.length) {
          setSkillSections(
            seed.skillSections.map((section, index) => ({
              id: `${section?.id || `skill-sec-${index + 1}`}`,
              name: `${section?.name || ""}`,
              skills: Array.isArray(section?.skills) && section.skills.length ? section.skills : [""],
            }))
          );
        }
        if (Array.isArray(seed.educationItems) && seed.educationItems.length) {
          setEducationItems(
            seed.educationItems.map((item) => ({
              year: `${item?.year || ""}`,
              institute: `${item?.institute || ""}`,
              degree: `${item?.degree || ""}`,
            }))
          );
        }
        if (Array.isArray(seed.experienceItems) && seed.experienceItems.length) {
          setExperienceItems(
            seed.experienceItems.map((item) => ({
              title: `${item?.title || ""}`,
              company: `${item?.company || ""}`,
              period: `${item?.period || ""}`,
              description: `${item?.description || ""}`,
            }))
          );
        }
        if (Array.isArray(seed.projectItems) && seed.projectItems.length) {
          setProjectItems(
            seed.projectItems.map((item) => ({
              name: `${item?.name || ""}`,
              tech: `${item?.tech || ""}`,
              description: `${item?.description || ""}`,
              link: `${item?.link || ""}`,
            }))
          );
        }
        if (seed.customResumeStageContent && typeof seed.customResumeStageContent === "object") {
          setCustomResumeStageContent(seed.customResumeStageContent);
        }
      } catch {
        // optional file
      }
    };
    loadTestSeed();
    return () => {
      cancelled = true;
    };
  }, [
    setCustomResumeStageContent,
    setCustomResumeStageCount,
    setDesignControls,
    setEducationItems,
    setExperienceItems,
    setInputMode,
    setProjectItems,
    setResumeSubStages,
    setSkillSections,
    setStructuredResume,
    setTemplateId,
  ]);

  useEffect(() => {
    if (!jobId) return undefined;
    let timer;
    let cancelled = false;
    const poll = async () => {
      try {
        const statusRes = await getAiTemplateJobStatusApi(jobId);
        if (cancelled) return;
        const nextStatus = `${statusRes?.status || ""}`;
        setStatus(nextStatus);
        if (nextStatus === "completed") {
          setDraft(statusRes?.result?.draftPortfolio || null);
          setTemplateSpec(statusRes?.result?.templateSpec || null);
          setStyleIntent(statusRes?.result?.styleIntent || null);
          setProvider(`${statusRes?.result?.provider || ""}`);
          setValidationErrors(
            Array.isArray(statusRes?.result?.validationErrors) ? statusRes.result.validationErrors : []
          );
          return;
        }
        if (nextStatus === "failed") {
          toast.error(statusRes?.failedReason || "AI job failed.");
          return;
        }
        timer = setTimeout(poll, 1500);
      } catch (error) {
        if (!cancelled) toast.error(error?.message || "Failed to fetch AI job status.");
      }
    };
    poll();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [jobId, setDraft, setProvider, setStatus, setStyleIntent, setTemplateSpec, setValidationErrors]);

  useEffect(() => {
    if (!isRunning) return undefined;
    const timer = setInterval(() => setThinkingTick((prev) => prev + 1), 1200);
    return () => clearInterval(timer);
  }, [isRunning, setThinkingTick]);

  useEffect(() => {
    if (!retryAfterSeconds) return undefined;
    const timer = setInterval(() => {
      setRetryAfterSeconds((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [retryAfterSeconds, setRetryAfterSeconds]);

  useEffect(() => {
    if (!visibleResumeSubStages.length) {
      setResumeSubStage(0);
      return;
    }
    if (resumeSubStage > visibleResumeSubStages.length - 1) {
      setResumeSubStage(visibleResumeSubStages.length - 1);
    }
  }, [resumeSubStage, setResumeSubStage, visibleResumeSubStages]);
};

