import Field from "../Field";
import { inputClassName } from "../dashboardFormConfig";

const PublishPanel = ({ form, onFieldChange }) => (
  <>
    <Field label="Certifications" hint="Format: name | provider | link (one per line)">
      <textarea value={form.certifications} onChange={onFieldChange("certifications")} rows={4} className={inputClassName} />
    </Field>
    <div className="rounded-xl border border-slate-700 bg-slate-950/40 p-4">
      <p className="text-sm text-slate-300">Final step: Save your portfolio first, then preview via URL data.</p>
    </div>
  </>
);

export default PublishPanel;
