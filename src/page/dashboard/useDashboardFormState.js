import { useState } from "react";
import { buildFormState } from "./formData";

const makeId = (prefix) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

const useDashboardFormState = () => {
  const [form, setForm] = useState(() => buildFormState());
  const [savedAt, setSavedAt] = useState(null);
  const [statusDetails, setStatusDetails] = useState([]);

  const updateField = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const addSkillGroup = () => {
    setForm((prev) => ({
      ...prev,
      skillsAdditionalGroups: [
        ...(Array.isArray(prev.skillsAdditionalGroups) ? prev.skillsAdditionalGroups : []),
        { id: makeId("skill-group"), name: "", skills: [""] },
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
            ? { ...group, skills: [...(Array.isArray(group.skills) ? group.skills : []), ""] }
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
        { id: makeId("work-item"), ...emptyItem },
      ],
    }));
  };

  const removeWorkItem = (collectionKey, itemId) => {
    setForm((prev) => ({
      ...prev,
      [collectionKey]: (Array.isArray(prev[collectionKey]) ? prev[collectionKey] : []).filter((item) => item.id !== itemId),
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
        { id: makeId("collection-item"), ...emptyItem },
      ],
    }));
  };

  const removeCollectionItem = (collectionKey, itemId) => {
    setForm((prev) => ({
      ...prev,
      [collectionKey]: (Array.isArray(prev[collectionKey]) ? prev[collectionKey] : []).filter((item) => item.id !== itemId),
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
      layoutStages: (prev.layoutStages || []).map((stage) => (stage.id === stageId ? { ...stage, title } : stage)),
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
      const nextStage = { id: nextId, title: `Custom Stage ${nextIndex}`, enabled: true };

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

  const resetToDefault = () => {
    setForm(buildFormState());
    setSavedAt(null);
    setStatusDetails([]);
  };

  return {
    form,
    setForm,
    savedAt,
    setSavedAt,
    statusDetails,
    setStatusDetails,
    handlers: {
      updateField,
      addSkillGroup,
      removeSkillGroup,
      updateSkillGroupName,
      addSkillToGroup,
      removeSkillFromGroup,
      updateSkillInGroup,
      addWorkItem,
      removeWorkItem,
      updateWorkItemField,
      addCollectionItem,
      removeCollectionItem,
      updateCollectionItemField,
      updateStageTitle,
      toggleStageEnabled,
      addCustomStage,
      updateCustomStage,
      resetToDefault,
    },
  };
};

export default useDashboardFormState;
