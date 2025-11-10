# Publishing Guide

Instructions for publishing `ivy-design-system` to both **npm** and **NuGet** registries.

This package is **dual-published**: it's available as `ivy-design-system` on npm and `Ivy.DesignSystem` on NuGet.org.

## Automated Publishing (Recommended)

The easiest way to publish is using the automated GitHub Actions workflow.

### Prerequisites

1. **GitHub Secrets** configured in repository settings:
   - `NPM_TOKEN` - npm authentication token
   - `NUGET_API_KEY` - NuGet.org API key

2. **Version synchronized** between `package.json` and `Ivy.DesignSystem.csproj`

### Publishing Steps

1. **Update version** using the sync script:
   ```bash
   npm run sync-version 1.0.1
   ```

2. **Commit changes**:
   ```bash
   git add package.json Ivy.DesignSystem.csproj
   git commit -m "chore: bump version to 1.0.1"
   ```

3. **Create and push tag**:
   ```bash
   git tag v1.0.1
   git push && git push --tags
   ```

4. **Monitor the workflow**:
   - Go to Actions tab on GitHub
   - Watch the "Publish Packages" workflow
   - Verify both npm and NuGet packages are published

### What the Workflow Does

1. ✅ Validates version synchronization
2. ✅ Builds the design system
3. ✅ Verifies C# compilation
4. ✅ Runs `dotnet format` check
5. ✅ Creates NuGet package
6. ✅ Publishes to npm
7. ✅ Publishes to NuGet.org
8. ✅ Creates GitHub Release

---

## Manual Publishing

If you need to publish manually (not recommended):

### Prerequisites

- npm account with publishing permissions
- Access to `ivy-design-system` package name on npm
- NuGet.org account with API key
- .NET 8.0 SDK installed
- Package built and tested locally

### Pre-Publishing Checklist

- [ ] Versions are synchronized: `npm run sync-version` (no arguments to check)
- [ ] All tests pass: `npm test`
- [ ] Build succeeds: `npm run build`
- [ ] C# compiles: `dotnet build Ivy.DesignSystem.csproj`
- [ ] C# code is formatted: `dotnet format Ivy.DesignSystem.csproj --verify-no-changes`
- [ ] Documentation is up to date
- [ ] All changes are committed and pushed to GitHub

### Manual Publishing Steps

#### 1. Sync Version

```bash
npm run sync-version 1.0.1
```

This updates both `package.json` and `Ivy.DesignSystem.csproj`.

#### 2. Build Everything

```bash
npm run clean
npm run build
dotnet build Ivy.DesignSystem.csproj --configuration Release
```

#### 3. Verify Package Contents

**npm:**
```bash
npm pack --dry-run
```

**NuGet:**
```bash
dotnet pack Ivy.DesignSystem.csproj --configuration Release --output ./nupkg
```

#### 4. Login to Registries

**npm:**
```bash
npm login
```

**NuGet:**
```bash
dotnet nuget add source https://api.nuget.org/v3/index.json -n nuget.org
```

#### 5. Publish Packages

**npm:**
```bash
npm publish --access public
```

**NuGet:**
```bash
dotnet nuget push ./nupkg/*.nupkg --api-key YOUR_API_KEY --source https://api.nuget.org/v3/index.json
```

#### 6. Verify Publication

**npm:**
```bash
npm info ivy-design-system
```

**NuGet:**
```bash
dotnet tool install -g NuGet.CommandLine
nuget list Ivy.DesignSystem
```

Or visit: https://www.nuget.org/packages/Ivy.DesignSystem

#### 7. Create GitHub Release

```bash
git tag v1.0.1
git push origin v1.0.1
```

Then create a release on GitHub with release notes.

---

## Version Management

