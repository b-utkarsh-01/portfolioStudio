import HeroSection from "../components/about/HeroSection";
import EducationSection from "../components/about/EducationSection";
import SkillsSection from "../components/about/SkillsSection";
import ExperienceSection from "../components/about/ExperienceSection";
import ProjectsSection from "../components/about/ProjectsSection";
import CertificationsSection from "../components/about/CertificationsSection";

const About = ({ appReady }) => {
  return (
    <div id="top" className="mx-auto max-w-6xl space-y-8 pb-32 sm:pb-36">
      <section id="hero" 
       className="scroll-mt-24 no-cursor-target">
        <HeroSection appReady={appReady} />
      </section>
      <section id="education" className="scroll-mt-24 no-cursor-target">
        <EducationSection />
      </section>
      <section id="skills" className="scroll-mt-24">
        <SkillsSection />
      </section>
      <section id="experience" className="scroll-mt-24 no-cursor-target">
        <ExperienceSection />
      </section>
      <section id="projects" className="scroll-mt-24">
        <ProjectsSection />
      </section>
      <section id="certifications" className="scroll-mt-24">
        <CertificationsSection />
      </section>
    </div>
  );
};

export default About;
