import { describe, it, expect } from "vitest";
import { readFile } from "fs/promises";
import { generateCSharpCode, extractTokens } from "./generate-csharp.js";
import { generateCSS } from "./generate-css.js";
import { writeFile, unlink } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";

// ---------------------------------------------------------------------------
// Shared fixtures
// ---------------------------------------------------------------------------

const SCALE_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
const HEX_RE = /^#[0-9a-fA-F]{6}$/;

/** Minimal source token set with one scalable color */
const sourceWithScale = {
  color: {
    red: {
      value: "#ef4444",
      type: "color",
      scale: {
        50: "#fff1ef",
        100: "#ffdeda",
        200: "#ffc2bc",
        300: "#fe9b93",
        400: "#f76c65",
        500: "#dd3e3e",
        600: "#b63232",
        700: "#912626",
        800: "#6e1a1a",
        900: "#490e0e",
        950: "#2d0606",
      },
    },
    /** Theme-only token that has no scale */
    black: { value: "#000000", type: "color" },
    white: { value: "#ffffff", type: "color" },
  },
};

// ---------------------------------------------------------------------------
// tokens.json — scale shape contract
// ---------------------------------------------------------------------------

describe("$tokens.json: color scale shape", () => {
  it("source color tokens with a scale have all 11 steps (50–950)", async () => {
    const raw = JSON.parse(await readFile("figma-tokens/$tokens.json", "utf-8"));
    const sourceColors =
      raw["ivy-framework"]["ivy-framework"]["source"]["color"];

    for (const [name, token] of Object.entries(sourceColors) as [string, any][]) {
      if (!token.scale) continue;
      const keys = Object.keys(token.scale).map(Number).sort((a, b) => a - b);
      expect(keys, `${name} scale steps`).toEqual([...SCALE_STEPS]);
    }
  });

  it("every scale shade is a valid 6-digit hex color", async () => {
    const raw = JSON.parse(await readFile("figma-tokens/$tokens.json", "utf-8"));
    const sourceColors =
      raw["ivy-framework"]["ivy-framework"]["source"]["color"];

    for (const [name, token] of Object.entries(sourceColors) as [string, any][]) {
      if (!token.scale) continue;
      for (const [step, shade] of Object.entries(token.scale) as [string, string][]) {
        expect(shade, `${name}-${step}`).toMatch(HEX_RE);
      }
    }
  });

  it("scale is present on all 23 expected chromatic/neutral source colors", async () => {
    const expectedColors = [
      "red", "orange", "amber", "yellow", "lime", "green", "emerald",
      "teal", "cyan", "sky", "blue", "indigo", "violet", "purple",
      "fuchsia", "pink", "rose", "slate", "gray", "zinc", "neutral",
      "stone", "ivy-green",
    ];
    const raw = JSON.parse(await readFile("figma-tokens/$tokens.json", "utf-8"));
    const sourceColors =
      raw["ivy-framework"]["ivy-framework"]["source"]["color"];

    for (const name of expectedColors) {
      expect(sourceColors[name], `${name} token exists`).toBeDefined();
      expect(sourceColors[name].scale, `${name} has scale`).toBeDefined();
    }
  });

  it("UI surface tokens (black, white, primary, border, etc.) have no scale", async () => {
    const skipTokens = [
      "primary", "black", "white", "secondary-light", "secondary-dark",
      "destructive", "success", "warning", "info", "border", "border-secondary",
      "ring", "muted-light", "muted-dark", "muted-foreground",
      "accent-foreground-light", "card-foreground-light", "card-dark",
      "background-dark",
    ];
    const raw = JSON.parse(await readFile("figma-tokens/$tokens.json", "utf-8"));
    const sourceColors =
      raw["ivy-framework"]["ivy-framework"]["source"]["color"];

    for (const name of skipTokens) {
      if (!sourceColors[name]) continue;
      expect(sourceColors[name].scale, `${name} must not have scale`).toBeUndefined();
    }
  });
});

// ---------------------------------------------------------------------------
// generate-css.ts — CSS output for scale shades
// ---------------------------------------------------------------------------

