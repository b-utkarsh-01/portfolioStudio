import BlurText from "../../../components/BlurText";

const ProfileName = ({ name }) => {
  const handleAnimationComplete = () => {
    console.log("Animation completed!");
  };

  return (
    <div className="min-w-0 flex-1">
      <BlurText
        text={name}
        delay={200}
        animateBy="words"
        direction="top"
        onAnimationComplete={handleAnimationComplete}
        className="hero-text-animate text-3xl font-bold leading-tight text-slate-100 tracking-tight sm:text-5xl"
      />
    </div>
  );
};

export default ProfileName;
