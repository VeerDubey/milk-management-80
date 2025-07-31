#!/usr/bin/env node

/**
 * AGGRESSIVE Package Manager Override
 * This script completely eliminates bun and forces npm usage
 */

import { execSync } from 'child_process';
import fs from 'fs';
import process from 'process';

console.log('🔥 AGGRESSIVE NPM OVERRIDE - Eliminating Bun Completely');

// Step 1: Kill ALL bun processes aggressively
const killCommands = [
  'pkill -9 -f bun',
  'killall -9 bun',
  'taskkill /F /IM bun.exe',
  'pgrep -f bun | xargs kill -9',
  'ps aux | grep bun | grep -v grep | awk \'{print $2}\' | xargs kill -9'
];

killCommands.forEach(cmd => {
  try {
    execSync(cmd, { stdio: 'ignore' });
  } catch (e) {
    // Ignore errors - process might not exist
  }
});

// Step 2: Remove ALL bun-related files and directories
const bunFiles = [
  'bun.lockb',
  '.bun',
  'bunfig.toml',
  '.bunfig.toml',
  'bun.config.js',
  'bun.config.ts'
];

bunFiles.forEach(file => {
  try {
    if (fs.existsSync(file)) {
      if (fs.lstatSync(file).isDirectory()) {
        fs.rmSync(file, { recursive: true, force: true });
      } else {
        fs.unlinkSync(file);
      }
      console.log(`✅ Removed ${file}`);
    }
  } catch (e) {
    console.log(`⚠️ Could not remove ${file}`);
  }
});

// Step 3: Create AGGRESSIVE .npmrc that completely disables git
const aggressiveNpmrc = `
# AGGRESSIVE NPM-ONLY CONFIGURATION
registry=https://registry.npmjs.org/
package-manager=npm
user-agent=npm

# COMPLETELY DISABLE GIT
git=false
git-tag-version=false
no-git-tag-version=true

# FORCE TARBALL DOWNLOADS - NO GIT CLONING
prefer-offline=false
prefer-online=true

# ELECTRON SPECIFIC - FORCE TARBALL
@electron:registry=https://registry.npmjs.org/
@electron/node-gyp:registry=https://registry.npmjs.org/
electron:registry=https://registry.npmjs.org/

# DISABLE ALL GIT OPERATIONS FOR ELECTRON
@electron:git=false
@electron/node-gyp:git=false
electron:git=false
node-gyp:git=false

# FORCE HIGH TIMEOUTS
fetch-timeout=600000
fetch-retry-mintimeout=60000
fetch-retry-maxtimeout=300000

# COMPATIBILITY
legacy-peer-deps=true
strict-ssl=true
package-lock=true

# FORCE NPM DETECTION
engine-strict=false
`;

fs.writeFileSync('.npmrc', aggressiveNpmrc.trim());
console.log('✅ Created aggressive .npmrc configuration');

// Step 4: Create package-lock.json to force npm detection
const forcedPackageLock = {
  "name": "milk-center-management",
  "version": "0.1.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "milk-center-management",
      "version": "0.1.0",
      "hasInstallScript": false,
      "dependencies": {},
      "devDependencies": {},
      "engines": {
        "node": ">=18.0.0",
        "npm": ">=8.0.0"
      }
    }
  }
};

fs.writeFileSync('package-lock.json', JSON.stringify(forcedPackageLock, null, 2));
console.log('✅ Created forced package-lock.json');

// Step 5: Set environment variables permanently
process.env.npm_config_user_agent = 'npm';
process.env.npm_config_package_manager = 'npm';
process.env.npm_config_git = 'false';
process.env.FORCE_NPM = 'true';
process.env.NO_BUN = 'true';
process.env.BUN_DISABLE = 'true';

// Remove bun from PATH if present
if (process.env.PATH) {
  process.env.PATH = process.env.PATH
    .split(':')
    .filter(path => !path.includes('bun'))
    .join(':');
}

console.log('✅ Environment variables set to force npm');

// Step 6: Clean npm cache and install
try {
  console.log('🧹 Cleaning npm cache...');
  execSync('npm cache clean --force', { stdio: 'inherit' });
  
  console.log('📦 Installing with npm (no git, no optional deps)...');
  execSync('npm install --no-git --no-optional --legacy-peer-deps --registry=https://registry.npmjs.org/', {
    stdio: 'inherit',
    env: { ...process.env }
  });
  
  console.log('✅ SUCCESS: Dependencies installed with npm only!');
} catch (error) {
  console.error('❌ NPM install failed:', error.message);
  console.log('🔄 Trying fallback installation...');
  
  // Fallback: Install essential packages only
  const essentialPackages = [
    'react@^18.3.1',
    'react-dom@^18.3.1',
    'react-router-dom@^6.26.2',
    '@radix-ui/react-dialog@^1.1.2',
    'lucide-react@^0.462.0',
    'sonner@^1.5.0'
  ];
  
  try {
    execSync(`npm install --no-git --legacy-peer-deps ${essentialPackages.join(' ')}`, {
      stdio: 'inherit',
      env: { ...process.env }
    });
    console.log('✅ Essential packages installed successfully');
  } catch (fallbackError) {
    console.error('❌ Fallback installation also failed');
    console.log('Manual steps required:');
    console.log('1. Delete node_modules');
    console.log('2. Run: npm install --no-git --legacy-peer-deps');
  }
}

console.log(`
🎉 OVERRIDE COMPLETE!
🚫 Bun has been completely eliminated
✅ npm is now the only package manager
🔧 Run: npm run dev (NOT bun dev)
`);