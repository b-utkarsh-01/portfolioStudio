import React from "react";
import { useLocation } from "react-router-dom";
import DashboardForm from "./dashboard/DashboardForm";
import DashboardHeader from "./dashboard/DashboardHeader";
import PublicPortfolioUrlCard from "./dashboard/PublicPortfolioUrlCard";
import useDashboardState from "./dashboard/useDashboardState";

const Dashboard = () => {
  const location = useLocation();
  const {
    currentUser,
    form,
    savedAt,
    statusDetails,
    publishing,
    unpublishing,
    publishStatus,
    profileUrl,
    urlDataPortfolioPath,
    publicPortfolioUrl,
    handlers,
  } = useDashboardState();

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-170px)] w-full flex-col rounded-3xl border border-slate-700 bg-slate-900/60 p-4 sm:min-h-[calc(100dvh-150px)] lg:h-[calc(100dvh-150px)] lg:min-h-0 lg:overflow-hidden">
      <DashboardHeader
        username={currentUser?.username}
        profileUrl={profileUrl}
        onLogout={handlers.handleLogout}
      />

      {savedAt ? (
        <PublicPortfolioUrlCard
          publicPortfolioUrl={publicPortfolioUrl}
          onCopy={handlers.handleCopyPublicUrl}
        />
      ) : null}

      <div className="min-h-0 flex-1 lg:overflow-hidden">
        <DashboardForm
          form={form}
          initialStageKey={location.state?.focusStage || ""}
          onSubmit={handlers.handleSave}
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
          onResetDefaults={handlers.resetToDefault}
          onCustomStageChange={handlers.updateCustomStage}
          urlDataPortfolioPath={urlDataPortfolioPath}
          savedAt={savedAt}
          statusDetails={statusDetails}
          onPublish={handlers.handlePublish}
          onUnpublish={handlers.handleUnpublish}
          publishing={publishing}
          unpublishing={unpublishing}
          publishStatus={publishStatus}
        />
      </div>
    </div>
  );
};

export default Dashboard;
