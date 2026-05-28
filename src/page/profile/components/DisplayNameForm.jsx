import React from "react";

const DisplayNameForm = ({ accountDraft, setAccountDraft }) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-slate-200">
        Display Name
        <input
          value={accountDraft.displayName}
          onChange={(event) =>
            setAccountDraft((prev) => ({ ...prev, displayName: event.target.value }))
          }
          className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 placeholder-slate-500 outline-none transition focus:border-orange-400 focus:ring-1 focus:ring-orange-400/50"
          placeholder="Your display name"
        />
      </label>
      <p className="text-xs text-slate-400">
        This is the name that will be displayed on your dashboard and default portfolio templates.
      </p>
    </div>
  );
};

export default DisplayNameForm;
