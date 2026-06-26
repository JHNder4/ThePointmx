import { supabase } from "../../lib/supabase";
import { Order, AdminProduct, BannerSettings } from "./types";

const SESSION_KEY = "tp_admin_session";
export const ADMIN_PASSWORD = "thepoint";

export const DEFAULT_ADMIN_PRODUCTS: AdminProduct[] = [
  // Productos principales
  { id: "soda",        name: "Soda",        price: 140, promoPrice: 0, isPromo: false, image: "/images/09fed79a-41e2-4c6a-b19a-c78b93d7c0e6.jpg", available: true },
  { id: "soda-lavada", name: "Soda Lavada", price: 500, promoPrice: 0, isPromo: false, image: "/images/OIP.jpg",                                    available: true },
  { id: "verde",       name: "Verde",       price: 140, promoPrice: 0, isPromo: false, image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400", available: true },
  { id: "frio",        name: "Frío",        price: 140, promoPrice: 0, isPromo: false, image: "/images/0eaf463f-8af7-4b29-bbe2-b4553197254c.jpg",  available: true },
  // Botones de categoría
  { id: "cat-prerolls",    name: "Pre-rolls",   price: 0, promoPrice: 0, isPromo: false, image: "", available: true, isCategory: true, categoryKey: "prerolls" },
  { id: "cat-comestibles", name: "Comestibles", price: 0, promoPrice: 0, isPromo: false, image: "", available: true, isCategory: true, categoryKey: "comestibles" },
  // Ítems individuales — Pre-rolls
  { id: "preroll-uva",        name: "Blunt Wrap XXL Uva",             price: 80, promoPrice: 0, isPromo: false, image: "", available: true, categoryKey: "prerolls" },
  { id: "preroll-blueberry",  name: "Blunt Wrap XXL Blueberry",       price: 80, promoPrice: 0, isPromo: false, image: "", available: true, categoryKey: "prerolls" },
  { id: "preroll-chocolate",  name: "Blunt Wrap XXL Chocolate Amargo",price: 90, promoPrice: 0, isPromo: false, image: "", available: true, categoryKey: "prerolls" },
  { id: "preroll-mango",      name: "Blunt Wrap XXL Mango",           price: 85, promoPrice: 0, isPromo: false, image: "", available: true, categoryKey: "prerolls" },
  // Ítems individuales — Comestibles
  { id: "comestible-brownie",  name: "Brownies de chocolate",              price: 80, promoPrice: 0, isPromo: false, image: "", available: true, categoryKey: "comestibles" },
  { id: "comestible-galletas", name: "Galletas con chispas de chocolate",  price: 80, promoPrice: 0, isPromo: false, image: "", available: true, categoryKey: "comestibles" },
  // Promociones — Pre-rolls
  { id: "promo-prerolls-2x150", name: "Promo Pre-rolls 2x150", price: 150, promoPrice: 150, isPromo: true, image: "", available: true, categoryKey: "prerolls" },
  { id: "promo-prerolls-3x220", name: "Promo Pre-rolls 3x220", price: 220, promoPrice: 220, isPromo: true, image: "", available: true, categoryKey: "prerolls" },
  // Promociones — Comestibles
  { id: "promo-comestibles-2x150", name: "Promo Comestibles 2x150", price: 150, promoPrice: 150, isPromo: true, image: "", available: true, categoryKey: "comestibles" },
  { id: "promo-comestibles-3x220", name: "Promo Comestibles 3x220", price: 220, promoPrice: 220, isPromo: true, image: "", available: true, categoryKey: "comestibles" },
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

export async function getOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(rowToOrder);
}

export async function getOrderById(id: string): Promise<Order | null> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data ? rowToOrder(data) : null;
}

export async function saveOrder(order: Order): Promise<void> {
  const { error } = await supabase.from("orders").insert({
    id: order.id,
    created_at: order.createdAt,
    items: order.items,
    total: order.total,
    address: order.address,
    status: order.status,
    estimated_time: order.estimatedTime ?? null,
  });
  if (error) throw error;
}

export async function updateOrderStatus(id: string, status: Order["status"]): Promise<void> {
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id);
  if (error) throw error;
}

