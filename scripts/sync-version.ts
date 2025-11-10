#!/usr/bin/env tsx

/**
 * Version Sync Script
 *
 * This script synchronizes versions across package.json and Ivy.DesignSystem.csproj
 * to ensure both npm and NuGet packages are published with the same version number.
 *
 * Usage:
 *   npm run sync-version <version>
 *   Example: npm run sync-version 1.0.1
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const ROOT_DIR = join(process.cwd());
const PACKAGE_JSON_PATH = join(ROOT_DIR, 'package.json');
const CSPROJ_PATH = join(ROOT_DIR, 'Ivy.DesignSystem.csproj');

function validateVersion(version: string): boolean {
  // Semantic versioning: MAJOR.MINOR.PATCH
  const semverRegex = /^\d+\.\d+\.\d+$/;
  return semverRegex.test(version);
}

function updatePackageJson(version: string): void {
  const packageJson = JSON.parse(readFileSync(PACKAGE_JSON_PATH, 'utf-8'));
  packageJson.version = version;
  writeFileSync(PACKAGE_JSON_PATH, JSON.stringify(packageJson, null, 2) + '\n');
  console.log(`✓ Updated package.json to version ${version}`);
}

function updateCsproj(version: string): void {
  let csprojContent = readFileSync(CSPROJ_PATH, 'utf-8');

  // Replace version in <Version> tag
  csprojContent = csprojContent.replace(
    /<Version>[\d.]+<\/Version>/,
    `<Version>${version}</Version>`
  );

  writeFileSync(CSPROJ_PATH, csprojContent);
  console.log(`✓ Updated Ivy.DesignSystem.csproj to version ${version}`);
}

function getCurrentVersions(): { npm: string; nuget: string } {
  const packageJson = JSON.parse(readFileSync(PACKAGE_JSON_PATH, 'utf-8'));
  const csprojContent = readFileSync(CSPROJ_PATH, 'utf-8');
  const versionMatch = csprojContent.match(/<Version>([\d.]+)<\/Version>/);

  return {
    npm: packageJson.version,
    nuget: versionMatch ? versionMatch[1] : 'unknown'
  };
}

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    const versions = getCurrentVersions();
    console.log('Current versions:');
    console.log(`  npm:   ${versions.npm}`);
    console.log(`  NuGet: ${versions.nuget}`);

    if (versions.npm !== versions.nuget) {
      console.log('\n⚠️  WARNING: Version mismatch detected!');
      process.exit(1);
    } else {
      console.log('\n✓ Versions are synchronized');
    }
    return;
  }

  const newVersion = args[0];

  if (!validateVersion(newVersion)) {
    console.error('❌ Invalid version format. Must be MAJOR.MINOR.PATCH (e.g., 1.0.0)');
    process.exit(1);
  }

  console.log(`Updating to version ${newVersion}...`);

  try {
    updatePackageJson(newVersion);
    updateCsproj(newVersion);

    console.log('\n✓ Version sync complete!');
    console.log('\nNext steps:');
    console.log('  1. Commit changes: git add package.json Ivy.DesignSystem.csproj');
    console.log(`  2. Create tag: git tag v${newVersion}`);
    console.log('  3. Push changes: git push && git push --tags');
  } catch (error) {
    console.error('❌ Error updating versions:', error);
    process.exit(1);
  }
}

main();
