import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "./aboutAnimations";
import SectionHeader from "./SectionHeader";
import { usePortfolioData } from "../../features/portfolio/PortfolioDataContext";

const ProjectsSection = () => {
  const { projects, projectIcons, sectionIcons } = usePortfolioData();
  const ExternalLinkIcon = projectIcons.externalLink;

  return (
    <motion.section
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-80px" }}
    variants={staggerContainer}
    className="space-y-5"
  >
    <SectionHeader icon={sectionIcons.projects} title="Projects" subtitle="Selected work" />
    <div className=" grid grid-cols-1 md:grid-cols-2 gap-4">
      {projects.map((project) => (
        <motion.article
          key={project.name}
          variants={fadeInUp}
          whileHover={{ y: -4 }}
          className="cursor-target rounded-2xl border border-slate-700 bg-slate-900/60 p-4 sm:p-5"
        >
          <div className=" flex items-start justify-between gap-2">
            <h3 className="text-slate-100 font-semibold text-base sm:text-lg">{project.name}</h3>
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-400 hover:text-orange-300 transition-colors"
            >
              <ExternalLinkIcon className="w-4 h-4" />
            </a>
          </div>
          <p className="text-orange-300 text-sm mt-1">{project.tech}</p>
          <p className="text-slate-300 text-sm mt-2 leading-relaxed">{project.description}</p>
        </motion.article>
      ))}
    </div>
  </motion.section>
  );
};

export default ProjectsSection;
