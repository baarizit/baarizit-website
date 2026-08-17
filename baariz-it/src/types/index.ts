export type ProductCategory = string;

export interface CategoryInfo {
  id: string;
  name: string;
  slug: string;
  iconName?: string;
  description?: string;
  image?: string;
  isActive: boolean;
  order: number;
  itemCount?: number;
}

export interface BrandInfo {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  website?: string;
  isActive: boolean;
}

export type ProductCondition = 'brand_new' | 'refurbished' | 'open_box';
export type ProductStatus = 'active' | 'draft' | 'out_of_stock' | 'hidden';

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  categoryId: string;
  categoryName: string;
  subCategory?: string;
  model?: string;
  sku: string;
  barcode: string;
  purchasePrice?: number; // Cost / Buy price in BDT (৳)
  regularPrice: number; // Selling price in BDT (৳)
  discountPrice?: number; // Offer / Discount price in BDT (৳)
  wholesalePrice?: number;
  isSpecialOffer?: boolean;
  discountPercentage?: number;
  stockStatus: 'in_stock' | 'out_of_stock' | 'pre_order' | 'limited';
  stockQuantity: number;
  lowStockThreshold: number;
  warranty: string;
  condition: ProductCondition;
  rating: number;
  reviewCount: number;
  mainImage: string;
  images: string[];
  shortDescription: string;
  fullDescription: string;
  specifications: Record<string, string>;
  tags: string[];
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  status: ProductStatus;
  pcBuilderSlot?: string; // e.g. 'processor', 'motherboard', 'ram', etc.
  compatibility?: {
    socket?: string; // e.g., "LGA1700", "AM5", "AM4"
    ramType?: string; // e.g., "DDR5", "DDR4"
    formFactor?: string; // e.g., "ATX", "Micro-ATX", "Mini-ITX"
    psuWattage?: number; // Minimum recommended PSU wattage (e.g., 650)
    tdp?: number; // TDP in watts for power calculation
  };
  seoTitle?: string;
  seoDescription?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type PCBuilderSlot =
  | 'processor'
  | 'motherboard'
  | 'ram'
  | 'ssd'
  | 'hdd'
  | 'graphics-card'
  | 'power-supply'
  | 'casing'
  | 'cpu-cooler'
  | 'monitor'
  | 'keyboard'
  | 'mouse';

export interface PCBuilderSlotConfig {
  slot: PCBuilderSlot;
  title: string;
  categorySlug: string;
  required: boolean;
  icon: string;
  description: string;
  isEnabled: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedWarranty?: string;
}

export interface WishlistItem {
  productId: string;
  addedAt: string;
}

export interface Review {
  id: string;
  productId: string;
  productName?: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  rating: number;
  comment: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected' | 'hidden';
  verifiedPurchase: boolean;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned';

export type PaymentMethod = 'cod' | 'bkash' | 'nagad' | 'bank';
export type PaymentStatus = 'pending' | 'paid' | 'verified' | 'refunded';

export interface OrderItem {
  productId: string;
  productName: string;
  sku: string;
  barcode?: string;
  image: string;
  price: number;
  quantity: number;
  warranty?: string;
}

export interface OrderTrackingStep {
  status: OrderStatus;
  title: string;
  timestamp: string;
  note: string;
  completed: boolean;
}

export interface Order {
  id: string; // e.g., "BIT-2026-9281"
  orderNumber: string;
  createdAt: string;
  customer: {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    district: string;
    area: string;
    notes?: string;
  };
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  couponCode?: string;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionId?: string;
  senderNumber?: string;
  status: OrderStatus;
  trackingHistory: OrderTrackingStep[];
  adminNotes?: string;
}

export interface Customer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  passwordHash?: string;
  address?: string;
  district?: string;
  area?: string;
  avatar?: string;
  totalOrders: number;
  totalSpent: number;
  status: 'active' | 'blocked';
  registeredAt: string;
  lastLoginAt?: string;
  lastOrderDate?: string;
  notes?: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: 'customer' | 'admin' | 'staff' | 'system';
  content: string;
  timestamp: string;
  isRead: boolean;
  productAttachment?: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
}

export interface Conversation {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadByAdminCount: number;
  unreadByCustomerCount: number;
  status: 'active' | 'closed';
}

export interface AppNotification {
  id: string;
  recipientRole: 'customer' | 'admin' | 'all';
  recipientId?: string; // specific user or customer ID
  type: 'order' | 'message' | 'registration' | 'system' | 'promotion';
  title: string;
  message: string;
  linkPage?: string;
  referenceId?: string; // order id, customer id, etc.
  createdAt: string;
  isRead: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number; // e.g. 10 for 10% or 500 for 500 BDT
  minSpend: number;
  maxDiscount?: number;
  expiryDate?: string;
  usageLimit?: number;
  usageCount: number;
  isActive: boolean;
  description: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  priceStarting: number;
  turnaroundTime: string;
  iconName: string;
  features: string[];
  popular?: boolean;
  isActive: boolean;
  image?: string;
}

