
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
  price: number;
  image?: string;
}

export interface Order {
  id: string;
  platform: Platform;
  customerName: string;
  productName: string;
  quantity: number;
  totalPrice: number;
  status: OrderStatus;
  date: string;
}

export interface Activity {
  id: string;
  type: 'post' | 'order' | 'inventory';
  message: string;
  timestamp: string;
}

export interface User {
  name: string;
  email: string;
  isAuthenticated: boolean;
}
