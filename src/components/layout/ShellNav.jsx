import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../../features/auth/AuthContext";

const ShellNav = () => {
  const { isAuthenticated } = useAuth();
  const { pathname } = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const authTarget = isAuthenticated ? "/dashboard" : "/auth";
  const isAuthActive = pathname === "/auth" || pathname === "/dashboard";

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const getNavClassName = ({ isActive }) =>
    [
      "rounded-md px-3 py-2 text-sm transition-colors",
      isActive
        ? "bg-slate-800 text-white"
        : "text-slate-200 hover:bg-slate-800",
    ].join(" ");

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-3 sm:px-6">
        <Link to="/" className="text-lg font-semibold tracking-tight text-slate-100">
          Portfolio Studio
        </Link>
        <nav className="hidden items-center gap-2 sm:flex sm:gap-3">
          <NavLink to="/" end className={getNavClassName}>
            Home
          </NavLink>
          <NavLink
            to="/about"
            className={getNavClassName}
          >
            About
          </NavLink>
          <NavLink
            to="/templates"
            className={getNavClassName}
          >
            See Templates
          </NavLink>
          <Link
            to={authTarget}
            className={[
              "rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isAuthActive
                ? "bg-orange-400 text-white"
                : "bg-orange-500 text-white hover:bg-orange-400",
            ].join(" ")}
          >
            {isAuthenticated ? "Dashboard" : "Login"}
          </Link>
        </nav>

        <div className="flex items-center gap-2 sm:hidden">
          <Link
            to={authTarget}
            className={[
              "rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isAuthActive
                ? "bg-orange-400 text-white"
                : "bg-orange-500 text-white hover:bg-orange-400",
            ].join(" ")}
          >
            {isAuthenticated ? "Dashboard" : "Login"}
          </Link>
          <button
            type="button"
            aria-label={isMobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setIsMobileOpen((prev) => !prev)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-700 text-slate-200"
          >
            {isMobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {isMobileOpen ? (
        <div className="border-t border-slate-800 bg-slate-950/95 px-3 py-3 sm:hidden">
          <div className="flex flex-col gap-1">
            <NavLink to="/" end className={getNavClassName}>
              Home
            </NavLink>
            <NavLink to="/about" className={getNavClassName}>
              About
            </NavLink>
            <NavLink to="/templates" className={getNavClassName}>
              See Templates
            </NavLink>
          </div>
        </div>
      ) : null}
    </header>
  );
};

export default ShellNav;