describe("generateCSS: color scale output", () => {
  it("emits base color var followed by all 11 scale shade vars", async () => {
    const tmp = join(tmpdir(), `scale-test-${Date.now()}.css`);
    try {
      await generateCSS({ color: sourceWithScale.color }, tmp, false);
      const css = await readFile(tmp, "utf-8");

      // Base var
      expect(css).toContain("--color-red: #ef4444;");

      // All scale steps
      for (const step of SCALE_STEPS) {
        expect(css).toContain(`--color-red-${step}:`);
        const match = css.match(new RegExp(`--color-red-${step}: (#[0-9a-fA-F]{6});`));
        expect(match, `--color-red-${step} is a hex color`).not.toBeNull();
      }
    } finally {
      await unlink(tmp).catch(() => {});
    }
  });

  it("scale shades appear immediately after the base color var", async () => {
    const tmp = join(tmpdir(), `scale-order-${Date.now()}.css`);
    try {
      await generateCSS({ color: sourceWithScale.color }, tmp, false);
      const css = await readFile(tmp, "utf-8");
      const lines = css.split("\n").map(l => l.trim()).filter(Boolean);

      const baseIdx = lines.findIndex(l => l.startsWith("--color-red:"));
      expect(baseIdx).toBeGreaterThan(-1);
      expect(lines[baseIdx + 1]).toMatch(/^--color-red-50:/);
      expect(lines[baseIdx + SCALE_STEPS.length]).toMatch(/^--color-red-950:/);
    } finally {
      await unlink(tmp).catch(() => {});
    }
  });

  it("tokens without a scale do not emit extra vars", async () => {
    const tmp = join(tmpdir(), `no-scale-${Date.now()}.css`);
    try {
      await generateCSS({ color: sourceWithScale.color }, tmp, false);
      const css = await readFile(tmp, "utf-8");

      // black has no scale — only --color-black should appear, not --color-black-50
      expect(css).toContain("--color-black: #000000;");
      expect(css).not.toContain("--color-black-50");
    } finally {
      await unlink(tmp).catch(() => {});
    }
  });

  it("all scale shade values in CSS are valid hex colors", async () => {
    const tmp = join(tmpdir(), `scale-valid-${Date.now()}.css`);
    try {
      await generateCSS({ color: sourceWithScale.color }, tmp, false);
      const css = await readFile(tmp, "utf-8");

      const scaleVarRe = /--color-red-\d+:\s*(#[^\s;]+);/g;
      const matches = [...css.matchAll(scaleVarRe)];
      expect(matches.length).toBe(SCALE_STEPS.length);
      for (const m of matches) {
        expect(m[1]).toMatch(HEX_RE);
      }
    } finally {
      await unlink(tmp).catch(() => {});
    }
  });
});

// ---------------------------------------------------------------------------
// generate-css.ts — built CSS files
// ---------------------------------------------------------------------------

describe("Built CSS files: source color scales", () => {
  it("ivy-framework-source.css contains scale shades for every scalable color", async () => {
    const css = await readFile("dist/css/ivy-framework-source.css", "utf-8");
    const scalableColors = [
      "red", "orange", "amber", "yellow", "lime", "green", "emerald",
      "teal", "cyan", "sky", "blue", "indigo", "violet", "purple",
      "fuchsia", "pink", "rose", "slate", "gray", "zinc", "neutral",
      "stone", "ivy-green",
    ];

    for (const color of scalableColors) {
      expect(css, `base var --color-${color}`).toContain(`--color-${color}:`);
      for (const step of SCALE_STEPS) {
        expect(css, `--color-${color}-${step}`).toContain(`--color-${color}-${step}:`);
      }
    }
  });

  it("every scale shade value in source CSS is a valid hex color", async () => {
    const css = await readFile("dist/css/ivy-framework-source.css", "utf-8");
    const scaleVarRe = /--color-[\w-]+-\d+:\s*(#[^\s;]+);/g;
    const matches = [...css.matchAll(scaleVarRe)];

    // 23 colors × 11 steps = 253
    expect(matches.length).toBe(253);
    for (const m of matches) {
      expect(m[1]).toMatch(HEX_RE);
    }
  });

  it("neutral and chromatic CSS files do NOT contain scale shades", async () => {
    const [neutral, chromatic] = await Promise.all([
      readFile("dist/css/ivy-framework-neutral.css", "utf-8"),
      readFile("dist/css/ivy-framework-chromatic.css", "utf-8"),
    ]);

    // These files use resolved references to source colors — no scale shades
    expect(neutral).not.toMatch(/--color-[\w]+-\d{2,3}:/);
    expect(chromatic).not.toMatch(/--color-[\w]+-\d{2,3}:/);
  });

  it("theme CSS files (light/dark) do NOT contain scale shades", async () => {
    const [light, dark] = await Promise.all([
      readFile("dist/css/ivy-framework-light.css", "utf-8"),
      readFile("dist/css/ivy-framework-dark.css", "utf-8"),
    ]);

    expect(light).not.toMatch(/--color-[\w]+-\d{2,3}:/);
    expect(dark).not.toMatch(/--color-[\w]+-\d{2,3}:/);
  });
});

// ---------------------------------------------------------------------------
// generate-csharp.ts — extractTokens handles scale
// ---------------------------------------------------------------------------

describe("extractTokens: color scale", () => {
  it("emits base token followed by 11 scale shade tokens", () => {
    const tokens = extractTokens(sourceWithScale);
    const redBase = tokens.find(t => t.name === "red");
    expect(redBase).toBeDefined();
    expect(redBase!.value).toBe("#ef4444");

    for (const step of SCALE_STEPS) {
      const shade = tokens.find(t => t.name === `red-${step}`);
      expect(shade, `token red-${step}`).toBeDefined();
      expect(shade!.value).toMatch(HEX_RE);
      expect(shade!.propertyName).toBe(`Red_${step}`);
      expect(shade!.category).toBe("color");
    }
  });

  it("tokens without scale produce only the base token", () => {
    const tokens = extractTokens(sourceWithScale);
    const blackTokens = tokens.filter(t => t.name.startsWith("black"));
    expect(blackTokens).toHaveLength(1);
    expect(blackTokens[0].value).toBe("#000000");
  });

  it("total tokens = base colors + (scalable × 11)", () => {
    // sourceWithScale has 3 colors: red (with scale), black, white
    const tokens = extractTokens(sourceWithScale);
    // 3 base + 11 shades for red = 14
    expect(tokens).toHaveLength(14);
  });
});

// ---------------------------------------------------------------------------
// generateCSharpCode — C# output for scale shades
// ---------------------------------------------------------------------------

describe("generateCSharpCode: color scale output", () => {
  it("emits Red base property and all 11 shade properties", () => {
    const code = generateCSharpCode({ source: sourceWithScale }, "SourceTokens", "Ivy.Themes");

    expect(code).toContain('public static readonly string Red = "#ef4444"');

    for (const step of SCALE_STEPS) {
      expect(code).toContain(`public static readonly string Red_${step}`);
      const match = code.match(
        new RegExp(`public static readonly string Red_${step} = "(#[0-9a-fA-F]{6})"`)
      );
      expect(match, `Red_${step} is a hex color`).not.toBeNull();
    }
  });

  it("scale shade properties use underscore notation (Red_50 not Red50)", () => {
    const code = generateCSharpCode({ source: sourceWithScale }, "SourceTokens", "Ivy.Themes");
    expect(code).toContain("Red_50");
    expect(code).not.toMatch(/\bRed50\b/);
  });

  it("tokens without scale only produce their base property", () => {
    const code = generateCSharpCode({ source: sourceWithScale }, "SourceTokens", "Ivy.Themes");
    expect(code).toContain('public static readonly string Black = "#000000"');
    expect(code).not.toMatch(/\bBlack_50\b/);
  });

  it("all scale shade values in C# are valid hex colors", () => {
    const code = generateCSharpCode({ source: sourceWithScale }, "SourceTokens", "Ivy.Themes");
    const shadeRe = /public static readonly string Red_\d+ = "(#[^"]+)"/g;
    const matches = [...code.matchAll(shadeRe)];
    expect(matches).toHaveLength(SCALE_STEPS.length);
    for (const m of matches) {
      expect(m[1]).toMatch(HEX_RE);
    }
  });

  it("total token count in remarks = base + scale shades", () => {
    const code = generateCSharpCode({ source: sourceWithScale }, "SourceTokens", "Ivy.Themes");
    // 3 base tokens + 11 red shades = 14
    expect(code).toContain("Total tokens: 14");
  });
});

