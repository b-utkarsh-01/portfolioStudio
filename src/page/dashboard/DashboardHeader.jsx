import React from "react";
import { Link } from "react-router-dom";
import { Save, Radio, Check, LogOut, Globe } from "lucide-react";

const DashboardHeader = ({
  username,
  profileUrl,
  onLogout,
  onSave,
  onOpenPublish,
  isPublished = false,
  savedRecently = false,
}) => (
  <div className="mb-4 sm:mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between border-b border-slate-800/80 pb-3 sm:pb-4 min-w-0">
    <div className="flex items-center gap-3 min-w-0">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100">Studio Editor</h1>
          {isPublished ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </span>
          ) : (
            <span className="rounded-full border border-slate-700 bg-slate-800/70 px-2 py-0.5 text-[10px] font-semibold text-slate-400">
              Draft
            </span>
          )}
        </div>
        <p className="text-xs text-slate-400">
          Logged in as <span className="font-semibold text-orange-300">@{username}</span>
        </p>
      </div>
    </div>

    {/* Primary Studio Action Bar (Save & Publish ALWAYS accessible) */}
    <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
      {/* 1. Save Portfolio Button */}
      <button
        type="button"
        onClick={onSave}
        className="inline-flex items-center gap-1.5 rounded-xl bg-orange-500 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-md shadow-orange-500/20 hover:bg-orange-400 transition active:scale-95"
        title="Save all changes across all stages"
      >
        {savedRecently ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
        <span>{savedRecently ? "Saved ✓" : "Save Portfolio"}</span>
      </button>

      {/* 2. Publish Settings Button */}
      <button
        type="button"
        onClick={onOpenPublish}
        className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs sm:text-sm font-semibold transition active:scale-95 ${
          isPublished
            ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25"
            : "border-cyan-500/50 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20"
        }`}
        title="Open publish & visibility settings"
      >
        <Radio className="h-4 w-4" />
        <span>{isPublished ? "Publish Settings" : "Publish Live"}</span>
      </button>

      {/* 3. Preview Portfolio */}
      <Link
        to={profileUrl}
        className="inline-flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs sm:text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition active:scale-95"
        title="Preview your public profile page"
      >
        <Globe className="h-3.5 w-3.5 text-slate-400" />
        <span>Preview</span>
      </Link>

      {/* 4. Logout */}
      <button
        type="button"
        onClick={onLogout}
        className="rounded-xl border border-slate-800 bg-slate-900/60 p-2 text-slate-400 hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-300 transition"
        title="Logout"
      >
        <LogOut className="h-4 w-4" />
      </button>
    </div>
  </div>
);

export default DashboardHeader;
