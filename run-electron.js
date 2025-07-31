#!/usr/bin/env node

/**
 * Electron Runner Script
 * Handles running the app in development and production modes
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const isDev = process.env.NODE_ENV === 'development' || process.argv.includes('--dev');
const isProduction = process.argv.includes('--prod');

console.log('🚀 Starting VMC Pro Desktop Application...');
console.log(`Mode: ${isDev ? 'Development' : 'Production'}`);

if (isDev) {
  // Development mode - start with concurrently
  console.log('📱 Starting development server and Electron...');
  
  const concurrently = spawn('npx', [
    'concurrently',
    '"npm run dev"',
    '"wait-on http://localhost:5173 && electron ."'
  ], {
    stdio: 'inherit',
    shell: true,
    cwd: __dirname
  });

  concurrently.on('close', (code) => {
    console.log(`Development server exited with code ${code}`);
    process.exit(code);
  });

  concurrently.on('error', (error) => {
    console.error('Failed to start development server:', error);
    process.exit(1);
  });

} else {
  // Production mode - just run electron
  console.log('⚡ Starting Electron in production mode...');
  
  // Check if dist exists
  const distPath = path.join(__dirname, 'dist');
  if (!fs.existsSync(distPath)) {
    console.error('❌ Dist folder not found. Please run "npm run build" first.');
    process.exit(1);
  }

  const electron = spawn('electron', ['.'], {
    stdio: 'inherit',
    shell: true,
    cwd: __dirname
  });

  electron.on('close', (code) => {
    console.log(`Electron exited with code ${code}`);
    process.exit(code);
  });

  electron.on('error', (error) => {
    console.error('Failed to start Electron:', error);
    process.exit(1);
  });
}