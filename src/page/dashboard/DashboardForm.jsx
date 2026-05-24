import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Field from "./Field";
import StageSidebar from "./StageSidebar";
import CustomStageEditor from "./CustomStageEditor";
import { DEFAULT_STAGES, inputClassName } from "./dashboardFormConfig";
import { StagePanels } from "./StagePanels";

const DashboardForm = ({
  form,
  onSubmit,
  onFieldChange,
  onSkillGroupAdd,
  onSkillGroupRemove,
  onSkillGroupNameChange,
  onSkillAdd,
  onSkillRemove,
  onSkillChange,
  onWorkItemAdd,
  onWorkItemRemove,
  onWorkItemChange,
  onCollectionItemAdd,
  onCollectionItemRemove,
  onCollectionItemChange,
  onStageTitleChange,
  onStageToggle,
  onAddStage,
  onResetDefaults,
  onCustomStageChange,
  urlDataPortfolioPath,
  savedAt,
  statusDetails = [],
}) => {
  const [stageIndex, setStageIndex] = useState(0);

  const stages = useMemo(
    () =>
    (Array.isArray(form.layoutStages) && form.layoutStages.length
      ? form.layoutStages.map((stage) => ({ key: stage.id, label: stage.title, enabled: stage.enabled !== false }))
      : DEFAULT_STAGES.map((stage) => ({ key: stage.key, label: stage.label, enabled: true }))),
    [form.layoutStages]
  );

  const isLastStage = stageIndex === stages.length - 1;
  const isFirstStage = stageIndex === 0;
  const stageTitle = useMemo(() => stages[stageIndex]?.label ?? "", [stageIndex, stages]);
  const stageDisplayName = useMemo(
    () => (stageTitle && stageTitle.trim().length ? stageTitle : `Stage ${stageIndex + 1}`),
    [stageIndex, stageTitle]
  );

  const activeStageKey = stages[stageIndex]?.key;
  const activeCustomStage =
    (Array.isArray(form.customStages) ? form.customStages : []).find((stage) => stage.id === activeStageKey) || null;

  const goNext = () => setStageIndex((prev) => Math.min(prev + 1, stages.length - 1));
  const goBack = () => setStageIndex((prev) => Math.max(prev - 1, 0));

  const ActivePanel = StagePanels[activeStageKey];
  const isCustomStage = !ActivePanel && stageIndex >= DEFAULT_STAGES.length;

  const handleSaveClick = () => {
    onSubmit?.();
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
      <StageSidebar
        stages={stages}
        stageIndex={stageIndex}
        setStageIndex={setStageIndex}
        onStageToggle={onStageToggle}
        onAddStage={onAddStage}
        onResetDefaults={onResetDefaults}
      />

      <section className="space-y-5 rounded-2xl border border-slate-700 bg-slate-900/50 p-4 sm:p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div className="w-full sm:max-w-lg">
            <label className="block text-sm text-slate-200">
              <span className="mb-1 flex items-center justify-between gap-2">
                <span>Stage Name</span>
                <span className="text-xs text-slate-400 sm:hidden">Step {stageIndex + 1} of {stages.length}</span>
              </span>
              <input
                value={stageTitle}
                onChange={(event) => onStageTitleChange?.(activeStageKey, event.target.value)}
                className={inputClassName}
                placeholder={stageDisplayName}
              />
            </label>
          </div>
          <p className="hidden text-xs text-slate-400 sm:block sm:self-start sm:pt-0.5">
            Step {stageIndex + 1} of {stages.length}
          </p>
        </div>

        {ActivePanel ? (
          <ActivePanel
            form={form}
            onFieldChange={onFieldChange}
            onSkillGroupAdd={onSkillGroupAdd}
            onSkillGroupRemove={onSkillGroupRemove}
            onSkillGroupNameChange={onSkillGroupNameChange}
            onSkillAdd={onSkillAdd}
            onSkillRemove={onSkillRemove}
            onSkillChange={onSkillChange}
            onWorkItemAdd={onWorkItemAdd}
            onWorkItemRemove={onWorkItemRemove}
            onWorkItemChange={onWorkItemChange}
            onCollectionItemAdd={onCollectionItemAdd}
            onCollectionItemRemove={onCollectionItemRemove}
            onCollectionItemChange={onCollectionItemChange}
          />
        ) : null}

        {isCustomStage ? (
          <CustomStageEditor
            activeStageKey={activeStageKey}
            activeCustomStage={activeCustomStage}
            onCustomStageChange={onCustomStageChange}
          />
        ) : null}

        <div className="flex flex-wrap justify-between gap-3">

          <div className="flex gap-5">
            {!isFirstStage ? (
              <button
                type="button"
                onClick={goBack}
                className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
              >
                Back
              </button>
            ) : null}

            {!isLastStage ? (
              <button
                type="button"
                onClick={goNext}
                className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-400"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSaveClick}
                className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-400"
              >
                Save Portfolio
              </button>
            )}
          </div>

          {isLastStage && savedAt && urlDataPortfolioPath ? (
            <Link
              to={urlDataPortfolioPath}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-cyan-400 px-4 py-2 text-sm font-semibold text-cyan-300 hover:bg-cyan-500/10"
            >
              View Portfolio (URL Data)
            </Link>
          ) : null}
        </div>

        {statusDetails.length ? (
          <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-3">
            <p className="text-sm font-semibold text-rose-200">Please fix the following:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-rose-200/90">
              {statusDetails.map((detail, index) => (
                <li key={`${detail}-${index}`}>{detail}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>
    </div>
  );
};

export default DashboardForm;
