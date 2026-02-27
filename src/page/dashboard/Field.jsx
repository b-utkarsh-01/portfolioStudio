const Field = ({ label, children, hint }) => (
  <label className="block text-sm text-slate-200">
    {label}
    {children}
    {hint ? <p className="mt-1 text-xs text-slate-400">{hint}</p> : null}
  </label>
);

export default Field;
