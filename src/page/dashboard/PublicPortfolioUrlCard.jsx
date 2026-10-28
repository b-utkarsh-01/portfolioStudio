import React from "react";
import { Copy, ExternalLink, Settings } from "lucide-react";

const PublicPortfolioUrlCard = ({ publicPortfolioUrl, onCopy, onOpenPublish }) => {
  if (!publicPortfolioUrl) return null;

  return (
    <div className="mb-4 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-3 sm:p-3.5">
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
          Public Portfolio Address
        </p>
        {onOpenPublish && (
          <button
            type="button"
            onClick={onOpenPublish}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300 hover:text-emerald-200 transition"
          >
            <Settings className="h-3 w-3" />
            <span>Manage Slug & Visibility</span>
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <code className="block flex-1 overflow-x-auto whitespace-nowrap rounded-xl border border-emerald-400/20 bg-slate-950/70 px-3 py-2 font-mono text-xs text-emerald-200 sm:text-sm">
          {publicPortfolioUrl}
        </code>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCopy}
            className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-400/60 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 transition active:scale-95"
          >
            <Copy className="h-3.5 w-3.5" />
            <span>Copy URL</span>
          </button>
          <a
            href={publicPortfolioUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-700 transition"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Open</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default PublicPortfolioUrlCard;
