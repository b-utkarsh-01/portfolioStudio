import { inputClassName } from "../registerStages";
import { Trash2 } from "lucide-react";

const RegisterStageFields = ({ activeStage, values, handlers }) => {
  const {
    username,
    password,
    email,
    phone,
    displayName,
    titles,
    summary,
    links,
  } = values;
  const {
    onUsernameChange,
    onPasswordChange,
    onEmailChange,
    onPhoneChange,
    onDisplayNameChange,
    onTitlesChange,
    onSummaryChange,
    onLinkAdd,
    onLinkRemove,
    onLinkChange,
  } = handlers;

  if (activeStage === "account") {
    return (
      <>
        <label className="block text-sm text-slate-200">
          Username <span className="text-orange-300">*</span>
          <input value={username} onChange={onUsernameChange} placeholder="yourname" autoComplete="username" className={inputClassName} />
        </label>
        <label className="block text-sm text-slate-200">
          Password <span className="text-orange-300">*</span>
          <input type="password" value={password} onChange={onPasswordChange} autoComplete="new-password" className={inputClassName} />
        </label>
      </>
    );
  }

  if (activeStage === "contact") {
    return (
      <>
        <label className="block text-sm text-slate-200">
          Contact Email <span className="text-orange-300">*</span>
          <input type="email" value={email} onChange={onEmailChange} placeholder="you@example.com" autoComplete="email" className={inputClassName} />
        </label>
        <label className="block text-sm text-slate-200">
          Contact Phone (optional)
          <input value={phone} onChange={onPhoneChange} placeholder="+91 9876543210" autoComplete="tel" className={inputClassName} />
        </label>
      </>
    );
  }

  if (activeStage === "profile") {
    return (
      <>
        <label className="block text-sm text-slate-200">
          Display Name <span className="text-orange-300">*</span>
          <input value={displayName} onChange={onDisplayNameChange} placeholder="Your Name" autoComplete="name" className={inputClassName} />
        </label>
        <label className="block text-sm text-slate-200">
          Titles (optional)
          <input value={titles} onChange={onTitlesChange} placeholder="Product Designer, Brand Strategist" className={inputClassName} />
        </label>
        <label className="block text-sm text-slate-200">
          Short Summary (optional)
          <textarea value={summary} onChange={onSummaryChange} rows={3} placeholder="I help businesses communicate clearly through design and storytelling." className={inputClassName} />
        </label>
      </>
    );
  }

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-3">
      <div className="mb-3">
        <div>
          <h3 className="text-base font-semibold text-slate-100">Links (optional)</h3>
          <p className="text-sm text-slate-400">Add GitHub, website, LinkedIn or any profile links.</p>
        </div>
      </div>

      <div className="space-y-3">
        {(Array.isArray(links) ? links : []).map((item) => (
          <div key={item.id} className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_auto]">
            <input
              value={item.text || ""}
              onChange={(event) => onLinkChange(item.id, "text", event.target.value)}
              placeholder="Display text (e.g., github.com/username)"
              className={`${inputClassName} mt-0`}
            />
            <input
              value={item.href || ""}
              onChange={(event) => onLinkChange(item.id, "href", event.target.value)}
              placeholder="Link (e.g., https://github.com/username)"
              className={`${inputClassName} mt-0`}
            />
            <button
              type="button"
              onClick={() => onLinkRemove(item.id)}
              className="inline-flex items-center justify-center rounded-lg border border-rose-500 px-3 py-2 text-rose-300 hover:bg-rose-500/10 hover:text-rose-200"
              title="Remove Link"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-3">
        <button
          type="button"
          onClick={onLinkAdd}
          className="inline-flex w-full items-center justify-center rounded-lg border border-cyan-400 px-3 py-2 text-sm font-semibold text-cyan-300 hover:bg-cyan-500/10"
        >
          + Add Link
        </button>
      </div>
    </div>
  );
};

export default RegisterStageFields;
