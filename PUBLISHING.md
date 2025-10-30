# Publishing Guide

Instructions for publishing `ivy-design-system` to npm.

## Prerequisites

- npm account with publishing permissions
- Access to `ivy-design-system` package name on npm
- Package built and tested locally

## Pre-Publishing Checklist

- [ ] All tests pass: `npm test`
- [ ] Build succeeds: `npm run build`
- [ ] Documentation is up to date
- [ ] Version number is correct in `package.json`
- [ ] CHANGELOG.md is updated (if exists)
- [ ] All changes are committed and pushed to GitHub

## Publishing Steps

### 1. Login to npm

```bash
npm login
```

Enter your credentials when prompted.

### 2. Verify Package Contents

```bash
npm pack --dry-run
```

This will show you exactly what files will be included in the published package.

### 3. Test the Package Locally (Optional)

Create a local tarball and test it in another project:

```bash
# Create tarball
npm pack

# In another project
npm install /path/to/ivy-design-system-0.1.0.tgz
```

### 4. Publish to npm

```bash
npm publish --access public
```

The `--access public` flag is required for scoped packages or first-time publications.

### 5. Verify Publication

```bash
npm info ivy-design-system
```

You should see your package information displayed.

### 6. Test Installation

In a test project:

```bash
npm install ivy-design-system
```

### 7. Create GitHub Release

```bash
git tag v0.1.0
git push origin v0.1.0
```

Then create a release on GitHub with release notes.

## Version Updates

For subsequent versions, follow semantic versioning:

### Patch Release (0.1.0 → 0.1.1)

Bug fixes and documentation updates:

```bash
npm version patch
npm publish
git push && git push --tags
```

### Minor Release (0.1.0 → 0.2.0)

New features, no breaking changes:

```bash
npm version minor
npm publish
git push && git push --tags
```

### Major Release (0.1.0 → 1.0.0)

Breaking changes:

```bash
npm version major
npm publish
git push && git push --tags
```

## Troubleshooting

### "You do not have permission to publish"

Ensure you:
1. Are logged in: `npm whoami`
2. Have access to the package
3. The package name isn't taken (for first publish)

### "Package already exists"

If the package name is taken, you may need to:
1. Use a different name
2. Request access from the package owner
3. Use a scoped package: `@ivy/design-system`

### Build Fails

Ensure all dependencies are installed:

```bash
npm install
npm run build
```

## npm Scripts

- `npm run build` - Build the package
- `npm run dev` - Watch mode (auto-rebuild on changes)
- `npm run clean` - Remove build artifacts
- `npm test` - Run tests

## Post-Publishing

1. Update documentation if needed
2. Announce the release
3. Update dependent projects (Ivy-Web, Ivy-Framework)
4. Monitor for issues

## Unpublishing (Emergency Only)

⚠️ **Warning**: Unpublishing is discouraged and has restrictions.

```bash
npm unpublish ivy-design-system@0.1.0
```

Note: You can only unpublish within 72 hours of publication.

## Support

For issues with publishing, contact:
- npm support: https://www.npmjs.com/support
- GitHub issues: https://github.com/Ivy-Interactive/Ivy-Design-System/issues
