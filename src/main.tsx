
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log('Application starting...');

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error('Root element not found!');
  throw new Error('Root element not found');
}

console.log('Root element found, creating React root...');

try {
  const root = createRoot(rootElement);
  console.log('React root created, rendering App...');
  root.render(<App />);
  console.log('App rendered successfully');
} catch (error) {
  console.error('Error creating or rendering app:', error);
  document.body.innerHTML = `
    <div style="padding: 20px; text-align: center; font-family: Arial, sans-serif;">
      <h1>Application Error</h1>
      <p>Failed to load the application. Please refresh the page.</p>
      <p style="color: red; font-size: 12px;">${error}</p>
    </div>
  `;
}
