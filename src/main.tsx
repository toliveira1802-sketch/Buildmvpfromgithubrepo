import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";
import '@fontsource-variable/inter'
import '@fontsource-variable/geist-mono'
import './app/consultor/tokens/theme.css'
import { initializeSeedIfEmpty } from './app/consultor/bootstrap'

initializeSeedIfEmpty()

function showFatalError(title: string, detail: string) {
  const container = document.createElement('div');
  container.style.cssText = 'background:#1a0000;color:#ff6b6b;padding:20px;font-family:monospace;white-space:pre-wrap;font-size:13px';

  const heading = document.createElement('strong');
  heading.textContent = title;
  container.appendChild(heading);

  const info = document.createElement('pre');
  info.textContent = detail;
  container.appendChild(info);

  document.body.replaceChildren(container);
}

window.addEventListener('error', (e) => {
  showFatalError('ERRO RUNTIME:', `${e.message}\n${e.filename}:${e.lineno}:${e.colno}`);
});

window.addEventListener('unhandledrejection', (e) => {
  const reason = e.reason instanceof Error ? e.reason.message : String(e.reason);
  showFatalError('PROMISE REJEITADA:', reason);
});

createRoot(document.getElementById("root")!).render(<App />);
