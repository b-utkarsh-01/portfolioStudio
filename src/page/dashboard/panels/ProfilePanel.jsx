import Field from "../Field";
import { inputClassName } from "../dashboardFormConfig";
import { Trash2 } from "lucide-react";

const removeBtnClass =
  "inline-flex h-10 w-10 items-center justify-center rounded-lg border border-rose-500/70 text-rose-300 hover:bg-rose-500/20 hover:text-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400/60";

const getTitles = (titles) => {
  const list = `${titles ?? ""}`.split("\n");
  if (!list.length) return [""];
  return list;
};

const ProfilePanel = ({ form, onFieldChange }) => {
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
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name"><input value={form.name} onChange={onFieldChange("name")} className={inputClassName} /></Field>
        <Field label="Avatar Image URL"><input value={form.avatar} onChange={onFieldChange("avatar")} className={inputClassName} placeholder="https://example.com/avatar.jpg" /></Field>
      </div>

      <section className="rounded-xl border border-slate-700 bg-slate-900/30 p-4">
        <div className="mb-3">
          <div>
            <p className="text-sm font-semibold text-slate-100">Titles</p>
            <p className="text-xs text-slate-400">Add role titles one by one.</p>
          </div>
        </div>
        <div className="space-y-3">
          {(titles.length ? titles : [""]).map((title, index) => (
            <div key={`title-${index}`} className="flex items-center gap-2">
              <input
                value={title}
                onChange={(event) => changeTitle(index, event.target.value)}
                placeholder="Title (e.g., Full Stack Developer)"
                className={`${inputClassName} mt-0`}
              />
              <button
                type="button"
                onClick={() => removeTitle(index)}
                className={removeBtnClass}
                title="Remove title"
                aria-label="Remove title"
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
            className="w-full rounded-lg border border-cyan-400/60 px-3 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/10"
          >
            + Add Title
          </button>
        </div>
      </section>

      <Field label="Summary"><textarea value={form.summary} onChange={onFieldChange("summary")} rows={3} className={inputClassName} /></Field>
      <Field label="Highlights (comma separated)"><input value={form.highlights} onChange={onFieldChange("highlights")} className={inputClassName} /></Field>
    </>
  );
};

export default ProfilePanel;

