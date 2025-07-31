# Vikas Milk Center Pro - Windows Build Guide

## Quick Build for Windows

### Option 1: Using Batch File (Recommended)
1. Double-click `build-windows.bat`
2. Wait for the build to complete
3. Find your executable in `dist_electron/` folder

### Option 2: Using Command Line
```bash
# Install dependencies
npm install

# Build web application
npm run build

# Build Windows desktop application
npx electron-builder --win --publish=never
```

### Option 3: Using Node.js Script
```bash
# Build for Windows specifically
node build-desktop.js windows

# Build for all platforms
node build-desktop.js all
```

## System Requirements

### For Building:
- Windows 7/8/10/11 (x64 or x86)
- Node.js 16.x or higher
- npm (comes with Node.js)
- At least 4GB RAM
- 2GB free disk space

### For Running the App:
- Windows 7/8/10/11
- 512MB RAM minimum
- 100MB free disk space

## Build Outputs

After building, you'll find these files in `dist_electron/`:

1. **Installer (NSIS)**: `Vikas Milk Center Pro-X.X.X-x64.exe`
   - Full installer with desktop shortcuts
   - Recommended for distribution

2. **Portable Version**: `Vikas Milk Center Pro-X.X.X-x64-portable.exe`
   - No installation required
   - Can run from USB drive

## Troubleshooting

### Build Fails
1. Make sure Node.js is installed: `node --version`
2. Clear cache: `npm cache clean --force`
3. Delete `node_modules` and run `npm install` again
4. Check Windows Defender isn't blocking the build

### App Won't Start
1. Install Visual C++ Redistributable
2. Check Windows compatibility mode
3. Run as administrator if needed

### Icon Issues
- Make sure `build/icon.ico` exists
- The icon should be 256x256 pixels
- Use a proper ICO format converter if needed

## Distribution

### For End Users:
1. Share the installer: `Vikas Milk Center Pro-X.X.X-x64.exe`
2. Users double-click to install
3. App appears in Start Menu and Desktop

### For Portable Use:
1. Share the portable version
2. No installation needed
3. Can run from any folder or USB drive

## File Structure After Build

```
dist_electron/
├── win-unpacked/              # Unpacked application files
├── Vikas Milk Center Pro-X.X.X-x64.exe     # Main installer
├── Vikas Milk Center Pro-X.X.X-x64-portable.exe  # Portable version
└── latest.yml                 # Update metadata
```

## Security Notes

- The app is not code-signed, so Windows may show security warnings
- Users should click "More info" → "Run anyway" if Windows Defender blocks it
- For production, consider purchasing a code signing certificate

## Updates

The app includes auto-update functionality:
- Updates are checked automatically
- Users will be notified when updates are available
- Manual update checking available in the app

## Support

For build issues or questions:
1. Check the console output for specific error messages
2. Ensure all dependencies are properly installed
3. Try building with administrator privileges
4. Check antivirus software isn't interfering