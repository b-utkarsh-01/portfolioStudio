const SectionHeader = ({ icon: Icon, title, subtitle }) => (
  <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
    <h2 className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-white">
      <Icon className="w-5 h-5 text-orange-400" />
      {title}
    </h2>
    {subtitle ? <p className="text-xs sm:text-sm text-slate-400">{subtitle}</p> : null}
  </div>
);

export default SectionHeader;
