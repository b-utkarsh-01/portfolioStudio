import Field from "../Field";
import { inputClassName } from "../dashboardFormConfig";

const SkillsPanel = ({ form, onFieldChange }) => (
  <>
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Programming Skills"><input value={form.skillsProgramming} onChange={onFieldChange("skillsProgramming")} className={inputClassName} /></Field>
      <Field label="Frontend Skills"><input value={form.skillsFrontend} onChange={onFieldChange("skillsFrontend")} className={inputClassName} /></Field>
      <Field label="Backend Skills"><input value={form.skillsBackend} onChange={onFieldChange("skillsBackend")} className={inputClassName} /></Field>
      <Field label="Databases"><input value={form.skillsDatabases} onChange={onFieldChange("skillsDatabases")} className={inputClassName} /></Field>
      <Field label="API Skills"><input value={form.skillsApi} onChange={onFieldChange("skillsApi")} className={inputClassName} /></Field>
      <Field label="Cloud & Tools"><input value={form.skillsCloud} onChange={onFieldChange("skillsCloud")} className={inputClassName} /></Field>
    </div>
    <Field label="Additional Skill Groups" hint="Format: Group Name | skill1, skill2 (one group per line)">
      <textarea value={form.skillsAdditional} onChange={onFieldChange("skillsAdditional")} rows={4} className={inputClassName} />
    </Field>
  </>
);

export default SkillsPanel;
