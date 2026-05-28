const useCustomStageFormState = (setForm) => {
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

  return {
    updateStageTitle,
    toggleStageEnabled,
    addCustomStage,
    updateCustomStage,
  };
};

export default useCustomStageFormState;
