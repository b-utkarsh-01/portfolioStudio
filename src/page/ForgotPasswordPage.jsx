import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPasswordApi } from "../features/auth/authApi";
import { inputClassName } from "./auth/registerStages";

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
    <div className="mx-auto w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900/70 p-6 transition-all duration-300 ease-out sm:p-8">
      <h1 className="text-2xl font-semibold text-slate-100">Forgot Password</h1>
      <p className="mt-2 text-sm text-slate-300">
        Enter your registered email address and we will send you a link to reset your password.
      </p>

      {message ? (
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
            Email Address
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
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
              {submitting ? "Sending..." : "Send Reset Link"}
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

export default ForgotPasswordPage;
