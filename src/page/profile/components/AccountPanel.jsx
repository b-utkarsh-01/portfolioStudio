import React from "react";
import AccountDetails from "./AccountDetails";
import DisplayNameForm from "./DisplayNameForm";
import PasswordResetSection from "./PasswordResetSection";
import { UserCheck } from "lucide-react";

const AccountPanel = ({
  editing,
  currentUser,
  accountDraft,
  setAccountDraft,
  portfolioUrl,
  onCopy,
  copied,
  templateId,
  isPublished,
}) => {
  return (
    <div className="flex h-full min-h-0 min-w-0 w-full flex-col rounded-2xl sm:rounded-3xl border border-slate-800 bg-slate-900/60 p-4 sm:p-6 shadow-xl backdrop-blur-xl">
      <div className="shrink-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border-b border-slate-800/80 pb-3 sm:pb-4 mb-4">
        <div className="flex items-center gap-2">
          <UserCheck className="h-4 w-4 text-orange-400 shrink-0" />
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-200">
            Account & Security Settings
          </h2>
        </div>
        <span className="text-[11px] sm:text-xs text-slate-500">Manage identity & authentication</span>
      </div>

      <div className="flex-1 min-h-0 w-full min-w-0 overflow-y-auto frontend-scrollbar pr-1 sm:pr-2 space-y-6">
        {/* Render Form when editing, otherwise display static details */}
        {editing ? (
          <DisplayNameForm accountDraft={accountDraft} setAccountDraft={setAccountDraft} />
        ) : (
          <AccountDetails
            currentUser={currentUser}
            portfolioUrl={portfolioUrl}
            onCopy={onCopy}
            copied={copied}
            templateId={templateId}
            isPublished={isPublished}
          />
        )}

        {/* Security & Password section */}
        {!editing && <PasswordResetSection email={currentUser?.email} />}
      </div>
    </div>
  );
};

export default AccountPanel;
