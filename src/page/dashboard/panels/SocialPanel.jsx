import Field from "../Field";
import { inputClassName } from "../dashboardFormConfig";

const SocialPanel = ({ form, onFieldChange }) => (
  <>
    <Field label="Services (non-tech friendly)" hint="Format: service name | description (one per line)">
      <textarea value={form.services} onChange={onFieldChange("services")} rows={4} className={inputClassName} />
    </Field>
    <Field label="Testimonials" hint="Format: name | role/company | quote (one per line)">
      <textarea value={form.testimonials} onChange={onFieldChange("testimonials")} rows={4} className={inputClassName} />
    </Field>
  </>
);

export default SocialPanel;
