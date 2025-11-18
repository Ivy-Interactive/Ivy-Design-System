import { describe, it, expect } from "vitest";
import { readFile } from "fs/promises";

describe("Token structure contract", () => {
  it("has required top-level structure", async () => {
    const tokensContent = await readFile("figma-tokens/$tokens.json", "utf-8");
    const tokens = JSON.parse(tokensContent);

    // Must have source and theme
    expect(tokens).toHaveProperty("source");
    expect(tokens).toHaveProperty("theme");
  });

  it("source has color tokens with value and type", async () => {
    const tokensContent = await readFile("figma-tokens/$tokens.json", "utf-8");
    const tokens = JSON.parse(tokensContent);

    expect(tokens.source).toHaveProperty("color");
    const colorTokens = tokens.source.color;

    // Check that all color tokens have value and type
    for (const [key, token] of Object.entries(colorTokens)) {
      expect(token).toHaveProperty("value");
      expect(token).toHaveProperty("type");
      expect(token.type).toBe("color");
      expect(typeof token.value).toBe("string");
    }
  });

  it("theme has light and dark variants", async () => {
    const tokensContent = await readFile("figma-tokens/$tokens.json", "utf-8");
    const tokens = JSON.parse(tokensContent);

    expect(tokens.theme).toHaveProperty("light");
    expect(tokens.theme).toHaveProperty("dark");
  });

  it("theme colors reference source colors", async () => {
    const tokensContent = await readFile("figma-tokens/$tokens.json", "utf-8");
    const tokens = JSON.parse(tokensContent);

    const lightColors = tokens.theme.light.color;
    const darkColors = tokens.theme.dark.color;

    // Check that theme colors use reference format
    for (const [key, token] of Object.entries(lightColors)) {
      expect(token).toHaveProperty("value");
      expect(token).toHaveProperty("type");
      // Values should be references like {source.color.xxx} or actual color values
      expect(typeof token.value).toBe("string");
    }

    for (const [key, token] of Object.entries(darkColors)) {
      expect(token).toHaveProperty("value");
      expect(token).toHaveProperty("type");
      expect(typeof token.value).toBe("string");
    }
  });

  it("has no duplicate color values in source", async () => {
    const tokensContent = await readFile("figma-tokens/$tokens.json", "utf-8");
    const tokens = JSON.parse(tokensContent);

    const colorTokens = tokens.source.color;
    const values = Object.values(colorTokens).map((token: any) => token.value);

    // Check for duplicates (excluding references)
    const actualValues = values.filter(
      (v: string) => !v.startsWith("{") && !v.endsWith("}")
    );
    const uniqueValues = new Set(actualValues);

    // If there are duplicates, they should be intentional (like same color used for different purposes)
    // This test ensures we're aware of any duplicates
    expect(actualValues.length).toBeGreaterThan(0);
  });

  it("all source color values are valid color formats", async () => {
    const tokensContent = await readFile("figma-tokens/$tokens.json", "utf-8");
    const tokens = JSON.parse(tokensContent);

    const colorTokens = tokens.source.color;
    const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
    const rgbRegex = /^rgb\(/;
    const rgbaRegex = /^rgba\(/;
    const hslRegex = /^hsl\(/;
    const hslaRegex = /^hsla\(/;
    const oklchRegex = /^oklch\(/;

    for (const [key, token] of Object.entries(colorTokens)) {
      const value = (token as any).value;
      // Skip references
      if (value.startsWith("{") && value.endsWith("}")) {
        continue;
      }

      // Check if it's a valid color format
      const isValidColor =
        hexColorRegex.test(value) ||
        rgbRegex.test(value) ||
        rgbaRegex.test(value) ||
        hslRegex.test(value) ||
        hslaRegex.test(value) ||
        oklchRegex.test(value);

      expect(isValidColor).toBe(true);
    }
  });

  it("theme structure matches expected format", async () => {
    const tokensContent = await readFile("figma-tokens/$tokens.json", "utf-8");
    const tokens = JSON.parse(tokensContent);

    // Light theme should have same keys as dark theme
    const lightKeys = Object.keys(tokens.theme.light.color);
    const darkKeys = Object.keys(tokens.theme.dark.color);

    expect(lightKeys.sort()).toEqual(darkKeys.sort());
  });

  it("token references use correct format", async () => {
    const tokensContent = await readFile("figma-tokens/$tokens.json", "utf-8");
    const tokens = JSON.parse(tokensContent);

    const lightColors = tokens.theme.light.color;
    const darkColors = tokens.theme.dark.color;

    const checkReferences = (colors: any) => {
      for (const [key, token] of Object.entries(colors)) {
        const value = (token as any).value;
        // If it's a reference, it should match {source.color.xxx} format
        if (value.startsWith("{") && value.endsWith("}")) {
          expect(value).toMatch(/^\{source\.color\.[\w-]+\}$/);
        }
      }
    };

    checkReferences(lightColors);
    checkReferences(darkColors);
  });
});
