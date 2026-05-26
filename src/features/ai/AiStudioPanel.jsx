import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AiResumeInputStage from "./components/AiResumeInputStage";
import AiStageSidebar from "./components/AiStageSidebar";
import AiPortfolioIdeaStage from "./components/AiPortfolioIdeaStage";
import AiGenerateApplyStage from "./components/AiGenerateApplyStage";
import AiStageNavigation from "./components/AiStageNavigation";
import { useAiStudioEffects } from "./hooks/useAiStudioEffects";
import { useAiStudioHandlers } from "./hooks/useAiStudioHandlers";
import {
  aiStages,
  defaultDesignControls,
  defaultResumeSubStages,
  defaultStructuredResume,
  defaultThinkingMessages,
} from "./aiStudioDefaults";

const AiStudioPanel = ({ applyRedirectPath = "/dashboard" }) => {
  const navigate = useNavigate();
  const [inputMode, setInputMode] = useState("text");
  const [resumeSubStage, setResumeSubStage] = useState(0);
  const [customResumeStageCount, setCustomResumeStageCount] = useState(0);
  const [resumeFile, setResumeFile] = useState(null);
  const [designControls, setDesignControls] = useState(defaultDesignControls);
  const [templateId, setTemplateId] = useState("ai-native-v1");
  const [jobId, setJobId] = useState("");
  const [status, setStatus] = useState("");
  const [provider, setProvider] = useState("");
  const [templateSpec, setTemplateSpec] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);
  const [styleIntent, setStyleIntent] = useState(null);
  const [generateError, setGenerateError] = useState("");
  const [retryAfterSeconds, setRetryAfterSeconds] = useState(0);
  const [thinkingTick, setThinkingTick] = useState(0);
  const [structuredResume, setStructuredResume] = useState(defaultStructuredResume);
  const [skillSections, setSkillSections] = useState([{ id: "skill-sec-1", name: "", skills: [""] }]);
  const [educationItems, setEducationItems] = useState([{ year: "", institute: "", degree: "" }]);
  const [experienceItems, setExperienceItems] = useState([
    { title: "", company: "", period: "", description: "" },
  ]);
  const [projectItems, setProjectItems] = useState([{ name: "", tech: "", description: "", link: "" }]);
  const [customResumeStageContent, setCustomResumeStageContent] = useState({});
  const [draft, setDraft] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [applying, setApplying] = useState(false);
  const [stageIndex, setStageIndex] = useState(0);
  const [fileError, setFileError] = useState("");
  const stages = aiStages;
  const [resumeSubStages, setResumeSubStages] = useState(defaultResumeSubStages);
  const defaultStages = defaultResumeSubStages;
  const visibleResumeSubStages = resumeSubStages.filter((stage) => stage.enabled);
  const isPasteTextMode = stageIndex === 0 && inputMode === "text";
  const isResumeSubStageLast = resumeSubStage >= Math.max(visibleResumeSubStages.length - 1, 0);
  const statusToProgress = {
    queueing: 10,
    queued: 20,
    waiting: 25,
    active: 60,
    completed: 100,
    failed: 100,
  };
  const progress = statusToProgress[`${status || ""}`] ?? 0;
  const isRunning = ["queueing", "queued", "waiting", "active"].includes(`${status || ""}`);
  const thinkingMessages = defaultThinkingMessages;
  const thinkingLabel = thinkingMessages[thinkingTick % thinkingMessages.length];
  useAiStudioEffects({
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
  });

  const {
    handleToggleResumeSubStage,
    handleAddResumeSubStage,
    handleResetResumeForm,
    handleGenerate,
    handleApply,
    handleCopyJobId,
  } = useAiStudioHandlers({
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
  });

  const handleResumeStageLabelChange = (stageKey, nextLabel) => {
    setResumeSubStages((prev) =>
      prev.map((stage) => (stage.key === stageKey ? { ...stage, label: nextLabel } : stage))
    );
  };

  return (
    <div className="grid h-full min-h-0 overflow-hidden lg:max-h-[calc(100dvh-260px)] gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
      <AiStageSidebar stages={stages} stageIndex={stageIndex} setStageIndex={setStageIndex} />

      <div className="grid h-full min-h-0 grid-rows-[minmax(0,1fr)_auto] rounded-2xl border border-slate-700 bg-slate-900/60 p-4">
        <div className="frontend-scrollbar min-h-0 overflow-y-auto pr-1">
                    {stageIndex === 0 ? (
            <AiResumeInputStage
              inputMode={inputMode}
              setInputMode={setInputMode}
              resumeFile={resumeFile}
              setResumeFile={setResumeFile}
              fileError={fileError}
              setFileError={setFileError}
              handleResetResumeForm={handleResetResumeForm}
              resumeSubStages={resumeSubStages}
              visibleResumeSubStages={visibleResumeSubStages}
              resumeSubStage={resumeSubStage}
              setResumeSubStage={setResumeSubStage}
              handleToggleResumeSubStage={handleToggleResumeSubStage}
              handleAddResumeSubStage={handleAddResumeSubStage}
              structuredResume={structuredResume}
              setStructuredResume={setStructuredResume}
              skillSections={skillSections}
              setSkillSections={setSkillSections}
              educationItems={educationItems}
              setEducationItems={setEducationItems}
              experienceItems={experienceItems}
              setExperienceItems={setExperienceItems}
              projectItems={projectItems}
              setProjectItems={setProjectItems}
              customResumeStageContent={customResumeStageContent}
              setCustomResumeStageContent={setCustomResumeStageContent}
              handleResumeStageLabelChange={handleResumeStageLabelChange}
              isResumeSubStageLast={isResumeSubStageLast}
            />
          ) : null}
          {stageIndex === 1 ? (
            <AiPortfolioIdeaStage
              designControls={designControls}
              setDesignControls={setDesignControls}
            />
          ) : null}

          {stageIndex === 2 ? (
            <AiGenerateApplyStage
              jobId={jobId}
              status={status}
              provider={provider}
              progress={progress}
              isRunning={isRunning}
              thinkingLabel={thinkingLabel}
              thinkingTick={thinkingTick}
              validationErrors={validationErrors}
              styleIntent={styleIntent}
              handleCopyJobId={handleCopyJobId}
              handleGenerate={handleGenerate}
              generating={generating}
              retryAfterSeconds={retryAfterSeconds}
              handleApply={handleApply}
              draft={draft}
              applying={applying}
              generateError={generateError}
            />
          ) : null}
        </div>

        <AiStageNavigation
          isPasteTextMode={isPasteTextMode}
          isResumeSubStageLast={isResumeSubStageLast}
          stageIndex={stageIndex}
          setStageIndex={setStageIndex}
          stages={stages}
        />
      </div>
    </div>
  );
};

export default AiStudioPanel;

