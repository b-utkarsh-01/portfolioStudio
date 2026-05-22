import Field from "../Field";
import { inputClassName } from "../dashboardFormConfig";

const WorkPanel = ({ form, onFieldChange }) => (
  <>
    <Field label="Education" hint="Format: subtitle | institute | degree (one per line)">
      <textarea value={form.education} onChange={onFieldChange("education")} rows={3} className={inputClassName} />
    </Field>
    <Field label="Experiences" hint="Format: title | company | period | description (one per line)">
      <textarea value={form.experiences} onChange={onFieldChange("experiences")} rows={5} className={inputClassName} />
    </Field>
    <Field label="Projects" hint="Format: name | tech | description | link (one per line)">
      <textarea value={form.projects} onChange={onFieldChange("projects")} rows={6} className={inputClassName} />
    </Field>
  </>
);

export default WorkPanel;
