import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Zap, CheckCircle2, Clock, Truck, PackageCheck,
  XCircle, Package, ShoppingBag, ThumbsUp, Sparkles,
} from "lucide-react";
import { getOrderById } from "../admin/store";
import { Order } from "../admin/types";
import { supabase } from "../../lib/supabase";
import { ThemeProvider } from "../context/ThemeContext";
import { ThemeToggle } from "../components/ThemeToggle";

interface TrackingPageProps {
  orderId: string;
}

const PROGRESS: Record<string, number> = {
  nuevo:       0,
  confirmado:  1,
  preparando:  2,
  "en-camino": 3,
  entregado:   4,
  cancelado:   -1,
  pending:     0,
  preparing:   2,
  "on-the-way":3,
  delivered:   4,
  cancelled:   -1,
};

const CANCELLED_VALUES = new Set(["cancelado", "cancelled"]);

interface Step {
  label: string;
  sublabel: string;
  icon: React.ElementType;
}

const STEPS: Step[] = [
  { label: "Pedido recibido",   sublabel: "Tu pedido llegó al sistema",        icon: ShoppingBag },
  { label: "Confirmado",        sublabel: "Estamos confirmando tu pedido",      icon: ThumbsUp    },
  { label: "En preparación",    sublabel: "Estamos preparando tu pedido",       icon: Package     },
  { label: "En camino",         sublabel: "Tu pedido va en camino",             icon: Truck       },
  { label: "Entregado",         sublabel: "¡Tu pedido fue entregado! 🎉",       icon: PackageCheck },
];

function getProgress(status: string): number {
  return PROGRESS[status] ?? 0;
}

