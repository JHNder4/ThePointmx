import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";

// ─── Routing ──────────────────────────────────────────────────────────────────
const path = window.location.pathname;
const isAdmin = path.startsWith("/admin");
const isTrack = path.startsWith("/track/");

async function boot() {
  const root = createRoot(document.getElementById("root")!);

  try {
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
  } catch (error) {
    console.error("Error iniciando ThePoint:", error);
    root.render(
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "#09090B", color: "white", fontFamily: "system-ui" }}>
        <div style={{ maxWidth: 520, textAlign: "center" }}>
          <h1 style={{ fontSize: 24, marginBottom: 12 }}>No se pudo cargar el panel</h1>
          <p style={{ color: "#A1A1AA", marginBottom: 20 }}>Recarga la página. Si el problema continúa, limpia la caché del sitio y vuelve a intentarlo.</p>
          <button onClick={() => window.location.reload()} style={{ border: 0, borderRadius: 10, padding: "12px 18px", color: "white", background: "#0071E3", cursor: "pointer" }}>Reintentar</button>
        </div>
      </div>
    );
  }
}

boot();
