import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { resetPasswordApi } from "../features/auth/authApi";
import { inputClassName } from "./auth/registerStages";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!token) {
      setError("Invalid reset token. Please request a new link.");
      return;
    }

    if (!password || !confirmPassword) {
      setError("Both fields are required.");
      return;
    }

    if (password.length < 5) {
      setError("Password must be at least 5 characters.");
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
      setError(err.message || "Failed to reset password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900/70 p-6 transition-all duration-300 ease-out sm:p-8">
      <h1 className="text-2xl font-semibold text-slate-100">Reset Password</h1>
      <p className="mt-2 text-sm text-slate-300">
        Enter and confirm your new password below.
      </p>

      {!token ? (
        <div className="mt-5 space-y-4">
          <p className="text-sm text-rose-300 font-medium">Invalid or missing reset token.</p>
          <Link
            to="/forgot-password"
            className="block text-center rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-400"
          >
            Request New Link
          </Link>
        </div>
      ) : message ? (
        <div className="mt-5 space-y-4">
          <p className="text-sm text-emerald-400 font-medium">{message}</p>
          <Link
            to="/auth"
            className="block text-center rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-400"
          >
            Back to Login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <label className="block text-sm text-slate-200">
            New Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={inputClassName}
              disabled={submitting}
            />
          </label>

          <label className="block text-sm text-slate-200">
            Confirm New Password
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className={inputClassName}
              disabled={submitting}
            />
          </label>

          {error ? <p className="text-sm text-rose-300">{error}</p> : null}

          <div className="flex flex-col gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-400"
            >
              {submitting ? "Resetting..." : "Reset Password"}
            </button>
            <Link
              to="/auth"
              className="text-center text-sm text-slate-400 hover:text-slate-200 underline mt-1"
            >
              Back to Login
            </Link>
          </div>
        </form>
      )}
    </div>
  );
};

export default ResetPasswordPage;
