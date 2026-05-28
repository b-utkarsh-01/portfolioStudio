import React from "react";

const AccountDetails = ({ currentUser }) => {
  const isPremium = Boolean(currentUser?.hasPremiumAccess);

  return (
    <div className="space-y-4">
      <div>
        <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block">Username</span>
        <span className="text-slate-100 font-medium text-lg">{currentUser?.username || "-"}</span>
      </div>

      <div>
        <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block">Email Address</span>
        <span className="text-slate-100 font-medium text-lg">{currentUser?.email || "-"}</span>
      </div>

      <div>
        <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block">Subscription Level</span>
        <div className="mt-1 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border bg-slate-950/40">
          {isPremium ? (
            <>
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="bg-gradient-to-r from-amber-200 to-yellow-400 bg-clip-text text-transparent font-bold">PREMIUM ACCESS</span>
            </>
          ) : (
            <>
              <span className="h-2 w-2 rounded-full bg-slate-500" />
              <span className="text-slate-300">FREE PLAN</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;
