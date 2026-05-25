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
    "https://codeload.github.com/b-utkarsh-01/portfolioStudio-template-renderer/tar.gz/main?rev=082c9f1",
  "portfolio-studio-default":
    "https://codeload.github.com/b-utkarsh-01/portfolioStudio-default/tar.gz/main?rev=1f7a95d",
  "portfolio-studio-premium":
    "https://codeload.github.com/b-utkarsh-01/portfolioStudio-premium/tar.gz/main?rev=7206130",
};

const next = mode === "local" ? localDeps : gitDeps;
pkg.dependencies = pkg.dependencies || {};
for (const [name, value] of Object.entries(next)) {
  pkg.dependencies[name] = value;
}

// Update overrides as well to match dependencies
if (pkg.overrides) {
  pkg.overrides["portfolio-studio-default"] = next["portfolio-studio-default"];
  pkg.overrides["portfolio-studio-premium"] = next["portfolio-studio-premium"];
  if (pkg.overrides["portfolio-template-renderer"]) {
    pkg.overrides["portfolio-template-renderer"]["portfolio-studio-default"] = next["portfolio-studio-default"];
    pkg.overrides["portfolio-template-renderer"]["portfolio-studio-premium"] = next["portfolio-studio-premium"];
  }
}

fs.writeFileSync(packageJsonPath, `${JSON.stringify(pkg, null, 2)}\n`, "utf8");

console.log(`Switched template dependencies and overrides to: ${mode.toUpperCase()}`);
console.log("Now run: npm install");

