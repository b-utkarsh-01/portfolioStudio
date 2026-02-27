import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import GooeyNav from "../../GooeyNav.jsx";
import { gooeyProps } from "./config";

const MobileNavDrawer = ({ isOpen, onClose }) => {
  const [mobileActiveIndex, setMobileActiveIndex] = useState(
    gooeyProps.initialActiveIndex ?? 0
  );

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-[10000] sm:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            aria-label="Close navigation overlay"
            className="absolute inset-0 bg-black/45"
            onClick={onClose}
          />

          <motion.aside
            className="absolute right-0 top-0 h-full w-[92vw] max-w-[360px] border-l border-zinc-700/70 bg-zinc-950/95 p-4 backdrop-blur"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="mb-6 flex items-center justify-between">
              <span className="text-xl font-semibold text-zinc-200">Navigation</span>
              <button
                type="button"
                aria-label="Close navigation menu"
                onClick={onClose}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-700 text-zinc-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="m-auto w-full text-center">
              <GooeyNav
                {...gooeyProps}
                initialActiveIndex={mobileActiveIndex}
                vertical
                navigationDelayMs={500}
                onNavigate={(_, index) => {
                  setMobileActiveIndex(index);
                  onClose();
                }}
              />
            </div>
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default MobileNavDrawer;
