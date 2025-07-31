# 🔨 Build Instructions for Vikas Milk Center Pro

## Quick Build Commands

### For End Users
```bash
# Windows Desktop App
./build-windows.bat
```

### For Developers
```bash
# Fix installation first
node emergency-npm-setup.js

# Web application
npm run build

# Desktop application
npm run build
npx electron-builder --win --x64 --publish=never
```

## Detailed Build Process

### 1. Pre-Build Setup (REQUIRED)
```bash
# This MUST be run first to avoid Bun/Git errors
node emergency-npm-setup.js
```

### 2. Web Application Build
```bash
npm run build
```
Output: `dist/` folder with optimized web application

### 3. Desktop Application Build
```bash
# Build web app first
npm run build

# Build Windows desktop app
npx electron-builder --win --x64 --publish=never
```
Output: `dist_electron/` folder with Windows installer

### 4. Testing Builds
```bash
# Test web build
npm run preview

# Test desktop build
npm run electron
```

## Build Outputs

### Web Application (`dist/`)
- `index.html` - Main HTML file
- `assets/` - Optimized CSS, JS, and assets
- Static files ready for web hosting

### Desktop Application (`dist_electron/`)
- `Vikas Milk Center Pro-1.0.0-win.exe` - Windows installer
- `Vikas Milk Center Pro-1.0.0-win-portable.exe` - Portable version

## Environment Requirements

### Development
- Node.js 18+ (LTS)
- npm 8+
- Windows 10/11 (for desktop builds)

### Production
- Any web server (for web version)
- Windows 64-bit (for desktop version)

## Build Configuration Files

### Vite (Web Build)
- `vite.config.ts` - Vite configuration
- `tsconfig.json` - TypeScript settings

### Electron (Desktop Build)
- `electron-builder.json` - Desktop build settings
- `electron/main.js` - Main Electron process

## Automated Build Pipeline

For CI/CD or automated building:

```bash
#!/bin/bash
# Build script for automation

# 1. Setup npm-only environment
node emergency-npm-setup.js

# 2. Install dependencies
npm install --no-git --legacy-peer-deps

# 3. Build web application
npm run build

# 4. Build desktop application (if needed)
npx electron-builder --win --x64 --publish=never

echo "Build completed successfully!"
```

## Common Build Issues & Solutions

### Issue: Git Clone Errors
```
error: "git clone" for "@electron/node-gyp" failed
```
**Solution**: Run `node emergency-npm-setup.js`

### Issue: Bun Usage
```
bun install failed
```
**Solution**: Project is configured for npm only. Use npm commands.

### Issue: Missing Dependencies
```
Module not found
```
**Solution**: Run `node force-npm-install.js`

### Issue: Desktop Build Fails
```
electron-builder error
```
**Solution**: Use `./build-windows.bat` script

## Build Verification

After building, verify:

### Web Build
```bash
npm run preview
# Should open http://localhost:4173
```

### Desktop Build
```bash
# Check if files exist
ls dist_electron/*.exe
# Should show installer and portable versions
```

## Distribution

### Web Application
Upload `dist/` folder contents to:
- Static hosting (Vercel, Netlify)
- CDN
- Web server

### Desktop Application
Distribute files from `dist_electron/`:
- `.exe` file for installation
- `-portable.exe` for portable use

## Performance Optimization

The build process includes:
- Code splitting
- Tree shaking
- Asset optimization
- Bundle compression
- Dependency analysis

Final bundle sizes (approximate):
- Web: ~2-3 MB (compressed)
- Desktop: ~150-200 MB (includes Electron runtime)

## Security Notes

Desktop builds include:
- Code signing (configure in electron-builder.json)
- Content Security Policy
- Process isolation
- Secure preload scripts

For production, consider adding:
- Code signing certificate
- Auto-updater configuration
- Crash reporting