import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthContext";

const mobileLinkClass = ({ isActive }) =>
  `rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
    isActive ? "bg-orange-500/15 text-orange-200 border border-orange-500/30" : "text-slate-200 hover:bg-slate-800/70"
  }`;

const MobileDrawer = ({ setMobileOpen }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="border-t border-slate-800 bg-slate-950/95 backdrop-blur-xl px-4 pb-4 pt-3 sm:hidden shadow-2xl">
      <nav className="flex flex-col gap-1.5">
        <NavLink to="/" className={mobileLinkClass} onClick={() => setMobileOpen(false)}>
          Home
        </NavLink>
        <NavLink to="/about" className={mobileLinkClass} onClick={() => setMobileOpen(false)}>
          About
        </NavLink>
        <NavLink to="/templates" className={mobileLinkClass} onClick={() => setMobileOpen(false)}>
          See Templates
        </NavLink>
        {isAuthenticated ? (
          <>
            <NavLink to="/dashboard" className={mobileLinkClass} onClick={() => setMobileOpen(false)}>
              Studio Editor (Dashboard)
            </NavLink>
            <NavLink to="/profile" className={mobileLinkClass} onClick={() => setMobileOpen(false)}>
              Profile & Settings
            </NavLink>
          </>
        ) : null}
      </nav>
    </div>
  );
};

export default MobileDrawer;
