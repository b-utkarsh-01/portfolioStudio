import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { resetPasswordApi } from "../features/auth/authApi";
import { inputClassName } from "./auth/registerStages";
import { KeyRound, Eye, EyeOff, CheckCircle2, ArrowLeft } from "lucide-react";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!token) {
      setError("Invalid or missing reset token. Please request a new link.");
      return;
    }

    if (!password || !confirmPassword) {
      setError("Both password fields are required.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await resetPasswordApi(token, password);
      setMessage(response.message || "Password has been reset successfully.");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.message || "Failed to reset password. Link may have expired.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900/80 p-6 shadow-xl backdrop-blur-md transition-all duration-300 ease-out sm:p-8">
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/20 text-orange-400">
          <KeyRound className="h-5 w-5" />
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-slate-100">Reset Password</h1>
      </div>
      <p className="mt-2 text-sm text-slate-300">
        Enter your new password below (minimum 6 characters).
      </p>

      {!token ? (
        <div className="mt-6 space-y-4">
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4">
            <p className="text-sm font-medium text-rose-300">
              Invalid or missing reset token. Please request a new link.
            </p>
          </div>
          <Link
            to="/forgot-password"
            className="flex items-center justify-center gap-1.5 w-full rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-400"
          >
            Request New Reset Link
          </Link>
        </div>
      ) : message ? (
        <div className="mt-6 space-y-4">
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center">
            <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-400 mb-2" />
            <p className="text-sm font-semibold text-emerald-300">{message}</p>
            <p className="text-xs text-slate-400 mt-1">You can now sign in using your new credentials.</p>
          </div>
          <Link
            to="/auth"
            className="flex items-center justify-center gap-1.5 w-full rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-400"
          >
            Go to Login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <label className="block text-sm text-slate-200">
            New Password
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className={`${inputClassName} pr-10`}
                disabled={submitting}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </label>

          <label className="block text-sm text-slate-200">
            Confirm New Password
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className={inputClassName}
              disabled={submitting}
            />
          </label>

          {error ? <p className="text-sm font-medium text-rose-300">{error}</p> : null}

          <div className="flex flex-col gap-2 pt-1">
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-400 disabled:opacity-60"
            >
              {submitting ? "Resetting Password..." : "Update Password"}
            </button>
            <Link
              to="/auth"
              className="flex items-center justify-center gap-1 text-center text-sm text-slate-400 hover:text-slate-200 transition mt-2"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Login
            </Link>
          </div>
        </form>
      )}
    </div>
  );
};

export default ResetPasswordPage;
