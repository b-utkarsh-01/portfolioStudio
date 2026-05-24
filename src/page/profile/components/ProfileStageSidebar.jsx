const ProfileStageSidebar = ({ activeStage, setActiveStage }) => {
  const stages = [
    { id: "account", label: "Account" },
    { id: "profile", label: "Profile" },
    { id: "highlights", label: "Highlights" },
    { id: "contacts", label: "Contacts" },
  ];

  return (
    <aside className="rounded-2xl border border-slate-700 bg-slate-900/60 p-4">
      <p className="mb-3 text-xs uppercase tracking-wide text-slate-400">Sections</p>
      <div className="space-y-2">
        {stages.map((stage, index) => {
          const selected = activeStage === stage.id;
          return (
            <button
              key={stage.id}
              type="button"
              onClick={() => setActiveStage(stage.id)}
              className={`w-full rounded-lg border px-3 py-2 text-left text-base font-medium transition ${
                selected
                  ? "border-orange-500 bg-orange-500/10 text-orange-200"
                  : "border-slate-700 bg-slate-950/50 text-slate-100 hover:border-slate-500"
              }`}
            >
              {index + 1}. {stage.label}
            </button>
          );
        })}
      </div>
    </aside>
  );
};

export default ProfileStageSidebar;
