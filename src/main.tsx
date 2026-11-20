import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { ClanProvider } from './context/ClanContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <LanguageProvider>
        <ClanProvider>
          <App />
        </ClanProvider>
      </LanguageProvider>
    </ThemeProvider>
  </React.StrictMode>
);

