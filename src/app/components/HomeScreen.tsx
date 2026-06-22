import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag, Zap } from "lucide-react";
import { getBanner, DEFAULT_BANNER } from "../admin/store";
import { BannerSettings } from "../admin/types";

interface HomeScreenProps {
  onStartOrder: () => void;
}

const TAPS_REQUIRED = 5;
const TAP_RESET_MS = 2000;

export function HomeScreen({ onStartOrder }: HomeScreenProps) {
  const [tapCount, setTapCount] = useState(0);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [banner, setBanner] = useState<BannerSettings>(DEFAULT_BANNER);

  useEffect(() => {
    getBanner().then(setBanner).catch(() => {});
  }, []);

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

        {/* Botón principal */}
        <motion.button
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38, type: "spring", stiffness: 80 }}
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleButtonClick}
          className="w-full relative py-5 px-8 rounded-2xl text-white font-semibold text-lg flex items-center justify-center gap-3 overflow-hidden transition-all duration-300 glow-blue"
          style={{ background: "var(--tp-btn)" }}
        >
          <ShoppingBag className="w-5 h-5 relative z-10 flex-shrink-0" />
          <span className="relative z-10">{banner.buttonText || "Hacer pedido"}</span>
        </motion.button>
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
