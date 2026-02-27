import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";

const Auth = () => {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = location.state?.from?.pathname || "";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Username and password are required.");
      return;
    }

    const payload = {
      username: username.trim(),
      password,
      displayName: displayName.trim(),
    };

    setSubmitting(true);
    const result = mode === "register" ? await register(payload) : await login(payload);
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error || "Authentication failed.");
      return;
    }

    const resolvedUsername = result.user?.username || username.trim().toLowerCase();
    const defaultTarget = mode === "login" ? `/u/${resolvedUsername}` : "/dashboard";
    navigate(redirectTo || defaultTarget, { replace: true });
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900/70 p-6 sm:p-8">
      <h1 className="text-2xl font-semibold text-slate-100">Portfolio Builder</h1>
      <p className="mt-2 text-sm text-slate-300">
        Login karo aur apna resume data dalke template se portfolio publish karo.
      </p>

      <div className="mt-5 flex rounded-xl bg-slate-800 p-1">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`flex-1 rounded-lg px-3 py-2 text-sm ${
            mode === "login" ? "bg-orange-500 text-white" : "text-slate-300"
          }`}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => setMode("register")}
          className={`flex-1 rounded-lg px-3 py-2 text-sm ${
            mode === "register" ? "bg-orange-500 text-white" : "text-slate-300"
          }`}
        >
          Register
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <label className="block text-sm text-slate-200">
          Username
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="yourname"
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-orange-400"
          />
        </label>

        {mode === "register" ? (
          <label className="block text-sm text-slate-200">
            Display Name
            <input
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              placeholder="Your Name"
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-orange-400"
            />
          </label>
        ) : null}

        <label className="block text-sm text-slate-200">
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-orange-400"
          />
        </label>

        {error ? <p className="text-sm text-rose-300">{error}</p> : null}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-400"
        >
          {submitting ? "Please wait..." : mode === "register" ? "Create account" : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Auth;
