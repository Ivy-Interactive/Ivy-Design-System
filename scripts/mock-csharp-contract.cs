#nullable enable

using System.Linq;

namespace Ivy.Themes
{
    public static class MockThemeTokens
    {
        public static class Color
        {
            public static readonly string Primary = "#00cc92";
            public static readonly string PrimaryForeground = "#000000";
            public static readonly string Secondary = "#dfe7e3";
            public static readonly string Background = "#ffffff";
            public static readonly string Foreground = "#000000";
        }

        public static string GenerateCSS(string selector = ":root")
        {
            var css = new System.Text.StringBuilder();
            css.AppendLine($"{selector} {{");

            foreach (var field in typeof(Color).GetFields(System.Reflection.BindingFlags.Public | System.Reflection.BindingFlags.Static))
            {
                if (field.FieldType == typeof(string))
                {
                    var name = string.Concat(field.Name.Select((x, i) => i > 0 && char.IsUpper(x) ? "-" + x.ToString() : x.ToString())).ToLower();
                    var value = field.GetValue(null);
                    css.AppendLine($"  --{name}: {value};");
                }
            }

            css.AppendLine("}");
            return css.ToString();
        }

        public static string? GetToken(string tokenName)
        {
            var propertyName = string.Concat(tokenName.Split('-').Select(s =>
                char.ToUpper(s[0]) + s.Substring(1)));

            var category = tokenName.Split('-')[0];
            var categoryClassName = char.ToUpper(category[0]) + category.Substring(1);

            var type = typeof(MockThemeTokens).GetNestedType(categoryClassName);
            if (type == null) return null;

            var field = type.GetField(propertyName, System.Reflection.BindingFlags.Public | System.Reflection.BindingFlags.Static);
            return field?.GetValue(null) as string;
        }

        public static string[] GetAllTokenNames()
        {
            return new string[]
            {
                "primary",
                "primary-foreground",
                "secondary",
                "background",
                "foreground"
            };
        }

        public static System.Collections.Generic.Dictionary<string, string> GetAllTokens()
        {
            var tokens = new System.Collections.Generic.Dictionary<string, string>();

            foreach (var field in typeof(Color).GetFields(System.Reflection.BindingFlags.Public | System.Reflection.BindingFlags.Static))
            {
                if (field.FieldType == typeof(string))
                {
                    var name = string.Concat(field.Name.Select((x, i) => i > 0 && char.IsUpper(x) ? "-" + x.ToString() : x.ToString())).ToLower();
                    var value = field.GetValue(null) as string;
                    if (value != null) tokens[name] = value;
                }
            }

            return tokens;
        }
    }
}
