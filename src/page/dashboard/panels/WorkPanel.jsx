import React from "react";
import EducationTab from "../components/EducationTab";
import ExperienceTab from "../components/ExperienceTab";
import ProjectsTab from "../components/ProjectsTab";

const WorkPanel = ({
  form,
  onWorkItemAdd,
  onWorkItemRemove,
  onWorkItemChange,
}) => {
  return (
    <div className="space-y-5">
      <EducationTab
        form={form}
        onWorkItemAdd={onWorkItemAdd}
        onWorkItemRemove={onWorkItemRemove}
        onWorkItemChange={onWorkItemChange}
      />
      <ExperienceTab
        form={form}
        onWorkItemAdd={onWorkItemAdd}
        onWorkItemRemove={onWorkItemRemove}
        onWorkItemChange={onWorkItemChange}
      />
      <ProjectsTab
        form={form}
        onWorkItemAdd={onWorkItemAdd}
        onWorkItemRemove={onWorkItemRemove}
        onWorkItemChange={onWorkItemChange}
      />
    </div>
  );
};

export default WorkPanel;