export interface CustomPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StockMovementLog {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  type: 'adjustment' | 'sale' | 'restock' | 'return';
  previousStock: number;
  newStock: number;
  quantityChange: number;
  reason: string;
  timestamp: string;
  operator: string;
}

export type UserRole = 'owner' | 'manager' | 'staff' | 'customer';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  address?: string;
  district?: string;
  permissions?: {
    manageProducts: boolean;
    manageOrders: boolean;
    manageCategories: boolean;
    manageInventory: boolean;
    manageCustomers: boolean;
    manageReviews: boolean;
    manageServices: boolean;
    manageCMS: boolean;
    manageSettings: boolean;
  };
}

export interface MenuItem {
  id: string;
  label: string;
  page: string; // page identifier or external url
  isExternal?: boolean;
  isEnabled: boolean;
  order: number;
}

export interface HomepageSectionConfig {
  id: string;
  name: string;
  type:
    | 'hero'
    | 'categories'
    | 'products'
    | 'offers'
    | 'services'
    | 'about'
    | 'why_choose_us'
    | 'reviews'
    | 'location'
    | 'contact'
    | 'custom_banner';
  title?: string;
  subtitle?: string;
  isEnabled: boolean;
  order: number;
}

export interface HeroSettings {
  badgeText: string;
  headlineMain: string;
  headlineHighlight: string;
  subtitle: string;
  button1Text: string;
  button1Action: string;
  button2Text: string;
  button2Action: string;
  bannerImage: string;
  featuresList: string[];
  isEnabled?: boolean;
}

export interface PromoBanner {
  id: string;
  title: string;
  description: string;
  image: string;
  buttonText: string;
  link: string;
  isEnabled: boolean;
  order: number;
}

export interface SiteSettings {
  // 1. Basic Business info
  shopName: string;
  tagline: string;
  shortDescription?: string;
  fullDescription?: string;
  phone: string;
  phonePrimary?: string;
  phoneSecondary?: string;
  supportPhone?: string;
  whatsapp: string;
  whatsappNumber?: string;
  email: string;
  businessHours: string;
  logoUrl?: string;
  faviconUrl?: string;
  coverImageUrl?: string;

  // 2. Address & Location
  address: string;
  displayAddress?: string;
  fullAddress: string;
  shopNumber?: string;
  floor?: string;
  building?: string;
  area?: string;
  city?: string;
  district?: string;
  country?: string;
  postalCode?: string;

  // 3. Google Maps
  googleMapsUrl?: string;
  googleMapsEmbedUrl: string;
  latitude?: string;
  longitude?: string;

  // 4. Announcement bar
  announcementText: string;
  isAnnouncementEnabled: boolean;

  // 5. Theme & Appearance
  themeAccent: 'cyan' | 'emerald' | 'purple' | 'blue' | 'amber' | 'rose';
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  fontStyle: string;
  themeMode?: string;
  buttonStyle?: string;
  borderRadius?: string;

  // 6. Delivery settings
  deliveryFeeSavar: number;
  deliveryFeeDhaka: number;
  deliveryFeeNationwide: number;
  freeDeliveryThreshold: number;
  estimatedDeliveryDhaka: string;
  estimatedDeliveryOutside: string;

  // 7. Payment Gateway settings
  isCodEnabled: boolean;
  isBkashEnabled: boolean;
  bkashNumber: string;
  bkashInstructions: string;
  isNagadEnabled: boolean;
  nagadNumber: string;
  nagadInstructions: string;
  isBankEnabled: boolean;
  bankDetails: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    branch: string;
    routingNumber: string;
  };

  // 8. Social Media
  facebookUrl: string;
  isFacebookEnabled?: boolean;
  whatsappUrl: string;
  isWhatsappEnabled?: boolean;
  youtubeUrl: string;
  isYoutubeEnabled?: boolean;
  instagramUrl: string;
  isInstagramEnabled?: boolean;
  tiktokUrl: string;
  isTiktokEnabled?: boolean;
  messengerUrl?: string;
  isMessengerEnabled?: boolean;

  // 9. Footer & Content
  footerDescription: string;
  footerText?: string;
  copyrightText: string;

  // 10. Content Customization
  aboutUsContent?: string;
  servicesContent?: string;
  whyChooseUsContent?: string;
  returnPolicyContent?: string;
  privacyPolicyContent?: string;
  termsContent?: string;
  deliveryInfoContent?: string;
  warrantyInfoContent?: string;

  // 11. SEO
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  ogImage: string;

  // 12. CMS Sections, Hero & Banners
  hero: HeroSettings;
  banners?: PromoBanner[];
  homepageSections: HomepageSectionConfig[];
  menuItems: MenuItem[];
}
