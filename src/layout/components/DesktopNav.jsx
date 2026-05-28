import React from "react";
import { NavLink } from "react-router-dom";
import { UserCircle2 } from "lucide-react";
import { useAuth } from "../../features/auth/AuthContext";

const navClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm transition ${
    isActive ? "bg-slate-800 text-white" : "text-slate-200 hover:bg-slate-800/70"
  }`;

const profileButtonClass = ({ isActive }) =>
  `inline-flex h-10 w-10 items-center justify-center rounded-full text-cyan-200 ring-1 transition ${
    isActive
      ? "bg-cyan-500/20 ring-cyan-300/60"
      : "bg-transparent ring-slate-600 hover:bg-cyan-500/10 hover:ring-cyan-400/50"
  }`;

const DesktopNav = () => {
  const { isAuthenticated } = useAuth();

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
        <NavLink
          to="/profile"
          className={profileButtonClass}
          title="Profile"
          aria-label="Profile"
        >
          <UserCircle2 className="h-6 w-6" />
        </NavLink>
      ) : (
        <NavLink to="/auth" className="rounded-lg bg-orange-500 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-400">
          Login
        </NavLink>
      )}
    </nav>
  );
};

export default DesktopNav;
