import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag, Zap, BookOpen, Download, Share } from "lucide-react";
import { getBanner, DEFAULT_BANNER } from "../admin/store";
import { BannerSettings } from "../admin/types";

interface HomeScreenProps {
  onStartOrder: () => void;
  onStartTutorial: () => void;
}

const TAPS_REQUIRED = 5;
const TAP_RESET_MS = 2000;

export function HomeScreen({ onStartOrder, onStartTutorial }: HomeScreenProps) {
  const [tapCount, setTapCount] = useState(0);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [banner, setBanner] = useState<BannerSettings>(DEFAULT_BANNER);
  const [deferredPrompt, setDeferredPrompt] = useState<Event & { prompt?: () => void } | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    getBanner().then(setBanner).catch(() => {});
  }, []);

  useEffect(() => {
    // Detect if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }
    // Detect iOS
    const ua = navigator.userAgent;
    const ios = /iPad|iPhone|iPod/.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream;
    setIsIOS(ios);
    if (ios) { setIsInstallable(true); return; }
    // Android/Desktop install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as Event & { prompt?: () => void });
      setIsInstallable(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (isIOS) { setShowIOSGuide(true); return; }
    if (deferredPrompt?.prompt) {
      deferredPrompt.prompt();
      setIsInstallable(false);
    }
  };

  const handleLogoTap = useCallback(() => {
    setTapCount(prev => {
      const next = prev + 1;
      if (next >= TAPS_REQUIRED) {
        if (resetTimer.current) clearTimeout(resetTimer.current);
        window.location.href = "/admin";
        return 0;
      }
      if (resetTimer.current) clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => setTapCount(0), TAP_RESET_MS);
      return next;
    });
  }, []);

  const handleButtonClick = () => {
    if (banner.buttonLink) {
      window.open(banner.buttonLink, "_blank");
    } else {
      onStartOrder();
    }
  };

  const showPromoBanner = banner.isActive && (banner.title || banner.subtitle);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden"
      style={{ background: "var(--tp-bg)" }}
    >
      {/* Fondo decorativo */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(var(--tp-border-l) 1px, transparent 1px), linear-gradient(90deg, var(--tp-border-l) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* Glow principal */}
        <motion.div
          animate={{ scale: [1, 1.12, 1], opacity: [0.18, 0.30, 0.18] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full"
          style={{ background: "radial-gradient(circle, var(--tp-accent-bg2) 0%, transparent 70%)" }}
        />
        {/* Glow secundario */}
        <motion.div
          animate={{ scale: [1, 1.18, 1], opacity: [0.10, 0.18, 0.10] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full"
          style={{ background: "radial-gradient(circle, var(--tp-accent-bg) 0%, transparent 70%)" }}
        />
      </div>

      {/* Contenido */}
      <div className="relative z-10 flex flex-col items-center px-6 w-full max-w-sm mx-auto text-center">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="mb-10 inline-flex items-center gap-2 px-4 py-1.5 rounded-full"
          style={{
            background: "var(--tp-accent-bg)",
            border: "1px solid var(--tp-accent-border)",
          }}
        >
          <Zap className="w-3 h-3" style={{ color: "var(--tp-accent)" }} />
          <span
            className="text-xs font-semibold tracking-widest uppercase"
            style={{ color: "var(--tp-accent)" }}
          >
            {banner.badgeText || "Entrega Premium"}
          </span>
        </motion.div>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, type: "spring", stiffness: 80, damping: 18 }}
          className="mb-8 cursor-default select-none"
          onClick={handleLogoTap}
        >
          <h1
            className="font-black tracking-tight leading-none"
            style={{ fontSize: "clamp(3.5rem, 16vw, 5.5rem)", letterSpacing: "-0.03em" }}
          >
            <span style={{ color: "var(--tp-fg)" }}>The</span>
            <span style={{ color: "var(--tp-accent)" }}>point</span>
          </h1>
        </motion.div>

        {/* Banner promocional */}
        <AnimatePresence>
          {showPromoBanner && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
              className="w-full mb-6 rounded-2xl overflow-hidden relative"
              style={{
                background: "var(--tp-card)",
                border: "1px solid var(--tp-accent-border)",
              }}
            >
              {banner.imageUrl && (
                <div className="absolute inset-0 opacity-10">
                  <img src={banner.imageUrl} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="relative p-5 text-left">
                {banner.title && (
                  <p className="font-bold text-base leading-tight" style={{ color: "var(--tp-fg)" }}>
                    {banner.title}
                  </p>
                )}
                {banner.subtitle && (
                  <p className="text-sm mt-1" style={{ color: "var(--tp-fg2)" }}>
                    {banner.subtitle}
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Botones principales */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38, type: "spring", stiffness: 80 }}
          className="w-full flex flex-col gap-3"
        >
          {/* Botón principal: Hacer pedido */}
          <motion.button
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleButtonClick}
            className="w-full relative py-5 px-8 rounded-2xl text-white font-semibold text-lg flex items-center justify-center gap-3 overflow-hidden transition-all duration-300 glow-blue"
            style={{ background: "var(--tp-btn)" }}
          >
            <ShoppingBag className="w-5 h-5 relative z-10 flex-shrink-0" />
            <span className="relative z-10">{banner.buttonText || "Hacer pedido"}</span>
          </motion.button>

          {/* Botón tutorial */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={onStartTutorial}
            className="w-full py-4 px-8 rounded-2xl font-semibold text-base flex items-center justify-center gap-2.5 transition-all"
            style={{
              background: "var(--tp-card)",
              border: "1px solid var(--tp-accent-border)",
              color: "var(--tp-fg)",
            }}
          >
            <BookOpen className="w-4.5 h-4.5 flex-shrink-0" style={{ color: "var(--tp-accent)" }} />
            <span>Ver tutorial</span>
          </motion.button>

          {/* Botón instalar */}
          {isInstallable && !isInstalled && (
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleInstall}
              className="w-full py-3.5 px-8 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2.5 transition-all"
              style={{
                background: "var(--tp-card)",
                border: "1px solid var(--tp-border)",
                color: "var(--tp-fg2)",
              }}
            >
              {isIOS
                ? <Share className="w-4 h-4 flex-shrink-0" />
                : <Download className="w-4 h-4 flex-shrink-0" />
              }
              <span>{isIOS ? "Añadir a pantalla de inicio" : "Instalar app"}</span>
            </motion.button>
          )}
        </motion.div>

        {/* Guía iOS */}
        {showIOSGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-end justify-center px-4"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
            onClick={() => setShowIOSGuide(false)}
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 280, damping: 28 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl overflow-hidden mb-6"
              style={{ background: "var(--tp-card)", border: "1px solid var(--tp-border)" }}
            >
              <div className="px-5 pt-5 pb-3">
                <p className="font-bold text-base" style={{ color: "var(--tp-fg)" }}>Instalar en iPhone / iPad</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--tp-fg2)" }}>Sigue estos pasos en Safari</p>
              </div>
              <div className="px-5 pb-5 space-y-3">
                {[
                  { icon: "⬆️", title: 'Toca el botón "Compartir"', desc: "El ícono de cuadro con flecha hacia arriba" },
                  { icon: "➕", title: '"Añadir a pantalla de inicio"', desc: "Desplázate hacia abajo en el menú" },
                  { icon: "✅", title: 'Toca "Agregar"', desc: "ThePoint aparecerá como app en tu pantalla" },
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-xl mt-0.5">{step.icon}</span>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "var(--tp-fg)" }}>{step.title}</p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--tp-fg2)" }}>{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-5 pb-5">
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="w-full py-3 rounded-xl text-sm font-semibold"
                  style={{ background: "var(--tp-accent)", color: "#fff" }}
                >
                  Entendido
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Acceso admin oculto */}
      <button
        onClick={() => { window.location.href = "/admin"; }}
        aria-hidden="true"
        tabIndex={-1}
        className="absolute bottom-4 right-5 transition-colors duration-300 text-lg leading-none select-none"
        style={{ color: "var(--tp-border)" }}
      >
        •
      </button>
    </motion.div>
  );
}
