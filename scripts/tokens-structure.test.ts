import { describe, it, expect } from "vitest";
import { readFile } from "fs/promises";

interface TokenValue {
  value: string;
  type: string;
}

interface ColorTokens {
  [key: string]: TokenValue;
}

interface ThemeColors {
  color: ColorTokens;
}

interface Theme {
  light: ThemeColors;
  dark: ThemeColors;
}

interface PackageTokens {
  source: {
    color: ColorTokens;
  };
  theme: Theme;
  neutral?: {
    color: ColorTokens;
  };
  chromatic?: {
    color: ColorTokens;
  };
}

interface TokensFile {
  "ivy-framework": PackageTokens;
  "ivy-web": PackageTokens;
  $themes?: unknown[];
  $metadata?: {
    tokenSetOrder: string[];
  };
}

function normalizeTokens(rawTokens: any): TokensFile {
  const result: any = {};

  if (rawTokens["ivy-framework"]) {
    const ivyFramework = rawTokens["ivy-framework"];
    if (ivyFramework.source && ivyFramework.theme) {
      result["ivy-framework"] = ivyFramework;
    } else if (ivyFramework["ivy-framework"]) {
      result["ivy-framework"] = ivyFramework["ivy-framework"];
    }
  }

  if (rawTokens["ivy-web"]) {
    const ivyWeb = rawTokens["ivy-web"];
    if (ivyWeb.source && ivyWeb.theme) {
      result["ivy-web"] = ivyWeb;
    } else if (rawTokens["ivy-framework"]?.["ivy-web"]) {
      result["ivy-web"] = rawTokens["ivy-framework"]["ivy-web"];
    }
  }

  result.$themes = rawTokens.$themes || [];
  result.$metadata = rawTokens.$metadata || { tokenSetOrder: [] };

  return result as TokensFile;
}

describe("Token contract: mock-tokens.json", () => {
  it("has required top-level structure", async () => {
    const tokensContent = await readFile(
      "figma-tokens/mock-tokens.json",
      "utf-8"
    );
    const tokens = JSON.parse(tokensContent) as TokensFile;

    expect(tokens).toHaveProperty("ivy-framework");
    expect(tokens["ivy-framework"]).toHaveProperty("source");
    expect(tokens["ivy-framework"]).toHaveProperty("theme");
    expect(tokens).toHaveProperty("ivy-web");
    expect(tokens["ivy-web"]).toHaveProperty("source");
    expect(tokens["ivy-web"]).toHaveProperty("theme");
  });

  it("source has color tokens with value and type", async () => {
    const tokensContent = await readFile(
      "figma-tokens/mock-tokens.json",
      "utf-8"
    );
    const tokens = JSON.parse(tokensContent) as TokensFile;

    expect(tokens["ivy-framework"].source).toHaveProperty("color");
    const colorTokens = tokens["ivy-framework"].source.color;

    for (const [, token] of Object.entries(colorTokens)) {
      expect(token).toHaveProperty("value");
      expect(token).toHaveProperty("type");
      expect(token.type).toBe("color");
      expect(typeof token.value).toBe("string");
    }
  });

  it("theme has light and dark variants", async () => {
    const tokensContent = await readFile(
      "figma-tokens/mock-tokens.json",
      "utf-8"
    );
    const tokens = JSON.parse(tokensContent) as TokensFile;

    expect(tokens["ivy-framework"].theme).toHaveProperty("light");
    expect(tokens["ivy-framework"].theme).toHaveProperty("dark");
    expect(tokens["ivy-web"].theme).toHaveProperty("light");
    expect(tokens["ivy-web"].theme).toHaveProperty("dark");
  });

  it("theme colors reference source colors with correct format", async () => {
    const tokensContent = await readFile(
      "figma-tokens/mock-tokens.json",
      "utf-8"
    );
    const tokens = JSON.parse(tokensContent) as TokensFile;

    const checkReferences = (colors: ColorTokens, packageName: string) => {
      for (const [, token] of Object.entries(colors)) {
        expect(token).toHaveProperty("value");
        expect(token).toHaveProperty("type");
        if (token.value.startsWith("{") && token.value.endsWith("}")) {
          expect(token.value).toMatch(
            new RegExp(`^\\{${packageName}\\.source\\.color\\.[\\w-]+\\}$`)
          );
        }
      }
    };

    checkReferences(
      tokens["ivy-framework"].theme.light.color,
      "ivy-framework"
    );
    checkReferences(tokens["ivy-framework"].theme.dark.color, "ivy-framework");
    checkReferences(tokens["ivy-web"].theme.light.color, "ivy-web");
    checkReferences(tokens["ivy-web"].theme.dark.color, "ivy-web");
  });

  it("light and dark themes have matching keys", async () => {
    const tokensContent = await readFile(
      "figma-tokens/mock-tokens.json",
      "utf-8"
    );
    const tokens = JSON.parse(tokensContent) as TokensFile;

    const ivyFrameworkLightKeys = Object.keys(
      tokens["ivy-framework"].theme.light.color
    );
    const ivyFrameworkDarkKeys = Object.keys(
      tokens["ivy-framework"].theme.dark.color
    );
    expect(ivyFrameworkLightKeys.sort()).toEqual(ivyFrameworkDarkKeys.sort());

    const ivyWebLightKeys = Object.keys(tokens["ivy-web"].theme.light.color);
    const ivyWebDarkKeys = Object.keys(tokens["ivy-web"].theme.dark.color);
    expect(ivyWebLightKeys.sort()).toEqual(ivyWebDarkKeys.sort());
  });

  it("all source color values are valid hex colors", async () => {
    const tokensContent = await readFile(
      "figma-tokens/mock-tokens.json",
      "utf-8"
    );
    const tokens = JSON.parse(tokensContent) as TokensFile;
    const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;

    const checkSourceColors = (colorTokens: ColorTokens) => {
      for (const [, token] of Object.entries(colorTokens)) {
        if (!token.value.startsWith("{")) {
          expect(token.value).toMatch(hexColorRegex);
        }
      }
    };

    checkSourceColors(tokens["ivy-framework"].source.color);
    checkSourceColors(tokens["ivy-web"].source.color);
  });
});

