
export enum OrderStatus {
  PENDING = 'Pending',
  PAID = 'Paid',
  SHIPPED = 'Shipped',
}

export enum Platform {
  FACEBOOK = 'Facebook',
  INSTAGRAM = 'Instagram',
  TIKTOK = 'TikTok',
}

export interface Product {
  id: string;
  name: string;
  stock: number;
  price: number; // Usual selling price
  buyingCost: number; // Cost of acquisition
  image?: string;
}

export interface Order {
  id: string;
  platform: Platform;
  customerName: string;
  productName: string;
  quantity: number;
  totalPrice: number; // Actual selling price (can be custom)
  buyingCost: number; // Buying cost at time of sale for profit calculation
  status: OrderStatus;
  date: string;
}

export interface Activity {
  id: string;
  type: 'post' | 'order' | 'inventory';
  message: string;
  timestamp: string;
}

export interface LinkedAccounts {
  facebook: boolean;
  instagram: boolean;
  tiktok: boolean;
  google: boolean;
}

export interface User {
  name: string;
  email: string;
  isAuthenticated: boolean;
  shopName?: string;
  location?: string;
  avatar?: string | null;
  bio?: string;
  phone?: string;
  linkedAccounts: LinkedAccounts;
}

export interface SocialMediaCaptions {
  facebook: string;
  instagram: string;
  tiktok: string;
}

export interface AIStrategicInsight {
  title: string;
  description: string;
  actionLabel: string;
  impact: 'high' | 'medium' | 'low';
  type: 'marketing' | 'inventory' | 'sales';
}

// Authentication specific types
export interface AuthError {
  code: string;
  message: string;
  action: string;
  severity: 'warning' | 'critical';
}

export interface DiagnosticResult {
  popupsEnabled: boolean;
  networkHealthy: boolean;
  cookiesEnabled: boolean;
}
