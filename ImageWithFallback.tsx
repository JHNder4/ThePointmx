import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Package, Clock, Truck, CheckCircle2, XCircle, ChevronDown, MapPin, ExternalLink, Timer, Sparkles, ThumbsUp } from "lucide-react";
import { Order, OrderStatus } from "../types";
import { updateOrderStatus, updateOrderEta } from "../store";

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; icon: React.ElementType }> = {
  // Nuevos estados
  nuevo:       { label: "Nuevo",      color: "text-purple-400", bg: "rgba(168,85,247,0.1)", border: "rgba(168,85,247,0.3)", icon: Sparkles },
  confirmado:  { label: "Confirmado", color: "text-amber-400",  bg: "rgba(251,191,36,0.1)", border: "rgba(251,191,36,0.3)", icon: ThumbsUp },
  preparando:  { label: "Preparando", color: "text-orange-400", bg: "rgba(249,115,22,0.1)", border: "rgba(249,115,22,0.3)", icon: Package },
  "en-camino": { label: "En camino",  color: "text-blue-400",   bg: "rgba(37,99,235,0.1)",  border: "rgba(37,99,235,0.3)",  icon: Truck },
  entregado:   { label: "Entregado",  color: "text-green-400",  bg: "rgba(34,197,94,0.1)",  border: "rgba(34,197,94,0.3)",  icon: CheckCircle2 },
  cancelado:   { label: "Cancelado",  color: "text-red-400",    bg: "rgba(239,68,68,0.1)",  border: "rgba(239,68,68,0.3)",  icon: XCircle },
  // Estados legados (retrocompat con pedidos existentes)
  pending:      { label: "Recibido",  color: "text-amber-400",  bg: "rgba(251,191,36,0.1)", border: "rgba(251,191,36,0.3)", icon: Clock },
  preparing:    { label: "Preparando",color: "text-orange-400", bg: "rgba(249,115,22,0.1)", border: "rgba(249,115,22,0.3)", icon: Package },
  "on-the-way": { label: "En camino", color: "text-blue-400",   bg: "rgba(37,99,235,0.1)",  border: "rgba(37,99,235,0.3)",  icon: Truck },
  delivered:    { label: "Entregado", color: "text-green-400",  bg: "rgba(34,197,94,0.1)",  border: "rgba(34,197,94,0.3)",  icon: CheckCircle2 },
  cancelled:    { label: "Cancelado", color: "text-red-400",    bg: "rgba(239,68,68,0.1)",  border: "rgba(239,68,68,0.3)",  icon: XCircle },
};

const NEW_STATUS_ORDER: OrderStatus[] = ["nuevo", "confirmado", "preparando", "en-camino", "entregado", "cancelado"];
const ALL_FILTER_OPTIONS: (OrderStatus | "all")[] = ["all", ...NEW_STATUS_ORDER];

const getConfig = (status: string) =>
  STATUS_CONFIG[status] ?? { label: status, color: "text-[#71717A]", bg: "rgba(39,39,42,0.5)", border: "rgba(63,63,70,0.4)", icon: Clock };

interface Props {
  orders: Order[];
  onOrdersChange: (orders: Order[]) => void;
}

function extractMapsUrl(address: string): string | null {
  const match = address.match(/https:\/\/maps\.google\.com\/\?q=[^\s\n]+/);
  return match ? match[0] : null;
}

