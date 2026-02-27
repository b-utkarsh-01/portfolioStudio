export const templateV1PreviewData = {
  profile: {
    name: "Alex Carter",
    title: ["Full Stack Developer", "MERN Engineer"],
    summary:
      "Product-focused developer with experience building scalable web apps, clean APIs, and modern UI systems.",
    highlights: ["React", "Node.js", "MongoDB"],
    contacts: [
      {
        type: "phone",
        text: "+1 (555) 012-3456",
        href: "tel:+15550123456",
        external: false,
      },
      {
        type: "email",
        text: "alex.carter@example.com",
        href: "mailto:alex.carter@example.com",
        external: false,
      },
      {
        type: "github",
        text: "github.com/alexcarter-dev",
        href: "https://github.com/alexcarter-dev",
        external: true,
      },
    ],
  },
  badgeName: {
    name: "AC",
    logo: "AC",
    badgeTitle: "Software Engineer",
  },
  skills: {
    programming: ["JavaScript", "TypeScript", "Python"],
    frontend: ["React", "Tailwind CSS", "Vite"],
    backend: ["Node.js", "Express.js", "REST APIs"],
    databases: ["MongoDB", "PostgreSQL"],
    api: ["JWT Auth", "Webhooks", "API Design"],
    cloud: ["Docker", "AWS EC2", "Vercel"],
  },
  education: [
    {
      subtitle: "Expected Graduation: May 2027",
      items: [
        {
          institute: "State University",
          degree: "B.Tech in Computer Science",
        },
      ],
    },
  ],
  experiences: [
    {
      title: "Frontend Intern",
      company: "Nova Labs",
      period: "Jan 2025 - Jun 2025",
      description:
        "Built reusable React components and improved dashboard performance with code-splitting and memoization.",
    },
    {
      title: "Freelance Developer",
      company: "Self-Employed",
      period: "2024 - Present",
      description:
        "Developed portfolio and business websites with responsive layouts, auth, and backend integrations.",
    },
  ],
  projects: [
    {
      name: "TaskFlow",
      tech: "React, Node.js, MongoDB",
      description:
        "A collaborative task manager with authentication, team boards, and activity tracking.",
      link: "https://github.com/example/taskflow",
    },
    {
      name: "ShopSphere API",
      tech: "Express.js, PostgreSQL",
      description:
        "E-commerce backend with product catalog, role-based auth, and order management endpoints.",
      link: "https://github.com/example/shopsphere-api",
    },
  ],
  certifications: [
    {
      name: "AWS Cloud Practitioner",
      provider: "Amazon Web Services",
      link: "https://www.credly.com/",
    },
    {
      name: "Meta Front-End Developer",
      provider: "Coursera",
      link: "https://www.coursera.org/",
    },
  ],
};
