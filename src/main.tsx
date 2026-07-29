import './scene/CafeSceneElement';
import './styles/global.css';
import { createRoot } from 'react-dom/client';
import { App } from './App';

// No <StrictMode>: dev double-mounting would tear down and rebuild the whole
// WebGL scene inside <cafe-scene>, replaying the loader progress sequence.
const appRoot = document.getElementById('app');
if (!appRoot) {
  throw new Error('Missing #app mount point in index.html.');
}

createRoot(appRoot).render(<App />);