describe("Token structure: $tokens.json (normalized)", () => {
  it("can be normalized to expected contract", async () => {
    const tokensContent = await readFile("figma-tokens/$tokens.json", "utf-8");
    const rawTokens = JSON.parse(tokensContent);
    const tokens = normalizeTokens(rawTokens);

    expect(tokens).toHaveProperty("ivy-framework");
    expect(tokens["ivy-framework"]).toHaveProperty("source");
    expect(tokens["ivy-framework"]).toHaveProperty("theme");
  });

  it("normalized ivy-framework has valid source colors", async () => {
    const tokensContent = await readFile("figma-tokens/$tokens.json", "utf-8");
    const rawTokens = JSON.parse(tokensContent);
    const tokens = normalizeTokens(rawTokens);

    expect(tokens["ivy-framework"].source).toHaveProperty("color");
    const colorTokens = tokens["ivy-framework"].source.color;
    const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;

    for (const [, token] of Object.entries(colorTokens)) {
      expect(token).toHaveProperty("value");
      expect(token).toHaveProperty("type");
      expect(token.type).toBe("color");
      if (!token.value.startsWith("{")) {
        expect(token.value).toMatch(hexColorRegex);
      }
    }
  });

  it("normalized ivy-framework has light and dark themes", async () => {
    const tokensContent = await readFile("figma-tokens/$tokens.json", "utf-8");
    const rawTokens = JSON.parse(tokensContent);
    const tokens = normalizeTokens(rawTokens);

    expect(tokens["ivy-framework"].theme).toHaveProperty("light");
    expect(tokens["ivy-framework"].theme).toHaveProperty("dark");
  });

  it("normalized theme colors use correct reference format", async () => {
    const tokensContent = await readFile("figma-tokens/$tokens.json", "utf-8");
    const rawTokens = JSON.parse(tokensContent);
    const tokens = normalizeTokens(rawTokens);

    const checkReferences = (colors: ColorTokens) => {
      for (const [, token] of Object.entries(colors)) {
        if (token.value.startsWith("{") && token.value.endsWith("}")) {
          expect(token.value).toMatch(
            /^\{(ivy-framework|ivy-web)\.source\.color\.[\w-]+\}$/
          );
        }
      }
    };

    checkReferences(tokens["ivy-framework"].theme.light.color);
    checkReferences(tokens["ivy-framework"].theme.dark.color);
  });

  it("normalized light and dark themes have matching keys", async () => {
    const tokensContent = await readFile("figma-tokens/$tokens.json", "utf-8");
    const rawTokens = JSON.parse(tokensContent);
    const tokens = normalizeTokens(rawTokens);

    const lightKeys = Object.keys(tokens["ivy-framework"].theme.light.color);
    const darkKeys = Object.keys(tokens["ivy-framework"].theme.dark.color);
    expect(lightKeys.sort()).toEqual(darkKeys.sort());
  });

  it("normalized ivy-web structure is valid", async () => {
    const tokensContent = await readFile("figma-tokens/$tokens.json", "utf-8");
    const rawTokens = JSON.parse(tokensContent);
    const tokens = normalizeTokens(rawTokens);

    if (tokens["ivy-web"]) {
      expect(tokens["ivy-web"]).toHaveProperty("source");
      expect(tokens["ivy-web"]).toHaveProperty("theme");
      expect(tokens["ivy-web"].theme).toHaveProperty("light");
      expect(tokens["ivy-web"].theme).toHaveProperty("dark");
    }
  });
});

