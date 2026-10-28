import React from "react";
import Field from "../Field";
import { inputClassName } from "../dashboardFormConfig";
import { Trash2 } from "lucide-react";
import ImageInputWithUpload from "../../../layout/components/ImageInputWithUpload";

const getTitles = (titles) => {
  const list = `${titles ?? ""}`.split("\n");
  if (!list.length) return [""];
  return list;
};

const BioTab = ({ form, onFieldChange }) => {
  const titles = getTitles(form.titles);

  const updateTitles = (nextTitles) => {
    const normalized = nextTitles.length ? nextTitles : [""];
    const value = normalized.join("\n");
    onFieldChange("titles")({ target: { value } });
  };

  const addTitle = () => updateTitles([...titles, ""]);
  const removeTitle = (index) => updateTitles(titles.filter((_, i) => i !== index));
  const changeTitle = (index, value) =>
    updateTitles(titles.map((item, i) => (i === index ? value : item)));

  return (
    <div className="space-y-5 min-w-0">
      <div className="grid gap-4 sm:grid-cols-2 min-w-0">
        <Field label="Name">
          <input value={form.name} onChange={onFieldChange("name")} className={inputClassName} />
        </Field>
        <div className="min-w-0">
          <label className="block text-sm text-slate-200 mb-1">Avatar Image (URL or JPG Upload)</label>
          <ImageInputWithUpload
            value={form.avatar}
            onChange={onFieldChange("avatar")}
            placeholder="Paste image URL or upload JPG..."
            maxDimension={600}
          />
        </div>
      </div>

      <section className="rounded-xl border border-slate-700 bg-slate-900/30 p-3.5 sm:p-4 min-w-0">
        <div className="mb-3">
          <div>
            <p className="text-sm font-semibold text-slate-100">Titles</p>
            <p className="text-xs text-slate-400">Add role titles one by one.</p>
          </div>
        </div>
        <div className="space-y-3 min-w-0">
          {(titles.length ? titles : [""]).map((title, index) => (
            <div key={`title-${index}`} className="flex items-center gap-2 min-w-0">
              <input
                value={title}
                onChange={(event) => changeTitle(index, event.target.value)}
                placeholder="Title (e.g., Full Stack Developer)"
                className={`${inputClassName} mt-0 min-w-0 flex-1`}
              />
              <button
                type="button"
                onClick={() => removeTitle(index)}
                className="shrink-0 rounded-lg border border-rose-500/60 p-2 text-rose-300 hover:bg-rose-500/10 transition"
                title="Remove title"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <div className="mt-3">
          <button
            type="button"
            onClick={addTitle}
            className="w-full rounded-lg border border-cyan-400/60 px-3 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/10 transition"
          >
            + Add Title
          </button>
        </div>
      </section>

      <Field label="Summary">
        <textarea
          value={form.summary}
          onChange={onFieldChange("summary")}
          rows={5}
          className={inputClassName}
        />
      </Field>

      <Field label="Highlights (comma-separated)">
        <input
          value={form.highlights}
          onChange={onFieldChange("highlights")}
          className={inputClassName}
        />
      </Field>
    </div>
  );
};

export default BioTab;
