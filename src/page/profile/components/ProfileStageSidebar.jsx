import React from "react";
import { ShieldCheck, User, IdCard, Share2, CheckCircle2 } from "lucide-react";

const STAGES = [
  {
    id: "account",
    label: "Account & Security",
    desc: "Credentials, plan & auth",
    icon: ShieldCheck,
  },
  {
    id: "profile",
    label: "Profile Bio",
    desc: "Name, titles & summary",
    icon: User,
  },
  {
    id: "highlights",
    label: "Highlights & Badges",
    desc: "Key skills & milestones",
    icon: IdCard,
  },
  {
    id: "contacts",
    label: "Contacts & Socials",
    desc: "Email, GitHub & links",
    icon: Share2,
  },
];

const ProfileStageSidebar = ({ activeStage, setActiveStage }) => {
  return (
    <>
      {/* Mobile Navigation: Sleek horizontal scrollable tab pills */}
      <div className="lg:hidden w-full min-w-0 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 p-2 shadow-lg backdrop-blur-xl">
        <div className="flex gap-2 overflow-x-auto no-scrollbar min-w-0 w-full">
          {STAGES.map((stage) => {
            const selected = activeStage === stage.id;
            const Icon = stage.icon;

            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => setActiveStage(stage.id)}
                className={`flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition active:scale-95 ${
                  selected
                    ? "border border-orange-500/50 bg-orange-500/20 text-orange-200 shadow-sm"
                    : "border border-slate-800 bg-slate-950/50 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${selected ? "text-orange-400" : "text-slate-400"}`} />
                <span>{stage.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop Navigation: Full vertical sidebar */}
      <aside className="hidden lg:flex h-full min-h-0 min-w-0 flex-col justify-between rounded-3xl border border-slate-800 bg-slate-900/60 p-4 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col min-h-0">
          <div className="mb-3 px-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Settings</p>
          </div>

          <nav className="flex flex-col gap-1.5">
            {STAGES.map((stage) => {
              const selected = activeStage === stage.id;
              const Icon = stage.icon;

              return (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => setActiveStage(stage.id)}
                  className={`group flex items-center gap-3.5 rounded-2xl p-3 text-left transition-all ${
                    selected
                      ? "border border-orange-500/30 bg-orange-500/10 text-orange-200 shadow-sm"
                      : "border border-transparent text-slate-400 hover:border-slate-800 hover:bg-slate-800/40 hover:text-slate-200"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition ${
                      selected
                        ? "bg-orange-500/20 text-orange-400"
                        : "bg-slate-800/60 text-slate-400 group-hover:bg-slate-800 group-hover:text-slate-300"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <span
                      className={`block text-xs font-semibold tracking-wide ${
                        selected ? "text-orange-200" : "text-slate-200"
                      }`}
                    >
                      {stage.label}
                    </span>
                    <span className="block truncate text-[11px] text-slate-500">
                      {stage.desc}
                    </span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Anchor card at bottom to balance full height on desktop */}
        <div className="mt-4 rounded-2xl border border-slate-800/80 bg-slate-950/50 p-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-semibold text-slate-200">Portfolio Studio</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Profile settings & credentials live.</p>
        </div>
      </aside>
    </>
  );
};

export default ProfileStageSidebar;
