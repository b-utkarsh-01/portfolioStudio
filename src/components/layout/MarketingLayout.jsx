import { Outlet } from "react-router-dom";
import ShellNav from "./ShellNav";

const MarketingLayout = () => (
  <div className="min-h-screen bg-slate-950 text-white">
    <ShellNav />
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <Outlet />
    </main>
  </div>
);

export default MarketingLayout;
