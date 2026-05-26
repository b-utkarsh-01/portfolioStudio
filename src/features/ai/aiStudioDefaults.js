export const aiStages = [
  { key: "input", label: "Resume Input" },
  { key: "idea", label: "Portfolio Idea" },
  { key: "generate", label: "Generate & Apply" },
];

export const defaultDesignControls = {
  primaryColor: "#22c55e",
  secondaryColor: "#10b981",
  accentColor: "#06b6d4",
  backgroundColor: "#020617",
  surfaceColor: "#0f172a",
  themeMode: "auto",
  graphics: "yes",
  stylePreset: "professional",
  variationSeed: "",
};

export const defaultStructuredResume = {
  name: "",
  email: "",
  phone: "",
  summary: "",
  skills: "",
  education: "",
  projects: "",
  experience: "",
};

export const defaultResumeSubStages = [
  { key: "profile", label: "Profile", enabled: true },
  { key: "skills", label: "Skills", enabled: true },
  { key: "education", label: "Education", enabled: true },
  { key: "projects", label: "Projects", enabled: true },
];

export const defaultThinkingMessages = [
  "AI resume parse kar raha hai",
  "Skills aur profile details extract ho rahi hain",
  "Template-compatible draft compose ho raha hai",
  "Final validation aur cleanup chal raha hai",
];
