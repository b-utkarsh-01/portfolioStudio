import { Link } from "react-router-dom";
import Field from "./Field";

const inputClassName =
  "mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-orange-400";

const DashboardForm = ({
  form,
  onSubmit,
  onFieldChange,
  onTemplateChange,
  urlDataPortfolioPath,
  savedAt,
  statusMessage,
}) => (
  <form onSubmit={onSubmit} className="space-y-6">
    <div className="rounded-2xl border border-slate-700 bg-slate-950/40 p-4">
      <h2 className="mb-3 text-lg text-slate-100">Template</h2>
      <label className="inline-flex items-center gap-2 text-sm text-slate-200">
        <input type="radio" checked={form.templateId === "portfolio-v1"} onChange={onTemplateChange} />
        Classic Portfolio (current design)
      </label>
    </div>

    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Name">
        <input
          value={form.name}
          onChange={onFieldChange("name")}
          placeholder="e.g. Utkarsh Pathak"
          className={inputClassName}
        />
      </Field>
      <Field label="Badge Name ( For Nav Bar )">
        <input
          value={form.badgeName}
          onChange={onFieldChange("badgeName")}
          placeholder="e.g. Utkarsh"
          className={inputClassName}
        />
      </Field>
      <Field label="Badge Logo">
        <input
          value={form.badgeLogo}
          onChange={onFieldChange("badgeLogo")}
          placeholder="e.g. UT"
          className={inputClassName}
        />
      </Field>
      <Field label="Badge Title">
        <input
          value={form.badgeTitle}
          onChange={onFieldChange("badgeTitle")}
          placeholder="e.g. Full Stack Builder"
          className={inputClassName}
        />
      </Field>
    </div>

    <Field label="Titles" hint="One title per line">
      <textarea
        value={form.titles}
        onChange={onFieldChange("titles")}
        rows={4}
        placeholder={"Backend Engineer\nNode.js Developer\nOpen Source Contributor"}
        className={inputClassName}
      />
    </Field>

    <Field label="Summary">
      <textarea
        value={form.summary}
        onChange={onFieldChange("summary")}
        rows={3}
        placeholder="Short intro about your experience, strengths, and what you build."
        className={inputClassName}
      />
    </Field>

    <Field label="Highlights (comma separated)">
      <input
        value={form.highlights}
        onChange={onFieldChange("highlights")}
        placeholder="Node.js, Express.js, MongoDB, React"
        className={inputClassName}
      />
    </Field>

    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Phone Text">
        <input
          value={form.phone}
          onChange={onFieldChange("phone")}
          placeholder="+91 9876543210"
          className={inputClassName}
        />
      </Field>
      <Field label="Phone Href">
        <input
          value={form.phoneHref}
          onChange={onFieldChange("phoneHref")}
          placeholder="tel:+911234567890"
          className={inputClassName}
        />
      </Field>
      <Field label="Email Text">
        <input
          value={form.email}
          onChange={onFieldChange("email")}
          placeholder="you@example.com"
          className={inputClassName}
        />
      </Field>
      <Field label="Email Href">
        <input
          value={form.emailHref}
          onChange={onFieldChange("emailHref")}
          placeholder="mailto:you@example.com"
          className={inputClassName}
        />
      </Field>
      <Field label="GitHub Text">
        <input
          value={form.github}
          onChange={onFieldChange("github")}
          placeholder="github.com/your-username"
          className={inputClassName}
        />
      </Field>
      <Field label="GitHub Link">
        <input
          value={form.githubHref}
          onChange={onFieldChange("githubHref")}
          placeholder="https://github.com/username"
          className={inputClassName}
        />
      </Field>
    </div>

    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Programming Skills">
        <input
          value={form.skillsProgramming}
          onChange={onFieldChange("skillsProgramming")}
          placeholder="C, C++, JavaScript, Python"
          className={inputClassName}
        />
      </Field>
      <Field label="Frontend Skills">
        <input
          value={form.skillsFrontend}
          onChange={onFieldChange("skillsFrontend")}
          placeholder="React.js, HTML, CSS, Tailwind CSS"
          className={inputClassName}
        />
      </Field>
      <Field label="Backend Skills">
        <input
          value={form.skillsBackend}
          onChange={onFieldChange("skillsBackend")}
          placeholder="Node.js, Express.js"
          className={inputClassName}
        />
      </Field>
      <Field label="Databases">
        <input
          value={form.skillsDatabases}
          onChange={onFieldChange("skillsDatabases")}
          placeholder="MongoDB, MySQL, PostgreSQL"
          className={inputClassName}
        />
      </Field>
      <Field label="API Skills">
        <input
          value={form.skillsApi}
          onChange={onFieldChange("skillsApi")}
          placeholder="REST APIs, JWT Auth, CRUD Operations"
          className={inputClassName}
        />
      </Field>
      <Field label="Cloud & Tools">
        <input
          value={form.skillsCloud}
          onChange={onFieldChange("skillsCloud")}
          placeholder="AWS, Docker, Firebase, Git"
          className={inputClassName}
        />
      </Field>
    </div>

    <Field
      label="Additional Skill Groups"
      hint="Format: Group Name | skill1, skill2 (one group per line)"
    >
      <textarea
        value={form.skillsAdditional}
        onChange={onFieldChange("skillsAdditional")}
        rows={4}
        placeholder={"DevOps | Docker, Kubernetes, CI/CD\nAI Tools | LangChain, FAISS"}
        className={inputClassName}
      />
    </Field>

    <Field label="Education" hint="Format: subtitle | institute | degree (one per line)">
      <textarea
        value={form.education}
        onChange={onFieldChange("education")}
        rows={3}
        placeholder="Expected Graduation: June 2026 | SVVV Indore | B.Tech CSE"
        className={inputClassName}
      />
    </Field>

    <Field label="Experiences" hint="Format: title | company | period | description (one per line)">
      <textarea
        value={form.experiences}
        onChange={onFieldChange("experiences")}
        rows={5}
        placeholder={
          "Intern | ABC Pvt Ltd | Jan 2025 - Mar 2025 | Built APIs for user management\nOrganizer | VoidHack | 2023 - 2024 | Coordinated national-level hackathon"
        }
        className={inputClassName}
      />
    </Field>

    <Field label="Projects" hint="Format: name | tech | description | link (one per line)">
      <textarea
        value={form.projects}
        onChange={onFieldChange("projects")}
        rows={6}
        placeholder={
          "AsyncMusic | React, Firebase | Music streaming web app | https://github.com/username/asyncmusic\nAI PDF QnA | Node.js, LangChain | Semantic search over PDFs | https://github.com/username/ai-pdf-qna"
        }
        className={inputClassName}
      />
    </Field>

    <Field label="Certifications" hint="Format: name | provider | link (one per line)">
      <textarea
        value={form.certifications}
        onChange={onFieldChange("certifications")}
        rows={4}
        placeholder={
          "Google Cloud Foundations | Google | https://example.com/certificate-1\nMERN Cohort | Sheryians | https://example.com/certificate-2"
        }
        className={inputClassName}
      />
    </Field>

    <div className="flex items-center gap-3">
      <button
        type="submit"
        className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-400"
      >
        Save Portfolio
      </button>
      {urlDataPortfolioPath ? (
        <Link
          to={urlDataPortfolioPath}
          target="_blank"
          rel="noreferrer"
          className="rounded-lg border border-cyan-400 px-4 py-2 text-sm font-semibold text-cyan-300 hover:bg-cyan-500/10"
        >
          View Portfolio (URL Data)
        </Link>
      ) : null}
      {savedAt ? <span className="text-sm text-emerald-300">Saved at {new Date(savedAt).toLocaleTimeString()}</span> : null}
      {statusMessage ? <span className="text-sm text-rose-300">{statusMessage}</span> : null}
    </div>
  </form>
);

export default DashboardForm;
