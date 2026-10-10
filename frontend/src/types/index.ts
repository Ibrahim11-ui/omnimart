export type UserRole = 'admin' | 'seller' | 'buyer';
export type UserStatus = 'active' | 'suspended';

export interface Address {
  id: string;
  label: string; // e.g., 'Home', 'Office'
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface PaymentCard {
  id: string;
  cardType: 'Visa' | 'Mastercard' | 'Amex';
  lastFour: string;
  holderName: string;
  expiry: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatar: string;
  phone?: string;
  addresses: Address[];
  paymentCards: PaymentCard[];
  createdAt: string;
}

export type ProductCategory =
  | 'Electronics'
  | 'Wearables'
  | 'Audio'
  | 'Home & Living'
  | 'Workspaces'
  | 'Accessories';

export type ComplianceStatus = 'approved' | 'under_review' | 'flagged';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: ProductCategory;
  stock: number;
  lowStockThreshold: number;
  sellerId: string;
  sellerName: string;
  rating: number;
  reviewCount: number;
  image: string;
  tags: string[];
  status: ComplianceStatus;
  featured?: boolean;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image: string;
  sellerId: string;
}

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface OrderTimelineStep {
  status: OrderStatus;
  label: string;
  timestamp: string;
  note: string;
  completed: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  couponCode?: string;
  shippingFee: number;
  totalAmount: number;
  shippingAddress: Address;
  paymentCard?: PaymentCard;
  status: OrderStatus;
  trackingNumber: string;
  estimatedDelivery: string;
  createdAt: string;
  timeline: OrderTimelineStep[];
}

export type ActivityType = 'user' | 'product' | 'order' | 'system';
export type ActivitySeverity = 'info' | 'success' | 'warning' | 'alert';

export interface ActivityLog {
  id: string;
  timestamp: string;
  type: ActivityType;
  actorName: string;
  actorRole: UserRole | 'system';
  action: string;
  details: string;
  severity: ActivitySeverity;
}

export interface BrowsingHistoryItem {
  productId: string;
  viewedAt: string;
}

export interface WishlistItem {
  productId: string;
  addedAt: string;
  priceWhenAdded: number;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export type BuyerTab = 'store' | 'history' | 'orders' | 'wishlist' | 'account';
export type SellerTab = 'listings' | 'orders' | 'inventory' | 'performance';
export type AdminTab = 'users' | 'products' | 'orders' | 'monitoring';
export type ActiveRoleView = 'buyer' | 'seller' | 'admin';
