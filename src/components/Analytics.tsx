import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

const GA_ID = 'G-V5TZ1B3E80';

/**
 * Fires a page_view event on every SPA route change.
 * The gtag.js script itself is loaded in index.html for fastest possible init.
 */
export function Analytics() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', 'page_view', {
      page_path: location.pathname + location.search,
      send_to: GA_ID,
    });
  }, [location]);

  return null;
}
