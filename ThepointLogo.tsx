import { useMemo } from "react";
import { motion } from "motion/react";
import { ShoppingBag, DollarSign, Clock, CheckCircle2, TrendingUp, ChevronRight } from "lucide-react";
import { Order } from "../types";

const STATUS_LABEL: Record<string, string> = {
  pending: "Pendiente",
  "on-the-way": "En camino",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

const STATUS_COLOR: Record<string, string> = {
  pending: "text-amber-400",
  "on-the-way": "text-blue-400",
  delivered: "text-green-400",
  cancelled: "text-red-400",
};

interface Props {
  orders: Order[];
  onNavigateOrders: () => void;
}

export function AdminDashboard({ orders, onNavigateOrders }: Props) {
  const today = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    return orders.filter(o => o.createdAt >= start);
  }, [orders]);

  const stats = useMemo(() => ({
    todayOrders: today.length,
    todaySales: today.reduce((s, o) => s + o.total, 0),
    pending: orders.filter(o => o.status === "pending").length,
    delivered: orders.filter(o => o.status === "delivered").length,
  }), [orders, today]);

  const recent = orders.slice(0, 5);

  const statCards = [
    {
      label: "Pedidos hoy",
      value: stats.todayOrders,
      icon: ShoppingBag,
      color: "rgba(37,99,235,0.15)",
      border: "rgba(37,99,235,0.3)",
      iconColor: "text-blue-400",
      glow: "rgba(37,99,235,0.1)",
    },
    {
      label: "Ventas hoy",
      value: `$${stats.todaySales}`,
      icon: DollarSign,
      color: "rgba(34,197,94,0.1)",
      border: "rgba(34,197,94,0.25)",
      iconColor: "text-green-400",
      glow: "rgba(34,197,94,0.08)",
    },
    {
      label: "Pendientes",
      value: stats.pending,
      icon: Clock,
      color: "rgba(251,191,36,0.1)",
      border: "rgba(251,191,36,0.25)",
      iconColor: "text-amber-400",
      glow: "rgba(251,191,36,0.08)",
    },
    {
      label: "Entregados",
      value: stats.delivered,
      icon: CheckCircle2,
      color: "rgba(168,85,247,0.1)",
      border: "rgba(168,85,247,0.25)",
      iconColor: "text-purple-400",
      glow: "rgba(168,85,247,0.08)",
    },
  ];

  return (
    <div className="p-5 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-7"
      >
        <h2 className="text-xl font-bold text-white tracking-tight">Dashboard</h2>
        <p className="text-[#71717A] text-sm mt-0.5">Resumen de operaciones</p>
      </motion.div>

      <div className="grid grid-cols-2 gap-3 mb-7">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="rounded-2xl p-4"
            style={{
              background: card.color,
              border: `1px solid ${card.border}`,
              boxShadow: `0 0 20px ${card.glow}`,
            }}
          >
            <card.icon className={`w-5 h-5 ${card.iconColor} mb-3`} />
            <p className="text-white font-black text-2xl leading-none tracking-tight">{card.value}</p>
            <p className="text-[#71717A] text-xs mt-1">{card.label}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl overflow-hidden"
        style={{ background: "rgba(24,24,27,0.8)", border: "1px solid rgba(63,63,70,0.5)" }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#27272A]">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <h3 className="text-white font-semibold text-sm">Pedidos recientes</h3>
          </div>
          <button
            onClick={onNavigateOrders}
            className="text-blue-400 text-xs font-medium flex items-center gap-1 hover:text-blue-300 transition-colors"
          >
            Ver todos <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {recent.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <ShoppingBag className="w-8 h-8 text-[#3F3F46] mx-auto mb-3" />
            <p className="text-[#52525B] text-sm">Aún no hay pedidos</p>
            <p className="text-[#3F3F46] text-xs mt-1">Los pedidos aparecerán aquí cuando los clientes ordenen</p>
          </div>
        ) : (
          <div className="divide-y divide-[#27272A]">
            {recent.map(order => (
              <div key={order.id} className="px-5 py-3.5 flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold text-sm">{order.id}</span>
                    <span className={`text-xs font-medium ${STATUS_COLOR[order.status]}`}>
                      {STATUS_LABEL[order.status]}
                    </span>
                  </div>
                  <p className="text-[#71717A] text-xs mt-0.5 truncate">
                    {order.items.map(i => `${i.name} ×${i.quantity}`).join(", ")}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-white font-bold text-sm">${order.total}</p>
                  <p className="text-[#52525B] text-xs">
                    {new Date(order.createdAt).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
