import { writeFile } from "fs/promises";

/**
 * Scale steps matching Tailwind's convention: 50, 100, 200, ..., 900, 950
 * Each step maps to a target lightness in oklch (0 = black, 1 = white).
 * The base color (500) keeps its original lightness.
 */
const SCALE_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

const LIGHTNESS_MAP: Record<number, number> = {
  50: 0.97,
  100: 0.93,
  200: 0.87,
  300: 0.79,
  400: 0.70,
  500: 0.60,
  600: 0.52,
  700: 0.44,
  800: 0.36,
  900: 0.27,
  950: 0.20,
};

/**
 * Parse a hex color (#rrggbb) into linear sRGB components [0..1].
 */
function hexToLinearRGB(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  // sRGB gamma to linear
  const toLinear = (c: number) =>
    c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

  return [toLinear(r), toLinear(g), toLinear(b)];
}

/**
 * Convert linear sRGB to OKLab.
 */
function linearRGBToOKLab(rgb: [number, number, number]): [number, number, number] {
  const [r, g, b] = rgb;

  const l_ = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m_ = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s_ = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;

  const l = Math.cbrt(l_);
  const m = Math.cbrt(m_);
  const s = Math.cbrt(s_);

  return [
    0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s,
  ];
}

/**
 * Convert OKLab to linear sRGB.
 */
function okLabToLinearRGB(lab: [number, number, number]): [number, number, number] {
  const [L, a, b] = lab;

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  return [
    +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s,
  ];
}

/**
 * Convert linear sRGB to gamma-encoded sRGB hex.
 */
function linearRGBToHex(rgb: [number, number, number]): string {
  const toGamma = (c: number) => {
    c = Math.max(0, Math.min(1, c));
    return c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  };

  const r = Math.round(toGamma(rgb[0]) * 255);
  const g = Math.round(toGamma(rgb[1]) * 255);
  const b = Math.round(toGamma(rgb[2]) * 255);

  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

/**
 * Generate a shade of the given hex color at the target oklch lightness,
 * preserving the hue and scaling chroma proportionally.
 */
function generateShade(hex: string, targetLightness: number): string {
  const linear = hexToLinearRGB(hex);
  const [L, a, b] = linearRGBToOKLab(linear);

  // Scale chroma proportionally to how much lightness changes.
  // As we move toward white or black, reduce chroma to stay in gamut.
  const chroma = Math.sqrt(a * a + b * b);
  const hue = Math.atan2(b, a);

  // Scale chroma: full at mid-lightness, tapering toward extremes
  const chromaScale = chroma > 0
    ? Math.min(1, targetLightness < L
        ? targetLightness / L
        : (1 - targetLightness) / (1 - L + 0.001))
    : 0;

  const newChroma = chroma * chromaScale;
  const newA = newChroma * Math.cos(hue);
  const newB = newChroma * Math.sin(hue);

  return linearRGBToHex(okLabToLinearRGB([targetLightness, newA, newB]));
}

/**
 * Generate the full 50-950 scale for a single color.
 */
function generateScale(hex: string): Record<number, string> {
  const scale: Record<number, string> = {};
  for (const step of SCALE_STEPS) {
    scale[step] = generateShade(hex, LIGHTNESS_MAP[step]);
  }
  return scale;
}

/**
 * Resolve a token value that may be a reference to a source token.
 */
function resolveValue(
  value: string,
  sourceTokens?: Record<string, any>,
): string {
  if (!sourceTokens) return value;

  const match = value.match(
    /^\{(ivy-framework|ivy-web)\.source\.(color|sizing)\.([\w.-]+)\}$/,
  );
  if (match) {
    const category = match[2];
    const name = match[3];
    const src = sourceTokens[category]?.[name];
    if (src) {
      return typeof src === "object" && "value" in src ? src.value : src;
    }
  }
  return value;
}

/**
 * Tokens to skip — UI surface tokens that resolve to black/white/gray
 * and don't benefit from a color scale.
 */
const SKIP_TOKENS = new Set([
  "primary", "secondary", "background", "foreground",
  "border", "input", "ring", "muted", "accent",
  "card", "popover", "black", "white",
]);

/**
 * Collect base hex colors from a token group (chromatic, neutral, or theme).
 * Skips `-foreground` tokens and UI surface tokens.
 */
function collectBaseColors(
  tokenGroup: Record<string, any>,
  sourceTokens?: Record<string, any>,
): Record<string, string> {
  const colors: Record<string, string> = {};

  const colorTokens = tokenGroup.color ?? tokenGroup;

  for (const [key, token] of Object.entries(colorTokens)) {
    if (key.endsWith("-foreground")) continue;
    if (SKIP_TOKENS.has(key)) continue;
    if (typeof token === "object" && token !== null && "value" in token && "type" in token) {
      if (token.type !== "color") continue;
      const resolved = resolveValue(token.value as string, sourceTokens);
      if (resolved.startsWith("#") && resolved.length === 7) {
        colors[key] = resolved;
      }
    }
  }

  return colors;
}

/**
 * Generates a CSS file with color scale variables for all provided colors.
 *
 * Output example:
 *   --red-50: #fef2f2;
 *   --red-100: #fee2e2;
 *   ...
 *   --red-950: #450a0a;
 */
export async function generateColorScaleCSS(
  tokenGroups: Array<{ tokens: Record<string, any>; sourceTokens?: Record<string, any> }>,
  outputPath: string,
) {
  const allColors: Record<string, string> = {};

  for (const { tokens, sourceTokens } of tokenGroups) {
    Object.assign(allColors, collectBaseColors(tokens, sourceTokens));
  }

  let css = "";
  for (const [name, hex] of Object.entries(allColors)) {
    const scale = generateScale(hex);
    for (const [step, value] of Object.entries(scale)) {
      css += `  --${name}-${step}: ${value};\n`;
    }
  }

  const output = `@layer base {\n  :root {\n${css}  }\n}\n`;
  await writeFile(outputPath, output);
  console.log(`  \u2713 ${outputPath}`);
}
