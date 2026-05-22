import { Outlet } from "react-router-dom";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";

const navClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm transition ${
    isActive ? "bg-slate-800 text-white" : "text-slate-200 hover:bg-slate-800/70"
  }`;

const MarketingLayout = () => (
  <div className="min-h-screen bg-slate-950 text-white">
    <header className="border-b border-slate-800">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/" className="text-2xl font-semibold tracking-tight text-white">
          Portfolio Studio
        </Link>
        <DesktopNav />
      </div>
    </header>
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <Outlet />
    </main>
  </div>
);

const DesktopNav = () => {
  const { isAuthenticated } = useAuth();

  return (
    <nav className="flex items-center gap-2">
      <NavLink to="/" className={navClass}>
        Home
      </NavLink>
      <NavLink to="/about" className={navClass}>
        About
      </NavLink>
      <NavLink to="/templates" className={navClass}>
        See Templates
      </NavLink>
      <NavLink to={isAuthenticated ? "/dashboard" : "/auth"} className="rounded-lg bg-orange-500 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-400">
        {isAuthenticated ? "Dashboard" : "Login"}
      </NavLink>
    </nav>
  );
};

export default MarketingLayout;
