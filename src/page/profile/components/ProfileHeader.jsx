import { Trash2 } from "lucide-react";

const ProfileHeader = ({ editing, saving, onEdit, onCancel, onSave, onLogout }) => (
  <div className="flex flex-wrap items-center justify-between gap-3">
    <h1 className="text-4xl font-semibold text-slate-100">Profile</h1>
    <div className="flex items-center gap-2">
      {!editing ? (
        <button type="button" onClick={onEdit} className="rounded-lg border border-cyan-500/70 px-4 py-2 text-sm font-semibold text-cyan-200 hover:bg-cyan-500/10">
          Edit
        </button>
      ) : (
        <>
          <button type="button" onClick={onCancel} className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-slate-800/70">
            Cancel
          </button>
          <button type="button" onClick={onSave} disabled={saving} className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-400 disabled:opacity-60">
            {saving ? "Saving..." : "Save"}
          </button>
        </>
      )}
      <button
        type="button"
        onClick={onLogout}
        className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-100 hover:border-rose-500 hover:bg-rose-500/10 hover:text-rose-200"
      >
        Logout
      </button>
    </div>
  </div>
);

export default ProfileHeader;
