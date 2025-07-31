#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Forcing NPM installation...');

try {
  // Kill bun processes
  try {
    execSync('pkill -f bun', { stdio: 'ignore' });
  } catch (e) {}

  // Remove bun.lockb
  const bunLockPath = path.join(process.cwd(), 'bun.lockb');
  if (fs.existsSync(bunLockPath)) {
    fs.unlinkSync(bunLockPath);
  }

  // Install with npm
  execSync('npm install --no-optional --legacy-peer-deps', { stdio: 'inherit' });
  console.log('✅ Installation successful!');
  
} catch (error) {
  console.error('❌ Installation failed:', error.message);
  process.exit(1);
}