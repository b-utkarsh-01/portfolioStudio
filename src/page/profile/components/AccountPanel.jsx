import React from "react";
import AccountDetails from "./AccountDetails";
import DisplayNameForm from "./DisplayNameForm";
import PasswordResetSection from "./PasswordResetSection";

const AccountPanel = ({ editing, currentUser, accountDraft, setAccountDraft }) => {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-6 backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
        <h2 className="text-sm uppercase tracking-wider text-slate-400 font-bold">Profile Info</h2>
      </div>

      <div className="space-y-6">
        {/* Render Form when editing, otherwise display static details */}
        {editing ? (
          <DisplayNameForm accountDraft={accountDraft} setAccountDraft={setAccountDraft} />
        ) : (
          <AccountDetails currentUser={currentUser} />
        )}

        {/* Password Reset option, only visible when NOT editing to prevent state conflicts */}
        {!editing && <PasswordResetSection email={currentUser?.email} />}
      </div>
    </div>
  );
};

export default AccountPanel;
