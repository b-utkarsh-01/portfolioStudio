export const navItems = [
  { label: "Home", href: "#hero" },
  { label: "Education", href: "#education" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Certifications", href: "#certifications" },
];

export const gooeyProps = {
  items: navItems,
  particleCount: 15,
  particleDistances: [90, 10],
  particleR: 100,
  initialActiveIndex: 0,
  syncWithScroll: true,
  scrollSpyOffset: 130,
  animationTime: 600,
  timeVariance: 300,
  colors: [1, 2, 3, 1, 2, 3, 1, 4],
  activeBg: "#ffffff",
  activeText: "#000000",
  inactiveText: "#e5e7eb",
};
