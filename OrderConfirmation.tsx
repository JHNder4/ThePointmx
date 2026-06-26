import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LayoutDashboard, ShoppingBag, Package, LogOut, Bell, Zap, Menu, X, Image } from "lucide-react";
import { AdminLogin } from "./AdminLogin";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AdminOrders } from "./pages/AdminOrders";
import { AdminProducts } from "./pages/AdminProducts";
import { AdminBanner } from "./pages/AdminBanner";
import {
  isAdminLoggedIn, logoutAdmin,
  getOrders, getAdminProducts, getNewOrderCount,
  getBanner, DEFAULT_BANNER,
} from "./store";
import { Order, AdminProduct, BannerSettings } from "./types";
import { supabase } from "../../lib/supabase";
import { OrderNotifications, NotificationItem } from "./components/OrderNotification";
import { playOrderNotificationSound } from "./utils/sound";

type Tab = "dashboard" | "orders" | "products" | "banner";

const NAV_ITEMS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "orders",    label: "Pedidos",   icon: ShoppingBag },
  { id: "products",  label: "Productos", icon: Package },
  { id: "banner",    label: "Banner",    icon: Image },
];

function rowToOrder(row: Record<string, unknown>): Order {
  return {
    id: row.id as string,
    createdAt: row.created_at as number,
    items: row.items as Order["items"],
    total: row.total as number,
    address: row.address as string,
    status: row.status as Order["status"],
    estimatedTime: (row.estimated_time as string | null) ?? undefined,
  };
}

