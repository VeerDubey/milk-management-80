
const CACHE_NAME = 'vmc-pro-desktop-v2.0.0';
const urlsToCache = [
  '/',
  '/dashboard',
  '/delivery-sheet-bulk',
  '/delivery-sheet-manager',
  '/customer-list',
  '/product-list',
  '/order-list',
  '/manifest.json',
  '/lovable-uploads/28f4e98f-6710-4594-b4b9-244b3b660626.png',
  '/lovable-uploads/94882b07-d7b1-4949-8dcb-7a750fd17c6b.png',
  // Add more critical routes for offline use
  '/track-sheet',
  '/invoices',
  '/analytics',
  '/reports'
];

// Install Service Worker
self.addEventListener('install', event => {
  console.log('[SW] Installing VMC Pro Desktop...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching App Shell & Critical Pages');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('[SW] VMC Pro Desktop Cached Successfully');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('[SW] Cache failed:', error);
      })
  );
});

// Activate Service Worker
self.addEventListener('activate', event => {
  console.log('[SW] Activating VMC Pro Desktop...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting Old Cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[SW] VMC Pro Desktop Activated');
      return self.clients.claim();
    })
  );
});

// Enhanced Fetch Strategy - Network First for API, Cache First for Assets
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Handle API requests with Network First strategy
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Cache successful API responses
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Return cached API response if network fails
          return caches.match(event.request);
        })
    );
    return;
  }
  
  // Handle app navigation and assets with Cache First strategy
  if (event.request.destination === 'document' || 
      event.request.destination === 'script' ||
      event.request.destination === 'style' ||
      event.request.destination === 'image') {
    
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) {
            return response;
          }
          
          return fetch(event.request)
            .then(fetchResponse => {
              // Save to cache for future requests
              if (fetchResponse.ok) {
                const responseClone = fetchResponse.clone();
                caches.open(CACHE_NAME).then(cache => {
                  cache.put(event.request, responseClone);
                });
              }
              return fetchResponse;
            });
        })
        .catch(() => {
          // Fallback for offline navigation
          if (event.request.destination === 'document') {
            return caches.match('/');
          }
        })
    );
  }
});

// Background Sync for Offline Operations
self.addEventListener('sync', event => {
  console.log('[SW] Background Sync Event:', event.tag);
  
  if (event.tag === 'delivery-sync') {
    event.waitUntil(syncDeliveryData());
  }
  
  if (event.tag === 'orders-sync') {
    event.waitUntil(syncOrderData());
  }
  
  if (event.tag === 'customers-sync') {
    event.waitUntil(syncCustomerData());
  }
});

// Push Notifications for Desktop
self.addEventListener('push', event => {
  let notificationData = {
    title: 'VMC Pro',
    body: 'New delivery update available',
    icon: '/lovable-uploads/28f4e98f-6710-4594-b4b9-244b3b660626.png',
    badge: '/lovable-uploads/28f4e98f-6710-4594-b4b9-244b3b660626.png'
  };
  
  if (event.data) {
    try {
      notificationData = { ...notificationData, ...event.data.json() };
    } catch (e) {
      notificationData.body = event.data.text();
    }
  }
  
  const options = {
    body: notificationData.body,
    icon: notificationData.icon,
    badge: notificationData.badge,
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: Math.random()
    },
    actions: [
      {
        action: 'view',
        title: 'View Details',
        icon: '/lovable-uploads/28f4e98f-6710-4594-b4b9-244b3b660626.png'
      },
      {
        action: 'close',
        title: 'Dismiss',
        icon: '/lovable-uploads/28f4e98f-6710-4594-b4b9-244b3b660626.png'
      }
    ],
    requireInteraction: true,
    tag: 'vmc-pro-notification'
  };

  event.waitUntil(
    self.registration.showNotification(notificationData.title, options)
  );
});

// Enhanced Notification Click Handler
self.addEventListener('notificationclick', event => {
  console.log('[SW] Notification click received:', event.action);
  
  event.notification.close();
  
  let url = '/';
  
  if (event.action === 'view') {
    // Determine URL based on notification data
    if (event.notification.data && event.notification.data.route) {
      url = event.notification.data.route;
    }
  } else if (event.action === 'close') {
    return; // Just close the notification
  }
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        // Focus existing window if available
        for (let client of clientList) {
          if (client.url.includes(self.location.origin)) {
            return client.focus().then(() => client.navigate(url));
          }
        }
        // Open new window if no existing window
        return clients.openWindow(url);
      })
  );
});

// Sync Functions for Offline Data Management
async function syncDeliveryData() {
  try {
    console.log('[SW] Syncing delivery data...');
    const offlineDeliveries = await getStoredData('offline-deliveries');
    
    for (const delivery of offlineDeliveries) {
      try {
        const response = await fetch('/api/deliveries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(delivery)
        });
        
        if (response.ok) {
          await removeStoredData('offline-deliveries', delivery.id);
          console.log('[SW] Delivery synced:', delivery.id);
        }
      } catch (error) {
        console.error('[SW] Failed to sync delivery:', error);
      }
    }
  } catch (error) {
    console.error('[SW] Delivery sync failed:', error);
  }
}

async function syncOrderData() {
  try {
    console.log('[SW] Syncing order data...');
    // Similar implementation for orders
  } catch (error) {
    console.error('[SW] Order sync failed:', error);
  }
}

async function syncCustomerData() {
  try {
    console.log('[SW] Syncing customer data...');
    // Similar implementation for customers
  } catch (error) {
    console.error('[SW] Customer sync failed:', error);
  }
}

// Helper functions for IndexedDB operations
async function getStoredData(storeName) {
  try {
    // Implementation would use IndexedDB to get offline data
    return [];
  } catch (error) {
    console.error('[SW] Failed to get stored data:', error);
    return [];
  }
}

async function removeStoredData(storeName, id) {
  try {
    // Implementation would use IndexedDB to remove synced data
    console.log('[SW] Removed synced data:', id);
  } catch (error) {
    console.error('[SW] Failed to remove stored data:', error);
  }
}

// Handle app installation
self.addEventListener('beforeinstallprompt', event => {
  console.log('[SW] VMC Pro is ready for installation');
  event.preventDefault();
  return event;
});

// Handle app launch
self.addEventListener('appinstalled', event => {
  console.log('[SW] VMC Pro Desktop installed successfully');
});

console.log('[SW] VMC Pro Desktop Service Worker Loaded');
