
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { Toaster } from './components/ui/toaster'
import { Toaster as SonnerToaster } from 'sonner'

// PWA & Desktop App Setup
console.log('🚀 Starting VMC Pro Desktop Application...');

// Simplified initialization for debugging
console.log('🚀 Starting VMC Pro...');

// Register Service Worker for offline functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then((registration) => {
        console.log('✅ SW registered successfully:', registration.scope);
        
        // Enable periodic background sync (if supported)
        if ('periodicSync' in registration && (registration as any).periodicSync) {
          try {
            (registration as any).periodicSync.register('delivery-data-sync', {
              minInterval: 24 * 60 * 60 * 1000, // 24 hours
            }).catch((err: any) => console.log('Periodic sync registration failed:', err));
          } catch (err) {
            console.log('Periodic sync not supported:', err);
          }
        }
      })
      .catch((registrationError) => {
        console.error('❌ SW registration failed:', registrationError);
      });
  });
}

// Enable persistent storage for desktop app
if ('storage' in navigator && 'persist' in navigator.storage) {
  navigator.storage.persist().then(persistent => {
    console.log(persistent ? '✅ Persistent storage enabled' : '⚠️ Persistent storage not available');
  });
}

// Desktop PWA Install Handler
let deferredPrompt: any;
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('🔔 VMC Pro can be installed as desktop app');
  e.preventDefault();
  deferredPrompt = e;
  
  // Create install button or show notification
  const installButton = document.createElement('button');
  installButton.textContent = '📥 Install VMC Pro Desktop';
  installButton.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    padding: 10px 15px;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  `;
  
  installButton.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(outcome === 'accepted' ? '✅ User installed the app' : '❌ User dismissed install');
      deferredPrompt = null;
      installButton.remove();
    }
  });
  
  document.body.appendChild(installButton);
  
  // Auto-hide after 10 seconds
  setTimeout(() => {
    if (installButton.parentNode) {
      installButton.remove();
    }
  }, 10000);
});

// Handle app installation
window.addEventListener('appinstalled', () => {
  console.log('🎉 VMC Pro Desktop installed successfully!');
  deferredPrompt = null;
});

// Enhanced error handling for desktop app
window.addEventListener('error', (event) => {
  console.error('🚨 Application Error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('🚨 Unhandled Promise Rejection:', event.reason);
});

// Offline/Online status detection
window.addEventListener('online', () => {
  console.log('🟢 Application is online');
  document.dispatchEvent(new CustomEvent('app-online'));
});

window.addEventListener('offline', () => {
  console.log('🔴 Application is offline');
  document.dispatchEvent(new CustomEvent('app-offline'));
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
    <Toaster />
    <SonnerToaster 
      position="top-right" 
      closeButton 
      richColors 
      expand={true}
      visibleToasts={5}
    />
  </React.StrictMode>,
)
