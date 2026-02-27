import { useEffect, useRef } from "react";
import gsap from "gsap";
import HeroBackground from "./hero/HeroBackground";
import HeroContent from "./hero/HeroContent";
import HeroBadge from "./hero/HeroBadge";
import HeroClock from "./hero/HeroClock";
import ProfileName from "./hero/ProfileName";
import { usePortfolioData } from "../../features/portfolio/PortfolioDataContext";

const HeroSection = ({ appReady = true }) => {
  const heroRef = useRef(null);
  const { profile } = usePortfolioData();
  const shortSummary = profile.summary.split(".")[0] + ".";

  useEffect(() => {
    if (!appReady) return;
    const ctx = gsap.context(() => {
      gsap.to(".ut-logo-container", {
        y: -6,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.from(".hero-text-animate", {
        opacity: 0,
        y: 20,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
      });
    }, heroRef);
    return () => ctx.revert();
  }, [appReady]);

  return (

    <section
      ref={heroRef}
      className="relative no-cursor-target w-full overflow-hidden rounded-3xl bg-[#040b1d] px-4 py-7 sm:px-6 sm:py-10"
    >
      <HeroBackground />
      <div className="mb-6 flex w-full flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <ProfileName name={profile.name} />
        <HeroClock className="z-0 w-fit self-start sm:mt-1 sm:self-auto" />
      </div>
      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-8 sm:gap-12 md:flex-row md:items-center">
        <HeroContent
          key={`hero-content-${appReady ? "ready" : "loading"}`}
          profile={profile}
          shortSummary={shortSummary}
        />
        
        <div className="flex w-full flex-shrink-0 flex-col items-center gap-3 md:w-auto lg:items-end">
          <HeroBadge key={`hero-badge-${appReady ? "ready" : "loading"}`} />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