// ---------------------------------------------------------------------------
// Built C# files
// ---------------------------------------------------------------------------

describe("Built C# files: source color scales", () => {
  it("IvyFrameworkSourceTokens.cs contains Red_50 through Red_950", async () => {
    const cs = await readFile("dist/csharp/IvyFrameworkSourceTokens.cs", "utf-8");
    for (const step of SCALE_STEPS) {
      expect(cs).toContain(`Red_${step}`);
    }
  });

  it("IvyFrameworkSourceTokens.cs contains scale shades for all 23 scalable colors", async () => {
    const cs = await readFile("dist/csharp/IvyFrameworkSourceTokens.cs", "utf-8");
    const scalableColors = [
      "Red", "Orange", "Amber", "Yellow", "Lime", "Green", "Emerald",
      "Teal", "Cyan", "Sky", "Blue", "Indigo", "Violet", "Purple",
      "Fuchsia", "Pink", "Rose", "Slate", "Gray", "Zinc", "Neutral",
      "Stone", "IvyGreen",
    ];

    for (const color of scalableColors) {
      expect(cs, `${color}_50 property`).toContain(`${color}_50`);
      expect(cs, `${color}_950 property`).toContain(`${color}_950`);
    }
  });

  it("all scale shade values in C# source file are valid hex colors", async () => {
    const cs = await readFile("dist/csharp/IvyFrameworkSourceTokens.cs", "utf-8");
    const shadeRe = /public static readonly string \w+_\d{2,3} = "(#[^"]+)"/g;
    const matches = [...cs.matchAll(shadeRe)];

    // 23 colors × 11 steps = 253
    expect(matches.length).toBe(253);
    for (const m of matches) {
      expect(m[1]).toMatch(HEX_RE);
    }
  });

  it("IvyFrameworkSourceTokens.cs has correct total token count", async () => {
    const cs = await readFile("dist/csharp/IvyFrameworkSourceTokens.cs", "utf-8");
    // 23 scalable × 11 = 253 shades + original 61 base tokens = 314
    expect(cs).toContain("Total tokens: 314");
  });

  it("IvyFrameworkChromaticTokens.cs does NOT contain scale shades", async () => {
    const cs = await readFile("dist/csharp/IvyFrameworkChromaticTokens.cs", "utf-8");
    // Chromatic tokens are references resolved to base hex, no scale
    expect(cs).not.toMatch(/\w+_\d{2,3}\s*=/);
  });
});
