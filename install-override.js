#!/usr/bin/env node

// Force npm installation by blocking bun
console.log('🚨 Blocking bun and forcing npm installation...');

const { execSync } = require('child_process');
const fs = require('fs');

// Remove all bun files
const bunFiles = ['bun.lockb', '.bun', 'bunfig.toml'];
bunFiles.forEach(file => {
  if (fs.existsSync(file)) {
    if (fs.lstatSync(file).isDirectory()) {
      fs.rmSync(file, { recursive: true, force: true });
    } else {
      fs.unlinkSync(file);
    }
  }
});

// Install with npm only
try {
  execSync('npm install --no-git --legacy-peer-deps --no-optional', {
    stdio: 'inherit',
    env: {
      ...process.env,
      npm_config_git: 'false',
      npm_config_user_agent: 'npm'
    }
  });
  console.log('✅ Installation successful with npm');
} catch (error) {
  console.error('❌ Installation failed');
}