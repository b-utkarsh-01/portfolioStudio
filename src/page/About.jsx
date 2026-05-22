import {
  CertificationsSection,
  CustomStagesSection,
  EducationSection,
  ExperienceSection,
  HeroSection,
  ProjectsSection,
  ServicesSection,
  SimpleHeroSection,
  SkillsSection,
  TestimonialsSection,
} from "portfolio-studio-premium/src";
import { usePortfolioData } from "../features/portfolio/PortfolioDataContext";

const getStage = (stages, id, fallbackTitle) => {
  const match = (Array.isArray(stages) ? stages : []).find((stage) => stage?.id === id);
  return {
    enabled: match?.enabled !== false,
    title: match?.title?.trim() || fallbackTitle,
  };
};

const About = ({ appReady, templateId = "default-v1" }) => {
  const { layout } = usePortfolioData();
  const stages = layout?.stages || [];
  const usePremiumVisualHero = templateId === "premium-v1";

  const profileStage = getStage(stages, "profile", "Profile");
  const workStage = getStage(stages, "work", "Work & Education");
  const skillsStage = getStage(stages, "skills", "Skills");
  const socialStage = getStage(stages, "social", "Services & Reviews");
  const publishStage = getStage(stages, "publish", "Publish");

  return (
    <div id="top" className="mx-auto max-w-6xl space-y-8 pb-32 sm:pb-36">
      {profileStage.enabled ? (
        <section id="hero" className="scroll-mt-24 no-cursor-target">
          {usePremiumVisualHero ? <HeroSection appReady={appReady} /> : <SimpleHeroSection />}
        </section>
      ) : null}
      {workStage.enabled ? (
        <section id="education" className="scroll-mt-24 no-cursor-target">
          <EducationSection title={workStage.title} />
        </section>
      ) : null}
      {skillsStage.enabled ? (
        <section id="skills" className="scroll-mt-24">
          <SkillsSection title={skillsStage.title} />
        </section>
      ) : null}
      {workStage.enabled ? (
        <section id="experience" className="scroll-mt-24 no-cursor-target">
          <ExperienceSection title={workStage.title} />
        </section>
      ) : null}
      {workStage.enabled ? (
        <section id="projects" className="scroll-mt-24">
          <ProjectsSection title={workStage.title} />
        </section>
      ) : null}
      {socialStage.enabled ? (
        <section id="services" className="scroll-mt-24">
          <ServicesSection title={socialStage.title} />
        </section>
      ) : null}
      {socialStage.enabled ? (
        <section id="testimonials" className="scroll-mt-24">
          <TestimonialsSection title={socialStage.title} />
        </section>
      ) : null}
      {publishStage.enabled ? (
        <section id="certifications" className="scroll-mt-24">
          <CertificationsSection title={publishStage.title} />
        </section>
      ) : null}
      <section id="custom-stages" className="scroll-mt-24">
        <CustomStagesSection />
      </section>
    </div>
  );
};

export default About;

