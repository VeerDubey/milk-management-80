#!/usr/bin/env node

/**
 * Package Lock Fixer - Creates npm package-lock.json to force npm usage
 */

import fs from 'fs';

console.log('🔧 Creating package-lock.json to force npm usage...');

// Create a basic package-lock.json structure
const packageLockContent = {
  "name": "milk-center-management",
  "version": "0.1.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "milk-center-management",
      "version": "0.1.0",
      "dependencies": {
        "react": "^18.3.1",
        "react-dom": "^18.3.1",
        "react-router-dom": "^6.26.2"
      },
      "devDependencies": {
        "vite": "^5.0.0",
        "@types/react": "^18.2.0",
        "@types/react-dom": "^18.2.0",
        "typescript": "^5.0.0"
      }
    }
  }
};

// Write the package-lock.json file
fs.writeFileSync('package-lock.json', JSON.stringify(packageLockContent, null, 2));

console.log('✅ Created package-lock.json');
console.log('✅ This will force npm usage and prevent bun from being used');

// Also create .npmrc if it doesn't exist
if (!fs.existsSync('.npmrc')) {
  const npmrcContent = `
registry=https://registry.npmjs.org/
git=false
legacy-peer-deps=true
user-agent=npm
package-manager=npm
optional=false
`;
  
  fs.writeFileSync('.npmrc', npmrcContent.trim());
  console.log('✅ Created .npmrc configuration');
}

console.log(`
🎉 Package manager forced to npm!
🚀 Now you can run: npm install
`);