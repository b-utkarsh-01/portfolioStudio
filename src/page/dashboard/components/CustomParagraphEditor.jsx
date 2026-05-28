import React from "react";
import Field from "../Field";
import { inputClassName } from "../dashboardFormConfig";

const CustomParagraphEditor = ({ activeStageKey, activeCustomStage, onCustomStageChange }) => {
  return (
    <Field label="Paragraph Content">
      <textarea
        value={activeCustomStage?.paragraph || ""}
        onChange={(event) => onCustomStageChange?.(activeStageKey, { paragraph: event.target.value })}
        rows={6}
        placeholder="Write your custom stage content here..."
        className={inputClassName}
      />
    </Field>
  );
};

export default CustomParagraphEditor;
