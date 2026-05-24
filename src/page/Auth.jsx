import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";
import AuthModeToggle from "./auth/components/AuthModeToggle";
import LoginForm from "./auth/components/LoginForm";
import RegisterForm from "./auth/components/RegisterForm";
import RegisterStageSidebar from "./auth/components/RegisterStageSidebar";
import { REGISTER_STAGES } from "./auth/registerStages";

const Auth = () => {
  const [mode, setMode] = useState("login");
  const [stageIndex, setStageIndex] = useState(0);
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [titles, setTitles] = useState("");
  const [summary, setSummary] = useState("");
  const [github, setGithub] = useState("");
  const [githubHref, setGithubHref] = useState("");
  const [badgeTitle, setBadgeTitle] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = location.state?.from?.pathname || "";
  const templateIntent = location.state?.templateId || location.state?.from?.state?.templateId || "";
  const isRegister = mode === "register";
  const isLastStage = stageIndex === REGISTER_STAGES.length - 1;
  const activeStage = REGISTER_STAGES[stageIndex]?.key;

  const stageErrors = useMemo(() => {
    const errors = {};
    if (!username.trim() || !password.trim()) errors.account = "Username and password are required.";
    if (!email.trim()) errors.contact = "Contact email is required.";
    return errors;
  }, [email, password, username]);

  const validateCurrentStage = () => {
    if (!isRegister) return true;
    if (activeStage === "account" && stageErrors.account) {
      setError(stageErrors.account);
      return false;
    }
    if (activeStage === "contact" && stageErrors.contact) {
      setError(stageErrors.contact);
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    if (event?.preventDefault) event.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Username and password are required.");
      return;
    }
    if (mode === "register" && !email.trim()) {
      setError("Contact email is required.");
      return;
    }

    const payload = {
      username: username.trim(),
      password,
      displayName: displayName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      titles: titles.trim(),
      summary: summary.trim(),
      github: github.trim(),
      githubHref: githubHref.trim(),
      badgeTitle: badgeTitle.trim(),
    };

    setSubmitting(true);
    const result = mode === "register" ? await register(payload) : await login(payload);
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error || "Authentication failed.");
      return;
    }

    const loginTarget = redirectTo || "/";
    const registerTarget = templateIntent ? "/dashboard" : "/templates?tier=default";
    const target = mode === "register" ? registerTarget : loginTarget;

    navigate(target, {
      replace: true,
      state: templateIntent ? { templateId: templateIntent, fromAuthFlow: true } : undefined,
    });
  };

  const handleCreateAccount = async () => {
    if (!isRegister || !isLastStage) return;
    await handleSubmit();
  };

  return (
    <div
      className={`mx-auto w-full rounded-3xl border border-slate-700 bg-slate-900/70 p-6 transition-all duration-300 ease-out sm:p-8 ${
        mode === "register" ? "max-w-5xl" : "max-w-md"
      }`}
    >
      <h1 className="text-2xl font-semibold text-slate-100">Portfolio Builder</h1>
      <p className="mt-2 text-sm text-slate-300">
        Sign in and publish your portfolio quickly. On registration, we prefill your dashboard
        data automatically.
      </p>

      <AuthModeToggle
        mode={mode}
        onLogin={() => {
          setMode("login");
          setError("");
        }}
        onRegister={() => {
          setMode("register");
          setStageIndex(0);
          setError("");
        }}
      />

      {mode === "login" ? (
        <LoginForm
          username={username}
          password={password}
          error={error}
          submitting={submitting}
          onUsernameChange={(event) => setUsername(event.target.value)}
          onPasswordChange={(event) => setPassword(event.target.value)}
          onSubmit={handleSubmit}
        />
      ) : (
        <div className="mt-5 grid gap-4 transition-opacity duration-300 ease-out lg:grid-cols-[150px_minmax(0,1fr)] xl:grid-cols-[170px_minmax(0,1fr)]">
          <RegisterStageSidebar
            stages={REGISTER_STAGES}
            stageIndex={stageIndex}
            onSelectStage={setStageIndex}
          />
          <RegisterForm
            stageIndex={stageIndex}
            totalStages={REGISTER_STAGES.length}
            activeStage={activeStage}
            error={error}
            submitting={submitting}
            isLastStage={isLastStage}
            onSubmit={handleSubmit}
            onCreateAccount={handleCreateAccount}
            onBack={() => {
              setError("");
              setStageIndex((prev) => Math.max(prev - 1, 0));
            }}
            onNext={() => {
              setError("");
              if (!validateCurrentStage()) return;
              setStageIndex((prev) => Math.min(prev + 1, REGISTER_STAGES.length - 1));
            }}
            values={{
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
            }}
            handlers={{
              onUsernameChange: (event) => setUsername(event.target.value),
              onPasswordChange: (event) => setPassword(event.target.value),
              onEmailChange: (event) => setEmail(event.target.value),
              onPhoneChange: (event) => setPhone(event.target.value),
              onDisplayNameChange: (event) => setDisplayName(event.target.value),
              onTitlesChange: (event) => setTitles(event.target.value),
              onSummaryChange: (event) => setSummary(event.target.value),
              onGithubChange: (event) => setGithub(event.target.value),
              onGithubHrefChange: (event) => setGithubHref(event.target.value),
              onBadgeTitleChange: (event) => setBadgeTitle(event.target.value),
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Auth;