export async function updateOrderEta(id: string, estimatedTime: string): Promise<void> {
  const { error } = await supabase
    .from("orders")
    .update({ estimated_time: estimatedTime })
    .eq("id", id);
  if (error) throw error;
}

export async function getAdminProducts(): Promise<AdminProduct[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*");
  if (error || !data || data.length === 0) return DEFAULT_ADMIN_PRODUCTS;

  // Build a lookup map so we can fall back to defaults for missing columns
  const defaultMap = Object.fromEntries(DEFAULT_ADMIN_PRODUCTS.map(p => [p.id, p]));

  // Map Supabase rows, falling back to defaults for any missing column
  const fromDB: AdminProduct[] = data.map(row => {
    const def = defaultMap[row.id as string];
    return {
      id: row.id as string,
      name: (row.name as string) || def?.name || "",
      price: (row.price as number) ?? def?.price ?? 0,
      promoPrice: (row.promo_price as number) ?? def?.promoPrice ?? 0,
      isPromo: (row.is_promo as boolean) ?? def?.isPromo ?? false,
      image: (row.image as string) ?? def?.image ?? "",
      available: (row.available as boolean) ?? def?.available ?? true,
      isCategory: (row.is_category as boolean) ?? def?.isCategory ?? false,
      categoryKey: ((row.category_key as string | null) ?? null) || def?.categoryKey || undefined,
    };
  });

  // Include any default products that are NOT yet in Supabase
  const dbIds = new Set(fromDB.map(p => p.id));
  const missing = DEFAULT_ADMIN_PRODUCTS.filter(p => !dbIds.has(p.id));

  return [...fromDB, ...missing];
}

export async function saveAdminProducts(products: AdminProduct[]): Promise<void> {
  for (const p of products) {
    const { error } = await supabase
      .from("products")
      .upsert({
        id: p.id,
        name: p.name,
        price: p.price,
        promo_price: p.promoPrice ?? 0,
        is_promo: p.isPromo ?? false,
        image: p.image,
        available: p.available,
        is_category: p.isCategory ?? false,
        category_key: p.categoryKey ?? null,
      }, { onConflict: "id" });
    if (error) throw error;
  }
}

export async function getNewOrderCount(lastSeen: number): Promise<number> {
  const { count, error } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .gt("created_at", lastSeen);
  if (error) return 0;
  return count ?? 0;
}

export function isAdminLoggedIn(): boolean {
  return sessionStorage.getItem(SESSION_KEY) === "true";
}

export function loginAdmin(password: string): boolean {
  if (password === ADMIN_PASSWORD) {
    sessionStorage.setItem(SESSION_KEY, "true");
    return true;
  }
  return false;
}

export function logoutAdmin(): void {
  sessionStorage.removeItem(SESSION_KEY);
}

// ─── Banner ──────────────────────────────────────────────────────────────────

export const DEFAULT_BANNER: BannerSettings = {
  id: 1,
  badgeText: "Entrega Premium",
  title: "",
  subtitle: "",
  buttonText: "Hacer pedido",
  buttonLink: "",
  imageUrl: "",
  isActive: false,
};

export async function getBanner(): Promise<BannerSettings> {
  const { data, error } = await supabase
    .from("banner_settings")
    .select("*")
    .eq("id", 1)
    .single();
  if (error || !data) return DEFAULT_BANNER;
  return {
    id: 1,
    badgeText: (data.badge_text as string) || DEFAULT_BANNER.badgeText,
    title: (data.title as string) || "",
    subtitle: (data.subtitle as string) || "",
    buttonText: (data.button_text as string) || DEFAULT_BANNER.buttonText,
    buttonLink: (data.button_link as string) || "",
    imageUrl: (data.image_url as string) || "",
    isActive: (data.is_active as boolean) ?? false,
  };
}

export async function saveBanner(banner: BannerSettings): Promise<void> {
  const { error } = await supabase
    .from("banner_settings")
    .upsert({
      id: 1,
      badge_text: banner.badgeText,
      title: banner.title,
      subtitle: banner.subtitle,
      button_text: banner.buttonText,
      button_link: banner.buttonLink,
      image_url: banner.imageUrl,
      is_active: banner.isActive,
      updated_at: new Date().toISOString(),
    }, { onConflict: "id" });
  if (error) throw error;
}
