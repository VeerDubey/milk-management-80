import { BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class SplashWindow {
  constructor() {
    this.splashWindow = null;
  }

  createSplashWindow() {
    this.splashWindow = new BrowserWindow({
      width: 400,
      height: 300,
      frame: false,
      alwaysOnTop: true,
      transparent: true,
      resizable: false,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true
      }
    });

    this.splashWindow.loadFile(path.join(__dirname, '../build/splash.html'));
    
    // Close splash window after 3 seconds
    setTimeout(() => {
      this.closeSplash();
    }, 3000);

    return this.splashWindow;
  }

  closeSplash() {
    if (this.splashWindow) {
      this.splashWindow.close();
      this.splashWindow = null;
    }
  }

  getSplashWindow() {
    return this.splashWindow;
  }
}

export default new SplashWindow();