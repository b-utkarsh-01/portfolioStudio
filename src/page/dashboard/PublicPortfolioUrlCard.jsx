const PublicPortfolioUrlCard = ({ publicPortfolioUrl, onCopy }) => {
  if (!publicPortfolioUrl) return null;

  return (
    <div className="mb-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3">
      <p className="text-xs uppercase tracking-wide text-emerald-300">Public Portfolio URL</p>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
        <code className="block flex-1 overflow-x-auto whitespace-nowrap rounded-md border border-emerald-400/20 bg-slate-950/60 px-3 py-2 text-xs text-emerald-200 sm:text-sm">
          {publicPortfolioUrl}
        </code>
        <button
          type="button"
          onClick={onCopy}
          className="rounded-lg border border-emerald-400/60 px-3 py-2 text-sm text-emerald-200 hover:bg-emerald-500/10"
        >
          Copy URL
        </button>
      </div>
    </div>
  );
};

export default PublicPortfolioUrlCard;
