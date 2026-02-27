import { Menu } from "lucide-react";

const MobileMenuButton = ({ isOpen, onToggle }) => {
  return (
    <button
      type="button"
      aria-label="Open navigation menu"
      aria-expanded={isOpen}
      onClick={onToggle}
      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-600/80 bg-zinc-800 text-zinc-100 sm:hidden"
    >
      <Menu className="h-5 w-5" />
    </button>
  );
};

export default MobileMenuButton;