export default function AdminShell() {
  const [loggedIn, setLoggedIn] = useState(isAdminLoggedIn());
  const [tab, setTab] = useState<Tab>("dashboard");
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [banner, setBanner] = useState<BannerSettings>(DEFAULT_BANNER);
  const [newCount, setNewCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [lastSeen, setLastSeenTs] = useState(() => parseInt(localStorage.getItem("tp_last_seen") || "0"));
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const seenOrderIds = useRef<Set<string>>(new Set());

  const refreshData = useCallback(async () => {
    try {
      const [fetchedOrders, fetchedProducts, count, fetchedBanner] = await Promise.all([
        getOrders(),
        getAdminProducts(),
        getNewOrderCount(lastSeen),
        getBanner(),
      ]);
      setOrders(fetchedOrders);
      setProducts(fetchedProducts);
      setNewCount(count);
      setBanner(fetchedBanner);
    } catch (err) {
      console.error("Error cargando datos del admin:", err);
    }
  }, [lastSeen]);

  // Polling fallback every 5 seconds
  useEffect(() => {
    if (!loggedIn) return;
    refreshData();
    const interval = setInterval(refreshData, 5000);
    return () => clearInterval(interval);
  }, [loggedIn, refreshData]);

  // Supabase Realtime — listen for new orders
  useEffect(() => {
    if (!loggedIn) return;

    const channel = supabase
      .channel("admin-new-orders")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        (payload) => {
          const newOrder = rowToOrder(payload.new as Record<string, unknown>);

          if (seenOrderIds.current.has(newOrder.id)) return;
          seenOrderIds.current.add(newOrder.id);

          setOrders(prev => [newOrder, ...prev]);
          setNewCount(prev => prev + 1);

          const notification: NotificationItem = {
            id: `notif-${newOrder.id}-${Date.now()}`,
            order: newOrder,
            receivedAt: Date.now(),
          };
          setNotifications(prev => [notification, ...prev].slice(0, 5));

          playOrderNotificationSound();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loggedIn]);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const handleTabChange = (t: Tab) => {
    setTab(t);
    setSidebarOpen(false);
    if (t === "orders") {
      const now = Date.now();
      localStorage.setItem("tp_last_seen", String(now));
      setLastSeenTs(now);
      setNewCount(0);
    }
  };

  if (!loggedIn) {
    return <AdminLogin onLogin={() => { setLoggedIn(true); }} />;
  }

  return (
    <div className="min-h-screen bg-[#09090B] flex flex-col md:flex-row">
      <OrderNotifications notifications={notifications} onDismiss={dismissNotification} />

      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 md:hidden"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ x: sidebarOpen ? 0 : "-100%" }}
        transition={{ type: "spring", stiffness: 280, damping: 28 }}
        className="fixed left-0 top-0 bottom-0 z-40 w-64 flex flex-col md:hidden"
        style={{
          background: "rgba(12,12,14,0.98)",
          borderRight: "1px solid rgba(63,63,70,0.4)",
          backdropFilter: "blur(20px)",
        }}
      >
        <SidebarContent
          tab={tab}
          newCount={newCount}
          onTabChange={handleTabChange}
          onLogout={() => { logoutAdmin(); setLoggedIn(false); }}
          showClose
          onClose={() => setSidebarOpen(false)}
        />
      </motion.aside>

      <aside
        className="hidden md:flex flex-col w-60 flex-shrink-0 sticky top-0 h-screen"
        style={{
          background: "rgba(12,12,14,0.98)",
          borderRight: "1px solid rgba(63,63,70,0.4)",
        }}
      >
        <SidebarContent
          tab={tab}
          newCount={newCount}
          onTabChange={handleTabChange}
          onLogout={() => { logoutAdmin(); setLoggedIn(false); }}
        />
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header
          className="md:hidden sticky top-0 z-20 flex items-center gap-3 px-4 py-3.5"
          style={{
            background: "rgba(9,9,11,0.95)",
            borderBottom: "1px solid rgba(63,63,70,0.4)",
            backdropFilter: "blur(12px)",
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-[#71717A]"
            style={{ background: "rgba(39,39,42,0.8)" }}
          >
            <Menu className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1.5 flex-1">
            <Zap className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-white font-bold text-sm tracking-tight">Thepoint Admin</span>
          </div>
          {newCount > 0 && tab !== "orders" && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={() => handleTabChange("orders")}
              className="relative w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)" }}
            >
              <Bell className="w-4 h-4 text-red-400" />
              <span
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white text-[10px] font-bold flex items-center justify-center"
                style={{ background: "#EF4444" }}
              >
                {newCount}
              </span>
            </motion.button>
          )}
        </header>

        <main className="flex-1 overflow-auto pb-20 md:pb-0">
          <AnimatePresence mode="wait">
            {tab === "dashboard" && (
              <motion.div key="dashboard" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25 }}>
                <AdminDashboard orders={orders} onNavigateOrders={() => handleTabChange("orders")} />
              </motion.div>
            )}
            {tab === "orders" && (
              <motion.div key="orders" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25 }}>
                <AdminOrders orders={orders} onOrdersChange={setOrders} />
              </motion.div>
            )}
            {tab === "products" && (
              <motion.div key="products" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25 }}>
                <AdminProducts products={products} onProductsChange={setProducts} />
              </motion.div>
            )}
            {tab === "banner" && (
              <motion.div key="banner" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25 }}>
                <AdminBanner banner={banner} onBannerChange={setBanner} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <nav
          className="md:hidden fixed bottom-0 left-0 right-0 flex items-center justify-around px-2 pb-safe pt-2"
          style={{
            background: "rgba(9,9,11,0.97)",
            borderTop: "1px solid rgba(63,63,70,0.4)",
            backdropFilter: "blur(16px)",
          }}
        >
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = tab === item.id;
            const hasBadge = item.id === "orders" && newCount > 0;
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className="relative flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl transition-all duration-200"
                style={{ background: isActive ? "rgba(37,99,235,0.12)" : "transparent" }}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 transition-colors ${isActive ? "text-blue-400" : "text-[#52525B]"}`} />
                  {hasBadge && (
                    <span
                      className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full text-white text-[9px] font-bold flex items-center justify-center"
                      style={{ background: "#EF4444" }}
                    >
                      {newCount > 9 ? "9+" : newCount}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] font-semibold transition-colors ${isActive ? "text-blue-400" : "text-[#52525B]"}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

interface SidebarContentProps {
  tab: Tab;
  newCount: number;
  onTabChange: (t: Tab) => void;
  onLogout: () => void;
  showClose?: boolean;
  onClose?: () => void;
}

function SidebarContent({ tab, newCount, onTabChange, onLogout, showClose, onClose }: SidebarContentProps) {
  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <Zap className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-blue-400 text-xs font-semibold tracking-widest uppercase">Thepoint</span>
          </div>
          <h2 className="text-white font-bold text-base tracking-tight">Panel Admin</h2>
        </div>
        {showClose && (
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#71717A]" style={{ background: "rgba(39,39,42,0.8)" }}>
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <nav className="flex flex-col gap-1.5 flex-1">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = tab === item.id;
          const hasBadge = item.id === "orders" && newCount > 0;
          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => onTabChange(item.id)}
              className="relative flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-200 w-full"
              style={{
                background: isActive ? "rgba(37,99,235,0.15)" : "transparent",
                border: isActive ? "1px solid rgba(37,99,235,0.25)" : "1px solid transparent",
              }}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-blue-400" : "text-[#52525B]"}`} />
              <span className={`text-sm font-medium ${isActive ? "text-white" : "text-[#71717A]"}`}>{item.label}</span>
              {hasBadge && (
                <span
                  className="ml-auto w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center"
                  style={{ background: "#EF4444" }}
                >
                  {newCount > 9 ? "9+" : newCount}
                </span>
              )}
            </motion.button>
          );
        })}
      </nav>

      <div className="pt-4 border-t border-[#27272A]">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onLogout}
          className="flex items-center gap-3 px-3 py-3 rounded-xl w-full text-[#71717A] hover:text-white transition-colors duration-200"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Cerrar sesión</span>
        </motion.button>
      </div>
    </div>
  );
}
