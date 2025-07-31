# 🚨 INSTALLATION GUIDE - IMPORTANT NOTES

## The Project is Configured for NPM ONLY

This project has been specifically configured to avoid Bun and Git-related installation issues. **DO NOT USE BUN**.

## Installation Steps

### Step 1: Fix Installation Issues
Run the emergency setup script to eliminate all Bun usage:

```bash
node emergency-npm-setup.js
```

This script will:
- Kill all Bun processes
- Remove Bun lock files
- Create aggressive npm-only configuration
- Install essential packages without Git dependencies

### Step 2: Alternative Installation Methods

If the emergency setup fails, try these alternatives:

```bash
# Method 1: Force NPM installation
node force-npm-install.js

# Method 2: NPM-only installer
node install-npm-only.js

# Method 3: Fallback installer
node fallback-install.js
```

### Step 3: Start the Application

```bash
npm run dev
```

## Why This Configuration?

The project uses npm exclusively because:
- Bun has issues with `@electron/node-gyp` package
- Git cloning fails in certain environments
- npm provides better compatibility for desktop builds
- Electron-builder works more reliably with npm

## Files That Enforce NPM Usage

- `.npmrc` - Disables Git operations completely
- `emergency-npm-setup.js` - Eliminates Bun usage
- `force-npm-install.js` - Aggressive npm installation
- `package-override.js` - Forces npm detection

## For AI/Automated Building

When building this project programmatically:

1. **Never use Bun** - Always use npm
2. **Run emergency setup first**: `node emergency-npm-setup.js`
3. **Use npm commands only**: `npm install`, `npm run build`, etc.
4. **Environment variables**: Set `FORCE_NPM=true` and `NO_BUN=true`

## Desktop Building

For Windows desktop build:
```bash
# Use the provided Windows build script
./build-windows.bat

# Or run manually
npm run build
npx electron-builder --win --x64 --publish=never
```

## Troubleshooting

If you still get Git/Bun errors:
1. Delete `node_modules` and `bun.lockb`
2. Run `node emergency-npm-setup.js`
3. Restart your terminal
4. Run `npm run dev`

The project will work correctly once the npm-only setup is applied.