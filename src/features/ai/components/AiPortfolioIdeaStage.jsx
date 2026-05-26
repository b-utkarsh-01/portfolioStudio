const PALETTE_PRESETS = [
  { name: "Emerald Pro", primary: "#22c55e", secondary: "#10b981", accent: "#06b6d4", background: "#020617", surface: "#0f172a" },
  { name: "Sunset", primary: "#f97316", secondary: "#fb7185", accent: "#facc15", background: "#1f2937", surface: "#111827" },
  { name: "Ocean", primary: "#0ea5e9", secondary: "#14b8a6", accent: "#22d3ee", background: "#082f49", surface: "#0c4a6e" },
  { name: "Royal", primary: "#6366f1", secondary: "#8b5cf6", accent: "#a78bfa", background: "#1e1b4b", surface: "#312e81" },
  { name: "Cartoon Pop", primary: "#ff2d2d", secondary: "#ff7a00", accent: "#ffe600", background: "#ffffff", surface: "#fff7cc" },
  { name: "Mono Clean", primary: "#334155", secondary: "#64748b", accent: "#0f172a", background: "#f8fafc", surface: "#ffffff" },
  { name: "Cyber Neon", primary: "#00f5d4", secondary: "#00bbf9", accent: "#f15bb5", background: "#030712", surface: "#111827" },
];

const AiPortfolioIdeaStage = ({ designControls, setDesignControls }) => (
  <div className="flex h-full min-h-0 flex-col gap-3">
    <p className="text-sm text-slate-200">Design Controls</p>
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {PALETTE_PRESETS.map((preset) => (
        <button
          key={preset.name}
          type="button"
          onClick={() =>
            setDesignControls((prev) => ({
              ...prev,
              primaryColor: preset.primary,
              secondaryColor: preset.secondary,
              accentColor: preset.accent,
              backgroundColor: preset.background,
              surfaceColor: preset.surface,
            }))
          }
          className="rounded-md border border-slate-700 bg-slate-950/50 px-3 py-2 text-left text-xs text-slate-200 hover:bg-slate-800"
        >
          <div className="mb-1 font-semibold">{preset.name}</div>
          <div className="flex gap-1">
            {[preset.primary, preset.secondary, preset.accent, preset.background].map((color) => (
              <span key={color} className="h-3 w-3 rounded-full border border-slate-600" style={{ background: color }} />
            ))}
          </div>
        </button>
      ))}
    </div>
    <div className="grid gap-3 sm:grid-cols-2">
      <label className="text-xs text-slate-300">
        Primary Color
        <input
          type="color"
          value={designControls.primaryColor}
          onChange={(event) =>
            setDesignControls((prev) => ({ ...prev, primaryColor: event.target.value }))
          }
          className="mt-1 h-10 w-full rounded-md border border-slate-700 bg-slate-950/60 p-1"
        />
      </label>
      <label className="text-xs text-slate-300">
        Secondary Color
        <input
          type="color"
          value={designControls.secondaryColor}
          onChange={(event) =>
            setDesignControls((prev) => ({ ...prev, secondaryColor: event.target.value }))
          }
          className="mt-1 h-10 w-full rounded-md border border-slate-700 bg-slate-950/60 p-1"
        />
      </label>
      <label className="text-xs text-slate-300">
        Accent Color
        <input
          type="color"
          value={designControls.accentColor}
          onChange={(event) =>
            setDesignControls((prev) => ({ ...prev, accentColor: event.target.value }))
          }
          className="mt-1 h-10 w-full rounded-md border border-slate-700 bg-slate-950/60 p-1"
        />
      </label>
      <label className="text-xs text-slate-300">
        Background Color
        <input
          type="color"
          value={designControls.backgroundColor}
          onChange={(event) =>
            setDesignControls((prev) => ({ ...prev, backgroundColor: event.target.value }))
          }
          className="mt-1 h-10 w-full rounded-md border border-slate-700 bg-slate-950/60 p-1"
        />
      </label>
      <label className="text-xs text-slate-300">
        Surface Color
        <input
          type="color"
          value={designControls.surfaceColor}
          onChange={(event) =>
            setDesignControls((prev) => ({ ...prev, surfaceColor: event.target.value }))
          }
          className="mt-1 h-10 w-full rounded-md border border-slate-700 bg-slate-950/60 p-1"
        />
      </label>
      <label className="text-xs text-slate-300">
        Graphics
        <select
          value={designControls.graphics}
          onChange={(event) =>
            setDesignControls((prev) => ({ ...prev, graphics: event.target.value }))
          }
          className="mt-1 h-10 w-full rounded-md border border-slate-700 bg-slate-950/60 px-2 text-sm text-slate-100"
        >
          <option value="yes">Yes (rich visuals)</option>
          <option value="no">No (clean/minimal)</option>
        </select>
      </label>
      <label className="text-xs text-slate-300">
        Theme Mode
        <select
          value={designControls.themeMode}
          onChange={(event) =>
            setDesignControls((prev) => ({ ...prev, themeMode: event.target.value }))
          }
          className="mt-1 h-10 w-full rounded-md border border-slate-700 bg-slate-950/60 px-2 text-sm text-slate-100"
        >
          <option value="auto">Auto</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </label>
      <label className="text-xs text-slate-300 sm:col-span-2">
        Portfolio Style
        <select
          value={designControls.stylePreset}
          onChange={(event) =>
            setDesignControls((prev) => ({ ...prev, stylePreset: event.target.value }))
          }
          className="mt-1 h-10 w-full rounded-md border border-slate-700 bg-slate-950/60 px-2 text-sm text-slate-100"
        >
          <option value="professional">Professional</option>
          <option value="cartoon">Cartoon</option>
          <option value="cyberpunk">Cyberpunk</option>
          <option value="minimal">Minimal</option>
        </select>
      </label>
      <label className="text-xs text-slate-300 sm:col-span-2">
        Variation Seed
        <input
          type="text"
          value={designControls.variationSeed}
          onChange={(event) =>
            setDesignControls((prev) => ({ ...prev, variationSeed: event.target.value }))
          }
          className="mt-1 h-10 w-full rounded-md border border-slate-700 bg-slate-950/60 px-2 text-sm text-slate-100"
          placeholder="Optional: e.g. 101, cartoon-v2"
        />
      </label>
    </div>
  </div>
);

export default AiPortfolioIdeaStage;
