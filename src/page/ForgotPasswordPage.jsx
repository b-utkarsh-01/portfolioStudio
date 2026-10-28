import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPasswordApi } from "../features/auth/authApi";
import { inputClassName } from "./auth/registerStages";
import { KeyRound, MailCheck, ArrowLeft } from "lucide-react";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await forgotPasswordApi(email.trim());
      setMessage(response.message || "Password reset link has been sent to your email.");
      setEmail("");
    } catch (err) {
      setError(err.message || "Failed to send reset link.");
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
        <h1 className="text-2xl font-bold tracking-tight text-slate-100">Forgot Password</h1>
      </div>
      <p className="mt-2 text-sm text-slate-300">
        Enter your registered email address to receive your password reset link.
      </p>

      {message ? (
        <div className="mt-6 space-y-4">
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center">
            <MailCheck className="mx-auto h-8 w-8 text-emerald-400 mb-2" />
            <p className="text-sm font-semibold text-emerald-300">{message}</p>
            <p className="text-xs text-slate-400 mt-1">
              Please check your inbox (and spam folder) for the reset instructions.
            </p>
          </div>

          <Link
            to="/auth"
            className="flex items-center justify-center gap-1.5 w-full rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <label className="block text-sm text-slate-200">
            Email Address
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={inputClassName}
              disabled={submitting}
              autoFocus
            />
          </label>

          {error ? <p className="text-sm font-medium text-rose-300">{error}</p> : null}

          <div className="flex flex-col gap-2 pt-1">
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-400 disabled:opacity-60"
            >
              {submitting ? "Sending..." : "Send Reset Link"}
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

export default ForgotPasswordPage;
