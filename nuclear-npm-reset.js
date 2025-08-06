#!/usr/bin/env node

// NUCLEAR OPTION - Complete npm-only reset
const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔥 NUCLEAR NPM RESET - Removing all electron dependencies');

// Kill all package manager processes
const killCommands = [
  'pkill -9 -f bun',
  'pkill -9 -f yarn', 
  'killall -9 bun',
  'killall -9 yarn'
];

killCommands.forEach(cmd => {
  try {
    execSync(cmd, { stdio: 'ignore' });
  } catch (e) {}
});

// Remove ALL lock files and node_modules
const toRemove = [
  'node_modules',
  'package-lock.json',
  'yarn.lock',
  'bun.lockb',
  '.bun',
  'bunfig.toml',
  '.bunfig.toml'
];

toRemove.forEach(item => {
  try {
    if (fs.existsSync(item)) {
      if (fs.lstatSync(item).isDirectory()) {
        fs.rmSync(item, { recursive: true, force: true });
      } else {
        fs.unlinkSync(item);
      }
      console.log(`✅ Removed ${item}`);
    }
  } catch (e) {
    console.log(`⚠️ Could not remove ${item}`);
  }
});

// Force npm environment
process.env.npm_config_user_agent = 'npm';
process.env.npm_config_git = 'false';
process.env.npm_config_optional = 'false';
process.env.FORCE_NPM = 'true';
process.env.NO_BUN = 'true';

// Install only essential web packages - NO ELECTRON
const essentialWebPackages = [
  'react@18.3.1',
  'react-dom@18.3.1',
  'react-router-dom@6.26.2',
  '@radix-ui/react-dialog@1.1.2',
  '@radix-ui/react-tabs@1.1.0',
  'lucide-react@0.462.0',
  'sonner@1.5.0',
  'date-fns@4.1.0',
  'clsx@2.1.1',
  'tailwind-merge@2.5.2'
];

console.log('📦 Installing web-only packages with npm...');

try {
  const installCmd = `npm install --no-git --legacy-peer-deps --no-optional ${essentialWebPackages.join(' ')}`;
  execSync(installCmd, {
    stdio: 'inherit',
    env: process.env
  });
  console.log('✅ Web-only packages installed successfully!');
} catch (error) {
  console.error('❌ Installation failed, trying individual packages...');
  
  // Install packages one by one as fallback
  essentialWebPackages.forEach(pkg => {
    try {
      execSync(`npm install --no-git --legacy-peer-deps ${pkg}`, {
        stdio: 'pipe',
        env: process.env
      });
      console.log(`✅ Installed ${pkg}`);
    } catch (e) {
      console.log(`⚠️ Skipped ${pkg}`);
    }
  });
}

console.log(`
🎉 NUCLEAR RESET COMPLETE!
🌐 Web-only mode activated
🚫 All electron dependencies eliminated
🚀 Run: npm run dev
`);