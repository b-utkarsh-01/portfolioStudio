import { useEffect, useState } from "react";

const HeroClock = ({ className = "" }) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div
      className={[
        "shrink-0 rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-1.5 text-center",
        className,
      ].join(" ")}
    >
      <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-300/80">
        Current Time
      </p>
      <p className="font-mono uppercase text-xs font-semibold text-emerald-300 sm:text-sm">
        {now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })}
      </p>
    </div>
  );
};

export default HeroClock;
