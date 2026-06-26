/**
 * SplashScreen — Pantalla de carga inicial
 * Se muestra ~1.5s al abrir la app, luego se desvanece
 * Solo aparece una vez por sesión
 */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ThepointLogoSplash } from "./ThepointLogo";

interface Props {
  onDone: () => void;
}

export function SplashScreen({ onDone }: Props) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 600); // espera a que termine la animación
    }, 1800);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
          style={{ background: "#09090B" }}
        >
          {/* Glow de fondo */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-[500px] h-[500px] rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(37,99,235,0.35) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 80, damping: 18 }}
            className="relative z-10"
          >
            <ThepointLogoSplash />
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="relative z-10 mt-5 text-sm tracking-widest uppercase font-semibold"
            style={{ color: "rgba(255,255,255,0.35)", letterSpacing: "0.2em" }}
          >
            Entrega Premium
          </motion.p>

          {/* Barra de carga */}
          <motion.div
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
            style={{ width: 120 }}
          >
            <div
              className="w-full h-0.5 rounded-full overflow-hidden"
              style={{ background: "rgba(255,255,255,0.08)" }}
            >
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.6, ease: "easeInOut" }}
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg, #2563EB, #60A5FA)" }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
