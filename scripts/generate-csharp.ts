import { writeFile } from "fs/promises";

/**
 * Converts a kebab-case token name to PascalCase C# property name
 * Examples:
 *   color-brand-primary -> ColorBrandPrimary
 *   color-semantic-text-primary -> ColorSemanticTextPrimary
 */
export function toPascalCase(str: string): string {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

/**
 * Extracts all tokens with their names and values from nested structure
 * Handles both direct color structure and theme structure (theme.dark.color, theme.light.color)
 */
export function extractTokens(
  obj: any,
  prefix = ""
): Array<{ name: string; value: string; propertyName: string }> {
  const tokens: Array<{ name: string; value: string; propertyName: string }> =
    [];

  // Handle theme structure (theme.dark.color or theme.light.color)
  if (obj.theme) {
    const themeKey = Object.keys(obj.theme)[0]; // 'dark' or 'light'
    if (obj.theme[themeKey]?.color) {
      return extractTokens(obj.theme[themeKey].color, prefix);
    }
  }

  // Handle direct color structure
  if (obj.color) {
    return extractTokens(obj.color, prefix);
  }

  // Extract tokens from current level
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "object" && value !== null) {
      if ("value" in value && "type" in value) {
        const varName = prefix ? `${prefix}-${key}` : key;
        // For simplified naming, just use the key directly (e.g., 'primary' -> 'Primary')
        const propertyName = toPascalCase(key);
        tokens.push({
          name: varName,
          value: value.value as string,
          propertyName,
        });
      } else if (key !== "theme") {
        // Skip theme key, process other nested objects
        const newPrefix = prefix ? `${prefix}-${key}` : key;
        tokens.push(...extractTokens(value, newPrefix));
      }
    }
  }

  return tokens;
}

/**
 * Resolves token references like {ivy-framework.source.color.primary} or {ivy-web.source.color.primary} to actual values
 */
function resolveTokenReference(
  value: string,
  sourceTokens: Record<string, any>
): string {
  // Check if it's a reference format: {ivy-framework.source.color.token-name} or {ivy-web.source.color.token-name}
  const referenceMatch = value.match(/^\{(ivy-framework|ivy-web)\.source\.color\.([\w-]+)\}$/);
  if (referenceMatch) {
    const tokenName = referenceMatch[2];
    // Look up in source tokens - sourceTokens is the source object with color property
    if (sourceTokens && sourceTokens.color && sourceTokens.color[tokenName]) {
      const sourceValue = sourceTokens.color[tokenName];
      if (
        typeof sourceValue === "object" &&
        sourceValue !== null &&
        "value" in sourceValue
      ) {
        return sourceValue.value as string;
      } else if (typeof sourceValue === "string") {
        return sourceValue;
      }
    }
    // If not found, return as-is (will be a reference string)
  }
  // If not a reference or not found, return as-is
  return value;
}

/**
 * Groups tokens by category - for simplified structure, all tokens are under 'color'
 */
export function groupTokensByCategory(
  tokens: Array<{ name: string; value: string; propertyName: string }>
) {
  // All tokens are color tokens in the simplified structure
  return { color: tokens };
}

/**
 * Generates C# code string (without writing to file)
 * @param tokens - All tokens object
 * @param className - Name of the C# class (default: DesignSystemTokens)
 * @param namespace - C# namespace (default: Ivy.Themes)
 * @param sourceTokens - Source tokens for resolving references (optional)
 * @returns Generated C# code as string
 */
