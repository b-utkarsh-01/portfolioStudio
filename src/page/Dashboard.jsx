import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import DashboardForm from "./dashboard/DashboardForm";
import DashboardHeader from "./dashboard/DashboardHeader";
// import PublicPortfolioUrlCard from "./dashboard/PublicPortfolioUrlCard";
import PublishModal from "./dashboard/PublishModal";
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

  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [savedRecently, setSavedRecently] = useState(false);

  const handleQuickSave = async (e) => {
    await handlers.handleSave(e);
    setSavedRecently(true);
    setTimeout(() => setSavedRecently(false), 2500);
  };

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-170px)] w-full min-w-0 flex-col rounded-2xl sm:rounded-3xl border border-slate-700 bg-slate-900/60 p-3 sm:p-5 sm:min-h-[calc(100dvh-150px)] lg:h-[calc(100dvh-150px)] lg:min-h-0 lg:overflow-hidden">
      {/* Studio Header with permanent Save & Publish access */}
      <DashboardHeader
        username={currentUser?.username}
        profileUrl={profileUrl}
        onLogout={handlers.handleLogout}
        onSave={handleQuickSave}
        onOpenPublish={() => setPublishModalOpen(true)}
        isPublished={publishStatus?.status === "published"}
        savedRecently={savedRecently}
      />

      {/* {savedAt || publishStatus?.status === "published" ? (
        <PublicPortfolioUrlCard
          publicPortfolioUrl={publicPortfolioUrl}
          onCopy={handlers.handleCopyPublicUrl}
          onOpenPublish={() => setPublishModalOpen(true)}
        />
      ) : null} */}

      <div className="min-h-0 flex-1 w-full min-w-0 lg:overflow-hidden">
        <DashboardForm
          form={form}
          initialStageKey={location.state?.focusStage || ""}
          onSubmit={handleQuickSave}
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
          onOpenPublish={() => setPublishModalOpen(true)}
        />
      </div>

      {/* Global Publish & Go Live Modal */}
      <PublishModal
        isOpen={publishModalOpen}
        onClose={() => setPublishModalOpen(false)}
        form={form}
        onFieldChange={handlers.updateField}
        onPublish={handlers.handlePublish}
        onUnpublish={handlers.handleUnpublish}
        publishing={publishing}
        unpublishing={unpublishing}
        publishStatus={publishStatus}
        publicPortfolioUrl={publicPortfolioUrl}
        onCopyUrl={handlers.handleCopyPublicUrl}
      />
    </div>
  );
};

export default Dashboard;
