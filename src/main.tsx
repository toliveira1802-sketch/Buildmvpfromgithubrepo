import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";

// Capturar erros globais e mostrar na tela
window.addEventListener('error', (e) => {
  document.body.innerHTML = `<div style="background:#1a0000;color:#ff6b6b;padding:20px;font-family:monospace;white-space:pre-wrap;font-size:13px">
<strong>ERRO RUNTIME:</strong>
${e.message}
${e.filename}:${e.lineno}:${e.colno}
${e.error?.stack || ''}
</div>`;
});

window.addEventListener('unhandledrejection', (e) => {
  document.body.innerHTML = `<div style="background:#1a0000;color:#ff6b6b;padding:20px;font-family:monospace;white-space:pre-wrap;font-size:13px">
<strong>PROMISE REJEITADA:</strong>
${e.reason?.message || e.reason}
${e.reason?.stack || ''}
</div>`;
});

createRoot(document.getElementById("root")!).render(<App />);
