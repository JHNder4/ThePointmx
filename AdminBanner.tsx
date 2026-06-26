import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";

// ─── Service Worker ───────────────────────────────────────────────────────────
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((reg) => {
        console.log("[PWA] Service Worker registrado:", reg.scope);
      })
      .catch((err) => {
        console.warn("[PWA] Error registrando Service Worker:", err);
      });
  });
}

// ─── Routing ──────────────────────────────────────────────────────────────────
const path = window.location.pathname;
const isAdmin = path.startsWith("/admin");
const isTrack = path.startsWith("/track/");

async function boot() {
  const root = createRoot(document.getElementById("root")!);

  if (isAdmin) {
    const { default: AdminShell } = await import("./app/admin/AdminShell.tsx");
    root.render(<AdminShell />);
  } else if (isTrack) {
    const orderId = path.replace("/track/", "").split("/")[0];
    const { TrackingPage } = await import("./app/track/TrackingPage.tsx");
    root.render(<TrackingPage orderId={orderId} />);
  } else {
    root.render(<App />);
  }
}

boot();
