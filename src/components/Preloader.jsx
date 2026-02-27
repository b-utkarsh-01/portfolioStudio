import { useEffect, useState } from "react";

const Preloader = ({ isLoaded }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setProgress((prev) => {
        if (isLoaded) {
          return Math.min(100, prev + 8);
        }
        if (prev >= 93) return prev;
        if (prev < 55) return prev + 3;
        if (prev < 80) return prev + 2;
        return prev + 1;
      });
    }, 40);

    return () => window.clearInterval(intervalId);
  }, [isLoaded]);

  return (
    <div className={`preloader-overlay ${isLoaded ? "is-loaded" : ""}`} aria-hidden="true">
      <div className="preloader-core">
        <p className="preloader-title">Loading</p>
        <p className="preloader-value">{Math.round(progress)}%</p>
        <div className="preloader-bar">
          <div className="preloader-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
};

export default Preloader;