export function AdminOrders({ orders, onOrdersChange }: Props) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "all">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [etaInputs, setEtaInputs] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});

  const filtered = orders.filter(o => {
    const matchSearch = !search ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.address.toLowerCase().includes(search.toLowerCase()) ||
      o.items.some(i => i.name.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = filterStatus === "all" || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    setSaving(prev => ({ ...prev, [orderId + status]: true }));
    try {
      await updateOrderStatus(orderId, status);
      onOrdersChange(orders.map(o => o.id === orderId ? { ...o, status } : o));
    } catch (err) {
      console.error("Error actualizando estado:", err);
    } finally {
      setSaving(prev => ({ ...prev, [orderId + status]: false }));
    }
  };

  const handleSaveEta = async (orderId: string) => {
    const eta = etaInputs[orderId]?.trim() ?? "";
    setSaving(prev => ({ ...prev, [orderId + "eta"]: true }));
    try {
      await updateOrderEta(orderId, eta);
      onOrdersChange(orders.map(o => o.id === orderId ? { ...o, estimatedTime: eta } : o));
    } catch (err) {
      console.error("Error guardando ETA:", err);
    } finally {
      setSaving(prev => ({ ...prev, [orderId + "eta"]: false }));
    }
  };

  const trackingUrl = (id: string) => `${window.location.origin}/track/${id}`;

  // Count by new statuses for summary row
  const counts = {
    nuevo: orders.filter(o => o.status === "nuevo").length,
    confirmado: orders.filter(o => o.status === "confirmado").length,
    preparando: orders.filter(o => o.status === "preparando" || o.status === "preparing").length,
    "en-camino": orders.filter(o => o.status === "en-camino" || o.status === "on-the-way").length,
    entregado: orders.filter(o => o.status === "entregado" || o.status === "delivered").length,
    cancelado: orders.filter(o => o.status === "cancelado" || o.status === "cancelled").length,
  };

  return (
    <div className="p-5 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
        <h2 className="text-xl font-bold text-white tracking-tight">Pedidos</h2>
        <p className="text-[#71717A] text-sm mt-0.5">{orders.length} pedidos en total</p>
      </motion.div>

      {/* Resumen por estado */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-3 gap-2 mb-5"
      >
        {(["nuevo","confirmado","preparando","en-camino","entregado","cancelado"] as const).map(s => {
          const cfg = getConfig(s);
          const count = counts[s as keyof typeof counts];
          return (
            <button
              key={s}
              onClick={() => setFilterStatus(s === filterStatus ? "all" : s)}
              className="rounded-xl p-3 text-left transition-all duration-200"
              style={{
                background: filterStatus === s ? cfg.bg : "rgba(24,24,27,0.6)",
                border: filterStatus === s ? `1px solid ${cfg.border}` : "1px solid rgba(63,63,70,0.4)",
              }}
            >
              <p className={`text-lg font-black ${cfg.color}`}>{count}</p>
              <p className="text-[#71717A] text-[10px] font-semibold uppercase tracking-wider mt-0.5">{cfg.label}</p>
            </button>
          );
        })}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col gap-3 mb-5"
      >
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#52525B]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar pedido, dirección, producto..."
            className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-[#52525B] text-sm outline-none transition-all"
            style={{ background: "rgba(24,24,27,0.9)", border: "1px solid rgba(63,63,70,0.5)" }}
            onFocus={e => { e.target.style.border = "1px solid rgba(37,99,235,0.4)"; }}
            onBlur={e => { e.target.style.border = "1px solid rgba(63,63,70,0.5)"; }}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {ALL_FILTER_OPTIONS.map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status as OrderStatus | "all")}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200"
              style={{
                background: filterStatus === status ? "rgba(37,99,235,0.2)" : "rgba(39,39,42,0.8)",
                border: filterStatus === status ? "1px solid rgba(37,99,235,0.4)" : "1px solid rgba(63,63,70,0.5)",
                color: filterStatus === status ? "#93C5FD" : "#71717A",
              }}
            >
              {status === "all" ? "Todos" : getConfig(status).label}
            </button>
          ))}
        </div>
      </motion.div>

      {filtered.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
          <Package className="w-10 h-10 text-[#3F3F46] mx-auto mb-3" />
          <p className="text-[#52525B] text-sm">
            {orders.length === 0 ? "Aún no hay pedidos" : "No se encontraron pedidos"}
          </p>
        </motion.div>
      ) : (
        <div className="flex flex-col gap-3">
          <AnimatePresence>
            {filtered.map((order, idx) => {
              const cfg = getConfig(order.status);
              const StatusIcon = cfg.icon;
              const isExpanded = expandedId === order.id;
              const mapsUrl = extractMapsUrl(order.address);
              const etaVal = etaInputs[order.id] ?? order.estimatedTime ?? "";

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className="rounded-2xl overflow-hidden"
                  style={{ background: "rgba(24,24,27,0.85)", border: `1px solid ${order.status === "nuevo" ? "rgba(168,85,247,0.3)" : "rgba(63,63,70,0.5)"}` }}
                >
                  <button
                    className="w-full px-4 py-4 flex items-center gap-3 text-left"
                    onClick={() => setExpandedId(isExpanded ? null : order.id)}
                  >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: cfg.bg }}>
                      <StatusIcon className={`w-4 h-4 ${cfg.color}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-white font-semibold text-sm">{order.id}</span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.color}`} style={{ background: cfg.bg }}>
                          {cfg.label}
                        </span>
                        {order.estimatedTime && (
                          <span className="text-xs text-[#71717A] flex items-center gap-1">
                            <Timer className="w-3 h-3" />{order.estimatedTime}
                          </span>
                        )}
                      </div>
                      <p className="text-[#71717A] text-xs mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString("es-MX", {
                          day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit"
                        })} · ${order.total}
                      </p>
                    </div>

                    <ChevronDown className={`w-4 h-4 text-[#52525B] flex-shrink-0 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 border-t border-[#27272A] pt-4 space-y-4">

                          <div>
                            <p className="text-[#52525B] text-xs font-semibold uppercase tracking-wider mb-2">Productos</p>
                            <div className="space-y-1.5">
                              {order.items.map((item, i) => (
                                <div key={i} className="flex justify-between text-sm">
                                  <span className="text-[#D4D4D8]">{item.name} ×{item.quantity}</span>
                                  <span className="text-white font-medium">${item.price * item.quantity}</span>
                                </div>
                              ))}
                              <div className="flex justify-between text-sm pt-1.5 border-t border-[#27272A] mt-1.5">
                                <span className="text-white font-semibold">Total</span>
                                <span className="text-blue-400 font-bold">${order.total}</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <p className="text-[#52525B] text-xs font-semibold uppercase tracking-wider mb-1.5">Dirección del cliente</p>
                            <p className="text-[#D4D4D8] text-sm leading-relaxed whitespace-pre-wrap break-all">{order.address}</p>
                            {mapsUrl && (
                              <a
                                href={mapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 mt-2 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                              >
                                <MapPin className="w-3 h-3" />
                                Abrir en Google Maps
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>

                          <div>
                            <p className="text-[#52525B] text-xs font-semibold uppercase tracking-wider mb-2">
                              Tiempo estimado de entrega
                            </p>
                            <div className="flex gap-2">
                              <input
                                value={etaVal}
                                onChange={e => setEtaInputs(prev => ({ ...prev, [order.id]: e.target.value }))}
                                placeholder="Ej: 20-30 min, 45 min..."
                                className="flex-1 px-3 py-2.5 rounded-xl text-white text-sm outline-none placeholder-[#52525B]"
                                style={{ background: "rgba(9,9,11,0.9)", border: "1px solid rgba(63,63,70,0.5)" }}
                                onFocus={e => { e.target.style.border = "1px solid rgba(37,99,235,0.4)"; }}
                                onBlur={e => { e.target.style.border = "1px solid rgba(63,63,70,0.5)"; }}
                              />
                              <motion.button
                                whileTap={{ scale: 0.96 }}
                                onClick={() => handleSaveEta(order.id)}
                                disabled={saving[order.id + "eta"]}
                                className="px-4 py-2.5 rounded-xl text-white text-xs font-semibold flex-shrink-0 transition-all disabled:opacity-60"
                                style={{ background: "linear-gradient(135deg, #2563EB, #1D4ED8)" }}
                              >
                                {saving[order.id + "eta"] ? "..." : "Guardar"}
                              </motion.button>
                            </div>
                          </div>

                          <div>
                            <p className="text-[#52525B] text-xs font-semibold uppercase tracking-wider mb-2">Cambiar estado</p>
                            <div className="grid grid-cols-2 gap-2">
                              {NEW_STATUS_ORDER.map(status => {
                                const sc = getConfig(status);
                                const Ic = sc.icon;
                                const isActive = order.status === status;
                                return (
                                  <motion.button
                                    key={status}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => handleStatusChange(order.id, status)}
                                    disabled={saving[order.id + status]}
                                    className="py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all duration-200 disabled:opacity-60"
                                    style={{
                                      background: isActive ? sc.bg : "rgba(39,39,42,0.6)",
                                      border: isActive ? `1px solid ${sc.border}` : "1px solid rgba(63,63,70,0.4)",
                                    }}
                                  >
                                    <Ic className={`w-3.5 h-3.5 ${isActive ? sc.color : "text-[#52525B]"}`} />
                                    <span className={isActive ? sc.color : "text-[#71717A]"}>{sc.label}</span>
                                  </motion.button>
                                );
                              })}
                            </div>
                          </div>

                          <div>
                            <p className="text-[#52525B] text-xs font-semibold uppercase tracking-wider mb-1.5">Enlace de seguimiento</p>
                            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{ background: "rgba(9,9,11,0.8)", border: "1px solid rgba(63,63,70,0.4)" }}>
                              <span className="text-[#71717A] text-xs font-mono flex-1 truncate">{trackingUrl(order.id)}</span>
                              <button
                                onClick={() => navigator.clipboard?.writeText(trackingUrl(order.id))}
                                className="text-blue-400 text-xs font-semibold hover:text-blue-300 transition-colors flex-shrink-0"
                              >
                                Copiar
                              </button>
                            </div>
                          </div>

                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
