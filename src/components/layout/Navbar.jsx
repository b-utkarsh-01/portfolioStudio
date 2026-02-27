import { useEffect, useState } from "react";
import BrandLink from "./navbar/BrandLink";
import DesktopGooeyNav from "./navbar/DesktopGooeyNav";
import MobileMenuButton from "./navbar/MobileMenuButton";
import MobileNavDrawer from "./navbar/MobileNavDrawer";

const Navbar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, [isMobileOpen]);

  return (
    <>
      <header className="no-cursor-target fixed bottom-2 left-1/2 z-50 w-[calc(100vw-12px)] max-w-[980px] -translate-x-1/2 sm:bottom-6 sm:w-[min(96vw,980px)]">
        <nav className="flex items-center justify-between gap-1 rounded-2xl border border-zinc-700/70 bg-zinc-900/90 p-1.5 backdrop-blur sm:gap-2 sm:p-2 ">
          <BrandLink />
          <DesktopGooeyNav />
          <MobileMenuButton
            isOpen={isMobileOpen}
            onToggle={() => setIsMobileOpen((prev) => !prev)}
          />
        </nav>
      </header>
      <MobileNavDrawer isOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)} />
    </>
  );
};

export default Navbar;
