#!/usr/bin/env node

/**
 * Project Startup Script - Forces NPM Usage
 * Run this FIRST to avoid Bun/Git errors
 */

import { execSync } from 'child_process';
import fs from 'fs';

console.log(`
🚀 Starting Vikas Milk Center Pro
🔧 Forcing NPM-only environment...
`);

// Step 1: Force npm environment
process.env.npm_config_user_agent = 'npm';
process.env.npm_config_package_manager = 'npm';
process.env.npm_config_git = 'false';
process.env.FORCE_NPM = 'true';
process.env.NO_BUN = 'true';
process.env.BUN_DISABLE = 'true';

// Remove bun environment variables
delete process.env.BUN_INSTALL;
delete process.env.BUN_CONFIG_FILE;

// Step 2: Create .npmrc to disable git
const npmrcContent = `
registry=https://registry.npmjs.org/
git=false
legacy-peer-deps=true
optional=false
user-agent=npm
package-manager=npm
`;

fs.writeFileSync('.npmrc', npmrcContent.trim());

// Step 3: Remove any bun files
const bunFiles = ['bun.lockb', 'bunfig.toml', '.bunfig.toml'];
bunFiles.forEach(file => {
  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
    console.log(`✅ Removed ${file}`);
  }
});

// Step 4: Check if node_modules exists
if (!fs.existsSync('node_modules')) {
  console.log('📦 Installing dependencies with npm...');
  try {
    execSync('npm install --no-git --legacy-peer-deps', {
      stdio: 'inherit',
      env: { ...process.env }
    });
    console.log('✅ Dependencies installed successfully');
  } catch (error) {
    console.log('⚠️ Installation failed, trying emergency setup...');
    try {
      execSync('node emergency-npm-setup.js', {
        stdio: 'inherit',
        env: { ...process.env }
      });
    } catch (e) {
      console.error('❌ Emergency setup also failed. Try manual installation.');
      process.exit(1);
    }
  }
}

// Step 5: Start the development server
console.log('🌟 Starting development server...');
try {
  execSync('npm run dev', {
    stdio: 'inherit',
    env: { ...process.env }
  });
} catch (error) {
  console.error('❌ Failed to start development server');
  console.log('Try running manually: npm run dev');
}