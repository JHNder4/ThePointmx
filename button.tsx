import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Download, X, Share, Plus } from "lucide-react";

type Platform = "android" | "ios" | "desktop" | null;

function detectPlatform(): Platform {
  if (typeof window === "undefined") return null;
  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream;
  if (isIOS) return "ios";
  const isAndroid = /Android/.test(ua);
  if (isAndroid) return "android";
  return "desktop";
}

function isInStandaloneMode(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export function InstallPrompt() {
  const [show, setShow] = useState(false);
  const [platform, setPlatform] = useState<Platform>(null);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<Event & { prompt?: () => void } | null>(null);

  useEffect(() => {
    // Ya instalada — no mostrar
    if (isInStandaloneMode()) return;

    const p = detectPlatform();
    setPlatform(p);

    // Android / Desktop — escuchar evento nativo
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as Event & { prompt?: () => void });
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", handler);

    // iOS — mostrar guía manual después de 3 s si el usuario no la descartó
    if (p === "ios") {
      const dismissed = sessionStorage.getItem("tp_install_dismissed");
      if (!dismissed) {
        const t = setTimeout(() => setShow(true), 3000);
        return () => {
          clearTimeout(t);
          window.removeEventListener("beforeinstallprompt", handler);
        };
      }
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (platform === "ios") {
      setShowIOSGuide(true);
      return;
    }
    if (deferredPrompt?.prompt) {
      deferredPrompt.prompt();
    }
    setShow(false);
  };

  const handleDismiss = () => {
    setShow(false);
    setShowIOSGuide(false);
    sessionStorage.setItem("tp_install_dismissed", "1");
  };

  return (
    <>
      {/* Banner principal */}
      <AnimatePresence>
        {show && !showIOSGuide && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-safe-bottom"
            style={{ paddingBottom: "env(safe-area-inset-bottom, 16px)" }}
          >
            <div
              className="mx-auto max-w-sm mb-4 rounded-2xl px-4 py-4 flex items-center gap-3"
              style={{
                background: "rgba(9,9,11,0.98)",
                border: "1px solid rgba(37,99,235,0.4)",
                boxShadow: "0 0 40px rgba(37,99,235,0.2), 0 20px 40px rgba(0,0,0,0.6)",
                backdropFilter: "blur(20px)",
              }}
            >
              <img
                src="/icons/icon-72x72.png"
                alt="ThePoint"
                className="w-12 h-12 rounded-xl flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm">Instalar ThePoint</p>
                <p className="text-[#71717A] text-xs mt-0.5 leading-relaxed">
                  {platform === "ios"
                    ? "Acceso rápido desde tu pantalla de inicio"
                    : "Instala la app y úsala sin navegador"}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <motion.button
                  whileTap={{ scale: 0.94 }}
                  onClick={handleInstall}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-white text-xs font-bold"
                  style={{ background: "linear-gradient(135deg, #2563EB, #1D4ED8)" }}
                >
                  {platform === "ios"
                    ? <Share className="w-3.5 h-3.5" />
                    : <Download className="w-3.5 h-3.5" />
                  }
                  {platform === "ios" ? "¿Cómo?" : "Instalar"}
                </motion.button>
                <button
                  onClick={handleDismiss}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-[#52525B]"
                  style={{ background: "rgba(39,39,42,0.6)" }}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Guía iOS */}
      <AnimatePresence>
        {showIOSGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center px-4"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
            onClick={handleDismiss}
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 28 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl overflow-hidden mb-6"
              style={{
                background: "rgba(18,18,20,0.99)",
                border: "1px solid rgba(63,63,70,0.5)",
              }}
            >
              <div className="px-5 pt-5 pb-2 flex items-center justify-between">
                <div>
                  <p className="text-white font-bold text-base">Instalar en iPhone / iPad</p>
                  <p className="text-[#71717A] text-xs mt-0.5">Sigue estos pasos en Safari</p>
                </div>
                <button onClick={handleDismiss} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#52525B]" style={{ background: "rgba(39,39,42,0.6)" }}>
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="px-5 pb-5 pt-3 space-y-3">
                {[
                  {
                    icon: <Share className="w-4 h-4 text-blue-400" />,
                    title: 'Toca el botón "Compartir"',
                    desc: 'El ícono de cuadro con flecha hacia arriba en la barra de Safari',
                  },
                  {
                    icon: <Plus className="w-4 h-4 text-blue-400" />,
                    title: '"Añadir a pantalla de inicio"',
                    desc: 'Desplázate hacia abajo en el menú hasta encontrar esta opción',
                  },
                  {
                    icon: <Download className="w-4 h-4 text-green-400" />,
                    title: 'Toca "Agregar"',
                    desc: 'ThePoint aparecerá como app en tu pantalla de inicio',
                  },
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: "rgba(37,99,235,0.12)", border: "1px solid rgba(37,99,235,0.2)" }}
                    >
                      {step.icon}
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold">{step.title}</p>
                      <p className="text-[#71717A] text-xs mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Flecha apuntando hacia la barra de herramientas */}
              <div
                className="mx-5 mb-5 rounded-xl px-4 py-3 text-center"
                style={{ background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.2)" }}
              >
                <p className="text-blue-400 text-xs font-semibold">
                  ↓ Busca el ícono <Share className="w-3 h-3 inline" /> en la barra inferior de Safari
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
