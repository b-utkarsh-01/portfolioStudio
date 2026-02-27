import { Link } from "react-router-dom";

const DashboardHeader = ({ username, profileUrl, onLogout }) => (
  <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
    <div>
      <h1 className="text-2xl font-semibold text-slate-100">Dashboard</h1>
      <p className="text-sm text-slate-300">
        Logged in as <span className="font-semibold">{username}</span>
      </p>
    </div>
    <div className="flex flex-wrap gap-2">
      <Link
        to={profileUrl}
        className="rounded-lg border border-orange-400 px-3 py-2 text-sm text-orange-300 hover:bg-orange-500/10"
      >
        Preview Portfolio
      </Link>
      <button
        type="button"
        onClick={onLogout}
        className="rounded-lg border border-slate-600 px-3 py-2 text-sm text-slate-200"
      >
        Logout
      </button>
    </div>
  </div>
);

export default DashboardHeader;
