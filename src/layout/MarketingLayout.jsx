import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import DesktopNav from "./components/DesktopNav";
import MobileNav from "./components/MobileNav";
import MobileDrawer from "./components/MobileDrawer";

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

export default MarketingLayout;
