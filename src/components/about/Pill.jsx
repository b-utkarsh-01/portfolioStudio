const Pill = ({
  text,
  icon: Icon,
  textClassName = "text-slate-200",
  iconClassName = "text-slate-300",
  hoverClassName = "hover:border-slate-500 hover:bg-slate-800/80",
  className = "",
  iconOnly = false,
}) => {
  const isIconOnly = iconOnly || (!text && !!Icon);

  return (
    <span
      className={[
        "group inline-flex rounded-full border border-slate-600 bg-slate-900/80 transition-all duration-200 hover:scale-105",
        isIconOnly
          ? "h-10 w-10 items-center justify-center p-0"
          : "items-center gap-1.5 px-3 py-1 text-xs sm:text-sm",
        hoverClassName,
        className,
      ].join(" ")}
    >
      {Icon ? (
        <Icon
          className={[
            "transition-transform duration-200 group-hover:scale-125",
            isIconOnly ? "h-4 w-4" : "h-3.5 w-3.5",
            iconClassName,
          ].join(" ")}
        />
      ) : null}
      {!isIconOnly ? <span className={textClassName}>{text}</span> : null}
    </span>
  );
};

export default Pill;
