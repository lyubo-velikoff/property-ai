import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    gtag: (command: string, ...args: any[]) => void;
    dataLayer: any[];
  }
}

export const GA_TRACKING_ID = import.meta.env.VITE_GA_TRACKING_ID;

// Initialize Google Analytics
export const initGA = () => {
  // Skip if tracking ID is not configured
  if (!GA_TRACKING_ID || GA_TRACKING_ID === 'G-XXXXXXXXXX') {
    console.warn('Google Analytics tracking ID not configured');
    return;
  }

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_TRACKING_ID);
};

// Track page views
export const pageview = (url: string) => {
  if (!window.gtag || !GA_TRACKING_ID || GA_TRACKING_ID === 'G-XXXXXXXXXX') {
    return;
  }
  
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
};

// Track events
export const event = ({ action, category, label, value }: {
  action: string;
  category: string;
  label: string;
  value?: number;
}) => {
  if (!window.gtag || !GA_TRACKING_ID || GA_TRACKING_ID === 'G-XXXXXXXXXX') {
    return;
  }

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// Hook to track page views
export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    pageview(location.pathname + location.search);
  }, [location]);
}; 
