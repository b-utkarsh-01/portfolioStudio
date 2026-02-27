import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "./aboutAnimations";
import SectionHeader from "./SectionHeader";
import { usePortfolioData } from "../../features/portfolio/PortfolioDataContext";

const CertificationsSection = () => {
  const { certifications, sectionIcons } = usePortfolioData();

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={staggerContainer}
      className="space-y-5"
    >
      <SectionHeader icon={sectionIcons.certifications} title="Certifications" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {certifications.map((cert) => (
          <motion.a
            key={cert.name}
            href={cert.link}
            target="_blank"
            rel="noopener noreferrer"
            variants={fadeInUp}
            whileHover={{ scale: 1.01 }}
            className="cursor-none cursor-target block rounded-2xl border border-slate-700 bg-slate-900/60 p-4"
          >
            <h3 className="text-slate-100 font-semibold">{cert.name}</h3>
            <p className="mt-1 text-sm text-slate-400">{cert.provider}</p>
          </motion.a>
        ))}
      </div>
    </motion.section>
  );
};

export default CertificationsSection;