export function TrackingPage({ orderId }: TrackingPageProps) {
  const [order, setOrder] = useState<Order | null | "not-found">(null);
  const seenRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const found = await getOrderById(orderId);
        if (!cancelled) setOrder(found ?? "not-found");
      } catch {
        if (!cancelled) setOrder("not-found");
      }
    };
    load();
    const interval = setInterval(load, 8000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [orderId]);

  useEffect(() => {
    const channel = supabase
      .channel(`tracking-${orderId}`)
      .on("postgres_changes", {
        event: "UPDATE",
        schema: "public",
        table: "orders",
        filter: `id=eq.${orderId}`,
      }, (payload) => {
        const row = payload.new as Record<string, unknown>;
        setOrder(prev => {
          if (!prev || prev === "not-found") return prev;
          return {
            ...prev,
            status: row.status as Order["status"],
            estimatedTime: (row.estimated_time as string | null) ?? undefined,
          };
        });
        seenRef.current = true;
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [orderId]);

  if (order === null) {
    return (
      <ThemeProvider>
        <LoadingState />
        <ThemeToggle />
      </ThemeProvider>
    );
  }
  if (order === "not-found") {
    return (
      <ThemeProvider>
        <NotFoundState orderId={orderId} />
        <ThemeToggle />
      </ThemeProvider>
    );
  }

  const isCancelled = CANCELLED_VALUES.has(order.status);
  const currentStep = getProgress(order.status);

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col" style={{ background: "var(--tp-bg)" }}>
        {/* Fondo decorativo */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{ opacity: [0.08, 0.16, 0.08] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full"
            style={{ background: "radial-gradient(ellipse, var(--tp-accent-bg2) 0%, transparent 70%)" }}
          />
        </div>

        {/* Header */}
        <header className="relative z-10 flex items-center justify-between px-5 pt-10 pb-6 max-w-lg mx-auto w-full">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <Zap className="w-3 h-3" style={{ color: "var(--tp-accent-text)" }} />
              <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: "var(--tp-accent-text)" }}>
                Thepoint
              </span>
            </div>
            <h1 className="font-black text-xl tracking-tight" style={{ color: "var(--tp-fg)" }}>
              Seguimiento
            </h1>
          </div>
          <div className="text-right">
            <p className="text-xs" style={{ color: "var(--tp-fg3)" }}>ID del pedido</p>
            <p className="font-bold font-mono text-sm" style={{ color: "var(--tp-fg)" }}>{order.id}</p>
          </div>
        </header>

        <main className="relative z-10 flex-1 px-5 pb-10 max-w-lg mx-auto w-full space-y-4">

          {/* ETA */}
          <AnimatePresence>
            {order.estimatedTime && !isCancelled && (
              <motion.div
                key="eta"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3 px-4 py-3.5 rounded-2xl"
                style={{
                  background: "var(--tp-accent-bg)",
                  border: "1px solid var(--tp-accent-border)",
                }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "var(--tp-accent-bg2)" }}
                >
                  <Clock className="w-4 h-4" style={{ color: "var(--tp-accent-text)" }} />
                </div>
                <div>
                  <p className="text-xs" style={{ color: "var(--tp-fg2)" }}>Tiempo estimado</p>
                  <p className="font-bold text-sm" style={{ color: "var(--tp-fg)" }}>{order.estimatedTime}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Estado cancelado */}
          {isCancelled ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center py-10 px-6 rounded-2xl text-center"
              style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)" }}
            >
              <XCircle className="w-14 h-14 text-red-400 mb-4" />
              <h2 className="font-bold text-xl mb-1" style={{ color: "var(--tp-fg)" }}>Pedido cancelado</h2>
              <p className="text-sm" style={{ color: "var(--tp-fg2)" }}>
                Si tienes preguntas, contáctanos por WhatsApp.
              </p>
            </motion.div>
          ) : (
            /* Pasos de progreso */
            <div
              className="rounded-2xl overflow-hidden"
              style={{ background: "var(--tp-card)", border: "1px solid var(--tp-border-l)" }}
            >
              <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--tp-divider)" }}>
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--tp-fg3)" }}>
                  Estado del pedido
                </p>
              </div>
              <div className="px-5 py-5 space-y-0">
                {STEPS.map((step, idx) => {
                  const isDone   = currentStep > idx;
                  const isActive = currentStep === idx;
                  const Icon     = step.icon;

                  return (
                    <div key={idx} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <motion.div
                          animate={isActive ? {
                            scale: [1, 1.1, 1],
                            boxShadow: [
                              "0 0 0px var(--tp-accent-bg)",
                              "0 0 16px var(--tp-btn-glow)",
                              "0 0 8px var(--tp-accent-bg)",
                            ],
                          } : {}}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500"
                          style={{
                            background: isDone
                              ? "rgba(34,197,94,0.15)"
                              : isActive
                              ? "var(--tp-accent-bg2)"
                              : "var(--tp-mute)",
                            border: isDone
                              ? "1px solid rgba(34,197,94,0.4)"
                              : isActive
                              ? "1px solid var(--tp-accent-border2)"
                              : "1px solid var(--tp-border-l)",
                          }}
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                          ) : (
                            <Icon
                              className="w-4 h-4"
                              style={{ color: isActive ? "var(--tp-accent-text)" : "var(--tp-fg3)" }}
                            />
                          )}
                        </motion.div>
                        {idx < STEPS.length - 1 && (
                          <div
                            className="w-0.5 flex-1 my-1 min-h-[24px] transition-all duration-700"
                            style={{ background: isDone ? "rgba(34,197,94,0.4)" : "var(--tp-border-l)" }}
                          />
                        )}
                      </div>

                      <div className={`pb-5 flex-1 ${idx === STEPS.length - 1 ? "pb-1" : ""}`}>
                        <p
                          className="font-semibold text-sm transition-colors duration-300"
                          style={{
                            color: isDone ? "#86EFAC" : isActive ? "var(--tp-fg)" : "var(--tp-fg3)",
                          }}
                        >
                          {step.label}
                        </p>
                        <AnimatePresence>
                          {(isDone || isActive) && (
                            <motion.p
                              key={`sub-${idx}`}
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0 }}
                              className="text-xs mt-0.5 overflow-hidden"
                              style={{ color: "var(--tp-fg2)" }}
                            >
                              {step.sublabel}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Detalle del pedido */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: "var(--tp-card)", border: "1px solid var(--tp-border-l)" }}
          >
            <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--tp-divider)" }}>
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--tp-fg3)" }}>
                Tu pedido
              </p>
            </div>
            <div className="px-5 py-4 space-y-2.5">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-5 h-5 rounded-md flex items-center justify-center font-bold text-xs flex-shrink-0"
                      style={{ background: "var(--tp-accent-bg2)", color: "var(--tp-accent-text)" }}
                    >
                      {item.quantity}
                    </span>
                    <span className="text-sm" style={{ color: "var(--tp-fg5)" }}>{item.name}</span>
                  </div>
                  <span className="font-semibold text-sm" style={{ color: "var(--tp-fg)" }}>
                    ${item.price * item.quantity}
                  </span>
                </div>
              ))}
              <div
                className="pt-2.5 flex justify-between"
                style={{ borderTop: "1px solid var(--tp-divider)" }}
              >
                <span className="font-semibold text-sm" style={{ color: "var(--tp-fg)" }}>Total</span>
                <span className="font-black text-sm" style={{ color: "var(--tp-accent-text)" }}>
                  ${order.total}
                </span>
              </div>
            </div>
          </div>

          {/* Indicador realtime */}
          <div className="flex items-center justify-center gap-2">
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-green-400"
            />
            <p className="text-xs" style={{ color: "var(--tp-fg3)" }}>Actualización en tiempo real</p>
          </div>
        </main>
      </div>
      <ThemeToggle />
    </ThemeProvider>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--tp-bg)" }}>
      <motion.div
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="flex flex-col items-center gap-4"
      >
        <Sparkles className="w-8 h-8" style={{ color: "var(--tp-accent-text)" }} />
        <p className="text-sm" style={{ color: "var(--tp-fg2)" }}>Cargando pedido...</p>
      </motion.div>
    </div>
  );
}

function NotFoundState({ orderId }: { orderId: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center" style={{ background: "var(--tp-bg)" }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
          style={{ background: "var(--tp-mute)", border: "1px solid var(--tp-border)" }}
        >
          <Package className="w-7 h-7" style={{ color: "var(--tp-fg3)" }} />
        </div>
        <div>
          <h2 className="font-bold text-xl" style={{ color: "var(--tp-fg)" }}>Pedido no encontrado</h2>
          <p className="text-sm mt-2 max-w-xs mx-auto" style={{ color: "var(--tp-fg2)" }}>
            No encontramos el pedido{" "}
            <span className="font-mono font-semibold" style={{ color: "var(--tp-fg)" }}>{orderId}</span>
            {". "}Verifica que el enlace sea correcto.
          </p>
        </div>
        <div className="flex items-center justify-center gap-1.5 pt-2">
          <Zap className="w-3 h-3" style={{ color: "var(--tp-accent-text)" }} />
          <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: "var(--tp-accent-text)" }}>
            Thepoint
          </span>
        </div>
      </motion.div>
    </div>
  );
}
