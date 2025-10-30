# Examples

This directory contains example implementations showing how to use Ivy Design System.

## CSS Example

[**css-example.html**](./css-example.html) - Pure CSS implementation using design tokens

Open this file in a browser to see design tokens in action:
- Brand colors
- Semantic colors
- Shadows and borders
- Spacing system
- Status colors

To view:
```bash
# From the project root
open examples/css-example.html
```

## Integration Examples

For full integration examples with actual projects, see:

- [Ivy-Web Integration Guide](../docs/getting-started.md#ivy-web-setup)
- [Ivy-Framework Integration Guide](../docs/getting-started.md#ivy-framework-setup)

## Creating Your Own Examples

1. Import the design system CSS:
```html
<link rel="stylesheet" href="../dist/css/ivy-web.css">
<link rel="stylesheet" href="../dist/css/light.css">
```

2. Use tokens in your styles:
```css
.my-component {
  background: var(--color-brand-primary);
  padding: var(--spacing-unit);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}
```

3. For Tailwind or JavaScript examples, follow the [Getting Started Guide](../docs/getting-started.md).
