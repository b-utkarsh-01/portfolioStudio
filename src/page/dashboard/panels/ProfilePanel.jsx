import Field from "../Field";
import { inputClassName } from "../dashboardFormConfig";
import { premiumV1Template } from "../../../../../premium-templates/src";

const ProfilePanel = ({ form, onFieldChange, onTemplateChange }) => (
  <>
    <div className="rounded-2xl border border-slate-700 bg-slate-950/40 p-4">
      <h3 className="mb-3 text-sm font-semibold text-slate-100">Template</h3>
      <div className="grid gap-2 sm:grid-cols-4">
        <label className="inline-flex items-center gap-2 text-sm text-slate-200">
          <input type="radio" name="templateId" value="default-v1" checked={form.templateId === "default-v1"} onChange={onTemplateChange} />
          Default 1
        </label>
        <label className="inline-flex items-center gap-2 text-sm text-slate-200">
          <input type="radio" name="templateId" value="default-v2" checked={form.templateId === "default-v2"} onChange={onTemplateChange} />
          Default 2
        </label>
        <label className="inline-flex items-center gap-2 text-sm text-slate-200">
          <input type="radio" name="templateId" value="default-v3" checked={form.templateId === "default-v3"} onChange={onTemplateChange} />
          Default 3
        </label>
        <label className="inline-flex items-center gap-2 text-sm text-slate-200">
          <input type="radio" name="templateId" value={premiumV1Template.id} checked={form.templateId === premiumV1Template.id} onChange={onTemplateChange} />
          Premium
        </label>
      </div>
    </div>
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Name"><input value={form.name} onChange={onFieldChange("name")} className={inputClassName} /></Field>
      <Field label="Badge Name (For Nav Bar)"><input value={form.badgeName} onChange={onFieldChange("badgeName")} className={inputClassName} /></Field>
      <Field label="Badge Logo"><input value={form.badgeLogo} onChange={onFieldChange("badgeLogo")} className={inputClassName} /></Field>
      <Field label="Badge Title"><input value={form.badgeTitle} onChange={onFieldChange("badgeTitle")} className={inputClassName} /></Field>
    </div>
    <Field label="Titles" hint="One title per line"><textarea value={form.titles} onChange={onFieldChange("titles")} rows={4} className={inputClassName} /></Field>
    <Field label="Summary"><textarea value={form.summary} onChange={onFieldChange("summary")} rows={3} className={inputClassName} /></Field>
    <Field label="Highlights (comma separated)"><input value={form.highlights} onChange={onFieldChange("highlights")} className={inputClassName} /></Field>
  </>
);

export default ProfilePanel;
