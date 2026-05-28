import { useState } from "react";
import { buildFormState } from "./formData";
import useSkillsFormState from "./hooks/useSkillsFormState";
import useWorkFormState from "./hooks/useWorkFormState";
import useCustomStageFormState from "./hooks/useCustomStageFormState";

const useDashboardFormState = () => {
  const [form, setForm] = useState(() => buildFormState());
  const [savedAt, setSavedAt] = useState(null);
  const [statusDetails, setStatusDetails] = useState([]);

  const updateField = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const resetToDefault = () => {
    setForm(buildFormState());
    setSavedAt(null);
    setStatusDetails([]);
  };

  const skillsState = useSkillsFormState(setForm);
  const workState = useWorkFormState(setForm);
  const customStageState = useCustomStageFormState(setForm);

  return {
    form,
    setForm,
    savedAt,
    setSavedAt,
    statusDetails,
    setStatusDetails,
    handlers: {
      updateField,
      resetToDefault,
      ...skillsState,
      ...workState,
      ...customStageState,
    },
  };
};

export default useDashboardFormState;