describe("normalizeTokens utility", () => {
  it("handles flat structure (expected format)", () => {
    const flatTokens = {
      "ivy-framework": {
        source: { color: { primary: { value: "#00cc92", type: "color" } } },
        theme: {
          light: {
            color: {
              primary: {
                value: "{ivy-framework.source.color.primary}",
                type: "color",
              },
            },
          },
          dark: {
            color: {
              primary: {
                value: "{ivy-framework.source.color.primary}",
                type: "color",
              },
            },
          },
        },
      },
      "ivy-web": {
        source: { color: { teal: { value: "#00d18e", type: "color" } } },
        theme: {
          light: {
            color: {
              primary: { value: "{ivy-web.source.color.teal}", type: "color" },
            },
          },
          dark: {
            color: {
              primary: { value: "{ivy-web.source.color.teal}", type: "color" },
            },
          },
        },
      },
    };

    const normalized = normalizeTokens(flatTokens);
    expect(normalized["ivy-framework"].source.color.primary.value).toBe(
      "#00cc92"
    );
    expect(normalized["ivy-web"].source.color.teal.value).toBe("#00d18e");
  });

  it("handles nested structure (Figma export format)", () => {
    const nestedTokens = {
      "ivy-framework": {
        "ivy-framework": {
          source: { color: { primary: { value: "#00cc92", type: "color" } } },
          theme: {
            light: {
              color: {
                primary: {
                  value: "{ivy-framework.source.color.primary}",
                  type: "color",
                },
              },
            },
            dark: {
              color: {
                primary: {
                  value: "{ivy-framework.source.color.primary}",
                  type: "color",
                },
              },
            },
          },
        },
        "ivy-web": {
          source: { color: { teal: { value: "#00d18e", type: "color" } } },
          theme: {
            light: {
              color: {
                primary: {
                  value: "{ivy-web.source.color.teal}",
                  type: "color",
                },
              },
            },
            dark: {
              color: {
                primary: {
                  value: "{ivy-web.source.color.teal}",
                  type: "color",
                },
              },
            },
          },
        },
      },
      "ivy-web": {
        source: { color: { teal: { value: "#00d18e", type: "color" } } },
        theme: {
          light: {
            color: {
              primary: { value: "{ivy-web.source.color.teal}", type: "color" },
            },
          },
          dark: {
            color: {
              primary: { value: "{ivy-web.source.color.teal}", type: "color" },
            },
          },
        },
      },
    };

    const normalized = normalizeTokens(nestedTokens);
    expect(normalized["ivy-framework"].source.color.primary.value).toBe(
      "#00cc92"
    );
    expect(normalized["ivy-web"].source.color.teal.value).toBe("#00d18e");
  });
});

export { normalizeTokens };
