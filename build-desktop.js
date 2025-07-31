#!/usr/bin/env node

/**
 * Desktop Build Script for Vikas Milk Center Pro
 * Builds the application for Windows, Mac, and Linux
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, options = {}) {
  const { silent = false } = options;
  
  if (!silent) {
    log(`\n> ${command}`, 'cyan');
  }
  
  try {
    execSync(command, { stdio: 'inherit', cwd: __dirname });
    return true;
  } catch (error) {
    log(`❌ Command failed: ${command}`, 'red');
    console.error(error.message);
    return false;
  }
}

function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    log(`📁 Created directory: ${dir}`, 'green');
  }
}

function prepareBuildFiles() {
  log('\n📋 Preparing build files...', 'yellow');
  
  // Ensure build directories exist
  ensureDirectoryExists(path.join(__dirname, 'build'));
  ensureDirectoryExists(path.join(__dirname, 'dist'));
  ensureDirectoryExists(path.join(__dirname, 'dist_electron'));
  
  // Copy icon files if they don't exist
  const iconPath = path.join(__dirname, 'build/icon.png');
  if (!fs.existsSync(iconPath)) {
    const publicIconPath = path.join(__dirname, 'public/icon-512x512.png');
    if (fs.existsSync(publicIconPath)) {
      fs.copyFileSync(publicIconPath, iconPath);
      log('✅ Copied icon file', 'green');
    }
  }
  
  log('✅ Build files prepared', 'green');
}

function buildWeb() {
  log('\n🔨 Building web application...', 'yellow');
  
  if (!runCommand('npm run build')) {
    throw new Error('Web build failed');
  }
  
  log('✅ Web application built successfully', 'green');
}

function buildDesktop(platform = 'current') {
  log(`\n🖥️  Building desktop application for ${platform}...`, 'yellow');
  
  let command;
  switch (platform) {
    case 'windows':
    case 'win':
      command = 'npx electron-builder --win --publish=never';
      break;
    case 'mac':
    case 'macos':
      command = 'npx electron-builder --mac --publish=never';
      break;
    case 'linux':
      command = 'npx electron-builder --linux --publish=never';
      break;
    case 'all':
      command = 'npx electron-builder --publish=never';
      break;
    default:
      // Build for current platform
      const os = process.platform;
      if (os === 'win32') {
        command = 'npx electron-builder --win --publish=never';
      } else if (os === 'darwin') {
        command = 'npx electron-builder --mac --publish=never';
      } else {
        command = 'npx electron-builder --linux --publish=never';
      }
  }
  
  if (!runCommand(command)) {
    throw new Error('Desktop build failed');
  }
  
  log('✅ Desktop application built successfully', 'green');
}

function showBuildInfo() {
  const distElectronPath = path.join(__dirname, 'dist_electron');
  
  if (fs.existsSync(distElectronPath)) {
    const files = fs.readdirSync(distElectronPath);
    const executables = files.filter(file => 
      file.endsWith('.exe') || 
      file.endsWith('.dmg') || 
      file.endsWith('.AppImage') ||
      file.endsWith('.deb') ||
      file.endsWith('.rpm')
    );
    
    if (executables.length > 0) {
      log('\n📦 Built applications:', 'bright');
      executables.forEach(file => {
        const filePath = path.join(distElectronPath, file);
        const stats = fs.statSync(filePath);
        const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
        log(`   📄 ${file} (${sizeInMB} MB)`, 'green');
      });
      
      log(`\n📁 Location: ${distElectronPath}`, 'cyan');
    }
  }
}

function main() {
  const args = process.argv.slice(2);
  const platform = args[0] || 'current';
  
  log(`
${colors.bright}${colors.blue}╔══════════════════════════════════════════╗
║          Vikas Milk Center Pro           ║
║         Desktop Build Script             ║
╚══════════════════════════════════════════╝${colors.reset}

Platform: ${process.platform}
Node Version: ${process.version}
Target: ${platform}
  `, 'blue');
  
  try {
    prepareBuildFiles();
    buildWeb();
    buildDesktop(platform);
    showBuildInfo();
    
    log(`\n🎉 Build completed successfully!`, 'bright');
    log(`\n💡 To run the application:`, 'yellow');
    log(`   • Extract and run the executable from dist_electron/`, 'cyan');
    log(`   • Or use: npm run electron:dev for development`, 'cyan');
    
  } catch (error) {
    log(`\n❌ Build failed: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Handle command line arguments
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
Usage: node build-desktop.js [platform]

Platforms:
  current  - Build for current platform (default)
  windows  - Build for Windows
  mac      - Build for macOS  
  linux    - Build for Linux
  all      - Build for all platforms

Examples:
  node build-desktop.js
  node build-desktop.js windows
  node build-desktop.js all
  `);
  process.exit(0);
}

main();