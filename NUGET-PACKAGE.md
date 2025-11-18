# Ivy.DesignSystem NuGet Package

## Package Information

- **Package ID**: `Ivy.DesignSystem`
- **Target Framework**: `.NET Standard 2.0` (compatible with .NET Framework 4.6.1+, .NET Core 2.0+, .NET 5+, etc.)
- **Namespace**: `Ivy.Themes`
- **License**: MIT
- **NuGet**: https://www.nuget.org/packages/Ivy.DesignSystem

## Installation

```bash
dotnet add package Ivy.DesignSystem
```

Or via Package Manager Console:

```powershell
Install-Package Ivy.DesignSystem
```

Or add to `.csproj`:

```xml
<PackageReference Include="Ivy.DesignSystem" Version="1.1.3" />
```

## Package Contents

The NuGet package includes:

### 1. Three Static Token Classes

#### `IvyFrameworkTokens`

Source design tokens (base color values, no duplicates)

#### `LightThemeTokens`

Light theme tokens that reference source colors

#### `DarkThemeTokens`

Dark theme tokens that reference source colors

### 2. Token Structure

Each class contains a nested `Color` class with static readonly string properties:

```csharp
namespace Ivy.Themes
{
    public static class LightThemeTokens
    {
        public static class Color
        {
            public static readonly string Primary = "#00cc92";
            public static readonly string PrimaryForeground = "#000000";
            public static readonly string Secondary = "#dfe7e3";
            public static readonly string SecondaryForeground = "#000000";
            // ... and more
        }
    }
}
```

## Available Tokens

### Semantic Colors

- `Primary` / `PrimaryForeground`
- `Secondary` / `SecondaryForeground`
- `Destructive` / `DestructiveForeground`
- `Success` / `SuccessForeground`
- `Warning` / `WarningForeground`
- `Info` / `InfoForeground`

### UI Colors

- `Background`
- `Foreground`
- `Border`
- `Input`
- `Ring`
- `Muted` / `MutedForeground`
- `Accent` / `AccentForeground`
- `Card` / `CardForeground`
- `Popover` / `PopoverForeground`

## Usage Examples

### Basic Usage

```csharp
using Ivy.Themes;

// Access light theme tokens
var primaryColor = LightThemeTokens.Color.Primary;
var backgroundColor = LightThemeTokens.Color.Background;
var borderColor = LightThemeTokens.Color.Border;

// Access dark theme tokens
var darkPrimary = DarkThemeTokens.Color.Primary;
var darkBackground = DarkThemeTokens.Color.Background;

// Access source tokens
var sourcePrimary = IvyFrameworkTokens.Color.Primary;
```

### Generate CSS Custom Properties

```csharp
using Ivy.Themes;

// Generate CSS for light theme
string lightThemeCSS = LightThemeTokens.GenerateCSS(":root");
// Output: :root { --primary: #00cc92; --background: #ffffff; ... }

// Generate CSS for dark theme with custom selector
string darkThemeCSS = DarkThemeTokens.GenerateCSS("[data-theme='dark']");
```

### Get Token by Name

```csharp
using Ivy.Themes;

// Get token value by CSS variable name
string? primary = LightThemeTokens.GetToken("primary");
// Returns: "#00cc92"

string? background = DarkThemeTokens.GetToken("background");
// Returns: "#000000"
```

### Get All Tokens

```csharp
using Ivy.Themes;
using System.Collections.Generic;

// Get all token names
string[] allTokenNames = LightThemeTokens.GetAllTokenNames();
// Returns: ["primary", "primary-foreground", "secondary", ...]

// Get all tokens as dictionary
Dictionary<string, string> allTokens = LightThemeTokens.GetAllTokens();
// Returns: { "primary": "#00cc92", "background": "#ffffff", ... }
```

### Use in Razor Pages/Views

```razor
@using Ivy.Themes

<style>
    .my-button {
        background-color: @LightThemeTokens.Color.Primary;
        color: @LightThemeTokens.Color.PrimaryForeground;
    }

    .my-card {
        background-color: @LightThemeTokens.Color.Card;
        border-color: @LightThemeTokens.Color.Border;
    }
</style>
```

### Use in C# Code-Behind

```csharp
using Ivy.Themes;

public class MyComponent
{
    public string GetButtonStyle()
    {
        return $"background-color: {LightThemeTokens.Color.Primary}; " +
               $"color: {LightThemeTokens.Color.PrimaryForeground};";
    }
}
```

### Dynamic Theme Switching

```csharp
using Ivy.Themes;

public class ThemeService
{
    public string GetColor(string tokenName, bool isDark = false)
    {
        if (isDark)
            return DarkThemeTokens.GetToken(tokenName) ?? "#000000";
        else
            return LightThemeTokens.GetToken(tokenName) ?? "#ffffff";
    }

    public string GenerateThemeCSS(bool isDark = false)
    {
        return isDark
            ? DarkThemeTokens.GenerateCSS(":root")
            : LightThemeTokens.GenerateCSS(":root");
    }
}
```

## Helper Methods

Each token class provides these utility methods:

### `GenerateCSS(string selector = ":root")`

Generates CSS custom properties string for all tokens.

**Example:**

```csharp
string css = LightThemeTokens.GenerateCSS();
// Returns: ":root { --primary: #00cc92; --background: #ffffff; ... }"
```

### `GetToken(string tokenName)`

Gets a token value by its CSS variable name (kebab-case).

**Example:**

```csharp
string? value = LightThemeTokens.GetToken("primary-foreground");
// Returns: "#000000"
```

### `GetAllTokenNames()`

Returns an array of all token names in kebab-case.

**Example:**

```csharp
string[] names = LightThemeTokens.GetAllTokenNames();
// Returns: ["primary", "primary-foreground", "secondary", ...]
```

### `GetAllTokens()`

Returns a dictionary mapping token names to values.

**Example:**

```csharp
Dictionary<string, string> tokens = LightThemeTokens.GetAllTokens();
// Returns: { "primary": "#00cc92", "background": "#ffffff", ... }
```

## Package Files

The NuGet package contains:

- **Compiled DLL**: `Ivy.DesignSystem.dll` (contains all three token classes)
- **XML Documentation**: `Ivy.DesignSystem.xml` (IntelliSense support)
- **README.md**: Package documentation
- **Symbols Package** (`.snupkg`): For debugging support

## Token Reference Format

Theme tokens reference source tokens using the format:

```
{source.color.token-name}
```

For example:

- `LightThemeTokens.Color.Primary` → `{source.color.primary}` → `#00cc92`
- `DarkThemeTokens.Color.Background` → `{source.color.black}` → `#000000`

## Versioning

The package follows Semantic Versioning:

- **Major**: Breaking changes to token names or structure
- **Minor**: New tokens or non-breaking enhancements
- **Patch**: Bug fixes or documentation updates

## Support

- **GitHub**: https://github.com/Ivy-Interactive/Ivy-Design-System
- **Issues**: https://github.com/Ivy-Interactive/Ivy-Design-System/issues
- **NuGet**: https://www.nuget.org/packages/Ivy.DesignSystem

## License

MIT License - See LICENSE file for details.
