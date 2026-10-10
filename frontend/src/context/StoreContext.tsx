import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type {
  User,
  Product,
  Order,
  ActivityLog,
  BrowsingHistoryItem,
  WishlistItem,
  CartItem,
  ComplianceStatus,
  OrderStatus,
  BuyerTab,
  SellerTab,
  AdminTab,
  ActiveRoleView,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_ACTIVITIES,
  INITIAL_BROWSING_HISTORY,
  INITIAL_WISHLIST,
} from '../data/seedData';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface StoreContextType {
  // Current view and persona
  activeRole: ActiveRoleView;
  setActiveRole: (role: ActiveRoleView) => void;
  currentUser: User;
  switchUser: (userId: string) => void;

  // Tabs
  buyerTab: BuyerTab;
  setBuyerTab: (tab: BuyerTab) => void;
  sellerTab: SellerTab;
  setSellerTab: (tab: SellerTab) => void;
  adminTab: AdminTab;
  setAdminTab: (tab: AdminTab) => void;

  // Users (Admin functionality)
  users: User[];
  addUser: (userData: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  toggleUserStatus: (id: string) => void;

  // Products (Seller & Admin functionality)
  products: Product[];
  addProduct: (productData: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewCount'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateProductStock: (id: string, newStock: number) => void;
  setProductCompliance: (id: string, status: ComplianceStatus) => void;

  // Orders (Buyer, Seller & Admin functionality)
  orders: Order[];
  placeOrder: (orderPayload: {
    buyerId: string;
    items: { productId: string; quantity: number }[];
    shippingAddress: any;
    paymentCard?: any;
    couponCode?: string;
    discountAmount: number;
  }) => Order | null;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, note?: string) => void;
  cancelOrder: (orderId: string, reason?: string) => void;

  // Buyer Specific
  cart: CartItem[];
  addToCart: (productId: string, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;

  wishlist: WishlistItem[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  browsingHistory: BrowsingHistoryItem[];
  recordProductView: (productId: string) => void;

  // Activity logs & monitoring
  activityLogs: ActivityLog[];
  addActivityLog: (log: Omit<ActivityLog, 'id' | 'timestamp'>) => void;

  // Feedback & Toasts
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;

  // Selected item modal details
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  selectedOrderId: string | null;
  setSelectedOrderId: (id: string | null) => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (isOpen: boolean) => void;
  isCheckoutModalOpen: boolean;
  setIsCheckoutModalOpen: (isOpen: boolean) => void;

  // Quick reset
  resetToSeedData: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USERS: 'omnimart_users_v1',
  PRODUCTS: 'omnimart_products_v1',
  ORDERS: 'omnimart_orders_v1',
  ACTIVITIES: 'omnimart_activities_v1',
  BROWSING_HISTORY: 'omnimart_browsing_history_v1',
  WISHLIST: 'omnimart_wishlist_v1',
  CART: 'omnimart_cart_v1',
  ROLE: 'omnimart_active_role_v1',
  CURRENT_USER_ID: 'omnimart_current_user_id_v1',
};

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 1. Core State with LocalStorage initialization
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
  });

  const [browsingHistory, setBrowsingHistory] = useState<BrowsingHistoryItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BROWSING_HISTORY);
    return saved ? JSON.parse(saved) : INITIAL_BROWSING_HISTORY;
  });

  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WISHLIST);
    return saved ? JSON.parse(saved) : INITIAL_WISHLIST;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CART);
    return saved ? JSON.parse(saved) : [
      { productId: 'prod-101', quantity: 1 }
    ];
  });

  const [activeRole, setActiveRoleState] = useState<ActiveRoleView>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ROLE) as ActiveRoleView;
    return saved || 'buyer';
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    return saved || 'user-buyer-1'; // Default to Alex Rivera
  });

  // Navigation tab states
  const [buyerTab, setBuyerTab] = useState<BuyerTab>('store');
  const [sellerTab, setSellerTab] = useState<SellerTab>('listings');
  const [adminTab, setAdminTab] = useState<AdminTab>('users');

  // UI state
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Synchronize state with LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activityLogs));
  }, [activityLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BROWSING_HISTORY, JSON.stringify(browsingHistory));
  }, [browsingHistory]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROLE, activeRole);
  }, [activeRole]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUserId);
  }, [currentUserId]);

  // Toast Helper
  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Activity Logger
  const addActivityLog = (log: Omit<ActivityLog, 'id' | 'timestamp'>) => {
    const newLog: ActivityLog = {
      ...log,
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: 'Just now',
    };
    setActivityLogs((prev) => [newLog, ...prev.slice(0, 49)]);
  };

  // Current active user object resolution
  const currentUser = users.find((u) => u.id === currentUserId) || users[0];

  // Role switching helper
  const setActiveRole = (role: ActiveRoleView) => {
    setActiveRoleState(role);
    // Auto switch persona to representative user for convenient testing
    if (role === 'admin') {
      const admin = users.find((u) => u.role === 'admin');
      if (admin) setCurrentUserId(admin.id);
    } else if (role === 'seller') {
      const seller = users.find((u) => u.role === 'seller');
      if (seller) setCurrentUserId(seller.id);
    } else {
      const buyer = users.find((u) => u.role === 'buyer' && u.status === 'active');
      if (buyer) setCurrentUserId(buyer.id);
    }
    showToast(`Switched view to ${role.toUpperCase()} mode`, 'info');
  };

  const switchUser = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (target) {
      setCurrentUserId(target.id);
      setActiveRoleState(target.role);
      showToast(`Logged in as ${target.name} (${target.role.toUpperCase()})`, 'info');
    }
  };

  // User Management (Admin)
  const addUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString(),
      addresses: userData.addresses || [],
      paymentCards: userData.paymentCards || [],
    };
    setUsers((prev) => [newUser, ...prev]);
    addActivityLog({
      type: 'user',
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action: `Created Account (${newUser.role.toUpperCase()})`,
      details: `User ${newUser.name} <${newUser.email}> registered.`,
      severity: 'success',
    });
    showToast(`User ${newUser.name} created successfully!`, 'success');
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...updates } : u))
    );
    const target = users.find((u) => u.id === id);
    addActivityLog({
      type: 'user',
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action: 'Updated User Account',
      details: `Modified details for ${target ? target.name : id}.`,
      severity: 'info',
    });
    showToast('User details updated successfully!', 'success');
  };

  const deleteUser = (id: string) => {
    const target = users.find((u) => u.id === id);
    if (!target) return;
    setUsers((prev) => prev.filter((u) => u.id !== id));
    addActivityLog({
      type: 'user',
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action: 'Deleted User Account',
      details: `Removed account for ${target.name} (${target.email}).`,
      severity: 'alert',
    });
    showToast(`User ${target.name} has been removed.`, 'warning');
  };

  const toggleUserStatus = (id: string) => {
    const target = users.find((u) => u.id === id);
    if (!target) return;
    const newStatus = target.status === 'active' ? 'suspended' : 'active';
    updateUser(id, { status: newStatus });
    addActivityLog({
      type: 'user',
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action: newStatus === 'active' ? 'Activated User' : 'Suspended User',
      details: `Status for ${target.name} changed to ${newStatus}.`,
      severity: newStatus === 'active' ? 'success' : 'alert',
    });
    showToast(`Account for ${target.name} set to ${newStatus.toUpperCase()}`, 'info');
  };

  // Product Management (Seller & Admin)
  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewCount'>) => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      rating: 5.0,
      reviewCount: 1,
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => [newProduct, ...prev]);
    addActivityLog({
      type: 'product',
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action: 'Listed New Product',
      details: `Product "${newProduct.name}" listed under ${newProduct.category} at $${newProduct.price}.`,
      severity: 'success',
    });
    showToast(`Product "${newProduct.name}" successfully listed!`, 'success');
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    const prod = products.find((p) => p.id === id);
    addActivityLog({
      type: 'product',
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action: 'Updated Product Listing',
      details: `Updated attributes for "${prod ? prod.name : id}".`,
      severity: 'info',
    });
    showToast('Product updated successfully!', 'success');
  };

  const deleteProduct = (id: string) => {
    const prod = products.find((p) => p.id === id);
    if (!prod) return;
    setProducts((prev) => prev.filter((p) => p.id !== id));
    addActivityLog({
      type: 'product',
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action: 'Deleted Product Listing',
      details: `Removed listing "${prod.name}" from marketplace.`,
      severity: 'warning',
    });
    showToast(`Product "${prod.name}" removed from catalog.`, 'warning');
  };

  const updateProductStock = (id: string, newStock: number) => {
    const prod = products.find((p) => p.id === id);
    if (!prod) return;
    const validatedStock = Math.max(0, newStock);
    updateProduct(id, { stock: validatedStock });
    
    if (validatedStock <= prod.lowStockThreshold) {
      addActivityLog({
        type: 'system',
        actorName: 'Inventory Bot',
        actorRole: 'system',
        action: 'Low Stock Alert Triggered',
        details: `"${prod.name}" is low in stock (${validatedStock} remaining). Threshold: ${prod.lowStockThreshold}.`,
        severity: 'warning',
      });
      showToast(`Warning: Stock for "${prod.name}" is critically low (${validatedStock} left)`, 'warning');
    } else {
      showToast(`Updated stock of "${prod.name}" to ${validatedStock}`, 'info');
    }
  };

  const setProductCompliance = (id: string, status: ComplianceStatus) => {
    const prod = products.find((p) => p.id === id);
    if (!prod) return;
    updateProduct(id, { status });
    addActivityLog({
      type: 'product',
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action: `Compliance: ${status.replace('_', ' ').toUpperCase()}`,
      details: `Listing "${prod.name}" marked as ${status}.`,
      severity: status === 'approved' ? 'success' : 'alert',
    });
    showToast(`Compliance updated: "${prod.name}" is now ${status.toUpperCase()}`, 'info');
  };

  // Order Processing & Purchase Flow
  const placeOrder = (orderPayload: {
    buyerId: string;
    items: { productId: string; quantity: number }[];
    shippingAddress: any;
    paymentCard?: any;
    couponCode?: string;
    discountAmount: number;
  }): Order | null => {
    const buyer = users.find((u) => u.id === orderPayload.buyerId) || currentUser;

    const orderItems = orderPayload.items
      .map((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) return null;
        return {
          productId: product.id,
          productName: product.name,
          price: product.price,
          quantity: item.quantity,
          image: product.image,
          sellerId: product.sellerId,
        };
      })
      .filter(Boolean) as Order['items'];

    if (orderItems.length === 0) {
      showToast('Cannot place an empty order!', 'error');
      return null;
    }

    // Deduct stock
    orderItems.forEach((item) => {
      const prod = products.find((p) => p.id === item.productId);
      if (prod) {
        const remaining = Math.max(0, prod.stock - item.quantity);
        setProducts((prev) =>
          prev.map((p) => (p.id === prod.id ? { ...p, stock: remaining } : p))
        );
      }
    });

    const subtotal = orderItems.reduce((acc, it) => acc + it.price * it.quantity, 0);
    const shippingFee = subtotal > 150 ? 0 : 15;
    const totalAmount = Math.max(0, subtotal - orderPayload.discountAmount + shippingFee);

    const orderNumber = `OM-${Math.floor(10000 + Math.random() * 90000)}`;
    const trackingNumber = `TRK-US-${Math.floor(1000000 + Math.random() * 9000000)}`;

    const newOrder: Order = {
      id: `order-${Date.now()}`,
      orderNumber,
      buyerId: buyer.id,
      buyerName: buyer.name,
      buyerEmail: buyer.email,
      items: orderItems,
      subtotal,
      discountAmount: orderPayload.discountAmount,
      couponCode: orderPayload.couponCode,
      shippingFee,
      totalAmount,
      shippingAddress: orderPayload.shippingAddress,
      paymentCard: orderPayload.paymentCard,
      status: 'pending',
      trackingNumber,
      estimatedDelivery: 'Oct 16, 2026',
      createdAt: new Date().toISOString(),
      timeline: [
        {
          status: 'pending',
          label: 'Order Confirmed',
          timestamp: 'Just now',
          note: `Payment authorized. Total: $${totalAmount.toFixed(2)}`,
          completed: true,
        },
        {
          status: 'processing',
          label: 'Processing & Fulfillment',
          timestamp: 'Pending seller dispatch',
          note: 'Seller is preparing package.',
          completed: false,
        },
        {
          status: 'shipped',
          label: 'Dispatched to Carrier',
          timestamp: 'Carrier tracking pending',
          note: `Assigned tracking ${trackingNumber}`,
          completed: false,
        },
        {
          status: 'out_for_delivery',
          label: 'Out for Delivery',
          timestamp: 'Pending local courier',
          note: '',
          completed: false,
        },
        {
          status: 'delivered',
          label: 'Delivered',
          timestamp: 'Estimated Oct 16',
          note: '',
          completed: false,
        },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();

    addActivityLog({
      type: 'order',
      actorName: buyer.name,
      actorRole: 'buyer',
      action: `Placed Order #${orderNumber}`,
      details: `${orderItems.length} items purchased for $${totalAmount.toFixed(2)}.`,
      severity: 'success',
    });

    showToast(`Order #${orderNumber} placed successfully!`, 'success');
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus, note?: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    const statusOrder: OrderStatus[] = [
      'pending',
      'processing',
      'shipped',
      'out_for_delivery',
      'delivered',
    ];

    const currentIdx = statusOrder.indexOf(newStatus);

    const updatedTimeline = order.timeline.map((step) => {
      const stepIdx = statusOrder.indexOf(step.status);
      if (step.status === newStatus) {
        return {
          ...step,
          timestamp: 'Just now',
          note: note || step.note || `Status updated to ${newStatus}`,
          completed: true,
        };
      }
      if (stepIdx <= currentIdx && stepIdx !== -1) {
        return { ...step, completed: true };
      }
      return step;
    });

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: newStatus, timeline: updatedTimeline } : o
      )
    );

    addActivityLog({
      type: 'order',
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action: `Updated Order #${order.orderNumber} Status`,
      details: `Order status set to "${newStatus.replace('_', ' ').toUpperCase()}".`,
      severity: newStatus === 'cancelled' ? 'alert' : 'info',
    });

    showToast(
      `Order #${order.orderNumber} status updated to ${newStatus.replace('_', ' ').toUpperCase()}`,
      'success'
    );
  };

  const cancelOrder = (orderId: string, reason?: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    // Restore stock
    order.items.forEach((item) => {
      const prod = products.find((p) => p.id === item.productId);
      if (prod) {
        setProducts((prev) =>
          prev.map((p) => (p.id === prod.id ? { ...p, stock: p.stock + item.quantity } : p))
        );
      }
    });

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'cancelled',
              timeline: [
                ...o.timeline,
                {
                  status: 'cancelled',
                  label: 'Order Cancelled & Refunded',
                  timestamp: 'Just now',
                  note: reason || 'Cancelled by administrator or seller.',
                  completed: true,
                },
              ],
            }
          : o
      )
    );

    addActivityLog({
      type: 'order',
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action: `Cancelled Order #${order.orderNumber}`,
      details: `Order cancelled. Stock restored. Reason: ${reason || 'Customer request/System override'}.`,
      severity: 'alert',
    });

    showToast(`Order #${order.orderNumber} has been cancelled and refunded.`, 'warning');
  };

  // Cart actions
  const addToCart = (productId: string, quantity = 1) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;

    if (prod.stock < 1) {
      showToast(`Sorry, "${prod.name}" is currently out of stock!`, 'error');
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        const nextQty = Math.min(prod.stock, existing.quantity + quantity);
        return prev.map((item) =>
          item.productId === productId ? { ...item, quantity: nextQty } : item
        );
      }
      return [...prev, { productId, quantity: Math.min(prod.stock, quantity) }];
    });

    showToast(`Added "${prod.name}" to your cart!`, 'success');
  };

  const removeFromCart = (productId: string) => {
    const prod = products.find((p) => p.id === productId);
    setCart((prev) => prev.filter((item) => item.productId !== productId));
    if (prod) {
      showToast(`Removed "${prod.name}" from cart.`, 'info');
    }
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const prod = products.find((p) => p.id === productId);
    const validQty = prod ? Math.min(prod.stock, quantity) : quantity;
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity: validQty } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Wishlist actions
  const toggleWishlist = (productId: string) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;

    setWishlist((prev) => {
      const exists = prev.some((w) => w.productId === productId);
      if (exists) {
        showToast(`Removed "${prod.name}" from wishlist.`, 'info');
        return prev.filter((w) => w.productId !== productId);
      } else {
        showToast(`Saved "${prod.name}" to wishlist!`, 'success');
        return [
          { productId, addedAt: new Date().toISOString().split('T')[0], priceWhenAdded: prod.price },
          ...prev,
        ];
      }
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((w) => w.productId === productId);
  };

  // Browsing History
  const recordProductView = (productId: string) => {
    setBrowsingHistory((prev) => {
      const filtered = prev.filter((h) => h.productId !== productId);
      return [{ productId, viewedAt: 'Just now' }, ...filtered.slice(0, 19)];
    });
  };

  // Reset to seed data
  const resetToSeedData = () => {
    localStorage.clear();
    setUsers(INITIAL_USERS);
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setActivityLogs(INITIAL_ACTIVITIES);
    setBrowsingHistory(INITIAL_BROWSING_HISTORY);
    setWishlist(INITIAL_WISHLIST);
    setCart([{ productId: 'prod-101', quantity: 1 }]);
    setActiveRoleState('buyer');
    setCurrentUserId('user-buyer-1');
    setBuyerTab('store');
    setSellerTab('listings');
    setAdminTab('users');
    showToast('Platform reset to initial seed data!', 'success');
  };

  return (
    <StoreContext.Provider
      value={{
        activeRole,
        setActiveRole,
        currentUser,
        switchUser,
        buyerTab,
        setBuyerTab,
        sellerTab,
        setSellerTab,
        adminTab,
        setAdminTab,
        users,
        addUser,
        updateUser,
        deleteUser,
        toggleUserStatus,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        updateProductStock,
        setProductCompliance,
        orders,
        placeOrder,
        updateOrderStatus,
        cancelOrder,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        wishlist,
        toggleWishlist,
        isInWishlist,
        browsingHistory,
        recordProductView,
        activityLogs,
        addActivityLog,
        toasts,
        showToast,
        removeToast,
        selectedProductId,
        setSelectedProductId,
        selectedOrderId,
        setSelectedOrderId,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        isCheckoutModalOpen,
        setIsCheckoutModalOpen,
        resetToSeedData,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
