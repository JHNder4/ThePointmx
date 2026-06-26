export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export type OrderStatus =
  | "nuevo" | "confirmado" | "preparando" | "en-camino" | "entregado" | "cancelado"
  | "pending" | "preparing" | "on-the-way" | "delivered" | "cancelled";

export interface Order {
  id: string;
  createdAt: number;
  items: OrderItem[];
  total: number;
  address: string;
  status: OrderStatus;
  estimatedTime?: string;
}

export interface AdminProduct {
  id: string;
  name: string;
  price: number;
  promoPrice: number;
  isPromo: boolean;
  image: string;
  available: boolean;
  isCategory?: boolean;
  categoryKey?: string;
}

export interface BannerSettings {
  id: number;
  badgeText: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  imageUrl: string;
  isActive: boolean;
}
