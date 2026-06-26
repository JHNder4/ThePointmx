import { motion } from "motion/react";
import { CheckCircle2, MessageCircle, Home, MapPin, CreditCard } from "lucide-react";
import { useState } from "react";
import { AllItems } from "./Cart";

interface OrderConfirmationProps {
  allItems: AllItems;
  cart: Record<string, number>;
  address: string;
  onSendWhatsApp: () => void;
  onBackToHome: () => void;
}

export function OrderConfirmation({
  allItems,
  cart,
  address,
  onSendWhatsApp,
  onBackToHome,
}: OrderConfirmationProps) {
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (sent) return;
    setSent(true);
    onSendWhatsApp();
  };

  const cartItems = Object.entries(cart)
    .filter(([, qty]) => qty > 0)
    .map(([id, quantity]) => ({
      id,
      quantity,
      name: allItems[id]?.name ?? id,
      price: allItems[id]?.price ?? 0,
    }));

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="min-h-screen flex flex-col items-center justify-start px-5 pt-16 pb-10"
      style={{ background: "var(--tp-bg)" }}
    >
      <div className="w-full max-w-lg">
        <motion.div
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 220, damping: 16 }}
          className="flex justify-center mb-6"
        >
          <div className="relative">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background: "var(--tp-accent-bg2)",
                border: "1px solid var(--tp-accent-border2)",
                boxShadow: "0 0 40px var(--tp-btn-glow)",
              }}
            >
              <CheckCircle2 className="w-10 h-10" style={{ color: "var(--tp-accent-text)" }} />
            </div>
            <motion.div
              animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full"
              style={{ background: "var(--tp-accent-bg)" }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl font-bold tracking-tight mb-2" style={{ color: "var(--tp-fg)" }}>
            ¡Pedido listo!
          </h2>
          <p className="text-sm" style={{ color: "var(--tp-fg2)" }}>
            Confirma enviándolo por WhatsApp
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.36 }}
          className="rounded-2xl overflow-hidden mb-4"
          style={{
            background: "var(--tp-card)",
            border: "1px solid var(--tp-border)",
            boxShadow: "var(--tp-shadow2)",
          }}
        >
          <div className="px-5 pt-5 pb-3">
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: "var(--tp-fg2)" }}
            >
              Resumen
            </p>
            <div className="flex flex-col gap-2.5 mb-4">
              {cartItems.map(item => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div
                      className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{
                        background: "var(--tp-accent-bg2)",
                        color: "var(--tp-accent-text)",
                      }}
                    >
                      {item.quantity}
                    </div>
                    <span className="text-sm truncate" style={{ color: "var(--tp-fg5)" }}>
                      {item.name}
                    </span>
                  </div>
                  <span className="font-semibold text-sm flex-shrink-0 ml-3" style={{ color: "var(--tp-fg)" }}>
                    ${item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div
            className="px-5 py-4 flex items-center justify-between"
            style={{
              background: "var(--tp-accent-bg)",
              borderTop: "1px solid var(--tp-accent-border)",
            }}
          >
            <span className="font-semibold text-sm" style={{ color: "var(--tp-fg4)" }}>
              Total
            </span>
            <span className="font-black text-xl tracking-tight" style={{ color: "var(--tp-accent-text)" }}>
              ${total} MXN
            </span>
          </div>

          <div
            className="px-5 py-4 space-y-3"
            style={{ borderTop: "1px solid var(--tp-divider)" }}
          >
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "var(--tp-fg3)" }} />
              <div>
                <p className="text-xs mb-0.5" style={{ color: "var(--tp-fg2)" }}>
                  Dirección de entrega
                </p>
                <p className="text-sm leading-snug" style={{ color: "var(--tp-fg5)" }}>
                  {address}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CreditCard className="w-4 h-4 flex-shrink-0" style={{ color: "var(--tp-fg3)" }} />
              <div>
                <p className="text-xs mb-0.5" style={{ color: "var(--tp-fg2)" }}>
                  Método de pago
                </p>
                <p className="text-sm" style={{ color: "var(--tp-fg5)" }}>
                  Efectivo
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.46 }}
          className="flex flex-col gap-3"
        >
          <div className="relative">
            {!sent && (
              <motion.div
                animate={{ scale: [1, 1.04, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 rounded-2xl"
                style={{ background: "rgba(37, 211, 102, 0.2)", filter: "blur(10px)" }}
              />
            )}
            <motion.button
              whileHover={{ scale: sent ? 1 : 1.02, y: sent ? 0 : -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSend}
              disabled={sent}
              className="relative w-full py-4 px-6 rounded-2xl text-white font-semibold text-base flex items-center justify-center gap-2.5 transition-all duration-300 disabled:cursor-not-allowed"
              style={{
                background: sent ? "var(--tp-mute)" : "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)",
                boxShadow: sent ? "none" : "0 0 28px rgba(34,197,94,0.35), 0 4px 20px rgba(0,0,0,0.3)",
                color: sent ? "var(--tp-fg2)" : "#FFFFFF",
              }}
            >
              <MessageCircle className="w-5 h-5 flex-shrink-0" />
              <span>{sent ? "Pedido enviado ✓" : "Enviar pedido por WhatsApp"}</span>
            </motion.button>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={onBackToHome}
            className="w-full py-4 px-6 rounded-2xl font-medium text-sm flex items-center justify-center gap-2 transition-all duration-200"
            style={{
              background: "var(--tp-card-s)",
              border: "1px solid var(--tp-border)",
              color: "var(--tp-fg4)",
            }}
          >
            <Home className="w-4 h-4" />
            <span>Volver al inicio</span>
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}
