import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Plus, Minus, ShoppingCart, Sparkles, Tag } from "lucide-react";

export interface CategoryItem {
  id: string;
  name: string;
  price: number;
}

export interface Promo {
  id: string;
  name: string;
  price: number;
}

interface CategoryScreenProps {
  title: string;
  menuLabel: string;
  items: CategoryItem[];
  promos: Promo[];
  cart: Record<string, number>;
  totalCartItems: number;
  totalCartPrice: number;
  onUpdateCart: (id: string, qty: number) => void;
  onBack: () => void;
  onViewCart: () => void;
}

export function CategoryScreen({
  title,
  menuLabel,
  items,
  promos,
  cart,
  totalCartItems,
  totalCartPrice,
  onUpdateCart,
  onBack,
  onViewCart,
}: CategoryScreenProps) {
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
          transition={{ delay: 0.08 }}
          className="mb-8"
        >
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3"
            style={{
              background: "var(--tp-accent-bg)",
              border: "1px solid var(--tp-accent-border)",
              color: "var(--tp-accent-text)",
            }}
          >
            <Tag className="w-3 h-3" />
            Categoría
          </div>
          <h2
            className="font-black tracking-tight leading-none"
            style={{
              fontSize: "clamp(1.6rem, 7vw, 2.2rem)",
              letterSpacing: "-0.03em",
              color: "var(--tp-fg)",
            }}
          >
            {title}
          </h2>
          <p className="text-xs font-semibold uppercase tracking-widest mt-2" style={{ color: "var(--tp-fg3)" }}>
            {menuLabel}
          </p>
        </motion.div>

        <div className="flex flex-col gap-3 mb-8">
          {items.map((item, index) => {
            const quantity = cart[item.id] || 0;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.07 }}
                className="rounded-xl p-4 flex items-center justify-between transition-all duration-300"
                style={{
                  background: quantity > 0 ? "var(--tp-accent-bg)" : "var(--tp-card-s)",
                  border: quantity > 0 ? "1px solid var(--tp-accent-border2)" : "1px solid var(--tp-border)",
                }}
              >
                <div className="flex-1 min-w-0 mr-3">
                  <p className="font-medium text-sm leading-snug" style={{ color: "var(--tp-fg)" }}>
                    {item.name}
                  </p>
                  <p className="font-bold text-base mt-0.5" style={{ color: "var(--tp-accent-text)" }}>
                    ${item.price}
                  </p>
                </div>
                <div
                  className="flex items-center gap-1 rounded-xl p-1 flex-shrink-0"
                  style={{ background: "var(--tp-mute)" }}
                >
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.85 }}
                    onClick={() => onUpdateCart(item.id, Math.max(0, quantity - 1))}
                    disabled={quantity === 0}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30"
                    style={{
                      background: quantity > 0 ? "var(--tp-border)" : "transparent",
                      color: "var(--tp-fg)",
                    }}
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </motion.button>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={quantity}
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      transition={{ duration: 0.12 }}
                      className="w-8 text-center font-bold text-sm tabular-nums"
                      style={{ color: "var(--tp-fg)" }}
                    >
                      {quantity}
                    </motion.span>
                  </AnimatePresence>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.85 }}
                    onClick={() => onUpdateCart(item.id, quantity + 1)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                    style={{
                      background: "var(--tp-btn)",
                      boxShadow: "0 0 8px var(--tp-btn-glow)",
                    }}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {promos.length > 0 && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-3 mb-5"
            >
              <div className="flex-1 h-px" style={{ background: "var(--tp-border)" }} />
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-yellow-400" />
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--tp-fg2)" }}>
                  Promociones
                </span>
                <Sparkles className="w-3 h-3 text-yellow-400" />
              </div>
              <div className="flex-1 h-px" style={{ background: "var(--tp-border)" }} />
            </motion.div>

            <div className="grid grid-cols-2 gap-3">
              {promos.map((promo, index) => {
                const quantity = cart[promo.id] || 0;
                return (
                  <motion.div
                    key={promo.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 + index * 0.1, type: "spring", stiffness: 120 }}
                    className="relative rounded-2xl overflow-hidden"
                    style={{
                      background: "var(--tp-card)",
                      border: "1px solid rgba(250,204,21,0.25)",
                      boxShadow: quantity > 0
                        ? "0 0 24px rgba(250,204,21,0.2), inset 0 1px 0 rgba(250,204,21,0.1)"
                        : "none",
                    }}
                  >
                    <motion.div
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: index * 1.2 }}
                      className="absolute inset-0 rounded-2xl pointer-events-none"
                      style={{ background: "linear-gradient(135deg, rgba(250,204,21,0.06) 0%, transparent 60%)" }}
                    />
                    <div className="relative p-4">
                      <div className="mb-2">
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded-full text-yellow-400"
                          style={{ background: "rgba(250,204,21,0.1)", border: "1px solid rgba(250,204,21,0.2)" }}
                        >
                          PROMO
                        </span>
                      </div>
                      <p
                        className="font-black leading-tight mb-1"
                        style={{ fontSize: "1rem", letterSpacing: "-0.01em", color: "var(--tp-fg)" }}
                      >
                        {promo.name}
                      </p>
                      <p className="text-yellow-400 font-bold text-xl">${promo.price}</p>
                      <div className="mt-4">
                        {quantity > 0 ? (
                          <div
                            className="w-full flex items-center justify-between rounded-xl p-1"
                            style={{ background: "var(--tp-mute)" }}
                          >
                            <motion.button
                              whileTap={{ scale: 0.85 }}
                              onClick={() => onUpdateCart(promo.id, quantity - 1)}
                              className="w-8 h-8 rounded-lg flex items-center justify-center"
                              style={{ background: "var(--tp-border)", color: "var(--tp-fg)" }}
                            >
                              <Minus className="w-3 h-3" />
                            </motion.button>
                            <span className="font-bold text-sm tabular-nums" style={{ color: "var(--tp-fg)" }}>
                              {quantity}
                            </span>
                            <motion.button
                              whileTap={{ scale: 0.85 }}
                              onClick={() => onUpdateCart(promo.id, quantity + 1)}
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                              style={{ background: "rgba(250,204,21,0.3)", border: "1px solid rgba(250,204,21,0.3)" }}
                            >
                              <Plus className="w-3 h-3" />
                            </motion.button>
                          </div>
                        ) : (
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onUpdateCart(promo.id, 1)}
                            className="w-full py-2 rounded-xl text-xs font-bold text-black transition-all"
                            style={{
                              background: "linear-gradient(135deg, #FACC15, #EAB308)",
                              boxShadow: "0 0 14px rgba(250,204,21,0.3)",
                            }}
                          >
                            Agregar al carrito
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </div>

      <AnimatePresence>
        {totalCartItems > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            className="fixed bottom-0 left-0 right-0 px-5 pb-8 pt-4"
            style={{ background: "var(--tp-grad-bot2)" }}
          >
            <div className="max-w-lg mx-auto">
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={onViewCart}
                className="w-full py-4 px-6 rounded-2xl text-white font-semibold text-base flex items-center justify-between transition-all duration-300 glow-blue"
                style={{ background: "var(--tp-btn)" }}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: "rgba(255,255,255,0.95)", color: "var(--tp-accent)" }}
                  >
                    {totalCartItems}
                  </div>
                  <span>{totalCartItems === 1 ? "1 producto" : `${totalCartItems} productos`}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">${totalCartPrice}</span>
                  <ShoppingCart className="w-4 h-4" />
                </div>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
