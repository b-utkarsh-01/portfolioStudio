import { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../features/auth/AuthContext";
import { REGISTER_STAGES } from "../registerStages";

const useRegisterState = () => {
  const [mode, setMode] = useState("login");
  const [stageIndex, setStageIndex] = useState(0);
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [titles, setTitles] = useState("");
  const [summary, setSummary] = useState("");
  const [links, setLinks] = useState([{ id: `link-${Date.now()}`, text: "", href: "" }]);
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
    if (!displayName.trim()) errors.profile = "Display name is required.";
    if (!email.trim()) errors.contact = "Contact email is required.";
    return errors;
  }, [displayName, email, password, username]);

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
    if (activeStage === "profile" && stageErrors.profile) {
      setError(stageErrors.profile);
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
    if (mode === "register" && !displayName.trim()) {
      setError("Display name is required.");
      return;
    }

    const firstValidLink =
      (Array.isArray(links) ? links : []).find(
        (item) => `${item?.text || ""}`.trim() || `${item?.href || ""}`.trim()
      ) || null;

    const payload = {
      username: username.trim(),
      password,
      displayName: displayName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      titles: titles.trim(),
      summary: summary.trim(),
      github: `${firstValidLink?.text || ""}`.trim(),
      githubHref: `${firstValidLink?.href || ""}`.trim(),
      links: (Array.isArray(links) ? links : [])
        .map((item) => ({
          text: `${item?.text || ""}`.trim(),
          href: `${item?.href || ""}`.trim(),
        }))
        .filter((item) => item.text || item.href),
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

  const addLinkItem = () => {
    setLinks((prev) => [
      ...(Array.isArray(prev) ? prev : []),
      {
        id: `link-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
        text: "",
        href: "",
      },
    ]);
  };

  const removeLinkItem = (id) => {
    setLinks((prev) => {
      const next = (Array.isArray(prev) ? prev : []).filter((item) => item.id !== id);
      return next.length ? next : [{ id: `link-${Date.now()}`, text: "", href: "" }];
    });
  };

  const updateLinkItem = (id, field, value) => {
    setLinks((prev) =>
      (Array.isArray(prev) ? prev : []).map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const selectStage = (index) => {
    setStageIndex(index);
  };

  const handleBack = () => {
    setError("");
    setStageIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setError("");
    if (!validateCurrentStage()) return;
    setStageIndex((prev) => Math.min(prev + 1, REGISTER_STAGES.length - 1));
  };

  return {
    mode,
    setMode,
    stageIndex,
    error,
    setError,
    submitting,
    isRegister,
    isLastStage,
    activeStage,
    handleSubmit,
    handleCreateAccount,
    handleBack,
    handleNext,
    selectStage,
    values: {
      username,
      password,
      email,
      phone,
      displayName,
      titles,
      summary,
      links,
    },
    handlers: {
      onUsernameChange: (event) => setUsername(event.target.value),
      onPasswordChange: (event) => setPassword(event.target.value),
      onEmailChange: (event) => setEmail(event.target.value),
      onPhoneChange: (event) => setPhone(event.target.value),
      onDisplayNameChange: (event) => setDisplayName(event.target.value),
      onTitlesChange: (event) => setTitles(event.target.value),
      onSummaryChange: (event) => setSummary(event.target.value),
      onLinkAdd: addLinkItem,
      onLinkRemove: removeLinkItem,
      onLinkChange: updateLinkItem,
    },
  };
};

export default useRegisterState;
