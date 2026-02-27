import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "./aboutAnimations";
import SectionHeader from "./SectionHeader";
import { usePortfolioData } from "../../features/portfolio/PortfolioDataContext";

const ExperienceSection = () => {
  const { experiences, experienceIcons, sectionIcons } = usePortfolioData();
  const CalendarIcon = experienceIcons.calendar;

  return (
    <motion.section
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-80px" }}
    variants={staggerContainer}
    className="no-cursor-target space-y-5"
  >
    <SectionHeader icon={sectionIcons.experience} title="Experience" />
    <div className="rounded-3xl border border-slate-700 bg-slate-900/60 p-5 sm:p-6">
      {experiences.map((item) => (
        <motion.div
          key={`${item.title}-${item.company}`}
          variants={fadeInUp}
          className="relative pl-6 sm:pl-8 border-l-2 border-slate-700 pb-6 last:pb-0"
        >
          <span className="absolute -left-1.5 top-1 h-3 w-3 rounded-full bg-orange-400" />
          <h3 className="text-base sm:text-lg font-semibold text-slate-100">{item.title}</h3>
          <p className="text-orange-300 text-sm">{item.company}</p>
          <p className="text-slate-400 text-xs sm:text-sm flex items-center gap-2 mt-1">
            <CalendarIcon className="w-4 h-4" />
            {item.period}
          </p>
          <p className="text-slate-300 text-sm mt-2 leading-relaxed">{item.description}</p>
        </motion.div>
      ))}
    </div>
  </motion.section>
  );
};

export default ExperienceSection;
