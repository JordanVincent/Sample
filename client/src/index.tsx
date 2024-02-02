import React from 'react';
import { createRoot } from 'react-dom/client';
import App from 'client/src/components/App';
import 'client/src/index.scss';

function render() {
  // Live reload
  // https://esbuild.github.io/api/#live-reload
  new EventSource('/esbuild').addEventListener('change', () =>
    location.reload(),
  );

  const container = document.getElementById('root');
  if (!container) {
    throw new Error('#root not found in document');
  }

  const root = createRoot(container);
  root.render(<App />);
}

render();
