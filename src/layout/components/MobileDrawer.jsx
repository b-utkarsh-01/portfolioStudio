import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthContext";

const mobileLinkClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm transition ${
    isActive ? "bg-slate-800 text-white" : "text-slate-200 hover:bg-slate-800/70"
  }`;

const MobileDrawer = ({ setMobileOpen }) => {
  const { isAuthenticated } = useAuth();

  return (
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
        {isAuthenticated ? (
          <NavLink to="/profile" className={mobileLinkClass} onClick={() => setMobileOpen(false)}>
            Profile
          </NavLink>
        ) : null}
      </nav>
    </div>
  );
};

export default MobileDrawer;
