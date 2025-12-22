

export const NotificationService = {
  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support desktop notification');
      return 'denied';
    }
    return await Notification.requestPermission();
  },

  getPermissionState(): NotificationPermission {
    if (!('Notification' in window)) return 'denied';
    return Notification.permission;
  },

  showLocalNotification(title: string, body: string) {
    if (this.getPermissionState() === 'granted') {
      try {
        // Try Service Worker registration first for better background handling
        navigator.serviceWorker.ready.then((registration) => {
          registration.showNotification(title, {
            body,
            icon: 'https://ui-avatars.com/api/?name=PetPal&background=0EA5A4&color=fff',
            vibrate: [200, 100, 200],
            tag: 'petpal-alarm',
            renotify: true,
            requireInteraction: true,
          } as any);
        }).catch(() => {
          // Fallback to basic Notification API
          new Notification(title, {
            body,
            icon: 'https://ui-avatars.com/api/?name=PetPal&background=0EA5A4&color=fff',
          });
        });
      } catch (e) {
        console.error("Notification trigger failed", e);
      }
    }
  }
};