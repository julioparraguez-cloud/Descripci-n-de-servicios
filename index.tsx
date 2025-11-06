import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');

// The main application is now a vanilla JS SPA in index.html.
// This check prevents the legacy React app from crashing if the #root element is not present.
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.warn('React root element #root not found. The React application will not be mounted, as the main application is running from index.html.');
}
