
// ElectronService.ts - Web-only service (Electron dependencies removed)

/**
 * This service provides web-only functionality with fallbacks.
 * Electron dependencies have been removed to avoid build issues.
 */
export const ElectronService = {
  // Feature detection - always false in web-only mode
  isElectron: false,
  
  // File operations
  downloadInvoice: async (data: string, filename: string) => {
    // Web-only download implementation
    const link = document.createElement('a');
    link.href = data;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return { success: true };
  },
  
  printInvoice: async (data: string) => {
    // Web-only print implementation
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = data;
    document.body.appendChild(iframe);
    
    iframe.onload = () => {
      try {
        iframe.contentWindow?.print();
      } catch (e) {
        console.error('Print failed:', e);
      }
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    };
    
    return { success: true };
  },
  
  getPrinters: async () => {
    // Web-only implementation - no printers available
    return { success: false, printers: [] };
  },
  
  // System operations
  system: {
    openExternal: async (url: string) => {
      // Web-only implementation
      window.open(url, '_blank');
      return true;
    },
    
    copyToClipboard: async (text: string) => {
      // Web-only clipboard implementation
      try {
        await navigator.clipboard.writeText(text);
        return { success: true };
      } catch (e) {
        console.error('Clipboard write failed:', e);
        return { success: false, error: 'Cannot access clipboard' };
      }
    },
    
    readFromClipboard: async () => {
      // Web-only clipboard implementation
      try {
        const text = await navigator.clipboard.readText();
        return { success: true, text };
      } catch (e) {
        console.error('Clipboard read failed:', e);
        return { success: false, error: 'Cannot access clipboard', text: '' };
      }
    },
    
    isPlatform: async (platform: string) => {
      // Web-only platform detection
      const userAgent = navigator.userAgent.toLowerCase();
      if (platform === 'windows') return userAgent.includes('win');
      if (platform === 'mac') return userAgent.includes('mac');
      if (platform === 'linux') return userAgent.includes('linux');
      return false;
    }
  },
  
  // Data import/export operations
  exportData: async (data: string, filename: string) => {
    // Web-only data export implementation
    const link = document.createElement('a');
    link.href = `data:text/json;charset=utf-8,${encodeURIComponent(data)}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return { success: true };
  },
  
  importData: async () => {
    // Web-only data import implementation
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.style.display = 'none';
      
      input.onchange = (e: Event) => {
        const target = e.target as HTMLInputElement;
        const file = target.files?.[0];
        
        if (!file) {
          resolve({ success: false, error: 'No file selected' });
          document.body.removeChild(input);
          return;
        }
        
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const data = reader.result as string;
            resolve({ success: true, data });
          } catch (error) {
            resolve({ success: false, error: 'Failed to read file' });
          }
          document.body.removeChild(input);
        };
        
        reader.onerror = () => {
          resolve({ success: false, error: 'Failed to read file' });
          document.body.removeChild(input);
        };
        
        reader.readAsText(file);
      };
      
      document.body.appendChild(input);
      input.click();
    });
  },
  
  // Log saving operation
  saveLog: async (data: string, filename: string) => {
    // Web-only log saving implementation
    const link = document.createElement('a');
    link.href = `data:text/plain;charset=utf-8,${encodeURIComponent(data)}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return { success: true };
  }
};
