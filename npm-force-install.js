#!/usr/bin/env node

// ULTIMATE npm force - completely bypass bun
const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔥 ULTIMATE NPM FORCE - Web-only mode');

// Kill bun processes
try {
  execSync('pkill -f bun', { stdio: 'ignore' });
} catch (e) {}

// Force environment
process.env.npm_config_user_agent = 'npm';
process.env.npm_config_git = 'false';
process.env.FORCE_NPM = 'true';

// Install essential web packages only
const webPackages = [
  'react@18.3.1',
  'react-dom@18.3.1', 
  'react-router-dom@6.26.2',
  '@radix-ui/react-dialog@1.1.2',
  'lucide-react@0.462.0',
  'sonner@1.5.0',
  'date-fns@4.1.0'
];

try {
  execSync(`npm install --no-git --legacy-peer-deps ${webPackages.join(' ')}`, {
    stdio: 'inherit',
    env: process.env
  });
  console.log('✅ Web-only packages installed successfully');
} catch (error) {
  console.log('Installing packages individually...');
  webPackages.forEach(pkg => {
    try {
      execSync(`npm install --no-git ${pkg}`, { stdio: 'inherit', env: process.env });
    } catch (e) {
      console.log(`⚠️ Skipped ${pkg}`);
    }
  });
}