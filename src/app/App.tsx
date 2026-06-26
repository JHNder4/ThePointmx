import { useState, useMemo, useEffect } from "react";
import { AnimatePresence } from "motion/react";
import { HomeScreen } from "./components/HomeScreen";
import { ProductCatalog, Product } from "./components/ProductCatalog";
import { Cart, AllItems } from "./components/Cart";
import { LocationForm } from "./components/LocationForm";
import { OrderConfirmation } from "./components/OrderConfirmation";
import { CategoryScreen, CategoryItem, Promo } from "./components/CategoryScreen";
import { ThemeProvider } from "./context/ThemeContext";
import { ThemeToggle } from "./components/ThemeToggle";
// ── TEPO ONBOARDING ── Para desactivar el tutorial, borra/comenta las dos líneas de abajo
// y el <TepoOnboarding ... /> al final del return.
import { TepoOnboarding } from "./components/TepoOnboarding";
import { saveOrder, getAdminProducts, DEFAULT_ADMIN_PRODUCTS } from "./admin/store";
import { AdminProduct } from "./admin/types";

type Screen = "home" | "products" | "cart" | "location" | "confirmation" | "prerolls" | "comestibles";

function toProduct(p: AdminProduct): Product {
  return {
    id: p.id,
    name: p.name,
    price: p.isPromo && p.promoPrice > 0 ? p.promoPrice : p.price,
    image: p.image || undefined,
    type: p.isCategory ? "category" : "product",
    categoryKey: p.categoryKey,
  };
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [address, setAddress] = useState("");
  const [adminProds, setAdminProds] = useState<AdminProduct[]>(DEFAULT_ADMIN_PRODUCTS);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    getAdminProducts().then(setAdminProds).catch(() => {});
  }, []);

  const regularProducts = useMemo<Product[]>(() =>
    adminProds
      .filter(p => !p.isCategory && !p.categoryKey && !p.isPromo && p.available)
      .map(toProduct),
    [adminProds]
  );

  const categoryProducts = useMemo<Product[]>(() =>
    adminProds
      .filter(p => p.isCategory && p.available)
      .map(p => ({
        id: p.id,
        name: p.name,
        price: 0,
        type: "category" as const,
        categoryKey: p.categoryKey,
        itemCount: adminProds.filter(x => x.categoryKey === p.categoryKey && !x.isCategory).length,
      })),
    [adminProds]
  );

  const mainPromoProducts = useMemo<Product[]>(() =>
    adminProds
      .filter(p => p.isPromo && !p.categoryKey && p.available)
      .map(toProduct),
    [adminProds]
  );

  const allDisplayProducts = useMemo(
    () => [...regularProducts, ...categoryProducts],
    [regularProducts, categoryProducts]
  );

  const categoryItems = useMemo(() => {
    const map: Record<string, CategoryItem[]> = {};
    adminProds
      .filter(p => p.categoryKey && !p.isCategory && !p.isPromo && p.available)
      .forEach(p => {
        const key = p.categoryKey!;
        if (!map[key]) map[key] = [];
        map[key].push({ id: p.id, name: p.name, price: p.price });
      });
    return map;
  }, [adminProds]);

  const categoryPromos = useMemo(() => {
    const map: Record<string, Promo[]> = {};
    adminProds
      .filter(p => p.categoryKey && p.isPromo && p.available)
      .forEach(p => {
        const key = p.categoryKey!;
        if (!map[key]) map[key] = [];
        map[key].push({ id: p.id, name: p.name, price: p.promoPrice > 0 ? p.promoPrice : p.price });
      });
    return map;
  }, [adminProds]);

  const allItems: AllItems = useMemo(() => {
    const entries = adminProds.map(p => [
      p.id,
      { name: p.name, price: p.isPromo && p.promoPrice > 0 ? p.promoPrice : p.price },
    ] as const);
    return Object.fromEntries(entries);
  }, [adminProds]);

  const totalCartItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const totalCartPrice = Object.entries(cart).reduce(
    (sum, [id, qty]) => sum + (allItems[id]?.price ?? 0) * qty,
    0
  );

  const handleUpdateCart = (productId: string, quantity: number) => {
    setCart(prev => {
      if (quantity === 0) {
        const next = { ...prev };
        delete next[productId];
        return next;
      }
      return { ...prev, [productId]: quantity };
    });
  };

  const handleSendWhatsApp = async () => {
    if (sending) return;
    setSending(true);

    const cartEntries = Object.entries(cart)
      .filter(([, qty]) => qty > 0)
      .map(([id, quantity]) => ({
        name: allItems[id]?.name ?? id,
        price: allItems[id]?.price ?? 0,
        quantity,
      }));

    const total = cartEntries.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const orderId = `TP-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    try {
      await saveOrder({
        id: orderId,
        createdAt: Date.now(),
        items: cartEntries,
        total,
        address,
        status: "nuevo",
      });
    } catch (err) {
      console.error("Error guardando pedido en Supabase:", err);
    } finally {
      setSending(false);
    }

    const trackingUrl = `${window.location.origin}/track/${orderId}`;

    let message = `*🛍️ Nuevo Pedido - Thepoint*\n*ID: ${orderId}*\n\n`;
    message += "*Productos:*\n";
    cartEntries.forEach(item => {
      message += `• ${item.name} x${item.quantity} - $${item.price * item.quantity}\n`;
    });
    message += `\n*Total: $${total}*\n\n`;
    message += `*📍 Dirección de entrega:*\n${address}\n\n`;
    message += `*💵 Método de pago:* Efectivo\n\n`;
    message += `*🔍 Seguimiento:* ${trackingUrl}`;

    const phoneNumber = "5213411156618";
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };

  // ── TEPO ONBOARDING: acción al terminar el tutorial ──────────────────────────
  const handleOnboardingComplete = (action: "continue" | "explore") => {
    if (action === "continue" && totalCartItems > 0) {
      setCurrentScreen("cart");
    } else {
      setCurrentScreen("products");
    }
  };

  const handleBackToHome = () => {
    setCurrentScreen("home");
    setCart({});
    setAddress("");
  };

  return (
    <ThemeProvider>
      <div className="size-full">
        <AnimatePresence mode="wait">
          {currentScreen === "home" && (
            <HomeScreen key="home" onStartOrder={() => setCurrentScreen("products")} />
          )}

          {currentScreen === "products" && (
            <ProductCatalog
              key="products"
              products={allDisplayProducts}
              promoProducts={mainPromoProducts}
              cart={cart}
              totalCartPrice={totalCartPrice}
              onUpdateCart={handleUpdateCart}
              onContinue={() => setCurrentScreen("cart")}
              onOpenCategory={(key) => setCurrentScreen(key as Screen)}
            />
          )}

          {currentScreen === "prerolls" && (
            <CategoryScreen
              key="prerolls"
              title="Pre-rolls"
              menuLabel="MENÚ PRE ROLLS XXL"
              items={categoryItems["prerolls"] ?? []}
              promos={categoryPromos["prerolls"] ?? []}
              cart={cart}
              totalCartItems={totalCartItems}
              totalCartPrice={totalCartPrice}
              onUpdateCart={handleUpdateCart}
              onBack={() => setCurrentScreen("products")}
              onViewCart={() => setCurrentScreen("cart")}
            />
          )}

          {currentScreen === "comestibles" && (
            <CategoryScreen
              key="comestibles"
              title="Comestibles"
              menuLabel="MENÚ COMESTIBLES"
              items={categoryItems["comestibles"] ?? []}
              promos={categoryPromos["comestibles"] ?? []}
              cart={cart}
              totalCartItems={totalCartItems}
              totalCartPrice={totalCartPrice}
              onUpdateCart={handleUpdateCart}
              onBack={() => setCurrentScreen("products")}
              onViewCart={() => setCurrentScreen("cart")}
            />
          )}

          {currentScreen === "cart" && (
            <Cart
              key="cart"
              allItems={allItems}
              cart={cart}
              onBack={() => setCurrentScreen("products")}
              onContinue={() => setCurrentScreen("location")}
            />
          )}

          {currentScreen === "location" && (
            <LocationForm
              key="location"
              onBack={() => setCurrentScreen("cart")}
              onContinue={(addr) => {
                setAddress(addr);
                setCurrentScreen("confirmation");
              }}
            />
          )}

          {currentScreen === "confirmation" && (
            <OrderConfirmation
              key="confirmation"
              allItems={allItems}
              cart={cart}
              address={address}
              onSendWhatsApp={handleSendWhatsApp}
              onBackToHome={handleBackToHome}
            />
          )}
        </AnimatePresence>

        {/* ── TEPO ONBOARDING ── Quita este bloque para desactivar el tutorial */}
        <TepoOnboarding
          currentScreen={currentScreen}
          cartItemCount={totalCartItems}
          onNavigate={(screen) => setCurrentScreen(screen)}
          onComplete={handleOnboardingComplete}
        />

        <ThemeToggle />
      </div>
    </ThemeProvider>
  );
}
