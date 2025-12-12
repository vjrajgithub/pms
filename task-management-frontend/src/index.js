import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import axios from 'axios';

// Set axios base URL
axios.defaults.baseURL = 'http://localhost:8000';

// Suppress specific upstream library deprecation warnings in development
if (process.env.NODE_ENV === 'development') {
  const originalError = console.error;
  console.error = (...args) => {
    const msg = typeof args[0] === 'string' ? args[0] : '';
    
    // Suppress ReactQuill findDOMNode deprecation warning
    if (msg.includes('findDOMNode is deprecated')) return;
    
    // Suppress other known warnings
    if (msg.includes('Support for defaultProps will be removed from function components')) return;
    if (msg.includes('Mention')) return;
    
    originalError(...args);
  };

  const originalWarn = console.warn;
  console.warn = (...args) => {
    const msg = typeof args[0] === 'string' ? args[0] : '';
    
    // Suppress React Router v7 future flag warnings
    if (msg.includes('React Router Future Flag Warning')) return;
    if (msg.includes('v7_startTransition')) return;
    if (msg.includes('v7_relativeSplatPath')) return;
    
    // Suppress other known warnings
    if (msg.includes('Support for defaultProps will be removed from function components')) return;
    if (msg.includes('Mention')) return;
    
    originalWarn(...args);
  };
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
