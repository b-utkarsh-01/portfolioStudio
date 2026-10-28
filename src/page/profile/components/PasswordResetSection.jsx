import React, { useState } from "react";
import { forgotPasswordApi, changePasswordApi } from "../../../features/auth/authApi";
import { toast } from "react-toastify";
import { Lock, Eye, EyeOff, Mail } from "lucide-react";

const fieldInputClass =
  "w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-orange-400";

const PasswordResetSection = ({ email }) => {
  const [showChangeForm, setShowChangeForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [sendingReset, setSendingReset] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error("Current password and new password are required.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    setUpdating(true);
    try {
      const res = await changePasswordApi({ currentPassword, newPassword });
      toast.success(res.message || "Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowChangeForm(false);
    } catch (err) {
      toast.error(err.message || "Failed to update password.");
    } finally {
      setUpdating(false);
    }
  };

  const handleRequestReset = async () => {
    if (!email) {
      toast.error("No email associated with this account.");
      return;
    }
    setSendingReset(true);
    try {
      const response = await forgotPasswordApi(email);
      toast.success(response.message || "Password reset link has been sent to your email!");
    } catch (err) {
      toast.error(err.message || "Failed to send reset link.");
    } finally {
      setSendingReset(false);
    }
  };

  return (
    <div className="border-t border-slate-800/80 pt-5 mt-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500/20 text-orange-400">
            <Lock className="h-4 w-4" />
          </span>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
            Security & Password
          </h3>
        </div>

        <button
          type="button"
          onClick={() => setShowChangeForm((prev) => !prev)}
          className="rounded-lg border border-orange-500/50 bg-orange-500/10 px-3 py-1.5 text-xs font-semibold text-orange-300 transition hover:bg-orange-500/20"
        >
          {showChangeForm ? "Close Form" : "Change Password"}
        </button>
      </div>

      {showChangeForm ? (
        <form onSubmit={handleChangePassword} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Update Your Password</p>
            <button
              type="button"
              onClick={() => setShowPasswords((prev) => !prev)}
              className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200"
            >
              {showPasswords ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              {showPasswords ? "Hide" : "Show"}
            </button>
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-1">Current Password</label>
            <input
              type={showPasswords ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter your current password"
              className={fieldInputClass}
              disabled={updating}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs text-slate-300 mb-1">New Password</label>
              <input
                type={showPasswords ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min 6 characters"
                className={fieldInputClass}
                disabled={updating}
              />
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1">Confirm New Password</label>
              <input
                type={showPasswords ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className={fieldInputClass}
                disabled={updating}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowChangeForm(false)}
              className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updating}
              className="rounded-lg bg-orange-500 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-orange-400 disabled:opacity-50"
            >
              {updating ? "Updating..." : "Save Password"}
            </button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-slate-800/80 bg-slate-950/40 p-3">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Forgot Current Password?</span>
            <span className="text-slate-300 text-xs">Send a 15-minute reset link directly to your registered email.</span>
          </div>
          <button
            type="button"
            onClick={handleRequestReset}
            disabled={sendingReset}
            className="inline-flex shrink-0 justify-center items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-200 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
          >
            <Mail className="h-3.5 w-3.5" />
            {sendingReset ? "Sending..." : "Email Reset Link"}
          </button>
        </div>
      )}
    </div>
  );
};

export default PasswordResetSection;
