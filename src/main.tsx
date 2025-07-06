
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add viewport meta tag for mobile optimization
if (!document.querySelector('meta[name="viewport"]')) {
  const viewport = document.createElement('meta');
  viewport.name = 'viewport';
  viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
  document.head.appendChild(viewport);
}

// Prevent zoom on mobile
document.addEventListener('touchstart', function(event) {
  if (event.touches.length > 1) {
    event.preventDefault();
  }
});

let lastTouchEnd = 0;
document.addEventListener('touchend', function(event) {
  const now = (new Date()).getTime();
  if (now - lastTouchEnd <= 300) {
    event.preventDefault();
  }
  lastTouchEnd = now;
}, false);

createRoot(document.getElementById("root")!).render(<App />);
