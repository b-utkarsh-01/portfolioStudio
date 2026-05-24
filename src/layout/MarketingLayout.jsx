import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Outlet } from "react-router-dom";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";

const navClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm transition ${
    isActive ? "bg-slate-800 text-white" : "text-slate-200 hover:bg-slate-800/70"
  }`;

const MarketingLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      <header className="border-b border-slate-800">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" className="text-2xl font-semibold leading-tight tracking-tight text-white sm:text-2xl">
            Portfolio Studio
          </Link>
          <MobileNav mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
          <DesktopNav />
        </div>
        {mobileOpen ? <MobileDrawer setMobileOpen={setMobileOpen} /> : null}
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
};

const DesktopNav = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="hidden items-center gap-2 sm:flex">
      <NavLink to="/" className={navClass}>
        Home
      </NavLink>
      <NavLink to="/about" className={navClass}>
        About
      </NavLink>
      <NavLink to="/templates" className={navClass}>
        See Templates
      </NavLink>
      {isAuthenticated ? (
        <button
          type="button"
          onClick={logout}
          className="rounded-lg border border-slate-600 px-3 py-2 text-sm font-semibold text-slate-100 hover:bg-slate-800/70"
        >
          Logout
        </button>
      ) : (
        <NavLink to="/auth" className="rounded-lg bg-orange-500 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-400">
          Login
        </NavLink>
      )}
    </nav>
  );
};

const MobileNav = ({ mobileOpen, setMobileOpen }) => {
  const { isAuthenticated, logout } = useAuth();
  return (
    <nav className="flex items-center gap-2 sm:hidden">
      {isAuthenticated ? (
        <button
          type="button"
          onClick={() => {
            setMobileOpen(false);
            logout();
          }}
          className="rounded-lg border border-slate-600 px-3 py-2 text-sm font-semibold text-slate-100 hover:bg-slate-800/70"
        >
          Logout
        </button>
      ) : (
        <NavLink
          to="/auth"
          onClick={() => setMobileOpen(false)}
          className="rounded-lg bg-orange-500 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-400"
        >
          Login
        </NavLink>
      )}
      <button
        type="button"
        onClick={() => setMobileOpen((prev) => !prev)}
        className="rounded-lg border border-slate-700 p-2 text-slate-100"
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </button>
    </nav>
  );
};

const mobileLinkClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm transition ${
    isActive ? "bg-slate-800 text-white" : "text-slate-200 hover:bg-slate-800/70"
  }`;

const MobileDrawer = ({ setMobileOpen }) => (
  <div className="border-t border-slate-800 bg-slate-950 px-4 pb-4 pt-3 sm:hidden">
    <nav className="flex flex-col gap-2">
      <NavLink to="/" className={mobileLinkClass} onClick={() => setMobileOpen(false)}>
        Home
      </NavLink>
      <NavLink to="/about" className={mobileLinkClass} onClick={() => setMobileOpen(false)}>
        About
      </NavLink>
      <NavLink to="/templates" className={mobileLinkClass} onClick={() => setMobileOpen(false)}>
        See Templates
      </NavLink>
    </nav>
  </div>
);

export default MarketingLayout;