This project follows [Semantic Versioning](https://semver.org/):

- **Major (X.0.0)**: Breaking changes to token names or structure
- **Minor (0.X.0)**: New tokens or non-breaking enhancements
- **Patch (0.0.X)**: Bug fixes or documentation updates

### Updating Versions

**Always use the sync script** to keep versions synchronized:

```bash
# Patch release (1.0.0 → 1.0.1)
npm run sync-version 1.0.1

# Minor release (1.0.0 → 1.1.0)
npm run sync-version 1.1.0

# Major release (1.0.0 → 2.0.0)
npm run sync-version 2.0.0
```

Then commit and tag:

```bash
git add package.json Ivy.DesignSystem.csproj
git commit -m "chore: bump version to X.Y.Z"
git tag vX.Y.Z
git push && git push --tags
```

### Version Validation

The build script automatically validates version synchronization. If versions don't match:

```bash
# Check current versions
npm run sync-version

# Output:
# Current versions:
#   npm:   1.0.0
#   NuGet: 1.0.1
# ⚠️  WARNING: Version mismatch detected!
```

---

## Troubleshooting

### npm: "You do not have permission to publish"

Ensure you:
1. Are logged in: `npm whoami`
2. Have access to the `ivy-design-system` package
3. Using `--access public` flag

### NuGet: "Failed to publish package"

Common issues:
1. **Invalid API key**: Get a new key from https://www.nuget.org/account/apikeys
2. **Package already exists**: Bump version number
3. **Duplicate version**: Can't republish the same version

### Version Mismatch

If `npm run build` fails with version mismatch:

```bash
npm run sync-version 1.0.0  # Sync to correct version
npm run build               # Try again
```

### C# Compilation Errors

Ensure .NET SDK is installed:

```bash
dotnet --version  # Should show 8.0.x or higher
dotnet build Ivy.DesignSystem.csproj
```

### GitHub Actions Workflow Fails

Check:
1. **Secrets are configured**: `NPM_TOKEN` and `NUGET_API_KEY` in repository settings
2. **Tag format is correct**: Must be `vX.Y.Z` (e.g., `v1.0.0`)
3. **Versions are synchronized**: Run `npm run sync-version` before tagging

---

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run build` | Build all outputs (CSS, Tailwind, JS/TS, C#) |
| `npm run dev` | Watch mode (auto-rebuild on changes) |
| `npm run clean` | Remove build artifacts |
| `npm run sync-version` | Sync versions between package.json and .csproj |
| `npm test` | Run tests (placeholder) |
| `dotnet build` | Compile C# code |
| `dotnet pack` | Create NuGet package |
| `dotnet format` | Format C# code |

---

## Post-Publishing Checklist

After publishing a new version:

1. ✅ Verify npm package: https://www.npmjs.com/package/ivy-design-system
2. ✅ Verify NuGet package: https://www.nuget.org/packages/Ivy.DesignSystem
3. ✅ Test installation in sample projects
4. ✅ Update dependent projects (Ivy-Web, Ivy-Framework)
5. ✅ Update documentation if needed
6. ✅ Announce the release (Discord, GitHub Discussions)
7. ✅ Monitor for issues

---

## GitHub Secrets Setup

To enable automated publishing, configure these secrets in your GitHub repository:

### NPM_TOKEN

1. Go to https://www.npmjs.com/settings/your-username/tokens
2. Create a new "Automation" token
3. Copy the token
4. Add to GitHub: Settings → Secrets and variables → Actions → New repository secret
5. Name: `NPM_TOKEN`, Value: (paste token)

### NUGET_API_KEY

1. Go to https://www.nuget.org/account/apikeys
2. Create a new API key with "Push" permission
3. Set glob pattern: `Ivy.DesignSystem`
4. Copy the key
5. Add to GitHub: Settings → Secrets and variables → Actions → New repository secret
6. Name: `NUGET_API_KEY`, Value: (paste key)

---

## Support

For issues with publishing:
- npm support: https://www.npmjs.com/support
- NuGet support: https://www.nuget.org/policies/Contact
- GitHub issues: https://github.com/Ivy-Interactive/Ivy-Design-System/issues
