import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, MapPin, ShoppingBag } from "lucide-react";

export type AllItems = Record<string, { name: string; price: number }>;

interface CartProps {
  allItems: AllItems;
  cart: Record<string, number>;
  onBack: () => void;
  onContinue: () => void;
}

export function Cart({ allItems, cart, onBack, onContinue }: CartProps) {
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
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="min-h-screen pb-36"
      style={{ background: "var(--tp-bg)" }}
    >
      <div className="px-5 pt-12 pb-4 max-w-lg mx-auto">
        <motion.button
          whileHover={{ x: -3 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="flex items-center gap-2 transition-colors duration-200 mb-8"
          style={{ color: "var(--tp-fg2)" }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Volver</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold tracking-tight" style={{ color: "var(--tp-fg)" }}>
            Tu Carrito
          </h2>
          <p className="text-sm mt-1" style={{ color: "var(--tp-fg2)" }}>
            {cartItems.length} {cartItems.length === 1 ? "producto" : "productos"}
          </p>
        </motion.div>

        <div className="flex flex-col gap-3 mb-6">
          <AnimatePresence>
            {cartItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16, scale: 0.95 }}
                transition={{ delay: index * 0.07, duration: 0.35 }}
                className="rounded-2xl p-4 flex items-center justify-between"
                style={{
                  background: "var(--tp-card-s)",
                  border: "1px solid var(--tp-border)",
                  boxShadow: "var(--tp-shadow)",
                }}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "var(--tp-accent-bg)",
                      border: "1px solid var(--tp-accent-border)",
                    }}
                  >
                    <ShoppingBag className="w-4 h-4" style={{ color: "var(--tp-accent-text)" }} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm leading-snug truncate" style={{ color: "var(--tp-fg)" }}>
                      {item.name}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--tp-fg2)" }}>
                      {item.quantity} × ${item.price}
                    </p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-3">
                  <p className="font-bold text-base" style={{ color: "var(--tp-fg)" }}>
                    ${item.price * item.quantity}
                  </p>
                  <p className="text-xs" style={{ color: "var(--tp-fg3)" }}>MXN</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-2xl p-5 mb-6"
          style={{
            background: "var(--tp-card)",
            border: "1px solid var(--tp-border)",
            boxShadow: "var(--tp-shadow2)",
          }}
        >
          <div
            className="flex items-center justify-between py-2.5"
            style={{ borderBottom: "1px solid var(--tp-divider)" }}
          >
            <span className="text-sm" style={{ color: "var(--tp-fg4)" }}>Subtotal</span>
            <span className="font-medium text-sm" style={{ color: "var(--tp-fg)" }}>${total}</span>
          </div>
          <div
            className="flex items-center justify-between py-2.5"
            style={{ borderBottom: "1px solid var(--tp-divider)" }}
          >
            <span className="text-sm" style={{ color: "var(--tp-fg4)" }}>Método de pago</span>
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full text-green-400"
              style={{ background: "rgba(34, 197, 94, 0.1)", border: "1px solid rgba(34,197,94,0.2)" }}
            >
              Efectivo
            </span>
          </div>
          <div className="flex items-center justify-between pt-4">
            <span className="font-bold text-base" style={{ color: "var(--tp-fg)" }}>Total</span>
            <span className="font-black text-2xl tracking-tight" style={{ color: "var(--tp-accent-text)" }}>
              ${total}
            </span>
          </div>
        </motion.div>
      </div>

      <div
        className="fixed bottom-0 left-0 right-0 px-5 pb-8 pt-4"
        style={{ background: "var(--tp-grad-bot)" }}
      >
        <div className="max-w-lg mx-auto">
          <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={onContinue}
            disabled={cartItems.length === 0}
            className="w-full py-4 px-6 rounded-2xl text-white font-semibold text-base flex items-center justify-center gap-2.5 transition-all duration-300 glow-blue disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: "var(--tp-btn)" }}
          >
            <MapPin className="w-4 h-4" />
            <span>Continuar a ubicación</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
