import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Unregister any old service workers from previous projects on this domain
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister();
      console.log('Unregistered stale service worker');
    }
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
