import React from "react";
import { X, Globe, Radio, Check, Copy, ExternalLink, ShieldCheck, AlertCircle } from "lucide-react";
import { inputClassName } from "./dashboardFormConfig";

const PublishModal = ({
  isOpen,
  onClose,
  form,
  onFieldChange,
  onPublish,
  onUnpublish,
  publishing,
  unpublishing,
  publishStatus,
  publicPortfolioUrl,
  onCopyUrl,
}) => {
  if (!isOpen) return null;

  const isPublished = publishStatus?.status === "published";
  const currentSlug = form?.slug || publishStatus?.slug || "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      {/* Modal Dialog Card */}
      <div
        className="relative w-full max-w-lg rounded-3xl border border-slate-700 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-xl animate-scaleUp text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
              <Radio className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-100">Publish Portfolio</h2>
              <p className="text-xs text-slate-400">Control your live status and custom public address</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-800 p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition"
            title="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Live Status Badge */}
        <div className="mb-5 flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/60 p-3.5">
          <div className="flex items-center gap-2.5">
            <span
              className={`flex h-3 w-3 rounded-full ${
                isPublished ? "bg-emerald-400 animate-pulse" : "bg-slate-500"
              }`}
            />
            <span className="text-xs font-semibold text-slate-200">
              {isPublished ? "Portfolio is LIVE" : "Portfolio is in DRAFT (Offline)"}
            </span>
          </div>
          <span
            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
              isPublished
                ? "border border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
                : "border border-slate-700 bg-slate-800 text-slate-400"
            }`}
          >
            {publishStatus?.visibility || "private"}
          </span>
        </div>

        {/* Slug & Visibility Form */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Custom Public Slug
            </label>
            <div className="relative">
              <input
                value={form.slug || ""}
                onChange={onFieldChange?.("slug")}
                placeholder="e.g. john-doe or utkarsh"
                className={`${inputClassName} mt-0 font-mono text-sm`}
              />
            </div>
            <p className="mt-1 text-[11px] text-slate-500 font-mono">
              Your URL: /p/{currentSlug || "your-slug"}
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Visibility Mode
            </label>
            <select
              value={form.visibility || "public"}
              onChange={onFieldChange?.("visibility")}
              className={`${inputClassName} mt-0 text-sm`}
            >
              <option value="public">Public (Anyone with link can view)</option>
              <option value="private">Private (Only you can preview)</option>
            </select>
          </div>
        </div>

        {/* Live Public URL Card (if published) */}
        {isPublished && publicPortfolioUrl && (
          <div className="mb-6 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-3.5 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5" />
              Live Site Address
            </span>
            <div className="flex items-center gap-2">
              <code className="block flex-1 truncate font-mono text-xs text-emerald-200 bg-slate-950/80 px-3 py-2 rounded-xl border border-emerald-500/20">
                {publicPortfolioUrl}
              </code>
              <button
                type="button"
                onClick={onCopyUrl}
                className="shrink-0 inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 transition active:scale-95"
                title="Copy URL"
              >
                <Copy className="h-3.5 w-3.5" />
                <span>Copy</span>
              </button>
              <a
                href={publicPortfolioUrl}
                target="_blank"
                rel="noreferrer"
                className="shrink-0 inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
          <div className="flex items-center gap-2">
            {isPublished ? (
              <button
                type="button"
                onClick={onUnpublish}
                disabled={unpublishing}
                className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-2.5 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 transition disabled:opacity-50 active:scale-95"
              >
                {unpublishing ? "Unpublishing..." : "Unpublish (Take Offline)"}
              </button>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-700 px-4 py-2.5 text-xs font-medium text-slate-300 hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={async () => {
                await onPublish?.();
              }}
              disabled={publishing}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 transition disabled:opacity-50 active:scale-95"
            >
              <Radio className="h-3.5 w-3.5" />
              <span>{publishing ? "Publishing..." : isPublished ? "Update Live Site" : "Publish Live"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublishModal;
