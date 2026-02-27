import { motion } from "framer-motion";
import { fadeInUp } from "./aboutAnimations";
import SectionHeader from "./SectionHeader";
import { usePortfolioData } from "../../features/portfolio/PortfolioDataContext";

const EducationSection = () => {
  const { education, sectionIcons } = usePortfolioData();

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={fadeInUp}
      className="no-cursor-target rounded-3xl border border-slate-700 bg-slate-900/60 p-5 sm:p-7"
    >
      <SectionHeader icon={sectionIcons.education} title="Education" />
      <div className="mt-4 space-y-4">
        {education.map((entry) => (
          <div key={entry.subtitle} className="space-y-3">
            <p className="text-sm font-medium text-orange-300">{entry.subtitle}</p>
            {entry.items.map((item) => (
              <div
                key={`${entry.subtitle}-${item.institute}-${item.degree}`}
                className="rounded-2xl border border-slate-700 bg-slate-950/50 p-4"
              >
                <h3 className="text-base sm:text-lg text-slate-100 font-semibold">
                  {item.institute}
                </h3>
                <p className="text-slate-400 text-sm sm:text-base mt-1">{item.degree}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </motion.section>
  );
};

export default EducationSection;
