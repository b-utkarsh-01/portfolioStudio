import React from "react";
import { User, Mail, Shield, Globe, Copy, Check, ExternalLink } from "lucide-react";

const AccountDetails = ({
  currentUser,
  portfolioUrl,
  onCopy,
  copied,
  templateId,
  isPublished,
}) => {
  const isPremium = Boolean(currentUser?.hasPremiumAccess);

  return (
    <div className="space-y-6">
      {/* Account Info Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4 transition hover:border-slate-700/60">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <User className="h-3.5 w-3.5 text-slate-400" />
            <span>Username</span>
          </div>
          <p className="mt-2 text-sm font-semibold text-slate-100 font-mono">
            @{currentUser?.username || "-"}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">Your unique public handle across PortfolioStudio.</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4 transition hover:border-slate-700/60">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <Mail className="h-3.5 w-3.5 text-slate-400" />
            <span>Email Address</span>
          </div>
          <p className="mt-2 text-sm font-semibold text-slate-100 truncate">
            {currentUser?.email || "-"}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">Used for password recovery and notifications.</p>
        </div>
      </div>

      {/* Subscription Banner */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-950/60 via-slate-900/40 to-slate-950/60 p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Shield className="h-5 w-5" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Plan Tier
              </span>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wide ${
                  isPremium
                    ? "border border-amber-500/40 bg-amber-500/10 text-amber-300"
                    : "border border-slate-700 bg-slate-800 text-slate-400"
                }`}
              >
                {isPremium && <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />}
                {isPremium ? "PREMIUM ACCESS" : "FREE PLAN"}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {isPremium
                ? "Full access to all standard, cyberpunk, dynamic AI, and Nebula templates."
                : "Basic access to standard developer portfolio layouts."}
            </p>
          </div>
        </div>
      </div>

      {/* Live Portfolio Share Card */}
      {/* {portfolioUrl && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/10 p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                Public Portfolio URL
              </span>
            </div>
            <span className="text-xs font-mono text-cyan-300 bg-cyan-950/40 border border-cyan-800/40 px-2 py-0.5 rounded-md">
              Theme: {templateId || "default-v4"}
            </span>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative min-w-0 flex-1">
              <input
                type="text"
                readOnly
                value={portfolioUrl}
                onClick={(e) => e.target.select()}
                className="w-full rounded-xl border border-slate-800 bg-slate-950/90 px-3.5 py-2 font-mono text-xs text-emerald-200 outline-none selection:bg-emerald-500/30 focus:border-emerald-500/50"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onCopy}
                className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 transition active:scale-95"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy Link"}
              </button>
              <a
                href={portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-medium text-slate-200 hover:bg-slate-700 transition"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Open
              </a>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default AccountDetails;
