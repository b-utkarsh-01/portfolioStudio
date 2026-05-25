import fs from "fs";
import path from "path";

const mode = process.argv[2];
if (!mode || !["local", "git"].includes(mode)) {
  console.error("Usage: node scripts/switch-template-source.mjs <local|git>");
  process.exit(1);
}

const packageJsonPath = path.resolve(process.cwd(), "package.json");
const raw = fs.readFileSync(packageJsonPath, "utf8");
const pkg = JSON.parse(raw);

const localDeps = {
  "portfolio-template-renderer": "file:../template-renderer",
  "portfolio-studio-default": "file:../default-templates",
  "portfolio-studio-premium": "file:../premium-templates",
};

const gitDeps = {
  "portfolio-template-renderer":
    "https://codeload.github.com/b-utkarsh-01/portfolioStudio-template-renderer/tar.gz/7bffa3a764ee92ad00ff4e08ae95b311cf1f2bcb",
  "portfolio-studio-default":
    "https://codeload.github.com/b-utkarsh-01/portfolioStudio-default/tar.gz/714ee1d0b883b2db763554e278f2f5b5cfb7f88c",
  "portfolio-studio-premium":
    "https://codeload.github.com/b-utkarsh-01/portfolioStudio-premium/tar.gz/54e65311ab39fd359354420bd309797e196df558",
};

const next = mode === "local" ? localDeps : gitDeps;
pkg.dependencies = pkg.dependencies || {};
for (const [name, value] of Object.entries(next)) {
  pkg.dependencies[name] = value;
}

fs.writeFileSync(packageJsonPath, `${JSON.stringify(pkg, null, 2)}\n`, "utf8");

console.log(`Switched template dependencies to: ${mode.toUpperCase()}`);
console.log("Now run: npm install");
