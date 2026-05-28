import React from "react";
import Field from "./Field";
import { inputClassName } from "./dashboardFormConfig";
import CustomParagraphEditor from "./components/CustomParagraphEditor";
import CustomCardsEditor from "./components/CustomCardsEditor";

const CustomStageEditor = ({ activeStageKey, activeCustomStage, onCustomStageChange }) => {
  const isParagraph = (activeCustomStage?.kind || "paragraph") === "paragraph";

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-950/40 p-4">
      <p className="text-sm text-slate-300">Custom stage editor</p>
      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        <Field label="Content Type">
          <select
            value={activeCustomStage?.kind || "paragraph"}
            onChange={(event) =>
              onCustomStageChange?.(activeStageKey, {
                kind: event.target.value,
                ...(event.target.value === "cards" ? { cards: activeCustomStage?.cards || [] } : {}),
              })
            }
            className={inputClassName}
          >
            <option value="paragraph">Paragraph</option>
            <option value="cards">Cards</option>
          </select>
        </Field>
      </div>

      <div className="mt-4">
        {isParagraph ? (
          <CustomParagraphEditor
            activeStageKey={activeStageKey}
            activeCustomStage={activeCustomStage}
            onCustomStageChange={onCustomStageChange}
          />
        ) : (
          <CustomCardsEditor
            activeStageKey={activeStageKey}
            activeCustomStage={activeCustomStage}
            onCustomStageChange={onCustomStageChange}
          />
        )}
      </div>
    </div>
  );
};

export default CustomStageEditor;
