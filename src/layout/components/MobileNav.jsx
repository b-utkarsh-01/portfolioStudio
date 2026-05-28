import React from "react";
import { NavLink } from "react-router-dom";
import { Menu, UserCircle2, X } from "lucide-react";
import { useAuth } from "../../features/auth/AuthContext";

const mobileProfileButtonClass = ({ isActive }) =>
  `inline-flex h-9 w-9 items-center justify-center rounded-full text-cyan-200 ring-1 transition ${
    isActive
      ? "bg-cyan-500/20 ring-cyan-300/60"
      : "bg-transparent ring-slate-600 hover:bg-cyan-500/10 hover:ring-cyan-400/50"
  }`;

const MobileNav = ({ mobileOpen, setMobileOpen }) => {
  const { isAuthenticated } = useAuth();

  return (
    <nav className="flex items-center gap-2 sm:hidden">
      {isAuthenticated ? (
        <NavLink
          to="/profile"
          onClick={() => setMobileOpen(false)}
          className={mobileProfileButtonClass}
          title="Profile"
          aria-label="Profile"
        >
          <UserCircle2 className="h-5 w-5" />
        </NavLink>
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

export default MobileNav;
