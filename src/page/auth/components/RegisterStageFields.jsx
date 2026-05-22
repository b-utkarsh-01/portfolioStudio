import { inputClassName } from "../registerStages";

const RegisterStageFields = ({ activeStage, values, handlers }) => {
  const {
    username,
    password,
    email,
    phone,
    displayName,
    titles,
    summary,
    github,
    githubHref,
    badgeTitle,
  } = values;
  const {
    onUsernameChange,
    onPasswordChange,
    onEmailChange,
    onPhoneChange,
    onDisplayNameChange,
    onTitlesChange,
    onSummaryChange,
    onGithubChange,
    onGithubHrefChange,
    onBadgeTitleChange,
  } = handlers;

  if (activeStage === "account") {
    return (
      <>
        <label className="block text-sm text-slate-200">
          Username
          <input value={username} onChange={onUsernameChange} placeholder="yourname" autoComplete="username" className={inputClassName} />
        </label>
        <label className="block text-sm text-slate-200">
          Password
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
          Display Name
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
    <>
      <label className="block text-sm text-slate-200">
        GitHub/Website Text (optional)
        <input value={github} onChange={onGithubChange} placeholder="github.com/username or yoursite.com" className={inputClassName} />
      </label>
      <label className="block text-sm text-slate-200">
        GitHub/Website Link (optional)
        <input value={githubHref} onChange={onGithubHrefChange} placeholder="https://github.com/username" className={inputClassName} />
      </label>
      <label className="block text-sm text-slate-200">
        Badge Title (optional)
        <input value={badgeTitle} onChange={onBadgeTitleChange} placeholder="Portfolio Studio User" className={inputClassName} />
      </label>
    </>
  );
};

export default RegisterStageFields;
