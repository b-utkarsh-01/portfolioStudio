import Field from "./Field";
import { inputClassName } from "./dashboardFormConfig";

const CustomStageEditor = ({ activeStageKey, activeCustomStage, onCustomStageChange }) => {
  const updateCardField = (cardIndex, field, value) => {
    const cards = Array.isArray(activeCustomStage?.cards) ? activeCustomStage.cards : [];
    const nextCards = cards.map((card, index) => (index === cardIndex ? { ...card, [field]: value } : card));
    onCustomStageChange?.(activeStageKey, { cards: nextCards });
  };

  const addCard = () => {
    const cards = Array.isArray(activeCustomStage?.cards) ? activeCustomStage.cards : [];
    onCustomStageChange?.(activeStageKey, {
      cards: [...cards, { title: "", subtitle: "", description: "", link: "", image: "" }],
    });
  };

  const removeCard = (cardIndex) => {
    const cards = Array.isArray(activeCustomStage?.cards) ? activeCustomStage.cards : [];
    onCustomStageChange?.(activeStageKey, {
      cards: cards.filter((_, index) => index !== cardIndex),
    });
  };

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
      {(activeCustomStage?.kind || "paragraph") === "paragraph" ? (
        <Field label="Paragraph Content">
          <textarea
            value={activeCustomStage?.paragraph || ""}
            onChange={(event) => onCustomStageChange?.(activeStageKey, { paragraph: event.target.value })}
            rows={6}
            placeholder="Write your custom stage content here..."
            className={inputClassName}
          />
        </Field>
      ) : (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-slate-200">Cards</p>
          {(Array.isArray(activeCustomStage?.cards) ? activeCustomStage.cards : []).length === 0 ? (
            <div className="rounded-lg border border-slate-700 bg-slate-950/40 p-3 text-sm text-slate-400">
              No cards yet. Click <span className="text-emerald-300">+ Add Card</span>.
            </div>
          ) : null}
          {(Array.isArray(activeCustomStage?.cards) ? activeCustomStage.cards : []).map((card, index) => (
            <div key={`${activeStageKey}-card-${index}`} className="space-y-3 rounded-xl border border-slate-700 bg-slate-950/40 p-3">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-wide text-slate-400">Card {index + 1}</p>
                <button
                  type="button"
                  onClick={() => removeCard(index)}
                  className="rounded-md border border-rose-500/60 px-2 py-1 text-xs text-rose-300 hover:bg-rose-500/10"
                >
                  Delete
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Title">
                  <input
                    value={card?.title || ""}
                    onChange={(event) => updateCardField(index, "title", event.target.value)}
                    placeholder="e.g. Feature 1"
                    className={inputClassName}
                  />
                </Field>
                <Field label="Subtitle">
                  <input
                    value={card?.subtitle || ""}
                    onChange={(event) => updateCardField(index, "subtitle", event.target.value)}
                    placeholder="e.g. Quick summary"
                    className={inputClassName}
                  />
                </Field>
              </div>
              <Field label="Description">
                <textarea
                  value={card?.description || ""}
                  onChange={(event) => updateCardField(index, "description", event.target.value)}
                  rows={3}
                  placeholder="Describe this card content..."
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
              <Field label="Image URL (optional)">
                <input
                  value={card?.image || ""}
                  onChange={(event) => updateCardField(index, "image", event.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className={inputClassName}
                />
              </Field>
            </div>
          ))}
          <button
            type="button"
            onClick={addCard}
            className="w-full rounded-md border border-emerald-500/60 px-3 py-2 text-sm font-medium text-emerald-300 hover:bg-emerald-500/10"
          >
            + Add Card
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomStageEditor;