export function generateCSharpCode(
  tokens: any,
  className = "DesignSystemTokens",
  namespace = "Ivy.Themes",
  sourceTokens?: any
): string {
  let extractedTokens = extractTokens(tokens);

  // Resolve references if source tokens are provided
  if (sourceTokens) {
    extractedTokens = extractedTokens.map((token) => ({
      ...token,
      value: resolveTokenReference(token.value, sourceTokens),
    }));
  }

  const groupedTokens = groupTokensByCategory(extractedTokens);

  // Generate nested classes for each category
  let nestedClasses = "";
  const categoryNames: string[] = [];

  for (const [category, categoryTokens] of Object.entries(groupedTokens)) {
    const categoryClassName = toPascalCase(category);
    categoryNames.push(categoryClassName);

    const properties = categoryTokens
      .map((token) => {
        // Escape quotes in values
        const escapedValue = token.value.replace(/"/g, '\\"');
        return (
          `            /// <summary>${token.name}</summary>\n` +
          `            public static readonly string ${token.propertyName} = "${escapedValue}";`
        );
      })
      .join("\n\n");

    nestedClasses += `
        /// <summary>
        /// Design tokens for ${category}
        /// </summary>
        public static class ${categoryClassName}
        {
${properties}
        }
`;
  }

  // Generate main class with CSS variable generator method
  const csharp = `//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by Ivy Design System build script.
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

#nullable enable

using System.Linq;

namespace ${namespace}
{
    /// <summary>
    /// Design System tokens generated from Ivy Design System
    /// Provides compile-time access to all design tokens
    /// </summary>
    /// <remarks>
    /// Generated on: ${new Date().toISOString()}
    /// Total tokens: ${extractedTokens.length}
    /// </remarks>
    public static class ${className}
    {
${nestedClasses}
        /// <summary>
        /// Generates CSS custom properties for all design tokens
        /// </summary>
        /// <param name="selector">CSS selector (default: ":root")</param>
        /// <returns>CSS string with all custom properties</returns>
        public static string GenerateCSS(string selector = ":root")
        {
            var css = new System.Text.StringBuilder();
            css.AppendLine($"{selector} {{");
${categoryNames
  .map(
    (cat) =>
      `
            // ${cat} tokens
            foreach (var field in typeof(${cat}).GetFields(System.Reflection.BindingFlags.Public | System.Reflection.BindingFlags.Static))
            {
                if (field.FieldType == typeof(string))
                {
                    var name = string.Concat(field.Name.Select((x, i) => i > 0 && char.IsUpper(x) ? "-" + x.ToString() : x.ToString())).ToLower();
                    var value = field.GetValue(null);
                    css.AppendLine($"  --{name}: {value};");
                }
            }`
  )
  .join("")}

            css.AppendLine("}");
            return css.ToString();
        }

        /// <summary>
        /// Gets a token value by its CSS variable name
        /// </summary>
        /// <param name="tokenName">Token name in kebab-case (e.g., "color-brand-primary")</param>
        /// <returns>Token value or null if not found</returns>
        public static string? GetToken(string tokenName)
        {
            var propertyName = string.Concat(tokenName.Split('-').Select(s =>
                char.ToUpper(s[0]) + s.Substring(1)));

            var category = tokenName.Split('-')[0];
            var categoryClassName = char.ToUpper(category[0]) + category.Substring(1);

            var type = typeof(${className}).GetNestedType(categoryClassName);
            if (type == null) return null;

            var field = type.GetField(propertyName, System.Reflection.BindingFlags.Public | System.Reflection.BindingFlags.Static);
            return field?.GetValue(null) as string;
        }

        /// <summary>
        /// Gets all token names
        /// </summary>
        /// <returns>Array of all token names in kebab-case</returns>
        public static string[] GetAllTokenNames()
        {
            return new string[]
            {
${extractedTokens.map((t) => `                "${t.name}"`).join(",\n")}
            };
        }

        /// <summary>
        /// Gets all token values as a dictionary
        /// </summary>
        /// <returns>Dictionary of token name -> value</returns>
        public static System.Collections.Generic.Dictionary<string, string> GetAllTokens()
        {
            var tokens = new System.Collections.Generic.Dictionary<string, string>();
${categoryNames
  .map(
    (cat) =>
      `
            // ${cat} tokens
            foreach (var field in typeof(${cat}).GetFields(System.Reflection.BindingFlags.Public | System.Reflection.BindingFlags.Static))
            {
                if (field.FieldType == typeof(string))
                {
                    var name = string.Concat(field.Name.Select((x, i) => i > 0 && char.IsUpper(x) ? "-" + x.ToString() : x.ToString())).ToLower();
                    var value = field.GetValue(null) as string;
                    if (value != null) tokens[name] = value;
                }
            }`
  )
  .join("")}

            return tokens;
        }
    }
}
`;

  return csharp;
}

/**
 * Generates C# static class with design tokens and writes to file
 * @param tokens - All tokens object
 * @param outputPath - Output file path
 * @param className - Name of the C# class (default: DesignSystemTokens)
 * @param namespace - C# namespace (default: Ivy.Themes)
 * @param sourceTokens - Source tokens for resolving references (optional)
 */
export async function generateCSharp(
  tokens: any,
  outputPath: string,
  className = "DesignSystemTokens",
  namespace = "Ivy.Themes",
  sourceTokens?: any
) {
  const csharp = generateCSharpCode(tokens, className, namespace, sourceTokens);
  const extractedTokens = extractTokens(tokens);
  const groupedTokens = groupTokensByCategory(extractedTokens);
  const categoryNames = Object.keys(groupedTokens).map((cat) =>
    toPascalCase(cat)
  );

  await writeFile(outputPath, csharp);
  console.log(`  ✓ ${outputPath}`);
  console.log(`  → Generated ${extractedTokens.length} C# token properties`);
  console.log(`  → Categories: ${categoryNames.join(", ")}`);
}
