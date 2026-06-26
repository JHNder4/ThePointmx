import { motion, AnimatePresence } from "motion/react";
import { Plus, Minus, ShoppingCart, ChevronRight, Package2, ArrowLeft } from "lucide-react";

export interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  type?: "product" | "category";
  categoryKey?: string;
  itemCount?: number;
}

interface QuantityControlsProps {
  quantity: number;
  onDecrement: () => void;
  onIncrement: () => void;
}

function QuantityControls({ quantity, onDecrement, onIncrement }: QuantityControlsProps) {
  return (
    <div className="flex items-center gap-1 rounded-xl p-1" style={{ background: "var(--tp-mute)" }}>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.82 }}
        onClick={onDecrement}
        disabled={quantity === 0}
        className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 disabled:opacity-30"
        style={{
          background: quantity > 0 ? "var(--tp-border)" : "transparent",
          color: "var(--tp-fg)",
        }}
      >
        <Minus className="w-4 h-4" />
      </motion.button>

      <AnimatePresence mode="wait">
        <motion.span
          key={quantity}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.14 }}
          className="w-9 text-center font-bold text-base tabular-nums select-none"
          style={{ color: "var(--tp-fg)" }}
        >
          {quantity}
        </motion.span>
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.82 }}
        onClick={onIncrement}
        className="w-9 h-9 rounded-lg flex items-center justify-center text-white transition-all duration-200"
        style={{ background: "var(--tp-btn)", boxShadow: "0 0 10px var(--tp-btn-glow)" }}
      >
        <Plus className="w-4 h-4" />
      </motion.button>
    </div>
  );
}

interface CardProps {
  product: Product;
  quantity: number;
  onUpdateCart: (id: string, qty: number) => void;
  index: number;
}

