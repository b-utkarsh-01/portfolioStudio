const AccountPanel = ({ editing, currentUser, accountDraft, setAccountDraft }) => (
  <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-4">
    <h2 className="text-sm uppercase tracking-wide text-slate-400">Account</h2>
    <p className="mt-2 text-slate-100"><span className="text-slate-400">Username:</span> {currentUser?.username || "-"}</p>
    {!editing ? (
      <p className="mt-1 text-slate-100"><span className="text-slate-400">Display Name:</span> {currentUser?.displayName || "-"}</p>
    ) : (
      <label className="mt-2 block text-sm text-slate-200">
        Display Name
        <input
          value={accountDraft.displayName}
          onChange={(event) => setAccountDraft((prev) => ({ ...prev, displayName: event.target.value }))}
          className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-orange-400"
          placeholder="Your display name"
        />
      </label>
    )}
  </div>
);

export default AccountPanel;
