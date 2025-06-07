import { useEffect, useRef } from 'react';

/**
 * Reloads the page whenever the length of the array stored under the given
 * localStorage key increases. This allows multiple tabs to stay in sync when
 * new content (tracks, playlists, etc.) is added from another tab.
 */
export const useAutoRefresh = (storageKey: string) => {
  const previousLength = useRef(0);

  useEffect(() => {
    // Initialize previous length from current localStorage value
    try {
      const current = JSON.parse(localStorage.getItem(storageKey) || '[]');
      previousLength.current = Array.isArray(current) ? current.length : 0;
    } catch {
      previousLength.current = 0;
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key !== storageKey || !e.newValue) return;
      try {
        const parsed = JSON.parse(e.newValue);
        const newLength = Array.isArray(parsed) ? parsed.length : 0;
        if (newLength > previousLength.current) {
          window.location.reload();
        }
        previousLength.current = newLength;
      } catch {
        // ignore parsing errors
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [storageKey]);
};