function SodaCard({ product, quantity, onUpdateCart, index }: CardProps) {
  const isInCart = quantity > 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      whileHover={{ y: -3 }}
      className="rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: "var(--tp-card-dark)",
        border: isInCart ? "1px solid var(--tp-accent-border2)" : "1px solid var(--tp-border-l)",
        boxShadow: isInCart
          ? "0 0 30px var(--tp-accent-bg), 0 8px 32px rgba(0,0,0,0.3)"
          : "0 8px 32px rgba(0,0,0,0.2)",
      }}
    >
      {product.image && (
        <div className="relative w-full overflow-hidden" style={{ height: 200, background: "var(--tp-mute)" }}>
          <motion.img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.5 }}
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, var(--tp-card-dark) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)" }}
          />
          {isInCart && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ background: "var(--tp-accent)", boxShadow: "0 0 14px var(--tp-btn-glow)" }}
            >
              {quantity}
            </motion.div>
          )}
        </div>
      )}

      <div className="px-5 pb-5 -mt-2">
        <div className="mb-4">
          <h3
            className="font-black leading-none tracking-tight"
            style={{ fontSize: "2.4rem", letterSpacing: "-0.04em", color: "var(--tp-fg)" }}
          >
            {product.name.toUpperCase()}
          </h3>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-black text-2xl" style={{ letterSpacing: "-0.03em", color: "var(--tp-accent-text)" }}>
              ${product.price}
            </span>
            <span className="text-sm font-medium" style={{ color: "var(--tp-fg3)" }}>1 pz</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <QuantityControls
            quantity={quantity}
            onDecrement={() => onUpdateCart(product.id, Math.max(0, quantity - 1))}
            onIncrement={() => onUpdateCart(product.id, quantity + 1)}
          />
          {isInCart && (
            <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} className="text-right">
              <p className="text-xs" style={{ color: "var(--tp-fg3)" }}>Subtotal</p>
              <p className="font-bold text-sm" style={{ color: "var(--tp-fg)" }}>${product.price * quantity}</p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function FrioCard({ product, quantity, onUpdateCart, index }: CardProps) {
  const isInCart = quantity > 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      whileHover={{ y: -3 }}
      className="rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: "rgba(10,12,20,0.97)",
        backdropFilter: "blur(20px)",
        border: isInCart ? "1px solid rgba(99,179,237,0.4)" : "1px solid rgba(99,179,237,0.12)",
        boxShadow: isInCart
          ? "0 0 28px rgba(99,179,237,0.12), 0 8px 32px rgba(0,0,0,0.4)"
          : "0 8px 32px rgba(0,0,0,0.3)",
      }}
    >
      {product.image && (
        <div className="relative w-full overflow-hidden" style={{ height: 210, background: "rgba(8,10,18,0.9)" }}>
          <motion.img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover opacity-80"
            whileHover={{ scale: 1.04, opacity: 0.9 }}
            transition={{ duration: 0.5 }}
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(10,12,20,1) 0%, rgba(10,12,20,0.3) 50%, transparent 100%)" }}
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(135deg, rgba(99,179,237,0.04) 0%, transparent 60%)" }}
          />
          {isInCart && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
              style={{
                background: "rgba(99,179,237,0.2)",
                border: "1px solid rgba(99,179,237,0.5)",
                color: "#93C5FD",
                backdropFilter: "blur(8px)",
              }}
            >
              {quantity}
            </motion.div>
          )}
        </div>
      )}

      <div className="px-5 pb-5 -mt-1">
        <div className="mb-4">
          <h3
            className="font-black leading-none tracking-tight"
            style={{ fontSize: "2.6rem", letterSpacing: "-0.05em", color: "#E2E8F0" }}
          >
            {product.name.toUpperCase()}
          </h3>
          <p className="font-bold text-base mt-0.5" style={{ color: "rgba(147,197,253,0.9)", letterSpacing: "0.01em" }}>
            ${product.price} / 1 PZ
          </p>
          <p
            className="text-xs font-semibold mt-1 uppercase tracking-widest"
            style={{ color: "rgba(148,163,184,0.5)" }}
          >
            Listo para disfrutar
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 rounded-xl p-1" style={{ background: "rgba(15,18,30,0.9)" }}>
            <motion.button
              whileTap={{ scale: 0.82 }}
              onClick={() => onUpdateCart(product.id, Math.max(0, quantity - 1))}
              disabled={quantity === 0}
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 disabled:opacity-30"
              style={{ background: quantity > 0 ? "rgba(51,65,85,0.9)" : "transparent", color: "#CBD5E1" }}
            >
              <Minus className="w-4 h-4" />
            </motion.button>
            <AnimatePresence mode="wait">
              <motion.span
                key={quantity}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.14 }}
                className="w-9 text-center font-bold text-base tabular-nums select-none"
                style={{ color: "#E2E8F0" }}
              >
                {quantity}
              </motion.span>
            </AnimatePresence>
            <motion.button
              whileTap={{ scale: 0.82 }}
              onClick={() => onUpdateCart(product.id, quantity + 1)}
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, rgba(99,179,237,0.25), rgba(59,130,246,0.2))",
                border: "1px solid rgba(99,179,237,0.3)",
                color: "#93C5FD",
              }}
            >
              <Plus className="w-4 h-4" />
            </motion.button>
          </div>
          {isInCart && (
            <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} className="text-right">
              <p className="text-xs" style={{ color: "#475569" }}>Subtotal</p>
              <p className="font-bold text-sm" style={{ color: "#CBD5E1" }}>${product.price * quantity}</p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function VerdeCard({ product, quantity, onUpdateCart, index }: CardProps) {
  const isInCart = quantity > 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      whileHover={{ y: -3 }}
      className="relative rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        minHeight: 340,
        border: isInCart ? "1px solid rgba(74,222,128,0.35)" : "1px solid rgba(63,63,70,0.3)",
        boxShadow: isInCart
          ? "0 0 32px rgba(74,222,128,0.1), 0 12px 40px rgba(0,0,0,0.5)"
          : "0 12px 40px rgba(0,0,0,0.4)",
      }}
    >
      {product.image && (
        <motion.img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover"
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.7 }}
          style={{ opacity: 0.45 }}
        />
      )}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(160deg, rgba(5,15,5,0.75) 0%, rgba(5,12,8,0.65) 40%, rgba(2,8,4,0.9) 80%, rgba(2,5,3,1) 100%)" }}
      />
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(74,222,128,0.05) 0%, transparent 50%)" }} />

      <div className="absolute top-4 right-4 w-24 h-24 opacity-70">
        <svg width="96" height="96" viewBox="0 0 96 96">
          <defs>
            <path id="stamp-circle-verde" d="M 48 48 m -38 0 a 38 38 0 1 1 76 0 a 38 38 0 1 1 -76 0" />
          </defs>
          <motion.text
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "48px 48px" }}
            fontSize="6.5"
            fill="rgba(134,239,172,0.55)"
            letterSpacing="2.2"
            fontWeight="600"
            fontFamily="Inter, sans-serif"
          >
            <textPath href="#stamp-circle-verde">CALIDAD GARANTIZADA • 100% ORGÁNICO •</textPath>
          </motion.text>
          <circle cx="48" cy="48" r="22" fill="none" stroke="rgba(134,239,172,0.15)" strokeWidth="0.8" />
          <circle cx="48" cy="48" r="36" fill="none" stroke="rgba(134,239,172,0.1)" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="relative z-10 p-5 flex flex-col" style={{ minHeight: 340 }}>
        <div className="flex-1">
          <div className="mb-1">
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "rgba(134,239,172,0.6)" }}>
              Cepa Premium
            </span>
          </div>
          <h3
            className="font-black leading-none tracking-tighter"
            style={{
              fontSize: "clamp(3.5rem, 14vw, 5rem)",
              letterSpacing: "-0.05em",
              color: "rgba(240,255,244,0.95)",
              textShadow: "0 0 40px rgba(74,222,128,0.2)",
            }}
          >
            {product.name.toUpperCase()}
          </h3>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-black" style={{ fontSize: "3rem", letterSpacing: "-0.04em", color: "rgba(134,239,172,0.9)" }}>
              {product.price}
            </span>
            <span style={{ color: "rgba(134,239,172,0.5)", fontSize: "1rem", fontWeight: 600 }}>/ 3.5g</span>
          </div>
          <p className="mt-1 text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(134,239,172,0.4)" }}>
            Cosecha 2026
          </p>
          {isInCart && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full"
              style={{ background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.2)" }}
            >
              <span className="text-xs font-bold" style={{ color: "rgba(134,239,172,0.9)" }}>
                {quantity} en carrito · ${product.price * quantity}
              </span>
            </motion.div>
          )}
        </div>

        <div className="mt-auto">
          <div className="w-full h-px mb-4" style={{ background: "linear-gradient(to right, rgba(134,239,172,0.15), transparent)" }} />
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold" style={{ color: "rgba(134,239,172,0.7)" }}>${product.price} / 3.5</p>
            <div className="flex items-center gap-1 rounded-xl p-1" style={{ background: "rgba(5,15,8,0.8)", border: "1px solid rgba(134,239,172,0.1)" }}>
              <motion.button
                whileTap={{ scale: 0.82 }}
                onClick={() => onUpdateCart(product.id, Math.max(0, quantity - 1))}
                disabled={quantity === 0}
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 disabled:opacity-30"
                style={{ background: quantity > 0 ? "rgba(30,50,35,0.9)" : "transparent", color: "#86EFAC" }}
              >
                <Minus className="w-4 h-4" />
              </motion.button>
              <AnimatePresence mode="wait">
                <motion.span
                  key={quantity}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.14 }}
                  className="w-9 text-center font-bold text-base tabular-nums select-none"
                  style={{ color: "#86EFAC" }}
                >
                  {quantity}
                </motion.span>
              </AnimatePresence>
              <motion.button
                whileTap={{ scale: 0.82 }}
                onClick={() => onUpdateCart(product.id, quantity + 1)}
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, rgba(34,197,94,0.3), rgba(21,128,61,0.2))",
                  border: "1px solid rgba(134,239,172,0.25)",
                  color: "#86EFAC",
                }}
              >
                <Plus className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function DefaultCard({ product, quantity, onUpdateCart, index }: CardProps) {
  const isInCart = quantity > 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      className="rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: "var(--tp-card-s)",
        border: isInCart ? "1px solid var(--tp-accent-border2)" : "1px solid var(--tp-border)",
        boxShadow: isInCart
          ? "0 0 20px var(--tp-accent-bg), 0 4px 20px rgba(0,0,0,0.15)"
          : "var(--tp-shadow)",
      }}
    >
      {product.image && (
        <div className="relative w-full h-44 overflow-hidden" style={{ background: "var(--tp-mute)" }}>
          <motion.img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.5 }}
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, var(--tp-bg) 0%, transparent 50%)" }} />
          {isInCart && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ background: "var(--tp-accent)", boxShadow: "0 0 12px var(--tp-btn-glow)" }}
            >
              {quantity}
            </motion.div>
          )}
        </div>
      )}

      <div className="p-5">
        <div className="flex items-end justify-between mb-4">
          <div>
            <h3 className="font-semibold text-base mb-0.5" style={{ color: "var(--tp-fg)" }}>
              {product.name}
            </h3>
            <p className="text-xs" style={{ color: "var(--tp-fg2)" }}>Entrega inmediata</p>
          </div>
          <div className="text-right">
            <span className="font-bold text-xl" style={{ color: "var(--tp-accent-text)" }}>
              ${product.price}
            </span>
            <p className="text-xs" style={{ color: "var(--tp-fg3)" }}>MXN</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <QuantityControls
            quantity={quantity}
            onDecrement={() => onUpdateCart(product.id, Math.max(0, quantity - 1))}
            onIncrement={() => onUpdateCart(product.id, quantity + 1)}
          />
          {isInCart && (
            <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} className="text-right">
              <p className="text-xs" style={{ color: "var(--tp-fg4)" }}>Subtotal</p>
              <p className="font-semibold text-sm" style={{ color: "var(--tp-fg)" }}>${product.price * quantity}</p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

interface ProductCatalogProps {
  products: Product[];
  promoProducts?: Product[];
  cart: Record<string, number>;
  totalCartPrice: number;
  onUpdateCart: (productId: string, quantity: number) => void;
  onContinue: () => void;
  onOpenCategory: (categoryKey: string) => void;
  onBack?: () => void;
}

export function ProductCatalog({ products, promoProducts = [], cart, totalCartPrice, onUpdateCart, onContinue, onOpenCategory, onBack }: ProductCatalogProps) {
  const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="min-h-screen pb-36"
      style={{ background: "var(--tp-bg)" }}
    >
      <div
        className="sticky top-0 z-20 px-5 pt-12 pb-5"
        style={{ background: "var(--tp-grad-top)" }}
      >
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
                style={{ background: "var(--tp-card)", color: "var(--tp-fg2)" }}
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
            <h2 className="text-2xl font-bold tracking-tight" style={{ color: "var(--tp-fg)" }}>
              Menú
            </h2>
            <p className="text-sm mt-0.5" style={{ color: "var(--tp-fg2)" }}>
              {products.filter(p => p.type !== "category").length} productos · {products.filter(p => p.type === "category").length} categorías
              {promoProducts.length > 0 && ` · ${promoProducts.length} promos`}
            </p>
            </div>
          </div>
          <div
            className="px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{
              background: "var(--tp-accent-bg)",
              border: "1px solid var(--tp-accent-border)",
              color: "var(--tp-accent-text)",
            }}
          >
            Thepoint
          </div>
        </div>
      </div>

      <div className="px-5 max-w-lg mx-auto">
        <div className="flex flex-col gap-4">
          {products.map((product, index) => {
            if (product.type === "category") {
              return (
                <motion.button
                  key={product.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.07, duration: 0.4 }}
                  whileHover={{ scale: 1.015, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => product.categoryKey && onOpenCategory(product.categoryKey)}
                  className="relative w-full rounded-2xl overflow-hidden text-left"
                  style={{
                    background: "var(--tp-card-s)",
                    border: "1px solid var(--tp-accent-border)",
                    boxShadow: "var(--tp-shadow)",
                  }}
                >
                  <motion.div
                    animate={{ opacity: [0.4, 0.7, 0.4] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: "linear-gradient(135deg, var(--tp-accent-bg) 0%, transparent 55%)" }}
                  />
                  <div className="relative p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: "var(--tp-accent-bg2)", border: "1px solid var(--tp-accent-border)" }}
                      >
                        <Package2 className="w-5 h-5" style={{ color: "var(--tp-accent-text)" }} />
                      </div>
                      <div>
                        <h3 className="font-bold text-base leading-tight" style={{ color: "var(--tp-fg)" }}>
                          {product.name}
                        </h3>
                        {product.itemCount !== undefined && (
                          <p className="text-xs mt-0.5" style={{ color: "var(--tp-fg2)" }}>
                            {product.itemCount} productos disponibles
                          </p>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 flex-shrink-0" style={{ color: "var(--tp-accent-text)" }} />
                  </div>
                </motion.button>
              );
            }

            const quantity = cart[product.id] || 0;
            const name = product.name.toLowerCase();

            if (name.includes("soda") || name.includes("refresco") || name.includes("agua")) {
              return <SodaCard key={product.id} product={product} quantity={quantity} onUpdateCart={onUpdateCart} index={index} />;
            }
            if (name.includes("frío") || name.includes("frio") || name.includes("cold") || name.includes("ice")) {
              return <FrioCard key={product.id} product={product} quantity={quantity} onUpdateCart={onUpdateCart} index={index} />;
            }
            if (name.includes("verde") || name.includes("green") || name.includes("hierba") || name.includes("kush") || name.includes("og")) {
              return <VerdeCard key={product.id} product={product} quantity={quantity} onUpdateCart={onUpdateCart} index={index} />;
            }
            return <DefaultCard key={product.id} product={product} quantity={quantity} onUpdateCart={onUpdateCart} index={index} />;
          })}

          {promoProducts.length > 0 && (
            <>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex-1 h-px" style={{ background: "var(--tp-border)" }} />
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--tp-fg2)" }}>
                  Promos
                </span>
                <div className="flex-1 h-px" style={{ background: "var(--tp-border)" }} />
              </div>
              {promoProducts.map((product, index) => {
                const quantity = cart[product.id] || 0;
                return <DefaultCard key={product.id} product={product} quantity={quantity} onUpdateCart={onUpdateCart} index={index} />;
              })}
            </>
          )}
        </div>
      </div>

      <AnimatePresence>
        {totalItems > 0 && (
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
                onClick={onContinue}
                className="w-full py-4 px-6 rounded-2xl text-white font-semibold text-base flex items-center justify-between transition-all duration-300 glow-blue"
                style={{ background: "var(--tp-btn)" }}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: "rgba(255,255,255,0.95)", color: "var(--tp-accent)" }}
                  >
                    {totalItems}
                  </div>
                  <span>{totalItems === 1 ? "1 producto" : `${totalItems} productos`}</span>
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
