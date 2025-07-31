import { app } from 'electron';
import os from 'os';

/**
 * App Info API - Provides application and system information
 */
export default {
  /**
   * Get application version
   */
  getVersion() {
    return app.getVersion();
  },

  /**
   * Get detailed system information
   */
  getSystemInfo() {
    return {
      platform: process.platform,
      osVersion: os.release(),
      osName: `${os.type()} ${os.release()}`,
      architecture: process.arch,
      cpuCores: os.cpus().length,
      totalMemory: os.totalmem(),
      freeMemory: os.freemem(),
      nodeVersion: process.versions.node,
      electronVersion: process.versions.electron,
      chromeVersion: process.versions.chrome
    };
  }
};