import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ShoppingBag, Zap } from "lucide-react";
import { Order } from "../types";

export interface NotificationItem {
  id: string;
  order: Order;
  receivedAt: number;
}

interface Props {
  notifications: NotificationItem[];
  onDismiss: (id: string) => void;
}

const AUTO_DISMISS_MS = 10000;

export function OrderNotifications({ notifications, onDismiss }: Props) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence mode="popLayout">
        {notifications.map(n => (
          <NotificationCard
            key={n.id}
            item={n}
            onDismiss={onDismiss}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

function NotificationCard({ item, onDismiss }: { item: NotificationItem; onDismiss: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(item.id), AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [item.id, onDismiss]);

  const { order } = item;
  const previewItems = order.items.slice(0, 2);
  const extra = order.items.length - 2;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 80, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
      className="pointer-events-auto rounded-2xl overflow-hidden shadow-2xl"
      style={{
        background: "rgba(15,15,18,0.97)",
        border: "1px solid rgba(37,99,235,0.4)",
        boxShadow: "0 0 30px rgba(37,99,235,0.15), 0 8px 32px rgba(0,0,0,0.5)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div className="px-4 py-3 flex items-start gap-3">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background: "rgba(37,99,235,0.2)", border: "1px solid rgba(37,99,235,0.4)" }}
        >
          <ShoppingBag className="w-4 h-4 text-blue-400" />
        </motion.div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <div className="flex items-center gap-1">
              <Zap className="w-2.5 h-2.5 text-blue-400" />
              <span className="text-blue-400 text-[10px] font-semibold tracking-widest uppercase">Nuevo pedido</span>
            </div>
            <motion.span
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.5, repeat: 3 }}
              className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0"
            />
          </div>

          <p className="text-white font-bold text-sm font-mono">{order.id}</p>

          <div className="mt-1.5 space-y-0.5">
            {previewItems.map((item, i) => (
              <p key={i} className="text-[#A1A1AA] text-xs">
                {item.name} <span className="text-[#71717A]">×{item.quantity}</span>
              </p>
            ))}
            {extra > 0 && (
              <p className="text-[#52525B] text-xs">+{extra} producto{extra > 1 ? "s" : ""} más</p>
            )}
          </div>

          <div className="mt-2 flex items-center justify-between">
            <span className="text-blue-400 font-bold text-sm">${order.total}</span>
            <span className="text-[#52525B] text-[10px]">
              {new Date(order.createdAt).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        </div>

        <button
          onClick={() => onDismiss(item.id)}
          className="w-6 h-6 rounded-lg flex items-center justify-center text-[#52525B] hover:text-white transition-colors flex-shrink-0"
          style={{ background: "rgba(39,39,42,0.6)" }}
        >
          <X className="w-3 h-3" />
        </button>
      </div>

      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: AUTO_DISMISS_MS / 1000, ease: "linear" }}
        style={{
          height: 2,
          background: "linear-gradient(90deg, #2563EB, #60A5FA)",
          transformOrigin: "left",
        }}
      />
    </motion.div>
  );
}
