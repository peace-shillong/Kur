import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { PWAProvider } from './context/PWAContext';
import { ClanProvider } from './context/ClanContext';
import './index.css';

// Register Service Worker for PWA offline capabilities
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.warn('Service Worker registration note:', err);
    });
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <LanguageProvider>
        <PWAProvider>
          <ClanProvider>
            <App />
          </ClanProvider>
        </PWAProvider>
      </LanguageProvider>
    </ThemeProvider>
  </React.StrictMode>
);

