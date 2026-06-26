/**
 * TEPO ONBOARDING — Tutorial gamificado para usuarios nuevos
 *
 * Para DESACTIVAR el tutorial: en App.tsx comenta/borra estas dos cosas:
 *   1. El import: import { TepoOnboarding } from "./components/TepoOnboarding";
 *   2. El componente: <TepoOnboarding ... />
 *
 * Para RESETEAR el tutorial (que vuelva a aparecer):
 *   En la consola del navegador: localStorage.removeItem("tp_onboarding_v1")
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronRight, Bell } from "lucide-react";

const STORAGE_KEY = "tp_onboarding_v1";
const TEPO_IMG = "/images/tepo.png";

type Screen = "home" | "products" | "cart" | "location" | "confirmation" | "prerolls" | "comestibles";
type Expression = "idle" | "wave" | "point" | "happy" | "thinking" | "success" | "surprised";

interface Step {
  expression: Expression;
  title: string;
  message: string;
  cta: string;
  spotlightPos?: { top: string; left: string; w: number; h: number };
  navigateTo?: Screen;
}

const STEPS: Step[] = [
  {
    expression: "point",
    title: "El botón que lo inicia todo",
    message: "Toca «Hacer pedido» para entrar al menú. Todo empieza desde aquí.",
    cta: "Entendido",
    spotlightPos: { top: "68%", left: "50%", w: 280, h: 68 },
  },
  {
    expression: "thinking",
    title: "El menú completo",
    message: "Aquí están todos los productos disponibles. Individuales y categorías para explorar.",
    cta: "Con todo",
    navigateTo: "products",
    spotlightPos: { top: "40%", left: "50%", w: 340, h: 280 },
  },
  {
    expression: "happy",
    title: "Agrega lo que quieras",
    message: "Toca el + para agregar al carrito. El − para quitarlo. Así de simple.",
    cta: "Ya sé",
    spotlightPos: { top: "54%", left: "68%", w: 140, h: 56 },
  },
  {
    expression: "thinking",
    title: "Tu dirección",
    message: "Cuando tengas todo listo te pido tu dirección. Puedes usar GPS o escribirla.",
    cta: "Perfecto",
  },
  {
    expression: "success",
    title: "Rastreo en tiempo real",
    message: "Envías el pedido por WhatsApp y lo rastreas desde el link que te llega.",
    cta: "¡Genial!",
  },
];

interface Props {
  currentScreen: Screen;
  cartItemCount: number;
  onNavigate: (screen: Screen) => void;
  onComplete: (action: "continue" | "explore") => void;
}

export function TepoOnboarding({ cartItemCount, onNavigate, onComplete }: Props) {
  const [phase, setPhase] = useState<"welcome" | "guide" | "finale" | "hidden">("hidden");
  const [stepIndex, setStepIndex] = useState(0);
  const [notifPing, setNotifPing] = useState(false);
  const [finaleMsg, setFinaleMsg] = useState(0);

  useEffect(() => {
    const done = localStorage.getItem(STORAGE_KEY);
    if (!done) {
      const t = setTimeout(() => setPhase("welcome"), 1400);
      return () => clearTimeout(t);
    }
    return undefined;
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setPhase("hidden");
  };

  const nextStep = () => {
    const step = STEPS[stepIndex];
    if (step.navigateTo) onNavigate(step.navigateTo);
    if (stepIndex < STEPS.length - 1) {
      setStepIndex(i => i + 1);
    } else {
      setPhase("finale");
      setTimeout(() => setNotifPing(true), 700);
      setTimeout(() => setFinaleMsg(1), 1900);
      setTimeout(() => setFinaleMsg(2), 3400);
    }
  };

  const handleFinale = (action: "continue" | "explore") => {
    localStorage.setItem(STORAGE_KEY, "1");
    setPhase("hidden");
    onComplete(action);
  };

  const step = STEPS[stepIndex];

  // ─── Tokens de color por tema ───────────────────────────────────────────────
  // dark:  fondo oscuro, azul brillante, textos claros
  // light: fondo blanco/gris claro, azul más suave, textos oscuros
  const dark = {
    modalBg: "linear-gradient(160deg, #0d1020 0%, #09090B 100%)",
    modalBorder: "rgba(37,99,235,0.4)",
    modalShadow: "0 0 80px rgba(37,99,235,0.22), 0 24px 60px rgba(0,0,0,0.7)",
    overlay: "rgba(0,0,0,0.78)",
    badgeBg: "rgba(37,99,235,0.12)",
    badgeBorder: "rgba(37,99,235,0.28)",
    badgeText: "#60A5FA",    // blue-400
    title: "#FFFFFF",
    subtitle: "#A1A1AA",
    btnPrimary: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
    btnPrimaryShadow: "0 0 28px rgba(37,99,235,0.45)",
    btnSecondaryBg: "rgba(39,39,42,0.5)",
    btnSecondaryText: "#71717A",
    closeBg: "rgba(39,39,42,0.7)",
    closeText: "#52525B",
    closeTextHover: "#A1A1AA",
    bubbleBg: "rgba(9,10,18,0.97)",
    bubbleBorder: "rgba(37,99,235,0.45)",
    bubbleShadow: "0 0 30px rgba(37,99,235,0.18), 0 10px 36px rgba(0,0,0,0.65)",
    stepActive: "#2563EB",
    stepInactive: "rgba(63,63,70,0.9)",
    msgTitle: "#FFFFFF",
    msgSubtitle: "#A1A1AA",
    glow: "rgba(37,99,235,0.55)",
  };

  const light = {
    modalBg: "linear-gradient(160deg, #FFFFFF 0%, #F4F4F5 100%)",
    modalBorder: "rgba(37,99,235,0.3)",
    modalShadow: "0 0 50px rgba(37,99,235,0.12), 0 24px 60px rgba(0,0,0,0.18)",
    overlay: "rgba(0,0,0,0.55)",
    badgeBg: "rgba(37,99,235,0.08)",
    badgeBorder: "rgba(37,99,235,0.22)",
    badgeText: "#2563EB",
    title: "#09090B",
    subtitle: "#52525B",
    btnPrimary: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
    btnPrimaryShadow: "0 0 20px rgba(37,99,235,0.3)",
    btnSecondaryBg: "rgba(228,228,231,0.7)",
    btnSecondaryText: "#71717A",
    closeBg: "rgba(228,228,231,0.9)",
    closeText: "#A1A1AA",
    closeTextHover: "#52525B",
    bubbleBg: "rgba(255,255,255,0.98)",
    bubbleBorder: "rgba(37,99,235,0.3)",
    bubbleShadow: "0 0 20px rgba(37,99,235,0.1), 0 10px 30px rgba(0,0,0,0.12)",
    stepActive: "#2563EB",
    stepInactive: "rgba(161,161,170,0.6)",
    msgTitle: "#09090B",
    msgSubtitle: "#52525B",
    glow: "rgba(37,99,235,0.3)",
  };

  return (
    <>
      {/* ─── Animaciones CSS ─────────────────────────────────────────────────── */}
      <style>{`
        @keyframes tepo-breathe  { 0%,100%{transform:scaleY(1) translateY(0)} 50%{transform:scaleY(1.015) translateY(-3px)} }
        @keyframes tepo-wave     { 0%,100%{transform:rotate(0deg) translateY(0)} 20%{transform:rotate(-8deg) translateY(-5px)} 50%{transform:rotate(8deg) translateY(-7px)} 75%{transform:rotate(-4deg) translateY(-3px)} }
        @keyframes tepo-point    { 0%,100%{transform:translateX(0) rotate(0deg)} 40%{transform:translateX(7px) rotate(3deg)} 70%{transform:translateX(9px) rotate(2deg)} }
        @keyframes tepo-happy    { 0%,100%{transform:translateY(0) scale(1)} 25%{transform:translateY(-12px) scale(1.05)} 55%{transform:translateY(-5px) scale(1.02)} 80%{transform:translateY(-9px) scale(1.04)} }
        @keyframes tepo-thinking { 0%,100%{transform:rotate(0deg)} 35%{transform:rotate(-6deg)} 65%{transform:rotate(-3deg)} }
        @keyframes tepo-success  { 0%{transform:scale(1) rotate(0)} 20%{transform:scale(1.1) rotate(-4deg)} 45%{transform:scale(1.14) rotate(4deg)} 70%{transform:scale(1.08) rotate(-1deg)} 100%{transform:scale(1.04) rotate(0)} }
        @keyframes tepo-surprised{ 0%{transform:scale(1) translateY(0)} 20%{transform:scale(1.13) translateY(-10px)} 50%{transform:scale(1.09) translateY(-7px)} 100%{transform:scale(1.06) translateY(-5px)} }
        @keyframes tepo-notif    { 0%,100%{transform:rotate(0)} 20%{transform:rotate(-22deg)} 40%{transform:rotate(22deg)} 60%{transform:rotate(-14deg)} 80%{transform:rotate(8deg)} }
        @keyframes spotlight-ring{ 0%,100%{box-shadow:0 0 0 3px rgba(37,99,235,0.8), 0 0 20px rgba(37,99,235,0.4)} 50%{box-shadow:0 0 0 6px rgba(37,99,235,0.4), 0 0 32px rgba(37,99,235,0.2)} }
        .tepo-idle      { animation: tepo-breathe 3s ease-in-out infinite; }
        .tepo-wave      { animation: tepo-wave 1.4s ease-in-out infinite; }
        .tepo-point     { animation: tepo-point 1.8s ease-in-out infinite; }
        .tepo-happy     { animation: tepo-happy 0.9s ease-in-out infinite; }
        .tepo-thinking  { animation: tepo-thinking 2.2s ease-in-out infinite; }
        .tepo-success   { animation: tepo-success 0.9s ease-out forwards; }
        .tepo-surprised { animation: tepo-surprised 0.7s ease-out forwards; }
        .notif-bell     { animation: tepo-notif 0.6s ease-in-out 3; }
        .spotlight-ring { animation: spotlight-ring 2s ease-in-out infinite; }
      `}</style>

      <AnimatePresence>

        {/* ═══════════════════════════════════════════════════════════════
            WELCOME MODAL
        ═══════════════════════════════════════════════════════════════ */}
        {phase === "welcome" && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            className="fixed inset-0 z-[60] flex items-end justify-center"
          >
            {/* Overlay — funciona igual en ambos temas */}
            <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.72)", backdropFilter: "blur(5px)" }} />

            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 28, delay: 0.05 }}
              className="relative w-full max-w-sm mx-4 mb-8 rounded-3xl overflow-visible z-10"
            >
              {/* Fondo adaptativo dark/light */}
              <div
                className="absolute inset-0 rounded-3xl"
                style={{
                  background: "var(--tp-modal-bg, linear-gradient(160deg, #0d1020 0%, #09090B 100%))",
                  border: "1px solid var(--tp-modal-border, rgba(37,99,235,0.4))",
                  boxShadow: "var(--tp-modal-shadow, 0 0 80px rgba(37,99,235,0.22), 0 24px 60px rgba(0,0,0,0.7))",
                }}
              />

              {/* Inyectamos CSS vars según la clase .dark en el DOM */}
              <style>{`
                :root {
                  --tp-modal-bg: ${light.modalBg};
                  --tp-modal-border: ${light.modalBorder};
                  --tp-modal-shadow: ${light.modalShadow};
                  --tp-badge-bg: ${light.badgeBg};
                  --tp-badge-border: ${light.badgeBorder};
                  --tp-badge-text: ${light.badgeText};
                  --tp-title: ${light.title};
                  --tp-subtitle: ${light.subtitle};
                  --tp-btn-sec-bg: ${light.btnSecondaryBg};
                  --tp-btn-sec-text: ${light.btnSecondaryText};
                  --tp-close-bg: ${light.closeBg};
                  --tp-close-text: ${light.closeText};
                  --tp-bubble-bg: ${light.bubbleBg};
                  --tp-bubble-border: ${light.bubbleBorder};
                  --tp-bubble-shadow: ${light.bubbleShadow};
                  --tp-step-inactive: ${light.stepInactive};
                  --tp-msg-title: ${light.msgTitle};
                  --tp-msg-subtitle: ${light.msgSubtitle};
                  --tp-glow: ${light.glow};
                }
                .dark {
                  --tp-modal-bg: ${dark.modalBg};
                  --tp-modal-border: ${dark.modalBorder};
                  --tp-modal-shadow: ${dark.modalShadow};
                  --tp-badge-bg: ${dark.badgeBg};
                  --tp-badge-border: ${dark.badgeBorder};
                  --tp-badge-text: ${dark.badgeText};
                  --tp-title: ${dark.title};
                  --tp-subtitle: ${dark.subtitle};
                  --tp-btn-sec-bg: ${dark.btnSecondaryBg};
                  --tp-btn-sec-text: ${dark.btnSecondaryText};
                  --tp-close-bg: ${dark.closeBg};
                  --tp-close-text: ${dark.closeText};
                  --tp-bubble-bg: ${dark.bubbleBg};
                  --tp-bubble-border: ${dark.bubbleBorder};
                  --tp-bubble-shadow: ${dark.bubbleShadow};
                  --tp-step-inactive: ${dark.stepInactive};
                  --tp-msg-title: ${dark.msgTitle};
                  --tp-msg-subtitle: ${dark.msgSubtitle};
                  --tp-glow: ${dark.glow};
                }
              `}</style>

              {/* Close */}
              <button
                onClick={dismiss}
                className="absolute top-4 right-4 z-10 w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                style={{ background: "var(--tp-close-bg)", color: "var(--tp-close-text)" }}
              >
                <X className="w-3.5 h-3.5" />
              </button>

              {/* Tepo */}
              <div className="relative flex justify-center pt-7 pb-0">
                <motion.div
                  animate={{ scale: [1, 1.1, 1], opacity: [0.25, 0.55, 0.25] }}
                  transition={{ duration: 2.8, repeat: Infinity }}
                  className="absolute inset-0 rounded-full"
                  style={{ background: `radial-gradient(circle, var(--tp-glow) 0%, transparent 68%)`, filter: "blur(14px)" }}
                />
                <img
                  src={TEPO_IMG}
                  alt="Tepo"
                  className="tepo-wave relative z-10 drop-shadow-2xl"
                  style={{ height: 170, width: "auto", objectFit: "contain" }}
                />
              </div>

              {/* Texto */}
              <div className="relative px-7 pb-3 text-center">
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-3"
                  style={{ background: "var(--tp-badge-bg)", border: "1px solid var(--tp-badge-border)" }}
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--tp-badge-text)" }}>
                    Tu guía en ThePoint
                  </span>
                </div>
                <h2 className="font-black text-[1.65rem] tracking-tight leading-tight mb-2.5" style={{ color: "var(--tp-title)" }}>
                  Qué onda,<br />soy Tepo 👋
                </h2>
                <p className="text-[0.92rem] leading-relaxed" style={{ color: "var(--tp-subtitle)" }}>
                  Te muestro cómo hacer tu primer pedido en menos de 60 segundos.
                </p>
              </div>

              {/* Botones */}
              <div className="relative px-7 pb-8 pt-4 flex flex-col gap-2.5">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setPhase("guide")}
                  className="w-full py-4 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2 transition-all"
                  style={{
                    background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
                    boxShadow: "0 0 28px rgba(37,99,235,0.45)",
                  }}
                >
                  Sí, llévame
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
                <button
                  onClick={dismiss}
                  className="w-full py-3 rounded-2xl text-sm font-medium transition-colors"
                  style={{ background: "var(--tp-btn-sec-bg)", color: "var(--tp-btn-sec-text)" }}
                >
                  Ya sé cómo funciona
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            GUIDE OVERLAY
        ═══════════════════════════════════════════════════════════════ */}
        {phase === "guide" && (
          <motion.div
            key={`guide-${stepIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            className="fixed inset-0 z-[60] pointer-events-none"
          >
            {/* Velo oscuro */}
            <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.52)" }} />

            {/* Spotlight */}
            {step.spotlightPos && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="absolute spotlight-ring"
                style={{
                  top: step.spotlightPos.top,
                  left: step.spotlightPos.left,
                  width: step.spotlightPos.w,
                  height: step.spotlightPos.h,
                  transform: "translate(-50%, -50%)",
                  borderRadius: 18,
                  background: "rgba(37,99,235,0.06)",
                }}
              />
            )}

            {/* Burbuja de Tepo — bottom right */}
            <div className="absolute bottom-6 right-3 pointer-events-auto flex flex-col items-end gap-2" style={{ maxWidth: 295 }}>

              {/* Puntos de progreso */}
              <div className="flex items-center gap-1.5 pr-1 mb-0.5">
                {STEPS.map((_, i) => (
                  <div
                    key={i}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: i === stepIndex ? 18 : 6,
                      height: 6,
                      background: i === stepIndex ? "#2563EB" : "var(--tp-step-inactive)",
                    }}
                  />
                ))}
              </div>

              {/* Burbuja */}
              <div
                className="relative rounded-2xl p-4 w-full"
                style={{
                  background: "var(--tp-bubble-bg)",
                  border: "1px solid var(--tp-bubble-border)",
                  boxShadow: "var(--tp-bubble-shadow)",
                  backdropFilter: "blur(20px)",
                }}
              >
                <p className="text-[9px] font-bold uppercase tracking-[0.12em] mb-1" style={{ color: "#2563EB" }}>
                  {step.title}
                </p>
                <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--tp-msg-subtitle)" }}>
                  {step.message}
                </p>
                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={dismiss}
                    className="text-xs py-1 transition-colors"
                    style={{ color: "var(--tp-btn-sec-text)" }}
                  >
                    Saltar
                  </button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={nextStep}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-white font-bold text-sm"
                    style={{
                      background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
                      boxShadow: "0 0 18px rgba(37,99,235,0.4)",
                    }}
                  >
                    {step.cta}
                    <ChevronRight className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
                {/* Cola de burbuja */}
                <div
                  className="absolute -bottom-[7px] right-[52px] w-3.5 h-3.5 rotate-45"
                  style={{
                    background: "var(--tp-bubble-bg)",
                    borderRight: "1px solid var(--tp-bubble-border)",
                    borderBottom: "1px solid var(--tp-bubble-border)",
                  }}
                />
              </div>

              {/* Tepo pequeño */}
              <div className="relative mr-2">
                <motion.div
                  animate={{ scale: [1, 1.18, 1], opacity: [0.18, 0.45, 0.18] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  className="absolute inset-0 rounded-full"
                  style={{ background: `radial-gradient(circle, var(--tp-glow) 0%, transparent 70%)`, filter: "blur(10px)" }}
                />
                <img
                  src={TEPO_IMG}
                  alt="Tepo"
                  className={`tepo-${step.expression} relative z-10 drop-shadow-2xl`}
                  style={{ height: 100, width: "auto", objectFit: "contain" }}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            FINALE MODAL
        ═══════════════════════════════════════════════════════════════ */}
        {phase === "finale" && (
          <motion.div
            key="finale"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-end justify-center"
          >
            <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.78)", backdropFilter: "blur(6px)" }} />

            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 26, delay: 0.05 }}
              className="relative w-full max-w-sm mx-4 mb-8 rounded-3xl overflow-visible z-10"
            >
              <div
                className="absolute inset-0 rounded-3xl"
                style={{
                  background: "var(--tp-modal-bg)",
                  border: "1px solid var(--tp-modal-border)",
                  boxShadow: "var(--tp-modal-shadow)",
                }}
              />

              {/* Tepo con notificación */}
              <div className="relative flex justify-center pt-6 pb-0">
                <motion.div
                  animate={{ scale: [1, 1.12, 1], opacity: [0.28, 0.6, 0.28] }}
                  transition={{ duration: 2.2, repeat: Infinity }}
                  className="absolute inset-0 rounded-full"
                  style={{ background: `radial-gradient(circle, var(--tp-glow) 0%, transparent 68%)`, filter: "blur(16px)" }}
                />
                <img
                  src={TEPO_IMG}
                  alt="Tepo"
                  className="tepo-surprised relative z-10 drop-shadow-2xl"
                  style={{ height: 150, width: "auto", objectFit: "contain" }}
                />

                {/* Ping de notificación */}
                <AnimatePresence>
                  {notifPing && (
                    <motion.div
                      key="notif"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 380, damping: 18 }}
                      className="absolute -top-1 -right-2 z-20"
                    >
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center"
                        style={{ background: "#2563EB", boxShadow: "0 0 20px rgba(37,99,235,0.8)" }}
                      >
                        <Bell className="notif-bell w-4.5 h-4.5 text-white" />
                      </div>
                      <motion.div
                        animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 1.3, repeat: 4 }}
                        className="absolute inset-0 rounded-full"
                        style={{ background: "rgba(37,99,235,0.45)" }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mensajes dinámicos */}
              <div className="relative px-7 text-center py-4 min-h-[88px] flex flex-col items-center justify-center">
                <AnimatePresence mode="wait">
                  {finaleMsg === 0 && (
                    <motion.div key="m0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <div className="flex items-center gap-1.5 justify-center">
                        {[0, 1, 2].map(i => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 rounded-full bg-blue-500"
                            animate={{ opacity: [0.3, 1, 0.3], y: [0, -5, 0] }}
                            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.18 }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                  {finaleMsg === 1 && (
                    <motion.div key="m1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                      <p className="font-black text-xl tracking-tight" style={{ color: "var(--tp-msg-title)" }}>
                        ¡Oh! Parece que me llegó un pedido.
                      </p>
                    </motion.div>
                  )}
                  {finaleMsg === 2 && (
                    <motion.div key="m2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <p className="font-black text-xl tracking-tight mb-2" style={{ color: "var(--tp-msg-title)" }}>
                        Ya terminaste el tutorial.
                      </p>
                      <p className="text-sm leading-relaxed" style={{ color: "var(--tp-msg-subtitle)" }}>
                        {cartItemCount > 0
                          ? `Vi que agregaste ${cartItemCount} producto${cartItemCount > 1 ? "s" : ""} al carrito. ¿Quieres completar tu pedido ahora?`
                          : "¿Quieres explorar el menú y hacer tu primer pedido?"}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Botones de acción */}
              <AnimatePresence>
                {finaleMsg === 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="relative px-7 pb-8 pt-1 flex flex-col gap-2.5"
                  >
                    {cartItemCount > 0 && (
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleFinale("continue")}
                        className="w-full py-4 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2"
                        style={{
                          background: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)",
                          boxShadow: "0 0 28px rgba(34,197,94,0.4)",
                        }}
                      >
                        Continuar pedido
                      </motion.button>
                    )}
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleFinale("explore")}
                      className="w-full py-4 rounded-2xl text-white font-bold text-base flex items-center justify-center"
                      style={{
                        background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
                        boxShadow: "0 0 24px rgba(37,99,235,0.38)",
                      }}
                    >
                      {cartItemCount > 0 ? "Seguir explorando" : "Explorar el menú"}
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>
    </>
  );
}
