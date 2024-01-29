export interface User {
  id: number;
  name: string;
  phone: string;
  email: string;
  password: string;
  points: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
export interface Category {
  id: number;
  name: string;
  products: Product[];
}
export interface Product {
  id: number;
  name: string;
  price: number;
  color: string;
  image: string;
  description: string;
  quantity: number;
  cateId: number;
}

export interface CartItem {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
  productId: number;
  userId: number;
}

export interface Price {
  price: number;
  tax: number;
  delivery: number;
  total: number;
}
export interface ChartDataPoint {
  x: Date;
  y: number;
}
export interface Order {
  id: number;
  email: string;
  address: string;
  contact: string;
  date: Date;
  status: string;
  payment: string;
  totalPrice: number;
  userId: number;
  orderDetails: OrderDetail[];
}

export interface OrderDetail {
  id: number | undefined;
  orderId: number | undefined;
  productId: number;
  quantity: number;
}
