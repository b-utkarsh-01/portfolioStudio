import { motion } from 'framer-motion';
import { usePortfolioData } from "../../../features/portfolio/PortfolioDataContext";

const HeroBadge = () => {
  const { badgeName } = usePortfolioData();

  return (
    <div className="mx-auto flex w-[170px] flex-col items-center sm:w-[190px]">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.2
        }}
        className="relative h-[145px] w-[145px] flex-shrink-0 sm:h-[165px] sm:w-[165px]"
      >
        {/* Gradient outer circle */}
        <div
          className="absolute inset-0 rounded-full "
          style={{
            background: 'linear-gradient(135deg, #22d3ee 0%, #f472b6 40%, #fb923c 70%, #facc15 100%)',
            boxShadow: '0 0 30px rgba(244, 114, 182, 0.4), 0 0 60px rgba(251, 146, 60, 0.2)',
          }}
        />

        {/* Inner circle with gradient background behind UT */}
        <div
          className="absolute rounded-full flex items-center justify-center overflow-hidden"
          style={{
            inset: '6px',
            background: 'linear-gradient(135deg, #22d3ee 0%, #f472b6 40%, #fb923c 70%, #facc15 100%)',
          }}
        >
          {/* Dark overlay for better text contrast */}
          <div className="absolute inset-0 bg-slate-900/40" />

          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="relative z-10 text-[4.5rem] leading-none tracking-[-0.04em] text-white sm:text-[6rem] xl:text-[5rem] font-black"
            style={{
              textShadow: '0 4px 20px rgba(0,0,0,0.5)',
            }}
          >
            {badgeName.logo}
          </motion.span>
        </div>

        {/* Decorative ring dots */}
        <motion.div
          className="pointer-events-none absolute inset-0"
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute left-1/2 top-[132px] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-lg sm:top-40" />
          <div className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 translate-y-3 rounded-full bg-cyan-200/90 shadow-lg" />
        </motion.div>
        <motion.div
          className="pointer-events-none absolute inset-0"
          animate={{ rotate: -360 }}
          transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute left-1/2 -top-4 h-2 w-2 -translate-x-1/2 translate-y-2 rounded-full bg-white/75 shadow-lg" />
          <div className="absolute left-1/2 top-[132px] h-2.5 w-2.5 -translate-x-1/2 -translate-y-2 rounded-full bg-orange-200/80 shadow-lg sm:top-40" />
        </motion.div>

      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.4 }}
        className="mt-5 w-fit text-center text-sm font-semibold tracking-wide text-slate-300 sm:text-base lg:text-lg"
      >
        <span className="relative inline-block">
          {badgeName.badgeTitle?.trim()}
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-400 to-orange-400 origin-left"
          />
        </span>
      </motion.p>
    </div>
  );
};

export default HeroBadge;
