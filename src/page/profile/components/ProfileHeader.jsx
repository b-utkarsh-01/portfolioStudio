import React from "react";
import { Link } from "react-router-dom";
import {
  ExternalLink,
  Copy,
  Check,
  Edit3,
  CheckCircle,
  X,
  LogOut,
  Image,
  LayoutDashboard,
  Palette,
} from "lucide-react";

const ProfileHeader = ({
  currentUser,
  portfolioData,
  portfolioInfo,
  portfolioUrl,
  editing,
  saving,
  onEdit,
  onCancel,
  onSave,
  onLogout,
  onCopy,
  copied = false,
}) => {
  const displayName = currentUser?.displayName || portfolioData?.profile?.name || currentUser?.username || "Developer";
  const username = currentUser?.username || "";
  const email = currentUser?.email || "";
  const isPremium = Boolean(currentUser?.hasPremiumAccess);
  const templateId = portfolioInfo?.templateId || "default-v4";
  const avatar = portfolioData?.profile?.avatar;

  // Generate initials
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");

  return (
    <div className="relative w-full min-w-0 rounded-2xl sm:rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950/80 p-4 sm:p-6 shadow-2xl backdrop-blur-xl">
      {/* Mobile-only Logout button in top-right */}
      <button
        type="button"
        onClick={onLogout}
        className="sm:hidden absolute top-3.5 right-3.5 rounded-xl border border-slate-800 bg-slate-900/80 p-2 text-slate-400 hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-300 transition"
        title="Log out of your account"
      >
        <LogOut className="h-4 w-4" />
      </button>

      <div className="flex flex-col gap-4 sm:gap-5 lg:flex-row lg:items-center lg:justify-between min-w-0 w-full">
        {/* User Identity Info */}
        <div className="flex items-start gap-3.5 sm:items-center sm:gap-4 pr-9 sm:pr-0 min-w-0 flex-1">
          {/* Avatar */}
          <div className="relative shrink-0">
            {avatar ? (
              <img
                src={avatar}
                alt={displayName}
                className="h-14 w-14 rounded-2xl border-2 border-slate-700 object-cover shadow-md sm:h-20 sm:w-20"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-orange-500/40 bg-gradient-to-br from-orange-500/20 via-slate-800 to-slate-900 text-lg font-bold text-orange-300 shadow-md sm:h-20 sm:w-20 sm:text-2xl">
                {initials || "U"}
              </div>
            )}
            {isPremium && (
              <span
                className="absolute -bottom-1 -right-1 flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full border-2 border-slate-950 bg-amber-500 text-slate-950 shadow"
                title="Premium Member"
              >
                <Image className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </span>
            )}
          </div>

          {/* Names and Status Chips */}
          <div className="min-w-0 space-y-1 sm:space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate text-lg sm:text-2xl font-bold tracking-tight text-slate-100">
                {displayName}
              </h1>
              {isPremium ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-amber-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                  PREMIUM
                </span>
              ) : (
                <span className="rounded-full border border-slate-700 bg-slate-800/60 px-2.5 py-0.5 text-[11px] font-medium text-slate-400">
                  FREE PLAN
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-xs text-slate-400">
              {username && <span className="font-mono text-slate-300">@{username}</span>}
              {username && email && <span>•</span>}
              {email && <span className="truncate max-w-[170px] sm:max-w-none">{email}</span>}
            </div>

            {/* Quick URL & Template Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-0.5 min-w-0">
              <span className="inline-flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-950/60 px-2.5 py-1 text-xs text-slate-300 font-mono">
                <Palette className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                <span className="truncate">{templateId}</span>
              </span>

              {portfolioUrl && (
                <div className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-950/30 px-2.5 py-1 text-xs font-mono text-emerald-300 min-w-0">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span className="truncate max-w-[130px] sm:max-w-[280px]">
                    {portfolioUrl.replace(/^https?:\/\//i, "")}
                  </span>
                  <button
                    type="button"
                    onClick={onCopy}
                    className="ml-0.5 text-emerald-400 hover:text-emerald-200 transition shrink-0"
                    title="Copy full portfolio URL"
                  >
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="shrink-0 flex flex-col sm:flex-row sm:items-center gap-2.5">
          <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-2.5">
            {portfolioUrl && !editing && (
              <a
                href={portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-xl border border-slate-700/80 bg-slate-800/80 px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs font-semibold text-slate-200 shadow-sm transition hover:bg-slate-700 hover:text-white active:scale-95"
              >
                <ExternalLink className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                <span>Live Site</span>
              </a>
            )}

            {!editing && (
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-xl border border-slate-700/80 bg-slate-800/80 px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs font-semibold text-slate-200 shadow-sm transition hover:bg-slate-700 hover:text-orange-300 active:scale-95"
              >
                <LayoutDashboard className="h-3.5 w-3.5 text-orange-400 shrink-0" />
                <span>Studio Editor</span>
              </Link>
            )}
          </div>

          {!editing ? (
            <button
              type="button"
              onClick={onEdit}
              className="inline-flex w-full sm:w-auto items-center justify-center gap-1.5 whitespace-nowrap rounded-xl bg-orange-500 px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-semibold text-white shadow-md shadow-orange-500/20 transition hover:bg-orange-400 active:scale-95"
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>Edit Details</span>
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-2.5">
              <button
                type="button"
                onClick={onCancel}
                className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-xl border border-slate-700 bg-slate-800 px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-slate-700 active:scale-95"
              >
                <X className="h-3.5 w-3.5" />
                Cancel
              </button>
              <button
                type="button"
                onClick={onSave}
                disabled={saving}
                className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-xl bg-orange-500 px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-semibold text-white shadow-md shadow-orange-500/20 transition hover:bg-orange-400 disabled:opacity-50 active:scale-95"
              >
                <CheckCircle className="h-3.5 w-3.5" />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}

          {/* Desktop-only Logout Button */}
          <button
            type="button"
            onClick={onLogout}
            className="hidden sm:inline-flex items-center justify-center rounded-xl border border-slate-800 bg-slate-900/60 p-2.5 text-slate-400 transition hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-300"
            title="Log out of your account"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
