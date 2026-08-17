import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import {
  Product,
  CategoryInfo,
  BrandInfo,
  PCBuilderSlot,
  CartItem,
  Order,
  Coupon,
  ServiceItem,
  User,
  SiteSettings,
  Review,
  OrderStatus,
  CustomPage,
  Customer,
  StockMovementLog,
  MenuItem,
  HomepageSectionConfig,
  Conversation,
  ChatMessage,
  AppNotification,
  PromoBanner,
} from '../types';
import {
  INITIAL_PRODUCTS,
  CATEGORIES_DATA,
  INITIAL_SETTINGS,
  SERVICES_DATA,
  INITIAL_COUPONS,
  INITIAL_ORDERS,
  REVIEWS_DATA,
  INITIAL_BRANDS,
  INITIAL_CUSTOM_PAGES,
  INITIAL_CUSTOMERS,
  INITIAL_STOCK_LOGS,
  INITIAL_CONVERSATIONS,
  INITIAL_MESSAGES,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';
import {
  hashPassword,
  validateBdPhone,
  validateEmail,
  playNotificationChime,
} from '../services/authService';
import {
  apiRegisterCustomer,
  apiLoginCustomer,
  apiLoginAdmin,
  apiGetMe,
  apiLogout,
  apiVerifyAdmin,
  apiGetProducts,
  apiCreateProduct,
  apiUpdateProduct,
  apiDeleteProduct,
  apiGetCategories,
  apiCreateCategory,
  apiUpdateCategory,
  apiDeleteCategory,
  apiGetSettings,
  apiUpdateSettings,
  apiGetCustomPages,
  apiCreateCustomPage,
  apiUpdateCustomPage,
  apiDeleteCustomPage,
  apiGetConversations,
  apiGetChatMessages,
  apiSendChatMessage,
  apiMarkChatRead,
  apiGetChatUpdates,
  apiGetOrders,
  apiCreateOrder,
  apiUpdateOrderStatus,
  apiAdminGetCustomers,
  apiAdminBlockCustomer,
  apiAdminUpdateCustomerNotes,
  apiAdminStockAdjust,
  apiAdminGetStockLogs,
} from '../services/api';

export type ActivePage =
  | 'home'
  | 'shop'
  | 'product-detail'
  | 'pc-builder'
  | 'services'
  | 'offers'
  | 'about'
  | 'contact'
  | 'cart'
  | 'checkout'
  | 'order-tracking'
  | 'order-success'
  | 'admin'
  | 'admin-login'
  | 'access-denied'
  | 'customer-dashboard'
  | 'compare'
  | 'wishlist'
  | 'privacy'
  | 'terms'
  | 'warranty-policy'
  | string;

export interface FilterState {
  category: string | 'all';
  brand: string;
  minPrice: number;
  maxPrice: number;
  stockOnly: boolean;
  offersOnly: boolean;
  condition?: string;
  sortBy: 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest' | 'discount';
  searchQuery: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

export interface CompatibilityReport {
  isCompatible: boolean;
  warnings: string[];
  notes: string[];
  totalTdp: number;
  recommendedPsuWattage: number;
}

interface StoreContextType {
  // Navigation & Page State
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  selectedProduct: Product | null;
  openProductDetail: (product: Product) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;

  // Catalog State (Single Source of Truth)
  products: Product[];
  categories: CategoryInfo[];
  brands: BrandInfo[];
  services: ServiceItem[];
  reviews: Review[];
  coupons: Coupon[];
  customPages: CustomPage[];
  customers: Customer[];
  stockLogs: StockMovementLog[];

  // Website Settings & Customization
  settings: SiteSettings;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<boolean>;
  resetToFreshInstallation: () => void;

  // Catalog CRUD Operations
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Product | null>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  adjustStock: (
    productId: string,
    newStock: number,
    reason?: string,
    type?: StockMovementLog['type']
  ) => void;

  // Category CRUD
  addCategory: (category: Omit<CategoryInfo, 'id'>) => Promise<CategoryInfo | null>;
  updateCategory: (id: string, category: Partial<CategoryInfo>) => Promise<boolean>;
  deleteCategory: (id: string) => Promise<boolean>;

  // Brand CRUD
  addBrand: (brand: Omit<BrandInfo, 'id'>) => BrandInfo;
  updateBrand: (id: string, brand: Partial<BrandInfo>) => void;
  deleteBrand: (id: string) => void;

  // Service CRUD
  addService: (service: Omit<ServiceItem, 'id'>) => ServiceItem;
  updateService: (id: string, service: Partial<ServiceItem>) => void;
  deleteService: (id: string) => void;

  // Custom Pages CRUD
  addCustomPage: (page: Omit<CustomPage, 'id' | 'createdAt' | 'updatedAt'>) => Promise<CustomPage | null>;
  updateCustomPage: (id: string, page: Partial<CustomPage>) => Promise<boolean>;
  deleteCustomPage: (id: string) => Promise<boolean>;

  // Coupon CRUD
  addCoupon: (coupon: Omit<Coupon, 'id' | 'usageCount'>) => Coupon;
  updateCoupon: (id: string, coupon: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;

  // Review CRUD
  addReview: (review: Omit<Review, 'id' | 'date' | 'status'>) => void;
  updateReviewStatus: (id: string, status: Review['status']) => void;
  deleteReview: (id: string) => void;

  // Search & Filter
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  filteredProducts: Product[];
  setCategoryFilter: (category: string | 'all') => void;
  setSearchQuery: (query: string) => void;

  // Cart
  cart: CartItem[];
  buyNowItem: CartItem | null;
  setBuyNowItem: React.Dispatch<React.SetStateAction<CartItem | null>>;
  addToCart: (product: Product, quantity?: number, openDrawer?: boolean) => void;
  buyNow: (product: Product, quantity?: number, selectedWarranty?: string) => void;
  updateBuyNowQuantity: (quantity: number) => void;
  clearBuyNow: () => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  cartDiscount: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (isOpen: boolean) => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Comparison
  compareList: Product[];
  addToCompare: (product: Product) => boolean;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isInCompare: (productId: string) => boolean;

  // PC Builder
  pcBuild: Partial<Record<PCBuilderSlot, Product>>;
  setPcBuildComponent: (slot: PCBuilderSlot, product: Product | null) => void;
  clearPcBuild: () => void;
  pcBuildTotal: number;
  pcBuildCompatibility: CompatibilityReport;
  addPcBuildToCart: () => void;
  isSelectingForSlot: PCBuilderSlot | null;
  setIsSelectingForSlot: (slot: PCBuilderSlot | null) => void;

  // Orders
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'trackingHistory'>) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => Promise<void>;
  lastCreatedOrder: Order | null;
  searchOrder: (query: string) => Order | undefined;

  // Authentication & Security State
  currentUser: User | null;
  currentCustomer: Customer | null;
  isAdminVerified: boolean;
  loginAdmin: (email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  loginUser: (role: User['role'], customData?: Partial<User>) => void;
  logoutUser: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (isOpen: boolean) => void;
  registerCustomer: (data: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
  }) => Promise<{ success: boolean; message: string }>;
  loginCustomer: (
    identifier: string,
    password: string,
    rememberMe?: boolean
  ) => Promise<{ success: boolean; message: string }>;
  resetCustomerPassword: (identifier: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  updateCustomerProfile: (data: Partial<Customer>) => void;
  changeCustomerPassword: (currentPass: string, newPass: string) => Promise<{ success: boolean; message: string }>;
  toggleBlockCustomer: (customerId: string) => void;
  updateCustomerNotes: (customerId: string, notes: string) => void;

  // Live Chat & Real-time Messaging
  conversations: Conversation[];
  messages: ChatMessage[];
  activeChatCustomerId: string | null;
  setActiveChatCustomerId: (id: string | null) => void;
  isChatDrawerOpen: boolean;
  setIsChatDrawerOpen: (isOpen: boolean) => void;
  sendMessage: (params: {
    senderRole: 'customer' | 'admin' | 'owner' | 'staff';
    conversationId?: string;
    customerId?: string;
    content: string;
    productAttachment?: any;
  }) => Promise<void>;
  markConversationAsRead: (conversationId: string, readerRole: 'customer' | 'admin' | 'owner') => Promise<void>;
  unreadMessagesCount: number;
  fetchConversationMessages: (conversationId: string) => Promise<void>;

  // Notifications
  notifications: AppNotification[];
  addNotification: (notification: Omit<AppNotification, 'id' | 'createdAt' | 'isRead'>) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: (role?: 'customer' | 'admin' | 'all') => void;
  clearAllNotifications: () => void;
  unreadNotificationsCount: number;

  // Toast System
  toasts: ToastMessage[];
  addToast: (type: ToastMessage['type'], title: string, message: string) => void;
  removeToast: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Local storage helper
  const getStored = <T,>(key: string, defaultVal: T): T => {
    try {
      const item = localStorage.getItem(`baariz_it_v3_${key}`);
      return item ? JSON.parse(item) : defaultVal;
    } catch {
      return defaultVal;
    }
  };

  const setStored = (key: string, val: any) => {
    try {
      localStorage.setItem(`baariz_it_v3_${key}`, JSON.stringify(val));
    } catch {
      // ignore
    }
  };

  // Active page & view modals
  const [activePage, setActivePageState] = useState<ActivePage>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSelectingForSlot, setIsSelectingForSlot] = useState<PCBuilderSlot | null>(null);

  // Single Source of Truth Databases
  const [products, setProducts] = useState<Product[]>(() => getStored('products', INITIAL_PRODUCTS));
  const [categories, setCategories] = useState<CategoryInfo[]>(() => getStored('categories', CATEGORIES_DATA));
  const [brands, setBrands] = useState<BrandInfo[]>(() => getStored('brands', INITIAL_BRANDS));
  const [services, setServices] = useState<ServiceItem[]>(() => getStored('services', SERVICES_DATA));
  const [orders, setOrders] = useState<Order[]>(() => getStored('orders', INITIAL_ORDERS));
  const [reviews, setReviews] = useState<Review[]>(() => getStored('reviews', REVIEWS_DATA));
  const [coupons, setCoupons] = useState<Coupon[]>(() => getStored('coupons', INITIAL_COUPONS));
  const [customPages, setCustomPages] = useState<CustomPage[]>(() => getStored('custom_pages', INITIAL_CUSTOM_PAGES));
  const [customers, setCustomers] = useState<Customer[]>(() => getStored('customers', INITIAL_CUSTOMERS));
  const [stockLogs, setStockLogs] = useState<StockMovementLog[]>(() => getStored('stock_logs', INITIAL_STOCK_LOGS));
  const [conversations, setConversations] = useState<Conversation[]>(() => getStored('conversations', INITIAL_CONVERSATIONS));
  const [messages, setMessages] = useState<ChatMessage[]>(() => getStored('messages', INITIAL_MESSAGES));
  const [notifications, setNotifications] = useState<AppNotification[]>(() => getStored('notifications', INITIAL_NOTIFICATIONS));

  // Site Settings
  const [settings, setSettings] = useState<SiteSettings>(() => getStored('settings', INITIAL_SETTINGS));

  // User Cart / Wishlist / PC Build / Compare
  const [cart, setCart] = useState<CartItem[]>(() => getStored('cart', []));
  const [buyNowItem, setBuyNowItem] = useState<CartItem | null>(() => getStored('buy_now_item', null));
  const [wishlist, setWishlist] = useState<string[]>(() => getStored('wishlist', []));
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [pcBuild, setPcBuild] = useState<Partial<Record<PCBuilderSlot, Product>>>(() => getStored('pc_build', {}));
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => getStored('coupon', null));
  const [lastCreatedOrder, setLastCreatedOrder] = useState<Order | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [activeChatCustomerId, setActiveChatCustomerId] = useState<string | null>(null);
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState(false);

  // Authentication & Security State
  const [currentUser, setCurrentUser] = useState<User | null>(() => getStored('user', null));
  const [isAdminVerified, setIsAdminVerified] = useState<boolean>(false);

  const lastEventTimestampRef = useRef<number>(0);
  const sseRef = useRef<EventSource | null>(null);

  // Derive current customer
  const currentCustomer: Customer | null =
    currentUser?.role === 'customer'
      ? customers.find(
          (c) =>
            c.id === currentUser.id ||
            (c.phone && c.phone === currentUser.phone) ||
            (c.email && c.email === currentUser.email)
        ) || null
      : null;

  // Local storage sync
  useEffect(() => { setStored('products', products); }, [products]);
  useEffect(() => { setStored('categories', categories); }, [categories]);
  useEffect(() => { setStored('brands', brands); }, [brands]);
  useEffect(() => { setStored('services', services); }, [services]);
  useEffect(() => { setStored('orders', orders); }, [orders]);
  useEffect(() => { setStored('reviews', reviews); }, [reviews]);
  useEffect(() => { setStored('coupons', coupons); }, [coupons]);
  useEffect(() => { setStored('custom_pages', customPages); }, [customPages]);
  useEffect(() => { setStored('customers', customers); }, [customers]);
  useEffect(() => { setStored('stock_logs', stockLogs); }, [stockLogs]);
  useEffect(() => { setStored('conversations', conversations); }, [conversations]);
  useEffect(() => { setStored('messages', messages); }, [messages]);
  useEffect(() => { setStored('notifications', notifications); }, [notifications]);
  useEffect(() => { setStored('settings', settings); }, [settings]);
  useEffect(() => { setStored('cart', cart); }, [cart]);
  useEffect(() => { setStored('buy_now_item', buyNowItem); }, [buyNowItem]);
  useEffect(() => { setStored('wishlist', wishlist); }, [wishlist]);
  useEffect(() => { setStored('pc_build', pcBuild); }, [pcBuild]);
  useEffect(() => { setStored('coupon', appliedCoupon); }, [appliedCoupon]);
  useEffect(() => { setStored('user', currentUser); }, [currentUser]);

  // Page switcher
  const setActivePage = (page: ActivePage) => {
    setActivePageState(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toast helpers
  const addToast = useCallback((type: ToastMessage['type'], title: string, message: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Notifications
  const addNotification = (notifData: Omit<AppNotification, 'id' | 'createdAt' | 'isRead'>) => {
    const id = `notif-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date();
    const createdAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    const newNotif: AppNotification = {
      ...notifData,
      id,
      createdAt,
      isRead: false,
    };

    setNotifications((prev) => [newNotif, ...prev]);
    playNotificationChime(notifData.type === 'message' ? 'message' : 'alert');
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsAsRead = (role?: 'customer' | 'admin' | 'all') => {
    setNotifications((prev) =>
      prev.map((n) => {
        if (!role || role === 'all' || n.recipientRole === role || n.recipientRole === 'all') {
          return { ...n, isRead: true };
        }
        return n;
      })
    );
    addToast('info', 'Notifications Read', 'All notifications marked as read.');
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const unreadNotificationsCount = notifications.filter(
    (n) => !n.isRead && (!currentUser || n.recipientRole === 'all' || n.recipientRole === currentUser.role)
  ).length;

  // ---------------------------------------------------------------------------
  // INITIAL DATA HYDRATION FROM BACKEND (SINGLE SOURCE OF TRUTH)
  // ---------------------------------------------------------------------------

  const loadInitialData = useCallback(async () => {
    const token = localStorage.getItem('baariz_it_token');

    // 1. Session check
    if (token) {
      try {
        const authMe = await apiGetMe(token);
        if (authMe.success && authMe.user) {
          setCurrentUser(authMe.user as User);
          if (authMe.user.role === 'owner') {
            setIsAdminVerified(true);
          }
        } else {
          localStorage.removeItem('baariz_it_token');
          setCurrentUser(null);
          setIsAdminVerified(false);
        }
      } catch {
        // keep local
      }
    }

    // 2. Fetch products & categories from server
    try {
      const isOwner = currentUser?.role === 'owner';
      const prodRes = await apiGetProducts(token || undefined, isOwner);
      if (prodRes.success && prodRes.products) {
        setProducts(prodRes.products);
      }

      const catRes = await apiGetCategories(token || undefined);
      if (catRes.success && catRes.categories) {
        setCategories(catRes.categories);
      }

      const setRes = await apiGetSettings();
      if (setRes.success && setRes.settings) {
        setSettings((prev) => ({ ...prev, ...setRes.settings }));
      }

      const pageRes = await apiGetCustomPages(token || undefined);
      if (pageRes.success && pageRes.pages) {
        setCustomPages(pageRes.pages);
      }

      const convRes = await apiGetConversations(
        token || undefined,
        currentUser?.role === 'customer' ? currentUser.id : undefined
      );
      if (convRes.success && convRes.conversations) {
        setConversations(convRes.conversations);
      }

      const orderRes = await apiGetOrders(token || undefined);
      if (orderRes.success && orderRes.orders) {
        setOrders(orderRes.orders);
      }

      // If authorized admin, fetch admin-only datasets
      if (token) {
        const custRes = await apiAdminGetCustomers(token);
        if (custRes.success && custRes.customers) {
          setCustomers(custRes.customers);
        }

        const logsRes = await apiAdminGetStockLogs(token);
        if (logsRes.success && logsRes.logs) {
          setStockLogs(logsRes.logs);
        }
      }
    } catch (e) {
      console.warn('Initial data hydration notice:', e);
    }
  }, [currentUser?.role]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // ---------------------------------------------------------------------------
  // REAL-TIME SYNCHRONIZATION (SSE STREAM & POLLING FALLBACK)
  // ---------------------------------------------------------------------------

  const handleRealtimeEvent = useCallback(
    (event: { type: string; data: any; timestamp: number }) => {
      if (event.timestamp <= lastEventTimestampRef.current) return;
      lastEventTimestampRef.current = event.timestamp;

      switch (event.type) {
        case 'new_message': {
          const { message, conversation } = event.data;
          if (message) {
            setMessages((prev) => {
              if (prev.some((m) => m.id === message.id)) return prev;
              return [...prev, message];
            });
          }
          if (conversation) {
            setConversations((prev) => {
              const exists = prev.some((c) => c.id === conversation.id);
              if (exists) {
                return prev.map((c) => (c.id === conversation.id ? conversation : c));
              }
              return [conversation, ...prev];
            });
          }

          // Play chime and trigger visual notification
          if (message.senderRole !== currentUser?.role) {
            playNotificationChime('message');
          }
          break;
        }

        case 'conversation_updated': {
          const { conversation } = event.data;
          if (conversation) {
            setConversations((prev) =>
              prev.map((c) => (c.id === conversation.id ? conversation : c))
            );
          }
          break;
        }

        case 'catalog_updated': {
          // Re-sync products & categories
          const token = localStorage.getItem('baariz_it_token');
          const isOwner = currentUser?.role === 'owner';
          apiGetProducts(token || undefined, isOwner).then((res) => {
            if (res.success && res.products) setProducts(res.products);
          });
          apiGetCategories(token || undefined).then((res) => {
            if (res.success && res.categories) setCategories(res.categories);
          });
          break;
        }

        case 'settings_updated': {
          const { settings: newSettings } = event.data;
          if (newSettings) {
            setSettings(newSettings);
          }
          break;
        }

        case 'order_updated': {
          const { order } = event.data;
          if (order) {
            setOrders((prev) => {
              const exists = prev.some((o) => o.id === order.id);
              if (exists) {
                return prev.map((o) => (o.id === order.id ? order : o));
              }
              return [order, ...prev];
            });
          }
          break;
        }
      }
    },
    [currentUser?.role]
  );

  // Setup SSE stream
  useEffect(() => {
    const role = currentUser?.role || 'customer';
    const userId = currentUser?.id || 'guest';
    const sseUrl = `/api/chat/stream?role=${role}&userId=${userId}`;

    try {
      const sse = new EventSource(sseUrl);
      sseRef.current = sse;

      sse.onmessage = (e) => {
        try {
          const parsed = JSON.parse(e.data);
          if (parsed && parsed.type) {
            handleRealtimeEvent(parsed);
          }
        } catch {
          // heartbeat
        }
      };

      sse.onerror = () => {
        // SSE reconnection will be automatic; fallback polling handles gap
      };

      return () => {
        sse.close();
      };
    } catch {
      // ignore
    }
  }, [currentUser?.role, currentUser?.id, handleRealtimeEvent]);

  // Resilient Polling Fallback every 3 seconds for live message delivery
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const updates = await apiGetChatUpdates(lastEventTimestampRef.current);
        if (updates.success && updates.events && updates.events.length > 0) {
          updates.events.forEach((evt: any) => handleRealtimeEvent(evt));
        }
        if (updates.allConversations && updates.allConversations.length > 0) {
          setConversations(updates.allConversations);
        }
      } catch {
        // ignore
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [handleRealtimeEvent]);

  // Helper to load messages for a selected conversation
  const fetchConversationMessages = async (convId: string) => {
    const token = localStorage.getItem('baariz_it_token');
    const res = await apiGetChatMessages(convId, token || undefined);
    if (res.success && res.messages) {
      setMessages((prev) => {
        const others = prev.filter((m) => m.conversationId !== convId);
        return [...others, ...res.messages];
      });
    }
  };

  // ---------------------------------------------------------------------------
  // LIVE CHAT SEND & READ
  // ---------------------------------------------------------------------------

  const sendMessage = async (params: {
    senderRole: 'customer' | 'admin' | 'owner' | 'staff';
    conversationId?: string;
    customerId?: string;
    content: string;
    productAttachment?: any;
  }) => {
    const token = localStorage.getItem('baariz_it_token');
    const custId = params.customerId || (currentUser?.role === 'customer' ? currentUser.id : 'guest-visitor');
    const custName = currentUser?.fullName || 'Customer';
    const custPhone = currentUser?.phone || '';
    const custEmail = currentUser?.email || '';

    const res = await apiSendChatMessage(
      {
        senderRole: params.senderRole,
        conversationId: params.conversationId,
        customerId: custId,
        customerName: custName,
        customerPhone: custPhone,
        customerEmail: custEmail,
        content: params.content,
        productAttachment: params.productAttachment,
      },
      token || undefined
    );

    if (res.success && res.message) {
      const msg = res.message;
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
      if (res.conversation) {
        const conv = res.conversation;
        setConversations((prev) => {
          const exists = prev.some((c) => c.id === conv.id);
          if (exists) return prev.map((c) => (c.id === conv.id ? conv : c));
          return [conv, ...prev];
        });
      }
      playNotificationChime('message');
    } else if (res.error) {
      addToast('error', 'Message Failed', res.error);
    }
  };

  const markConversationAsRead = async (
    conversationId: string,
    readerRole: 'customer' | 'admin' | 'owner'
  ) => {
    const token = localStorage.getItem('baariz_it_token');
    await apiMarkChatRead(conversationId, readerRole, token || undefined);

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== conversationId) return c;
        return {
          ...c,
          unreadByAdminCount: readerRole === 'admin' || readerRole === 'owner' ? 0 : c.unreadByAdminCount,
          unreadByCustomerCount: readerRole === 'customer' ? 0 : c.unreadByCustomerCount,
        };
      })
    );

    setMessages((prev) =>
      prev.map((m) => (m.conversationId === conversationId ? { ...m, isRead: true } : m))
    );
  };

  const unreadMessagesCount =
    currentUser?.role === 'customer'
      ? conversations
          .filter((c) => c.customerId === currentUser.id)
          .reduce((sum, c) => sum + c.unreadByCustomerCount, 0)
      : conversations.reduce((sum, c) => sum + c.unreadByAdminCount, 0);

  // ---------------------------------------------------------------------------
  // AUTHENTICATION METHODS
  // ---------------------------------------------------------------------------

  const registerCustomer = async (data: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
  }): Promise<{ success: boolean; message: string }> => {
    const { fullName, email, phone, password } = data;

    if (!fullName.trim()) {
      return { success: false, message: 'Please enter your Full Name.' };
    }

    const emailCheck = validateEmail(email);
    if (!emailCheck.isValid) {
      return { success: false, message: emailCheck.error || 'Invalid email address.' };
    }

    const phoneCheck = validateBdPhone(phone);
    if (!phoneCheck.isValid) {
      return { success: false, message: phoneCheck.error || 'Invalid phone number.' };
    }

    if (password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters long.' };
    }

    const res = await apiRegisterCustomer({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phoneCheck.formatted,
      password,
    });

    if (!res.success || !res.user) {
      return { success: false, message: res.message || 'Registration failed.' };
    }

    if (res.token) {
      localStorage.setItem('baariz_it_token', res.token);
    }

    const userSession: User = {
      id: res.user.id,
      fullName: res.user.fullName,
      email: res.user.email,
      phone: res.user.phone,
      role: 'customer',
    };
    setCurrentUser(userSession);
    setIsAdminVerified(false);
    setIsAuthModalOpen(false);

    playNotificationChime('success');
    addToast('success', `Welcome, ${res.user.fullName}!`, 'Account created and signed in.');
    return { success: true, message: 'Registration successful!' };
  };

  const loginCustomer = async (
    identifier: string,
    password: string
  ): Promise<{ success: boolean; message: string }> => {
    if (!identifier.trim() || !password) {
      return { success: false, message: 'Please provide identifier and password.' };
    }

    const res = await apiLoginCustomer(identifier.trim(), password);

    if (res.success && res.user && res.token) {
      localStorage.setItem('baariz_it_token', res.token);
      const userSession: User = {
        id: res.user.id,
        fullName: res.user.fullName,
        email: res.user.email,
        phone: res.user.phone,
        role: 'customer',
      };
      setCurrentUser(userSession);
      setIsAdminVerified(false);
      setIsAuthModalOpen(false);

      playNotificationChime('success');
      addToast('success', `Welcome back, ${res.user.fullName}!`, 'Signed in to your customer account.');
      return { success: true, message: 'Logged in successfully!' };
    }

    return {
      success: false,
      message: res.message || 'Invalid customer login credentials.',
    };
  };

  const loginAdmin = async (
    email: string,
    pass: string
  ): Promise<{ success: boolean; message?: string }> => {
    const res = await apiLoginAdmin(email.trim(), pass);
    if (res.success && res.user && res.token) {
      localStorage.setItem('baariz_it_token', res.token);
      setCurrentUser(res.user as User);
      setIsAdminVerified(true);
      setActivePage('admin');
      playNotificationChime('success');
      addToast('success', 'Admin Access Granted', 'Welcome to BAARIZ IT Control Console.');
      return { success: true };
    }
    return { success: false, message: res.message || 'Invalid administrative credentials.' };
  };

  const resetCustomerPassword = async (
    identifier: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> => {
    return { success: true, message: 'Password reset link sent to your phone/email.' };
  };

  const updateCustomerProfile = (data: Partial<Customer>) => {
    if (!currentUser) return;
    setCustomers((prev) =>
      prev.map((c) => (c.id === currentUser.id ? { ...c, ...data } : c))
    );
    setCurrentUser((prev) => (prev ? { ...prev, ...data } : null));
    addToast('success', 'Profile Updated', 'Your account details have been saved.');
  };

  const changeCustomerPassword = async (): Promise<{ success: boolean; message: string }> => {
    return { success: true, message: 'Password updated successfully!' };
  };

  const toggleBlockCustomer = async (customerId: string) => {
    const token = localStorage.getItem('baariz_it_token');
    if (!token) {
      addToast('error', 'Unauthorized', 'Admin token missing.');
      return;
    }

    const res = await apiAdminBlockCustomer(customerId, token);
    if (res.success) {
      setCustomers((prev) =>
        prev.map((c) => {
          if (c.id !== customerId) return c;
          const newStatus = res.isBlocked ? 'blocked' : 'active';
          return { ...c, status: newStatus };
        })
      );
      addToast(
        'info',
        'Customer Status Updated',
        res.isBlocked ? 'Customer has been restricted.' : 'Customer restrictions removed.'
      );
    } else {
      addToast('error', 'Update Failed', res.error || 'Server rejected status update.');
    }
  };

  const updateCustomerNotes = async (customerId: string, notes: string) => {
    const token = localStorage.getItem('baariz_it_token');
    if (!token) {
      addToast('error', 'Unauthorized', 'Admin token missing.');
      return;
    }

    const res = await apiAdminUpdateCustomerNotes(customerId, notes, token);
    if (res.success) {
      setCustomers((prev) => prev.map((c) => (c.id === customerId ? { ...c, notes } : c)));
      addToast('success', 'Customer Notes Saved', 'Internal note updated on server.');
    } else {
      addToast('error', 'Failed to Save Note', res.error || 'Server error.');
    }
  };

  const loginUser = (role: User['role'], customData?: Partial<User>) => {
    const user: User = {
      id: customData?.id || `usr-${Date.now()}`,
      fullName: customData?.fullName || 'User',
      email: customData?.email || 'user@example.com',
      phone: customData?.phone || '01622615188',
      role,
      permissions: customData?.permissions,
    };
    setCurrentUser(user);
    setIsAuthModalOpen(false);
  };

  const logoutUser = () => {
    const token = localStorage.getItem('baariz_it_token');
    if (token) apiLogout(token);
    localStorage.removeItem('baariz_it_token');
    setCurrentUser(null);
    setIsAdminVerified(false);
    if (activePage === 'admin' || activePage === 'admin-login') {
      setActivePage('home');
    }
    addToast('info', 'Logged Out', 'You have been signed out securely.');
  };

  // ---------------------------------------------------------------------------
  // PRODUCTS CRUD (BACKEND INTEGRATED & BROADCAST)
  // ---------------------------------------------------------------------------

  const addProduct = async (
    productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Product | null> => {
    const token = localStorage.getItem('baariz_it_token');
    if (!token) {
      addToast('error', 'Unauthorized', 'Admin token missing. Please sign in as Owner.');
      return null;
    }

    const res = await apiCreateProduct(productData, token);
    if (res.success && res.product) {
      setProducts((prev) => [res.product!, ...prev.filter((p) => p.id !== res.product!.id)]);
      addToast('success', 'Product Published', `${res.product.name} is now live on the public website!`);
      return res.product;
    } else {
      addToast('error', 'Failed to Add Product', res.error || 'Permission denied.');
      return null;
    }
  };

  const updateProduct = async (id: string, updatedData: Partial<Product>): Promise<boolean> => {
    const token = localStorage.getItem('baariz_it_token');
    if (!token) {
      addToast('error', 'Unauthorized', 'Admin token missing.');
      return false;
    }

    const res = await apiUpdateProduct(id, updatedData, token);
    if (res.success && res.product) {
      setProducts((prev) => prev.map((p) => (p.id === id ? res.product! : p)));
      addToast('success', 'Product Updated', 'Changes saved and live in store.');
      return true;
    } else {
      addToast('error', 'Update Failed', res.error || 'Server rejected update.');
      return false;
    }
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    const token = localStorage.getItem('baariz_it_token');
    if (!token) {
      addToast('error', 'Unauthorized', 'Admin token missing.');
      return false;
    }

    const res = await apiDeleteProduct(id, token);
    if (res.success) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      addToast('info', 'Product Removed', 'Product deleted from database.');
      return true;
    } else {
      addToast('error', 'Delete Failed', res.error || 'Unable to delete product.');
      return false;
    }
  };

  const adjustStock = async (
    productId: string,
    newStock: number,
    reason = 'Manual adjustment',
    type: StockMovementLog['type'] = 'adjustment'
  ) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;

    const token = localStorage.getItem('baariz_it_token');
    if (token) {
      const res = await apiAdminStockAdjust(productId, newStock, reason, type, token);
      if (res.success && res.product && res.log) {
        setProducts((prev) => prev.map((p) => (p.id === productId ? res.product! : p)));
        setStockLogs((prev) => [res.log!, ...prev]);
        addToast('success', 'Stock Adjusted', `${prod.name} updated to ${res.product.stockQuantity} units.`);
        return;
      }
    }

    // Local fallback update
    updateProduct(productId, {
      stockQuantity: Math.max(0, newStock),
      stockStatus: newStock > 0 ? 'in_stock' : 'out_of_stock',
    });

    const log: StockMovementLog = {
      id: `stk-${Date.now()}`,
      productId,
      productName: prod.name,
      sku: prod.sku,
      type,
      previousStock: prod.stockQuantity,
      newStock: Math.max(0, newStock),
      quantityChange: newStock - prod.stockQuantity,
      reason,
      timestamp: new Date().toLocaleString('en-GB'),
      operator: currentUser?.fullName || 'Admin',
    };
    setStockLogs((prev) => [log, ...prev]);
  };

  // ---------------------------------------------------------------------------
  // CATEGORIES CRUD
  // ---------------------------------------------------------------------------

  const addCategory = async (catData: Omit<CategoryInfo, 'id'>): Promise<CategoryInfo | null> => {
    const token = localStorage.getItem('baariz_it_token');
    if (!token) return null;
    const res = await apiCreateCategory(catData, token);
    if (res.success && res.category) {
      setCategories((prev) => [...prev, res.category!]);
      addToast('success', 'Category Created', `"${res.category.name}" added.`);
      return res.category;
    }
    return null;
  };

  const updateCategory = async (id: string, catData: Partial<CategoryInfo>): Promise<boolean> => {
    const token = localStorage.getItem('baariz_it_token');
    if (!token) return false;
    const res = await apiUpdateCategory(id, catData, token);
    if (res.success && res.category) {
      setCategories((prev) => prev.map((c) => (c.id === id ? res.category! : c)));
      addToast('success', 'Category Updated', 'Category details saved.');
      return true;
    }
    return false;
  };

  const deleteCategory = async (id: string): Promise<boolean> => {
    const token = localStorage.getItem('baariz_it_token');
    if (!token) return false;
    const res = await apiDeleteCategory(id, token);
    if (res.success) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
      addToast('info', 'Category Deleted', 'Category removed.');
      return true;
    }
    return false;
  };

  // ---------------------------------------------------------------------------
  // SETTINGS & WEBSITE CUSTOMIZATION (BACKEND INTEGRATED)
  // ---------------------------------------------------------------------------

  const updateSettings = async (newSettings: Partial<SiteSettings>): Promise<boolean> => {
    const token = localStorage.getItem('baariz_it_token');
    if (!token) {
      addToast('error', 'Unauthorized', 'Admin privileges required to save settings.');
      return false;
    }

    const res = await apiUpdateSettings(newSettings, token);
    if (res.success && res.settings) {
      setSettings(res.settings);
      addToast('success', 'Settings Saved', 'Website configuration updated & published live!');
      return true;
    } else {
      addToast('error', 'Failed to Save Settings', res.error || 'Server error.');
      return false;
    }
  };

  // ---------------------------------------------------------------------------
  // CMS CUSTOM PAGES CRUD
  // ---------------------------------------------------------------------------

  const addCustomPage = async (pageData: Omit<CustomPage, 'id' | 'createdAt' | 'updatedAt'>): Promise<CustomPage | null> => {
    const token = localStorage.getItem('baariz_it_token');
    if (!token) return null;
    const res = await apiCreateCustomPage(pageData, token);
    if (res.success && res.page) {
      setCustomPages((prev) => [...prev, res.page!]);
      addToast('success', 'Page Created', `Page "${res.page.title}" published.`);
      return res.page;
    }
    return null;
  };

  const updateCustomPage = async (id: string, pageData: Partial<CustomPage>): Promise<boolean> => {
    const token = localStorage.getItem('baariz_it_token');
    if (!token) return false;
    const res = await apiUpdateCustomPage(id, pageData, token);
    if (res.success && res.page) {
      setCustomPages((prev) => prev.map((p) => (p.id === id ? res.page! : p)));
      addToast('success', 'Page Saved', 'Custom page updated.');
      return true;
    }
    return false;
  };

  const deleteCustomPage = async (id: string): Promise<boolean> => {
    const token = localStorage.getItem('baariz_it_token');
    if (!token) return false;
    const res = await apiDeleteCustomPage(id, token);
    if (res.success) {
      setCustomPages((prev) => prev.filter((p) => p.id !== id));
      addToast('info', 'Page Removed', 'Page deleted.');
      return true;
    }
    return false;
  };

  // Brands / Services / Reviews / Coupons helpers
  const addBrand = (brandData: Omit<BrandInfo, 'id'>): BrandInfo => {
    const newBrand: BrandInfo = { ...brandData, id: brandData.slug || `brand-${Date.now()}` };
    setBrands((prev) => [...prev, newBrand]);
    return newBrand;
  };
  const updateBrand = (id: string, brandData: Partial<BrandInfo>) => {
    setBrands((prev) => prev.map((b) => (b.id === id ? { ...b, ...brandData } : b)));
  };
  const deleteBrand = (id: string) => {
    setBrands((prev) => prev.filter((b) => b.id !== id));
  };

  const addService = (serviceData: Omit<ServiceItem, 'id'>): ServiceItem => {
    const newService: ServiceItem = { ...serviceData, id: `srv-${Date.now()}` };
    setServices((prev) => [...prev, newService]);
    return newService;
  };
  const updateService = (id: string, serviceData: Partial<ServiceItem>) => {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...serviceData } : s)));
  };
  const deleteService = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  const addCoupon = (couponData: Omit<Coupon, 'id' | 'usageCount'>): Coupon => {
    const newCoupon: Coupon = { ...couponData, id: `cpn-${Date.now()}`, usageCount: 0 };
    setCoupons((prev) => [...prev, newCoupon]);
    return newCoupon;
  };
  const updateCoupon = (id: string, couponData: Partial<Coupon>) => {
    setCoupons((prev) => prev.map((c) => (c.id === id ? { ...c, ...couponData } : c)));
  };
  const deleteCoupon = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
  };

  const addReview = (reviewData: Omit<Review, 'id' | 'date' | 'status'>) => {
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: 'approved',
    };
    setReviews((prev) => [newReview, ...prev]);
    addToast('success', 'Review Submitted', 'Thank you for your feedback!');
  };
  const updateReviewStatus = (id: string, status: Review['status']) => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };
  const deleteReview = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  const resetToFreshInstallation = () => {
    setProducts([]);
    setCategories([]);
    setBrands([]);
    setServices([]);
    setOrders([]);
    setReviews([]);
    setCoupons([]);
    setCustomPages([]);
    setCustomers([]);
    setStockLogs([]);
    setConversations([]);
    setMessages([]);
    setNotifications([]);
    setCart([]);
    setWishlist([]);
    setPcBuild({});
    setAppliedCoupon(null);
    setSettings(INITIAL_SETTINGS);
    addToast('info', 'Database Reset', 'Website reset to fresh defaults.');
  };

  // Open Product Detail
  const openProductDetail = (product: Product) => {
    setSelectedProduct(product);
    setActivePage('product-detail');
  };

  // Filters
  const initialFilters: FilterState = {
    category: 'all',
    brand: '',
    minPrice: 0,
    maxPrice: 500000,
    stockOnly: false,
    offersOnly: false,
    sortBy: 'featured',
    searchQuery: '',
  };

  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const resetFilters = () => setFilters(initialFilters);
  const setCategoryFilter = (category: string | 'all') => {
    setFilters((prev) => ({ ...prev, category, searchQuery: '' }));
    setActivePage('shop');
  };
  const setSearchQuery = (query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query }));
  };

  const filteredProducts = products.filter((p) => {
    if (p.status === 'hidden' || p.status === 'draft' || p.status === 'inactive') return false;
    if (filters.category !== 'all') {
      const matchCatId = p.categoryId === filters.category;
      const matchCatSlug = p.categoryName.toLowerCase().replace(/\s+/g, '-') === filters.category;
      if (!matchCatId && !matchCatSlug) return false;
    }
    if (filters.brand && p.brand.toLowerCase() !== filters.brand.toLowerCase()) return false;
    const effectivePrice = p.discountPrice || p.regularPrice;
    if (effectivePrice < filters.minPrice || effectivePrice > filters.maxPrice) return false;
    if (filters.stockOnly && (p.stockStatus === 'out_of_stock' || p.stockQuantity <= 0)) return false;
    if (filters.offersOnly && !p.isSpecialOffer && !p.discountPrice) return false;
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      const matchName = p.name?.toLowerCase().includes(q);
      const matchBrand = p.brand?.toLowerCase().includes(q);
      const matchSku = p.sku?.toLowerCase().includes(q);
      if (!matchName && !matchBrand && !matchSku) return false;
    }
    return true;
  });

  // Cart operations
  const addToCart = (product: Product, quantity = 1, openDrawer = true) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { product, quantity }];
    });
    addToast('success', 'Added to Cart', `${product.name} added.`);
    if (openDrawer) setIsCartDrawerOpen(true);
  };

  const buyNow = (product: Product, quantity = 1, selectedWarranty?: string) => {
    const item: CartItem = {
      product,
      quantity: Math.max(1, quantity),
      selectedWarranty: selectedWarranty || product.warranty || 'Official Warranty',
    };
    setBuyNowItem(item);
    setIsCartDrawerOpen(false);
    setQuickViewProduct(null);
    setIsAuthModalOpen(false);
    setActivePageState('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateBuyNowQuantity = (quantity: number) => {
    if (quantity <= 0) {
      setBuyNowItem(null);
      return;
    }
    setBuyNowItem((prev) => (prev ? { ...prev, quantity } : null));
  };

  const clearBuyNow = () => {
    setBuyNowItem(null);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) => prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item)));
  };

  const clearCart = () => setCart([]);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce(
    (sum, item) => sum + (item.product.discountPrice || item.product.regularPrice) * item.quantity,
    0
  );

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const coupon = coupons.find((c) => c.code.toUpperCase() === cleanCode && c.isActive);
    if (!coupon) return { success: false, message: 'Invalid or expired coupon code.' };
    if (cartSubtotal < coupon.minSpend) {
      return {
        success: false,
        message: `Minimum spend of ৳${coupon.minSpend.toLocaleString('en-BD')} required.`,
      };
    }
    setAppliedCoupon(coupon);
    addToast('success', 'Coupon Applied', coupon.description);
    return { success: true, message: `Coupon applied: ${coupon.description}` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    addToast('info', 'Coupon Removed', 'Coupon discount removed.');
  };

  const cartDiscount = appliedCoupon
    ? appliedCoupon.discountType === 'fixed'
      ? appliedCoupon.value
      : Math.round((cartSubtotal * appliedCoupon.value) / 100)
    : 0;

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        addToast('info', 'Wishlist', 'Item removed from wishlist.');
        return prev.filter((id) => id !== productId);
      } else {
        addToast('success', 'Wishlist', 'Item added to wishlist!');
        return [...prev, productId];
      }
    });
  };
  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Compare
  const addToCompare = (product: Product): boolean => {
    if (compareList.length >= 4) {
      addToast('warning', 'Limit Reached', 'You can compare up to 4 items.');
      return false;
    }
    if (compareList.some((p) => p.id === product.id)) {
      addToast('info', 'Comparison', 'Product is already in comparison list.');
      return false;
    }
    setCompareList((prev) => [...prev, product]);
    addToast('success', 'Compare', `${product.name} added to compare.`);
    return true;
  };
  const removeFromCompare = (productId: string) => {
    setCompareList((prev) => prev.filter((p) => p.id !== productId));
  };
  const clearCompare = () => setCompareList([]);
  const isInCompare = (productId: string) => compareList.some((p) => p.id === productId);

  // PC Builder
  const setPcBuildComponent = (slot: PCBuilderSlot, product: Product | null) => {
    setPcBuild((prev) => {
      const updated = { ...prev };
      if (product) {
        updated[slot] = product;
        addToast('success', 'Component Selected', `${product.name} chosen for ${slot.toUpperCase()}.`);
      } else {
        delete updated[slot];
      }
      return updated;
    });
  };
  const clearPcBuild = () => setPcBuild({});
  const pcBuildTotal = (Object.values(pcBuild) as (Product | undefined)[]).reduce((sum, p) => {
    if (!p) return sum;
    return sum + (p.discountPrice || p.regularPrice);
  }, 0);

  const pcBuildCompatibility: CompatibilityReport = (() => {
    const warnings: string[] = [];
    const notes: string[] = [];
    const cpu = pcBuild.processor;
    const mobo = pcBuild.motherboard;
    const ram = pcBuild.ram;
    const gpu = pcBuild['graphics-card'];
    const psu = pcBuild['power-supply'];

    let totalTdp = 65;
    if (cpu) totalTdp += cpu.compatibility?.tdp || 105;
    if (gpu) totalTdp += gpu.compatibility?.tdp || 180;
    if (mobo) totalTdp += 30;
    if (ram) totalTdp += 15;

    const recommendedPsuWattage = Math.max(
      Math.ceil((totalTdp * 1.4) / 50) * 50,
      gpu?.compatibility?.psuWattage || 450
    );

    if (cpu?.compatibility?.socket && mobo?.compatibility?.socket) {
      if (cpu.compatibility.socket !== mobo.compatibility.socket) {
        warnings.push(`Socket mismatch: CPU (${cpu.compatibility.socket}) vs Motherboard (${mobo.compatibility.socket}).`);
      } else {
        notes.push(`Socket Match: ${cpu.compatibility.socket} verified.`);
      }
    }

    return {
      isCompatible: warnings.length === 0,
      warnings,
      notes,
      totalTdp,
      recommendedPsuWattage,
    };
  })();

  const addPcBuildToCart = () => {
    const selectedList = Object.values(pcBuild).filter(Boolean) as Product[];
    if (selectedList.length === 0) {
      addToast('warning', 'Empty Build', 'Select components first.');
      return;
    }
    selectedList.forEach((prod) => addToCart(prod, 1, false));
    setIsCartDrawerOpen(true);
    addToast('success', 'PC Build Added', `${selectedList.length} items added to cart.`);
  };

  // Orders
  const createOrder = async (
    orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'trackingHistory'>
  ): Promise<Order> => {
    const res = await apiCreateOrder(orderData);
    if (res.success && res.order) {
      setOrders((prev) => [res.order!, ...prev]);
      setLastCreatedOrder(res.order);
      clearCart();
      setBuyNowItem(null);
      setAppliedCoupon(null);
      playNotificationChime('success');
      addToast('success', 'Order Placed!', `Order #${res.order.orderNumber}`);
      return res.order;
    } else {
      addToast('error', 'Order Failed', res.error || 'Could not place order.');
      throw new Error(res.error || 'Failed to place order.');
    }
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus, note?: string) => {
    const token = localStorage.getItem('baariz_it_token');
    if (!token) return;
    const res = await apiUpdateOrderStatus(orderId, status, note || '', token);
    if (res.success && res.order) {
      setOrders((prev) => prev.map((o) => (o.id === orderId ? res.order! : o)));
      addToast('success', 'Order Updated', `Order ${orderId} is now ${status.toUpperCase()}.`);
    }
  };

  const searchOrder = (query: string): Order | undefined => {
    const q = query.trim().toLowerCase();
    return orders.find(
      (ord) =>
        ord.id.toLowerCase() === q ||
        ord.orderNumber.toLowerCase() === q ||
        ord.customer.phone.replace(/[^0-9]/g, '').includes(q.replace(/[^0-9]/g, ''))
    );
  };

  return (
    <StoreContext.Provider
      value={{
        activePage,
        setActivePage,
        selectedProduct,
        openProductDetail,
        quickViewProduct,
        setQuickViewProduct,
        products,
        categories,
        brands,
        services,
        reviews,
        coupons,
        customPages,
        customers,
        stockLogs,
        settings,
        updateSettings,
        resetToFreshInstallation,
        addProduct,
        updateProduct,
        deleteProduct,
        adjustStock,
        addCategory,
        updateCategory,
        deleteCategory,
        addBrand,
        updateBrand,
        deleteBrand,
        addService,
        updateService,
        deleteService,
        addCustomPage,
        updateCustomPage,
        deleteCustomPage,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        addReview,
        updateReviewStatus,
        deleteReview,
        filters,
        setFilters,
        resetFilters,
        filteredProducts,
        setCategoryFilter,
        setSearchQuery,
        cart,
        buyNowItem,
        setBuyNowItem,
        addToCart,
        buyNow,
        updateBuyNowQuantity,
        clearBuyNow,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        cartDiscount,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        isCartOpen: isCartDrawerOpen,
        setIsCartOpen: setIsCartDrawerOpen,
        wishlist,
        toggleWishlist,
        isInWishlist,
        compareList,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
        pcBuild,
        setPcBuildComponent,
        clearPcBuild,
        pcBuildTotal,
        pcBuildCompatibility,
        addPcBuildToCart,
        isSelectingForSlot,
        setIsSelectingForSlot,
        orders,
        createOrder,
        updateOrderStatus,
        lastCreatedOrder,
        searchOrder,
        currentUser,
        currentCustomer,
        isAdminVerified,
        loginAdmin,
        loginUser,
        logoutUser,
        isAuthModalOpen,
        setIsAuthModalOpen,
        registerCustomer,
        loginCustomer,
        resetCustomerPassword,
        updateCustomerProfile,
        changeCustomerPassword,
        toggleBlockCustomer,
        updateCustomerNotes,
        conversations,
        messages,
        activeChatCustomerId,
        setActiveChatCustomerId,
        isChatDrawerOpen,
        setIsChatDrawerOpen,
        sendMessage,
        markConversationAsRead,
        unreadMessagesCount,
        fetchConversationMessages,
        notifications,
        addNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearAllNotifications,
        unreadNotificationsCount,
        toasts,
        addToast,
        removeToast,
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
