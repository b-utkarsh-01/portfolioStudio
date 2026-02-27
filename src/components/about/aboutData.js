import {Award, GraduationCap, Calendar, Briefcase, Code, ExternalLink, Terminal, Database, Cloud, Code2, Braces, Coffee, FileCode, Cpu, Atom, Globe, Palette, Wind, Server, Network, Wrench, FileJson, Flame, Box, GitBranch,Phone, Mail, Github,
} from "lucide-react";

export const sectionIcons = {
  education: GraduationCap,
  experience: Briefcase,
  projects: Code,
  certifications: Award,
  skills: Terminal,
};

export const experienceIcons = {
  calendar: Calendar,
};

export const projectIcons = {
  externalLink: ExternalLink,
};

export const contactIcons = {
  phone: Phone,
  email: Mail,
  github: Github,
};

export const skillGroupIcons = {
  programming: Code,
  frontend: Terminal,
  backend: Database,
  databases: Database,
  api: Cloud,
  cloudTools: Cloud,
};

export const skillIcons = {
  C: Code2,
  "C++": Braces,
  Java: Coffee,
  JavaScript: FileCode,
  Python: Cpu,
  "React.js": Atom,
  HTML: Globe,
  CSS: Palette,
  "Tailwind CSS": Wind,
  "Node.js": Server,
  "Express.js": Server,
  MongoDB: Database,
  MySQL: Database,
  "REST APIs": Network,
  "CRUD Operations": Wrench,
  JSON: FileJson,
  Firebase: Flame,
  "MongoDB Atlas": Cloud,
  AWS: Cloud,
  Docker: Box,
  Git: GitBranch,
};
