import React, { useState } from "react";
import { forgotPasswordApi } from "../../../features/auth/authApi";
import { toast } from "react-toastify";

const PasswordResetSection = ({ email }) => {
  const [loading, setLoading] = useState(false);

  const handleRequestReset = async () => {
    if (!email) {
      toast.error("No email associated with this account.");
      return;
    }
    setLoading(true);
    try {
      const response = await forgotPasswordApi(email);
      toast.success(response.message || "Password reset link sent to your email!");
    } catch (err) {
      toast.error(err.message || "Failed to send password reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-t border-slate-800/80 pt-4 mt-6">
      <h3 className="text-sm font-semibold text-slate-300">Security</h3>
      <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <span className="text-xs text-slate-400 block">Password management</span>
          <span className="text-slate-300 text-sm">Need to update your password? Request a reset link.</span>
        </div>
        <button
          onClick={handleRequestReset}
          disabled={loading}
          className="inline-flex justify-center items-center rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-xs font-semibold text-slate-200 shadow-sm transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
        >
          {loading ? "Sending link..." : "Reset Password"}
        </button>
      </div>
    </div>
  );
};

export default PasswordResetSection;
