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
  "portfolio-template-renderer": "git+https://github.com/b-utkarsh-01/portfolioStudio-template-renderer.git",
  "portfolio-studio-default": "git+https://github.com/b-utkarsh-01/portfolioStudio-default.git",
  "portfolio-studio-premium": "git+https://github.com/b-utkarsh-01/portfolioStudio-premium.git",
};

const next = mode === "local" ? localDeps : gitDeps;
pkg.dependencies = pkg.dependencies || {};
for (const [name, value] of Object.entries(next)) {
  pkg.dependencies[name] = value;
}

fs.writeFileSync(packageJsonPath, `${JSON.stringify(pkg, null, 2)}\n`, "utf8");

console.log(`Switched template dependencies to: ${mode.toUpperCase()}`);
console.log("Now run: npm install");
