import Field from "../Field";
import { inputClassName } from "../dashboardFormConfig";

const ContactPanel = ({ form, onFieldChange }) => (
  <div className="grid gap-4 sm:grid-cols-2">
    <Field label="Phone Text"><input value={form.phone} onChange={onFieldChange("phone")} className={inputClassName} /></Field>
    <Field label="Phone Href"><input value={form.phoneHref} onChange={onFieldChange("phoneHref")} className={inputClassName} /></Field>
    <Field label="Email Text"><input value={form.email} onChange={onFieldChange("email")} className={inputClassName} /></Field>
    <Field label="Email Href"><input value={form.emailHref} onChange={onFieldChange("emailHref")} className={inputClassName} /></Field>
    <Field label="GitHub Text"><input value={form.github} onChange={onFieldChange("github")} className={inputClassName} /></Field>
    <Field label="GitHub Link"><input value={form.githubHref} onChange={onFieldChange("githubHref")} className={inputClassName} /></Field>
  </div>
);

export default ContactPanel;
