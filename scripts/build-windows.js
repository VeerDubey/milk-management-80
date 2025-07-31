#!/usr/bin/env node

/**
 * Windows-specific build script for Vikas Milk Center Pro
 * Optimized for Windows deployment with proper error handling
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Windows-specific colors for console output
const colors = {
  reset: '',
  bright: '',
  red: '',
  green: '',
  yellow: '',
  blue: '',
  cyan: ''
};

// Enable colors on Windows if supported
if (process.platform === 'win32' && process.env.FORCE_COLOR !== '0') {
  colors.reset = '\x1b[0m';
  colors.bright = '\x1b[1m';
  colors.red = '\x1b[31m';
  colors.green = '\x1b[32m';
  colors.yellow = '\x1b[33m';
  colors.blue = '\x1b[34m';
  colors.cyan = '\x1b[36m';
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, options = {}) {
  const { silent = false, cwd = rootDir } = options;
  
  if (!silent) {
    log(`\n> ${command}`, 'cyan');
  }
  
  try {
    execSync(command, { 
      stdio: 'inherit', 
      cwd,
      env: { ...process.env, FORCE_COLOR: '1' }
    });
    return true;
  } catch (error) {
    log(`❌ Command failed: ${command}`, 'red');
    console.error(error.message);
    return false;
  }
}

function ensureWindowsAssets() {
  log('\n📋 Ensuring Windows-specific assets...', 'yellow');
  
  const buildDir = path.join(rootDir, 'build');
  const iconPath = path.join(buildDir, 'icon.ico');
  
  // Ensure build directory exists
  if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir, { recursive: true });
    log('✅ Created build directory', 'green');
  }
  
  // Check if icon exists, if not copy from PNG
  if (!fs.existsSync(iconPath)) {
    const pngIconPath = path.join(buildDir, 'icon.png');
    if (fs.existsSync(pngIconPath)) {
      // For now, just ensure the icon exists
      log('⚠️  ICO icon will be generated during build', 'yellow');
    }
  }
  
  log('✅ Windows assets prepared', 'green');
}

function checkWindowsRequirements() {
  log('\n🔍 Checking Windows build requirements...', 'yellow');
  
  // Check Node.js version
  try {
    const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
    log(`✅ Node.js: ${nodeVersion}`, 'green');
  } catch (error) {
    log('❌ Node.js not found', 'red');
    return false;
  }
  
  // Check npm
  try {
    const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
    log(`✅ npm: v${npmVersion}`, 'green');
  } catch (error) {
    log('❌ npm not found', 'red');
    return false;
  }
  
  // Check if we're on Windows
  if (process.platform !== 'win32') {
    log('⚠️  Not running on Windows, cross-compilation will be attempted', 'yellow');
  } else {
    log('✅ Running on Windows', 'green');
  }
  
  return true;
}

function buildWebApp() {
  log('\n🔨 Building web application...', 'yellow');
  
  if (!runCommand('npm run build')) {
    throw new Error('Web build failed');
  }
  
  log('✅ Web application built successfully', 'green');
}

function buildWindowsApp() {
  log('\n🖥️  Building Windows desktop application...', 'yellow');
  
  // Build both installer and portable versions
  const command = 'npx electron-builder --win --x64 --ia32 --publish=never';
  
  if (!runCommand(command)) {
    throw new Error('Windows desktop build failed');
  }
  
  log('✅ Windows desktop application built successfully', 'green');
}

function showWindowsBuildResults() {
  const distElectronPath = path.join(rootDir, 'dist_electron');
  
  if (fs.existsSync(distElectronPath)) {
    const files = fs.readdirSync(distElectronPath);
    const windowsFiles = files.filter(file => 
      file.endsWith('.exe') || 
      file.endsWith('.msi') ||
      file.endsWith('.appx')
    );
    
    if (windowsFiles.length > 0) {
      log('\n📦 Windows build results:', 'bright');
      windowsFiles.forEach(file => {
        const filePath = path.join(distElectronPath, file);
        const stats = fs.statSync(filePath);
        const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
        
        let fileType = '';
        if (file.includes('Setup') || (!file.includes('portable') && file.endsWith('.exe'))) {
          fileType = ' (Installer)';
        } else if (file.includes('portable')) {
          fileType = ' (Portable)';
        }
        
        log(`   📄 ${file}${fileType} (${sizeInMB} MB)`, 'green');
      });
      
      log(`\n📁 Location: ${distElectronPath}`, 'cyan');
      log('\n💡 Distribution Guide:', 'yellow');
      log('   • Use installer (.exe) for end-user distribution', 'cyan');
      log('   • Use portable version for USB/no-install scenarios', 'cyan');
      log('   • Test on clean Windows machines before distribution', 'cyan');
    }
  }
}

function main() {
  log(`
${colors.bright}${colors.blue}╔══════════════════════════════════════════╗
║      Vikas Milk Center Pro - Windows     ║
║           Build Script v2.0              ║
╚══════════════════════════════════════════╝${colors.reset}

Platform: ${process.platform}
Architecture: ${process.arch}
Node Version: ${process.version}
Target: Windows (x64 + x86)
  `, 'blue');
  
  try {
    if (!checkWindowsRequirements()) {
      throw new Error('Windows build requirements not met');
    }
    
    ensureWindowsAssets();
    buildWebApp();
    buildWindowsApp();
    showWindowsBuildResults();
    
    log(`\n🎉 Windows build completed successfully!`, 'bright');
    log(`\n💡 Next steps:`, 'yellow');
    log(`   • Test the installer on a clean Windows machine`, 'cyan');
    log(`   • Check that all features work in the built app`, 'cyan');
    log(`   • Consider code signing for production distribution`, 'cyan');
    
  } catch (error) {
    log(`\n❌ Windows build failed: ${error.message}`, 'red');
    log(`\n🔧 Troubleshooting tips:`, 'yellow');
    log(`   • Run 'npm cache clean --force' and try again`, 'cyan');
    log(`   • Ensure Windows Defender isn't blocking the build`, 'cyan');
    log(`   • Try running as Administrator`, 'cyan');
    log(`   • Check that all dependencies are installed`, 'cyan');
    process.exit(1);
  }
}

// Run if called directly
if (process.argv[1] === __filename) {
  main();
}

export { main as buildWindows };