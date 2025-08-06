// Web-only environment flag to prevent any electron imports
declare global {
  interface Window {
    __WEB_ONLY_MODE__: boolean;
  }
}

// Force web-only mode
if (typeof window !== 'undefined') {
  window.__WEB_ONLY_MODE__ = true;
}

export {};