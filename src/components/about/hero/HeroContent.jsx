import Pill from "../Pill";
import TextType from '../../../components/TextType';
import DecryptedText from '../../../components/DecryptedText';
import { usePortfolioData } from "../../../features/portfolio/PortfolioDataContext";

const HeroContent = ({ profile, shortSummary }) => {
  const { contactIcons } = usePortfolioData();

  return (
    <>
    <div className="min-w-0 space-y-4 text-left sm:space-y-5">
      
      <TextType
        text={profile.title}
        typingSpeed={75}
        pauseDuration={1500}
        showCursor
        cursorCharacter="_"
        deletingSpeed={50}
        variableSpeedEnabled={false}
        variableSpeedMin={60}
        variableSpeedMax={120}
        cursorBlinkDuration={0.5}
        className="hero-text-animate text-lg font-semibold leading-tight text-slate-300 sm:text-[2rem]"
      />
      <div className="max-w-3xl font-mono text-base leading-relaxed text-slate-400 sm:text-lg">
        <DecryptedText
          text={shortSummary}
          animateOn="view"
          revealDirection="start"
          sequential
          useOriginalCharsOnly={false}
        />
      </div>

      <div className="hero-text-animate flex flex-wrap gap-2">
        {profile.highlights.slice(0, 3).map((highlight) => (
          <Pill key={highlight} text={highlight} />
        ))}
      </div>

      <div className="hero-text-animate flex flex-wrap items-center gap-2">
        {profile.contacts?.map((contact) => {
          const Icon = contactIcons[contact.type];
          return (
            <a
              key={contact.href}
              href={contact.href}
              className="inline-flex cursor-none"
              target={contact.external ? "_blank" : undefined}
              rel={contact.external ? "noreferrer" : undefined}
              aria-label={contact.text}
              title={contact.text}
            >
              <Pill icon={Icon} iconOnly />
            </a>
          );
        })}
      </div>

    </div>
    </>
  );
};

export default HeroContent;
