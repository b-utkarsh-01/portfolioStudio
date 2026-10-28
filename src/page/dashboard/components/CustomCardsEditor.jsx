import React from "react";
import Field from "../Field";
import { inputClassName } from "../dashboardFormConfig";
import { Trash2 } from "lucide-react";
import ImageInputWithUpload from "../../../layout/components/ImageInputWithUpload";

const CustomCardsEditor = ({ activeStageKey, activeCustomStage, onCustomStageChange }) => {
  const cards = Array.isArray(activeCustomStage?.cards) ? activeCustomStage.cards : [];

  const updateCardField = (cardIndex, field, value) => {
    const nextCards = cards.map((card, index) => {
      if (index !== cardIndex) return card;
      return { ...card, [field]: value };
    });
    onCustomStageChange?.(activeStageKey, { ...activeCustomStage, kind: "cards", cards: nextCards });
  };

  const addCard = () => {
    onCustomStageChange?.(activeStageKey, {
      ...activeCustomStage,
      kind: "cards",
      cards: [...cards, { title: "", subtitle: "", description: "", link: "", image: "" }],
    });
  };

  const removeCard = (cardIndex) => {
    onCustomStageChange?.(activeStageKey, {
      ...activeCustomStage,
      kind: "cards",
      cards: cards.filter((_, index) => index !== cardIndex),
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-100">Cards Section</h3>
          <p className="text-xs text-slate-400">Add cards with title, description, link and image.</p>
        </div>
        <button
          type="button"
          onClick={addCard}
          className="rounded-lg border border-cyan-400/60 px-3 py-1.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/10"
        >
          + Add Card
        </button>
      </div>

      {cards.map((card, index) => (
        <div key={`${activeStageKey}-card-${index}`} className="rounded-xl border border-slate-700 bg-slate-900/30 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Card {index + 1}</span>
            <button
              type="button"
              onClick={() => removeCard(index)}
              className="rounded-lg border border-rose-500/60 p-1.5 text-rose-300 hover:bg-rose-500/10"
              title="Remove card"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <Field label="Title">
            <input
              value={card?.title || ""}
              onChange={(event) => updateCardField(index, "title", event.target.value)}
              placeholder="Card Title"
              className={inputClassName}
            />
          </Field>
          <Field label="Subtitle (optional)">
            <input
              value={card?.subtitle || ""}
              onChange={(event) => updateCardField(index, "subtitle", event.target.value)}
              placeholder="Subtitle / Metric"
              className={inputClassName}
            />
          </Field>
          <Field label="Description">
            <textarea
              rows={3}
              value={card?.description || ""}
              onChange={(event) => updateCardField(index, "description", event.target.value)}
              placeholder="Card description text"
              className={inputClassName}
            />
          </Field>
          <Field label="Link (optional)">
            <input
              value={card?.link || ""}
              onChange={(event) => updateCardField(index, "link", event.target.value)}
              placeholder="https://example.com"
              className={inputClassName}
            />
          </Field>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Image (URL or JPG Upload)
            </label>
            <ImageInputWithUpload
              value={card?.image || ""}
              onChange={(event) => updateCardField(index, "image", event.target.value)}
              placeholder="https://example.com/image.jpg or upload JPG..."
              maxDimension={800}
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={addCard}
        className="w-full rounded-lg border border-cyan-400/60 px-3 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/10"
      >
        + Add Card
      </button>
    </div>
  );
};

export default CustomCardsEditor;
