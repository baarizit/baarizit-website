import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// =========================================================================
// 1. SINGLE OWNER / ADMIN CONFIGURATION
// =========================================================================
const ADMIN_CONFIG = {
  id: 'usr-owner-01',
  fullName: 'Engr. Baariz (Shop Owner)',
  email: (process.env.ADMIN_EMAIL || 'owner@baarizit.com').toLowerCase().trim(),
  phone: '01622615188',
  role: 'owner' as const,
  password: process.env.ADMIN_PASSWORD || 'BaarizAdmin@2026!',
  permissions: {
    manageProducts: true,
    manageOrders: true,
    manageCategories: true,
    manageInventory: true,
    manageCustomers: true,
    manageReviews: true,
    manageServices: true,
    manageCMS: true,
    manageSettings: true,
  },
};

// Password hashing helper (SHA-256 with salt)
function hashPassword(password: string): string {
  return crypto
    .createHash('sha256')
    .update(password + '_baariz_it_salt_2026')
    .digest('hex');
}

// =========================================================================
// 2. TYPES & IN-MEMORY DATABASES (SINGLE SOURCE OF TRUTH)
// =========================================================================

interface StoredUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: 'customer' | 'owner';
  address?: string;
  district?: string;
  area?: string;
  isBlocked?: boolean;
  notes?: string;
  createdAt: string;
}

interface Session {
  token: string;
  userId: string;
  email: string;
  fullName: string;
  phone: string;
  role: 'customer' | 'owner';
  permissions?: typeof ADMIN_CONFIG.permissions;
  createdAt: number;
  expiresAt: number;
}

interface Product {
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
  purchasePrice?: number;
  regularPrice: number;
  discountPrice?: number;
  wholesalePrice?: number;
  isSpecialOffer?: boolean;
  discountPercentage?: number;
  stockStatus: 'in_stock' | 'out_of_stock' | 'pre_order' | 'limited';
  stockQuantity: number;
  lowStockThreshold: number;
  warranty: string;
  condition: 'brand_new' | 'refurbished' | 'open_box';
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
  status: 'active' | 'draft' | 'inactive' | 'out_of_stock' | 'hidden';
  pcBuilderSlot?: string;
  compatibility?: Record<string, any>;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

interface CategoryInfo {
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

interface BrandInfo {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  website?: string;
  isActive: boolean;
}

interface CustomPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: 'customer' | 'admin' | 'owner' | 'staff' | 'system';
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

interface Conversation {
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

interface Order {
  id: string;
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
  items: any[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  couponCode?: string;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  transactionId?: string;
  senderNumber?: string;
  status: string;
  trackingHistory: any[];
  adminNotes?: string;
}

interface StockMovementLog {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  type: 'initial' | 'restock' | 'adjustment' | 'order_deduction' | 'return_restock';
  previousStock: number;
  newStock: number;
  quantityChange: number;
  reason: string;
  timestamp: string;
  operator: string;
}

// Master Databases
const usersDb = new Map<string, StoredUser>();
const sessionsDb = new Map<string, Session>();
const productsDb = new Map<string, Product>();
const categoriesDb = new Map<string, CategoryInfo>();
const brandsDb = new Map<string, BrandInfo>();
const customPagesDb = new Map<string, CustomPage>();
const ordersDb = new Map<string, Order>();
const conversationsDb = new Map<string, Conversation>();
const messagesDb = new Map<string, ChatMessage>();
const stockLogsDb = new Map<string, StockMovementLog>();

// Site Settings
let siteSettings = {
  shopName: 'BAARIZ IT',
  tagline: 'More Tech, More Possibilities',
  shortDescription: 'Your premier destination for genuine computer components, custom gaming PCs, laptops, and professional repair servicing in Savar, Dhaka.',
  fullDescription: 'BAARIZ IT is the leading tech and hardware computer store in Savar, Dhaka, providing 100% authentic computer components, custom workstation & gaming rigs, official manufacturer warranty, express servicing, and expert PC consulting.',
  phone: '01622615188',
  phonePrimary: '01622615188',
  phoneSecondary: '01711223344',
  whatsapp: '01622615188',
  whatsappNumber: '01622615188',
  supportPhone: '01622615188',
  email: 'baarizit@gmail.com',
  businessHours: 'Saturday – Thursday: 10:00 AM – 9:00 PM | Friday: 3:00 PM – 9:30 PM',
  
  // Location & Address Details
  address: 'Shop A/23, 3rd Floor, Block A, National Blind Welfare Association Shopping Complex, Savar Bus Stand',
  displayAddress: 'National Blind Welfare Association Shopping Complex, 3rd Floor, Block A, Shop A/23, Savar Bus Stand, Savar, Dhaka, Bangladesh',
  fullAddress: 'National Blind Welfare Association Shopping Complex, 3rd Floor, Block A, Shop A/23, Savar Bus Stand, Savar, Dhaka, Bangladesh',
  shopNumber: 'Shop A/23',
  floor: '3rd Floor',
  building: 'National Blind Welfare Association Shopping Complex',
  area: 'Savar Bus Stand',
  city: 'Savar',
  district: 'Dhaka',
  country: 'Bangladesh',
  postalCode: '1340',

  // Google Maps
  googleMapsUrl: 'https://maps.google.com/?q=National+Blind+Welfare+Association+Shopping+Complex+Savar+Dhaka',
  googleMapsEmbedUrl: 'https://maps.google.com/maps?q=National%20Blind%20Welfare%20Association%20Shopping%20Complex%2C%20Savar%20Bus%20Stand%2C%20Savar%2C%20Dhaka&t=&z=16&ie=UTF8&iwloc=&output=embed',
  latitude: '23.8488',
  longitude: '90.2577',

  // Media
  logoUrl: '',
  faviconUrl: '',
  coverImageUrl: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=1200&auto=format&fit=crop&q=80',
  
  // Announcement
  announcementText: 'Welcome to BAARIZ IT — More Tech, More Possibilities | Savar, Dhaka, Bangladesh',
  isAnnouncementEnabled: true,

  // Theme & Appearance
  themeAccent: 'cyan' as const,
  primaryColor: '#06b6d4',
  secondaryColor: '#3b82f6',
  accentColor: '#10b981',
  fontStyle: 'sans',
  themeMode: 'dark',
  buttonStyle: 'rounded-xl',
  borderRadius: '16px',

  // Delivery settings
  deliveryFeeSavar: 60,
  deliveryFeeDhaka: 100,
  deliveryFeeNationwide: 150,
  freeDeliveryThreshold: 0,
  estimatedDeliveryDhaka: '24 - 48 Hours',
  estimatedDeliveryOutside: '2 - 4 Days',

  // Payment Gateway settings
  isCodEnabled: true,
  isBkashEnabled: true,
  bkashNumber: '01622615188',
  bkashInstructions: 'Send Money or Merchant Payment to personal bKash number 01622615188, then input your Transaction ID.',
  isNagadEnabled: true,
  nagadNumber: '01622615188',
  nagadInstructions: 'Send Money to Nagad number 01622615188, then provide your Transaction ID and Sender Number.',
  isBankEnabled: false,
  bankDetails: {
    bankName: 'City Bank PLC',
    accountName: 'BAARIZ IT',
    accountNumber: '1102938475001',
    branch: 'Savar Branch',
    routingNumber: '225260111',
  },

  // Social Media
  facebookUrl: 'https://facebook.com/baarizit',
  isFacebookEnabled: true,
  whatsappUrl: 'https://wa.me/8801622615188',
  isWhatsappEnabled: true,
  youtubeUrl: 'https://youtube.com/@baarizit',
  isYoutubeEnabled: true,
  instagramUrl: 'https://instagram.com/baarizit',
  isInstagramEnabled: true,
  tiktokUrl: 'https://tiktok.com/@baarizit',
  isTiktokEnabled: false,
  messengerUrl: 'https://m.me/baarizit',
  isMessengerEnabled: true,

  // Footer & Content
  footerDescription: 'BAARIZ IT is your premier destination for genuine computer components, custom gaming PCs, laptops, and professional repair servicing in Savar, Dhaka.',
  footerText: 'BAARIZ IT — Premier Computer & Laptop Hardware Shop in Savar, Dhaka. 100% Genuine Products with Official Warranty.',
  copyrightText: '© 2026 BAARIZ IT. All Rights Reserved.',

  // Content Customization
  aboutUsContent: 'BAARIZ IT is Savar’s most trusted technology outlet. Established with a vision to provide authentic computer hardware, top-tier custom desktop builds, and certified repair servicing, we cater to gamers, creators, students, and businesses across Bangladesh.',
  servicesContent: 'We provide expert motherboard repairs, GPU thermal servicing, laptop screen & keyboard replacement, custom liquid cooling loop installations, Windows/BIOS optimization, and high-speed data recovery.',
  whyChooseUsContent: '100% Authentic Brand Warranty, Certified Hardware Technicians, Competitive Pricing, Express Savar Local Delivery, and dedicated after-sales support.',
  returnPolicyContent: 'Products with official manufacturer defects are eligible for instant replacement within 7 days of delivery with original box and invoice.',
  privacyPolicyContent: 'We prioritize customer privacy. Your personal details, contact info, and transaction records are encrypted and never shared with third parties.',
  termsContent: 'All purchases are covered under standard manufacturer warranty terms. Warranty stickers must remain intact for warranty fulfillment.',
  deliveryInfoContent: 'Savar local orders are delivered within 2-4 hours. Dhaka metro is delivered within 24-48 hours. Nationwide courier delivery takes 2-3 business days.',
  warrantyInfoContent: 'All processors, motherboards, GPUs, and SSDs come with 1 to 5 years official brand warranty fulfilled at our Savar service desk.',

  // SEO
  metaTitle: 'BAARIZ IT — More Tech, More Possibilities | Computer & Laptop Shop Savar',
  metaDescription: 'Shop genuine PC components, gaming laptops, processors, graphics cards, and expert PC servicing at BAARIZ IT in Savar Bus Stand, Dhaka.',
  keywords: 'computer shop savar, baariz it, pc builder bangladesh, laptop repair savar, graphics card bd, processor price bd',
  ogImage: '',

  // Hero Section Customization
  hero: {
    badgeText: 'PREMIER COMPUTER & TECH SHOP IN SAVAR',
    headlineMain: 'More Tech,',
    headlineHighlight: 'More Possibilities.',
    subtitle: 'Build your dream custom gaming PC, discover latest laptops & genuine hardware components with official warranty in Savar, Dhaka.',
    button1Text: 'Explore Products',
    button1Action: 'shop',
    button2Text: 'Custom PC Builder',
    button2Action: 'pc-builder',
    bannerImage: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=1200&auto=format&fit=crop&q=80',
    isEnabled: true,
    featuresList: [
      '100% Authentic Products',
      'Official Manufacturer Warranty',
      'Same-Day Delivery in Savar',
      'Expert On-Site Servicing & Repairs',
    ],
  },

  // Homepage Banners
  banners: [
    {
      id: 'banner-1',
      title: 'Ultimate Gaming Rig Season 2026',
      description: 'Build your ultimate gaming PC with AMD Ryzen 7000/9000 & RTX 40/50 Series. Free professional cable management & thermal benchmarking!',
      image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=1200&auto=format&fit=crop&q=80',
      buttonText: 'Start Custom Build',
      link: 'pc-builder',
      isEnabled: true,
      order: 1,
    },
    {
      id: 'banner-2',
      title: 'Official Warranty Hardware Upgrades',
      description: 'Upgrade your NVMe Gen4 SSD, High-Speed DDR5 RAM, and 80+ Gold Power Supplies with 100% brand replacement warranty.',
      image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=1200&auto=format&fit=crop&q=80',
      buttonText: 'View All Hardware',
      link: 'shop',
      isEnabled: true,
      order: 2,
    },
  ],

  // CMS Sections
  homepageSections: [
    { id: 'sec-hero', name: 'Hero Banner & Highlights', type: 'hero', isEnabled: true, order: 1 },
    { id: 'sec-categories', name: 'Hardware Categories', type: 'categories', isEnabled: true, order: 2 },
    { id: 'sec-products', name: 'Featured Products Catalog', type: 'products', isEnabled: true, order: 3 },
    { id: 'sec-offers', name: 'Promotional Offers & Flash Deals', type: 'offers', isEnabled: true, order: 4 },
    { id: 'sec-why-us', name: 'Why Choose Us Value Cards', type: 'why_choose_us', isEnabled: true, order: 5 },
    { id: 'sec-services', name: 'Servicing & Repair Desk', type: 'services', isEnabled: true, order: 6 },
    { id: 'sec-reviews', name: 'Customer Reviews & Feedback', type: 'reviews', isEnabled: true, order: 7 },
    { id: 'sec-location', name: 'Store Map & Physical Outlet', type: 'location', isEnabled: true, order: 8 },
    { id: 'sec-contact', name: 'Instant Inquiry & Contact Form', type: 'contact', isEnabled: true, order: 9 },
  ],

  menuItems: [
    { id: 'menu-1', label: 'Home', page: 'home', isEnabled: true, order: 1 },
    { id: 'menu-2', label: 'Shop Catalog', page: 'shop', isEnabled: true, order: 2 },
    { id: 'menu-3', label: 'PC Builder', page: 'pc-builder', isEnabled: true, order: 3 },
    { id: 'menu-4', label: 'Tech Services', page: 'services', isEnabled: true, order: 4 },
    { id: 'menu-5', label: 'Special Offers', page: 'offers', isEnabled: true, order: 5 },
    { id: 'menu-6', label: 'About Us', page: 'about', isEnabled: true, order: 6 },
    { id: 'menu-7', label: 'Contact', page: 'contact', isEnabled: true, order: 7 },
    { id: 'menu-8', label: 'Track Order', page: 'order-tracking', isEnabled: true, order: 8 },
  ],
};

// =========================================================================
// 3. REALTIME EVENT BROADCASTER (SSE + POLLING ENGINE)
// =========================================================================

interface RealtimeEvent {
  id: string;
  type: 'new_message' | 'conversation_updated' | 'catalog_updated' | 'settings_updated' | 'order_updated';
  timestamp: number;
  data: any;
}

const realtimeEvents: RealtimeEvent[] = [];
const sseClients = new Set<{
  res: Response;
  role: string;
  userId?: string;
  convId?: string;
}>();

function broadcastRealtimeEvent(type: RealtimeEvent['type'], data: any) {
  const event: RealtimeEvent = {
    id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    type,
    timestamp: Date.now(),
    data,
  };

  // Keep last 200 events in circular log for polling sync
  realtimeEvents.push(event);
  if (realtimeEvents.length > 200) {
    realtimeEvents.shift();
  }

  // Push to active SSE connections
  const payload = `data: ${JSON.stringify(event)}\n\n`;
  for (const client of sseClients) {
    try {
      client.res.write(payload);
    } catch {
      sseClients.delete(client);
    }
  }
}

// Keep-alive heartbeat for SSE every 25s
setInterval(() => {
  for (const client of sseClients) {
    try {
      client.res.write(': heartbeat\n\n');
    } catch {
      sseClients.delete(client);
    }
  }
}, 25000);

// =========================================================================
// 4. AUTHENTICATION & SECURITY MIDDLEWARE
// =========================================================================

function createSession(user: {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: 'customer' | 'owner';
  permissions?: typeof ADMIN_CONFIG.permissions;
}): Session {
  const token = `bit_${crypto.randomBytes(32).toString('hex')}`;
  const session: Session = {
    token,
    userId: user.id,
    email: user.email,
    fullName: user.fullName,
    phone: user.phone,
    role: user.role,
    permissions: user.permissions,
    createdAt: Date.now(),
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };
  sessionsDb.set(token, session);
  return session;
}

function getSessionFromReq(req: Request): Session | null {
  let token: string | undefined;
  
  // 1. Authorization Bearer header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7).trim();
  }
  
  // 2. Cookie or query param fallback
  if (!token && req.query && typeof req.query.token === 'string') {
    token = req.query.token.trim();
  }
  
  if (!token) return null;
  const session = sessionsDb.get(token);
  if (!session) return null;
  if (Date.now() > session.expiresAt) {
    sessionsDb.delete(token);
    return null;
  }
  return session;
}

// STRICT SERVER-SIDE AUTHORIZATION: USERS WITH 'customer' OR UNAUTHENTICATED ROLES RECEIVE 403 FORBIDDEN
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const session = getSessionFromReq(req);
  if (!session) {
    return res.status(403).json({
      success: false,
      status: 403,
      error: '403 Forbidden: Unauthenticated. Admin privileges required.',
      message: 'Users with unauthenticated roles are forbidden from accessing administrative functionalities.',
    });
  }
  if (session.role !== 'owner' && (session.role as string) !== 'admin') {
    return res.status(403).json({
      success: false,
      status: 403,
      error: '403 Forbidden: Access Denied. Admin privileges required.',
      message: 'Users with customer role are forbidden from accessing administrative functionalities.',
    });
  }
  next();
}

// =========================================================================
// 5. SEED INITIAL BASE HARDWARE & CATEGORIES
// =========================================================================

const initialCategories: CategoryInfo[] = [
  { id: 'processor', name: 'Processors (CPU)', slug: 'processor', description: 'Intel & AMD Ryzen desktop processors with official warranty', isActive: true, order: 1 },
  { id: 'motherboard', name: 'Motherboards', slug: 'motherboard', description: 'Intel & AMD socket motherboards (ASUS, MSI, Gigabyte, ASRock)', isActive: true, order: 2 },
  { id: 'graphics-card', name: 'Graphics Cards (GPU)', slug: 'graphics-card', description: 'NVIDIA GeForce RTX & AMD Radeon gaming graphics cards', isActive: true, order: 3 },
  { id: 'ram', name: 'RAM (Memory)', slug: 'ram', description: 'DDR4 & DDR5 high-speed desktop and laptop memory kits', isActive: true, order: 4 },
  { id: 'ssd', name: 'Storage (SSD & HDD)', slug: 'ssd', description: 'High-speed M.2 NVMe PCIe Gen4 SSDs and mechanical drives', isActive: true, order: 5 },
  { id: 'power-supply', name: 'Power Supplies (PSU)', slug: 'power-supply', description: '80+ Bronze, Gold & Platinum certified power supplies', isActive: true, order: 6 },
  { id: 'casing', name: 'Casing & Chassis', slug: 'casing', description: 'ARGB gaming casings, tempered glass, mesh airflow cases', isActive: true, order: 7 },
  { id: 'cpu-cooler', name: 'Cooling Solutions', slug: 'cpu-cooler', description: 'AIO Liquid Coolers, ARGB Air Coolers, case fans', isActive: true, order: 8 },
  { id: 'monitor', name: 'Gaming Monitors', slug: 'monitor', description: '144Hz, 180Hz, 240Hz IPS & Fast VA gaming displays', isActive: true, order: 9 },
  { id: 'accessories', name: 'Peripherals & Accessories', slug: 'accessories', description: 'Mechanical keyboards, gaming mice, headsets', isActive: true, order: 10 },
];

initialCategories.forEach((c) => categoriesDb.set(c.id, c));

// Seed initial authentic product catalog
const initialProducts: Product[] = [
  {
    id: 'prod-cpu-7800x3d',
    name: 'AMD Ryzen 7 7800X3D Gaming Processor',
    slug: 'amd-ryzen-7-7800x3d-gaming-processor',
    brand: 'AMD',
    categoryId: 'processor',
    categoryName: 'Processors (CPU)',
    sku: 'BIT-7800X3D',
    barcode: '880192837461',
    regularPrice: 48500,
    discountPrice: 46200,
    stockStatus: 'in_stock',
    stockQuantity: 8,
    lowStockThreshold: 2,
    warranty: '3 Years Official Brand Warranty',
    condition: 'brand_new',
    rating: 5.0,
    reviewCount: 14,
    mainImage: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&auto=format&fit=crop&q=80'],
    shortDescription: 'World’s fastest gaming processor with 3D V-Cache technology, 8 cores, 16 threads, 5.0 GHz boost.',
    fullDescription: 'The AMD Ryzen 7 7800X3D features 104MB total cache and next-gen Zen 4 architecture built on 5nm process technology. Ideal for esports and heavy simulation titles.',
    specifications: {
      Cores: '8 Cores / 16 Threads',
      'Base Clock': '4.2 GHz',
      'Boost Clock': 'Up to 5.0 GHz',
      'Total Cache': '104MB (L2+L3)',
      Socket: 'AM5',
      TDP: '120W',
    },
    tags: ['AMD', 'Ryzen 7', 'Gaming CPU', 'AM5', '3D V-Cache'],
    isFeatured: true,
    isSpecialOffer: true,
    status: 'active',
    pcBuilderSlot: 'processor',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-gpu-rtx4070super',
    name: 'ASUS TUF Gaming GeForce RTX 4070 Super 12GB OC',
    slug: 'asus-tuf-gaming-geforce-rtx-4070-super-12gb-oc',
    brand: 'ASUS',
    categoryId: 'graphics-card',
    categoryName: 'Graphics Cards (GPU)',
    sku: 'BIT-TUF4070S',
    barcode: '880192837462',
    regularPrice: 84000,
    discountPrice: 81500,
    stockStatus: 'in_stock',
    stockQuantity: 5,
    lowStockThreshold: 1,
    warranty: '3 Years Official Brand Warranty',
    condition: 'brand_new',
    rating: 4.9,
    reviewCount: 9,
    mainImage: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80'],
    shortDescription: 'Military-grade TUF components, dual ball bearing fans, DLSS 3 frame generation, and 12GB GDDR6X.',
    fullDescription: 'Experience fluid 1440p and 4K ray tracing with DLSS 3. Built with military-grade capacitors and heavy axial-tech cooling.',
    specifications: {
      VRAM: '12GB GDDR6X',
      'Memory Bus': '192-bit',
      'Engine Clock': '2595 MHz (OC Mode)',
      Power: 'Recommended 750W PSU',
      Interface: 'PCIe 4.0',
    },
    tags: ['ASUS', 'TUF Gaming', 'RTX 4070 Super', 'DLSS 3', 'Ray Tracing'],
    isFeatured: true,
    isSpecialOffer: false,
    status: 'active',
    pcBuilderSlot: 'graphics-card',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-mb-b650-plus',
    name: 'MSI MAG B650 TOMAHAWK WIFI AM5 Motherboard',
    slug: 'msi-mag-b650-tomahawk-wifi-am5-motherboard',
    brand: 'MSI',
    categoryId: 'motherboard',
    categoryName: 'Motherboards',
    sku: 'BIT-B650TOMAHAWK',
    barcode: '880192837463',
    regularPrice: 26500,
    discountPrice: 25200,
    stockStatus: 'in_stock',
    stockQuantity: 10,
    lowStockThreshold: 2,
    warranty: '3 Years Official Brand Warranty',
    condition: 'brand_new',
    rating: 4.8,
    reviewCount: 7,
    mainImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80'],
    shortDescription: 'Robust 14+2+1 Duet Rail Power System, DDR5 Memory Boost, PCIe 4.0, Wi-Fi 6E & 2.5G LAN.',
    fullDescription: 'Heavy-duty AM5 motherboard designed for Ryzen 7000, 8000, and 9000 series desktop processors with premium thermal shields.',
    specifications: {
      Socket: 'AM5',
      Chipset: 'AMD B650',
      Memory: '4x DDR5 Slots up to 128GB',
      Storage: '3x M.2 PCIe 4.0 Slots',
      Networking: 'Wi-Fi 6E + 2.5Gbps LAN',
    },
    tags: ['MSI', 'B650', 'AM5', 'DDR5', 'Wi-Fi 6E'],
    isFeatured: true,
    isSpecialOffer: false,
    status: 'active',
    pcBuilderSlot: 'motherboard',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-ram-ddr5-32gb',
    name: 'Corsair Vengeance RGB 32GB (2x16GB) DDR5 6000MHz CL30',
    slug: 'corsair-vengeance-rgb-32gb-ddr5-6000mhz',
    brand: 'Corsair',
    categoryId: 'ram',
    categoryName: 'RAM (Memory)',
    sku: 'BIT-CORSAIR32DDR5',
    barcode: '880192837464',
    regularPrice: 14500,
    discountPrice: 13800,
    stockStatus: 'in_stock',
    stockQuantity: 12,
    lowStockThreshold: 3,
    warranty: 'Lifetime Brand Warranty',
    condition: 'brand_new',
    rating: 5.0,
    reviewCount: 11,
    mainImage: 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=800&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1562976540-1502c2145186?w=800&auto=format&fit=crop&q=80'],
    shortDescription: 'High-performance optimized DDR5 memory kit with dynamic 10-zone RGB lighting and AMD EXPO support.',
    fullDescription: 'Tuned specifically for AM5 and Intel platforms with tight CL30 timings for maximum frame rates and zero micro-stutters.',
    specifications: {
      Capacity: '32GB (2 x 16GB)',
      Speed: 'DDR5 6000MHz',
      Latency: 'CL30-36-36-76',
      Profile: 'AMD EXPO / Intel XMP 3.0',
    },
    tags: ['Corsair', 'DDR5', 'RGB', '6000MHz', 'CL30'],
    isFeatured: false,
    isSpecialOffer: true,
    status: 'active',
    pcBuilderSlot: 'ram',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

initialProducts.forEach((p) => productsDb.set(p.id, p));

// Seed demo customer
const demoCustomer: StoredUser = {
  id: 'cust-demo-1',
  fullName: 'Tanvir Ahmed (Customer)',
  email: 'tanvir@gmail.com',
  phone: '01711223344',
  passwordHash: hashPassword('Customer@123'),
  role: 'customer',
  address: 'House 14, Road 3, Sector 4, Uttara',
  district: 'Dhaka',
  area: 'Uttara',
  isBlocked: false,
  createdAt: new Date().toISOString(),
};
usersDb.set(demoCustomer.id, demoCustomer);

// =========================================================================
// 6. AUTHENTICATION API ROUTES
// =========================================================================

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 1. Customer Registration (Strictly forces role = 'customer')
app.post('/api/auth/register', (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;

    if (!fullName || typeof fullName !== 'string' || !fullName.trim()) {
      return res.status(400).json({ success: false, message: 'Please enter your full name.' });
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanPhone = (phone || '').replace(/[^0-9+]/g, '').trim();

    if (!cleanPhone || cleanPhone.length < 11) {
      return res.status(400).json({ success: false, message: 'Please enter a valid mobile number.' });
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }

    if (cleanEmail === ADMIN_CONFIG.email) {
      return res.status(400).json({
        success: false,
        message: 'This email address is reserved. Please sign in or use another email.',
      });
    }

    const existingUser = Array.from(usersDb.values()).find(
      (u) => u.email.toLowerCase() === cleanEmail || u.phone === cleanPhone
    );

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email or mobile number already exists.',
      });
    }

    const newCustomerId = `cust-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newCustomer: StoredUser = {
      id: newCustomerId,
      fullName: fullName.trim(),
      email: cleanEmail,
      phone: cleanPhone,
      passwordHash: hashPassword(password),
      role: 'customer', // HARD ENFORCED
      isBlocked: false,
      createdAt: new Date().toISOString(),
    };

    usersDb.set(newCustomerId, newCustomer);

    const session = createSession({
      id: newCustomer.id,
      email: newCustomer.email,
      fullName: newCustomer.fullName,
      phone: newCustomer.phone,
      role: 'customer',
    });

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully as Customer.',
      token: session.token,
      user: {
        id: newCustomer.id,
        fullName: newCustomer.fullName,
        email: newCustomer.email,
        phone: newCustomer.phone,
        role: 'customer',
      },
    });
  } catch (err) {
    console.error('Error in registration:', err);
    return res.status(500).json({ success: false, message: 'Internal server error during registration.' });
  }
});

// 2. Customer Login
app.post('/api/auth/login', (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'Please provide identifier and password.' });
    }

    const cleanId = identifier.toLowerCase().trim();
    const hash = hashPassword(password);

    const customer = Array.from(usersDb.values()).find(
      (u) =>
        (u.email.toLowerCase() === cleanId || u.phone === cleanId || u.phone.replace(/[^0-9]/g, '') === cleanId) &&
        u.role === 'customer'
    );

    if (!customer) {
      return res.status(401).json({ success: false, message: 'No customer account found with these credentials.' });
    }

    if (customer.isBlocked) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been temporarily restricted. Please contact BAARIZ IT support.',
      });
    }

    if (customer.passwordHash !== hash) {
      return res.status(401).json({ success: false, message: 'Incorrect password. Please try again.' });
    }

    const session = createSession({
      id: customer.id,
      email: customer.email,
      fullName: customer.fullName,
      phone: customer.phone,
      role: 'customer',
    });

    return res.json({
      success: true,
      token: session.token,
      user: {
        id: customer.id,
        fullName: customer.fullName,
        email: customer.email,
        phone: customer.phone,
        role: 'customer',
      },
    });
  } catch (err) {
    console.error('Error in customer login:', err);
    return res.status(500).json({ success: false, message: 'Server error during login.' });
  }
});

// 3. Admin / Owner Login (Validates against single owner credentials)
app.post('/api/auth/admin-login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Admin email and password are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const isOwnerEmail = cleanEmail === ADMIN_CONFIG.email;
    const isOwnerPassword =
      password === ADMIN_CONFIG.password || hashPassword(password) === hashPassword(ADMIN_CONFIG.password);

    if (!isOwnerEmail || !isOwnerPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid administrative credentials. Access denied.',
      });
    }

    const session = createSession({
      id: ADMIN_CONFIG.id,
      email: ADMIN_CONFIG.email,
      fullName: ADMIN_CONFIG.fullName,
      phone: ADMIN_CONFIG.phone,
      role: 'owner',
      permissions: ADMIN_CONFIG.permissions,
    });

    return res.json({
      success: true,
      message: 'Admin authorization granted.',
      token: session.token,
      user: {
        id: ADMIN_CONFIG.id,
        fullName: ADMIN_CONFIG.fullName,
        email: ADMIN_CONFIG.email,
        phone: ADMIN_CONFIG.phone,
        role: 'owner',
        permissions: ADMIN_CONFIG.permissions,
      },
    });
  } catch (err) {
    console.error('Error in admin login:', err);
    return res.status(500).json({ success: false, message: 'Server error during admin authentication.' });
  }
});

// 4. Session Validation
app.get('/api/auth/me', (req, res) => {
  const session = getSessionFromReq(req);
  if (!session) {
    return res.status(401).json({ success: false, user: null });
  }

  return res.json({
    success: true,
    user: {
      id: session.userId,
      fullName: session.fullName,
      email: session.email,
      phone: session.phone,
      role: session.role,
      permissions: session.permissions,
    },
  });
});

// 5. Verify Admin Permission (Strictly returns 403 for unauthenticated or customer roles)
app.all(['/api/auth/verify-admin', '/api/admin/verify'], (req, res) => {
  const session = getSessionFromReq(req);
  if (!session) {
    return res.status(403).json({
      success: false,
      status: 403,
      isAdmin: false,
      error: '403 Forbidden: Unauthenticated. Admin privileges required.',
      message: 'Users with unauthenticated roles receive a 403 Forbidden response.',
    });
  }

  if (session.role !== 'owner' && (session.role as string) !== 'admin') {
    return res.status(403).json({
      success: false,
      status: 403,
      isAdmin: false,
      error: '403 Forbidden: Access Denied. Account does not have administrative privileges.',
      message: 'Users with customer role receive a 403 Forbidden response.',
    });
  }

  return res.json({
    success: true,
    status: 200,
    isAdmin: true,
    user: {
      id: session.userId,
      fullName: session.fullName,
      email: session.email,
      phone: session.phone,
      role: session.role,
      permissions: session.permissions,
    },
  });
});

// 6. Logout
app.post('/api/auth/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7).trim();
    sessionsDb.delete(token);
  }
  return res.json({ success: true, message: 'Logged out successfully.' });
});

// =========================================================================
// DEDICATED /api/admin/* FUNCTIONALITIES (STRICTLY REQUIRE ADMIN ROLE)
// =========================================================================

// Admin Dashboard Overview & Real-time Stats
app.get('/api/admin/stats', requireAdmin, (req, res) => {
  const allOrders = Array.from(ordersDb.values());
  const allProducts = Array.from(productsDb.values());
  const allCustomers = Array.from(usersDb.values()).filter((u) => u.role === 'customer');

  const totalRevenue = allOrders
    .filter((o) => o.status !== 'cancelled')
    .reduce((acc, o) => acc + (o.total || 0), 0);

  const pendingOrders = allOrders.filter((o) => o.status === 'pending').length;
  const processingOrders = allOrders.filter((o) => o.status === 'processing' || o.status === 'confirmed').length;
  const lowStockCount = allProducts.filter((p) => p.stockQuantity <= p.lowStockThreshold).length;

  return res.json({
    success: true,
    stats: {
      totalRevenue,
      totalOrders: allOrders.length,
      pendingOrders,
      processingOrders,
      totalProducts: allProducts.length,
      lowStockCount,
      totalCustomers: allCustomers.length,
    },
  });
});

// Admin Customers Management
app.get('/api/admin/customers', requireAdmin, (req, res) => {
  const customers = Array.from(usersDb.values())
    .filter((u) => u.role === 'customer')
    .map((u) => {
      const custOrders = Array.from(ordersDb.values()).filter(
        (o) => o.customer.email === u.email || o.customer.phone === u.phone
      );
      const totalSpent = custOrders
        .filter((o) => o.status !== 'cancelled')
        .reduce((sum, o) => sum + (o.total || 0), 0);

      return {
        id: u.id,
        fullName: u.fullName,
        email: u.email,
        phone: u.phone,
        address: u.address || 'Savar, Dhaka',
        district: u.district || 'Dhaka',
        area: u.area || 'Savar',
        status: u.isBlocked ? ('blocked' as const) : ('active' as const),
        notes: u.notes || '',
        totalOrders: custOrders.length,
        totalSpent,
        createdAt: u.createdAt,
      };
    });

  return res.json({ success: true, customers });
});

// Admin Toggle Customer Block Status
app.put('/api/admin/customers/:id/block', requireAdmin, (req, res) => {
  const user = usersDb.get(req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, error: 'Customer not found.' });
  }

  user.isBlocked = !user.isBlocked;
  usersDb.set(user.id, user);

  return res.json({
    success: true,
    message: `Customer ${user.isBlocked ? 'blocked' : 'unblocked'} successfully.`,
    isBlocked: user.isBlocked,
    customerId: user.id,
  });
});

// Admin Update Customer Notes
app.put('/api/admin/customers/:id/notes', requireAdmin, (req, res) => {
  const user = usersDb.get(req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, error: 'Customer not found.' });
  }

  user.notes = req.body.notes || '';
  usersDb.set(user.id, user);

  return res.json({
    success: true,
    message: 'Customer notes updated.',
    notes: user.notes,
    customerId: user.id,
  });
});

// Admin Stock Adjustment & Logging
app.post('/api/admin/stock-adjust', requireAdmin, (req, res) => {
  const { productId, newStock, reason, type } = req.body;
  const prod = productsDb.get(productId);
  if (!prod) {
    return res.status(404).json({ success: false, error: 'Product not found.' });
  }

  const prevStock = prod.stockQuantity;
  const targetStock = Math.max(0, Number(newStock) || 0);
  prod.stockQuantity = targetStock;
  prod.stockStatus = targetStock > 0 ? 'in_stock' : 'out_of_stock';
  prod.updatedAt = new Date().toISOString();
  productsDb.set(prod.id, prod);

  const session = getSessionFromReq(req);
  const log: StockMovementLog = {
    id: `stk-${Date.now()}`,
    productId: prod.id,
    productName: prod.name,
    sku: prod.sku,
    type: type || 'adjustment',
    previousStock: prevStock,
    newStock: targetStock,
    quantityChange: targetStock - prevStock,
    reason: reason || 'Manual Admin stock calibration',
    timestamp: new Date().toLocaleString('en-GB'),
    operator: session?.fullName || 'Shop Admin',
  };
  stockLogsDb.set(log.id, log);

  broadcastRealtimeEvent('catalog_updated', { action: 'stock_adjusted', product: prod, log });

  return res.json({
    success: true,
    message: 'Stock adjusted successfully.',
    product: prod,
    log,
  });
});

// Admin Get Stock Movement Logs
app.get('/api/admin/stock-logs', requireAdmin, (req, res) => {
  const logs = Array.from(stockLogsDb.values()).reverse();
  return res.json({ success: true, logs });
});

// Admin Get All Store Orders
app.get('/api/admin/orders', requireAdmin, (req, res) => {
  const allOrders = Array.from(ordersDb.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return res.json({ success: true, orders: allOrders });
});

// =========================================================================
// 7. PRODUCTS API (SINGLE SOURCE OF TRUTH + OWNER AUTHORIZATION)
// =========================================================================

// Public / Catalog Fetching (Customers only see 'active' products; Owner can view all)
app.get('/api/products', (req, res) => {
  const session = getSessionFromReq(req);
  const isOwner = session?.role === 'owner';
  const includeAll = req.query.includeAll === 'true' && isOwner;

  let allProds = Array.from(productsDb.values());

  if (!includeAll) {
    allProds = allProds.filter((p) => p.status === 'active');
  }

  // Sort by createdAt descending
  allProds.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

  res.json({
    success: true,
    total: allProds.length,
    products: allProds,
  });
});

app.get('/api/products/:id', (req, res) => {
  const prod = productsDb.get(req.params.id);
  if (!prod) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }

  const session = getSessionFromReq(req);
  if (prod.status !== 'active' && session?.role !== 'owner') {
    return res.status(404).json({ success: false, error: 'Product not available' });
  }

  res.json({ success: true, product: prod });
});

// CREATE PRODUCT — OWNER ONLY
app.post('/api/products', requireAdmin, (req, res) => {
  try {
    const data = req.body;
    if (!data.name || !data.brand || !data.regularPrice) {
      return res.status(400).json({ success: false, error: 'Product name, brand, and regular price are required.' });
    }

    const id = data.id || `prod-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const slug =
      data.slug ||
      data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const newProduct: Product = {
      id,
      name: data.name.trim(),
      slug,
      brand: data.brand.trim(),
      categoryId: data.categoryId || 'hardware',
      categoryName: data.categoryName || 'Hardware',
      subCategory: data.subCategory || '',
      model: data.model || '',
      sku: data.sku || `BIT-${Date.now().toString().slice(-4)}`,
      barcode: data.barcode || `880${Date.now().toString().slice(-7)}`,
      purchasePrice: Number(data.purchasePrice) || 0,
      regularPrice: Number(data.regularPrice) || 0,
      discountPrice: data.discountPrice ? Number(data.discountPrice) : undefined,
      wholesalePrice: data.wholesalePrice ? Number(data.wholesalePrice) : undefined,
      isSpecialOffer: Boolean(data.isSpecialOffer),
      stockStatus: data.stockStatus || 'in_stock',
      stockQuantity: Number(data.stockQuantity) >= 0 ? Number(data.stockQuantity) : 10,
      lowStockThreshold: Number(data.lowStockThreshold) || 2,
      warranty: data.warranty || 'Official Brand Warranty',
      condition: data.condition || 'brand_new',
      rating: data.rating || 5.0,
      reviewCount: data.reviewCount || 1,
      mainImage:
        data.mainImage ||
        'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&auto=format&fit=crop&q=80',
      images: Array.isArray(data.images) && data.images.length > 0 ? data.images : [data.mainImage || 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&auto=format&fit=crop&q=80'],
      shortDescription: data.shortDescription || '',
      fullDescription: data.fullDescription || '',
      specifications: data.specifications || {},
      tags: Array.isArray(data.tags) ? data.tags : [data.brand || 'Tech'],
      isFeatured: Boolean(data.isFeatured),
      isBestSeller: Boolean(data.isBestSeller),
      isNewArrival: Boolean(data.isNewArrival),
      status: data.status || 'active', // DEFAULT TO ACTIVE
      pcBuilderSlot: data.pcBuilderSlot || '',
      compatibility: data.compatibility || {},
      seoTitle: data.seoTitle || data.name,
      seoDescription: data.seoDescription || data.shortDescription,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    productsDb.set(id, newProduct);

    // Live broadcast to all connected clients & storefronts
    broadcastRealtimeEvent('catalog_updated', { action: 'created', product: newProduct });

    return res.status(201).json({
      success: true,
      message: 'Product created successfully and published.',
      product: newProduct,
    });
  } catch (err) {
    console.error('Error creating product:', err);
    return res.status(500).json({ success: false, error: 'Failed to create product.' });
  }
});

// UPDATE PRODUCT — OWNER ONLY
app.put('/api/products/:id', requireAdmin, (req, res) => {
  try {
    const existing = productsDb.get(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Product not found.' });
    }

    const data = req.body;
    const updated: Product = {
      ...existing,
      ...data,
      id: existing.id,
      regularPrice: data.regularPrice !== undefined ? Number(data.regularPrice) : existing.regularPrice,
      discountPrice: data.discountPrice !== undefined ? (data.discountPrice ? Number(data.discountPrice) : undefined) : existing.discountPrice,
      stockQuantity: data.stockQuantity !== undefined ? Number(data.stockQuantity) : existing.stockQuantity,
      updatedAt: new Date().toISOString(),
    };

    productsDb.set(existing.id, updated);

    // Broadcast live catalog update
    broadcastRealtimeEvent('catalog_updated', { action: 'updated', product: updated });

    return res.json({
      success: true,
      message: 'Product updated successfully.',
      product: updated,
    });
  } catch (err) {
    console.error('Error updating product:', err);
    return res.status(500).json({ success: false, error: 'Failed to update product.' });
  }
});

// DELETE PRODUCT — OWNER ONLY
app.delete('/api/products/:id', requireAdmin, (req, res) => {
  try {
    const existing = productsDb.get(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Product not found.' });
    }

    productsDb.delete(req.params.id);

    broadcastRealtimeEvent('catalog_updated', { action: 'deleted', productId: req.params.id });

    return res.json({
      success: true,
      message: 'Product removed from catalog.',
      productId: req.params.id,
    });
  } catch (err) {
    console.error('Error deleting product:', err);
    return res.status(500).json({ success: false, error: 'Failed to delete product.' });
  }
});

// =========================================================================
// 8. CATEGORIES API
// =========================================================================

app.get('/api/categories', (req, res) => {
  const session = getSessionFromReq(req);
  let cats = Array.from(categoriesDb.values());
  if (session?.role !== 'owner') {
    cats = cats.filter((c) => c.isActive !== false);
  }
  cats.sort((a, b) => (a.order || 0) - (b.order || 0));
  res.json({ success: true, categories: cats });
});

app.post('/api/categories', requireAdmin, (req, res) => {
  try {
    const data = req.body;
    if (!data.name) {
      return res.status(400).json({ success: false, error: 'Category name is required.' });
    }

    const id = data.id || data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newCategory: CategoryInfo = {
      id,
      name: data.name.trim(),
      slug: data.slug || id,
      iconName: data.iconName || 'Cpu',
      description: data.description || '',
      image: data.image || '',
      isActive: data.isActive !== false,
      order: Number(data.order) || categoriesDb.size + 1,
    };

    categoriesDb.set(id, newCategory);
    broadcastRealtimeEvent('catalog_updated', { action: 'category_created', category: newCategory });

    return res.status(201).json({ success: true, category: newCategory });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to create category.' });
  }
});

app.put('/api/categories/:id', requireAdmin, (req, res) => {
  const existing = categoriesDb.get(req.params.id);
  if (!existing) {
    return res.status(404).json({ success: false, error: 'Category not found.' });
  }

  const updated: CategoryInfo = {
    ...existing,
    ...req.body,
    id: existing.id,
  };

  categoriesDb.set(existing.id, updated);
  broadcastRealtimeEvent('catalog_updated', { action: 'category_updated', category: updated });

  return res.json({ success: true, category: updated });
});

app.delete('/api/categories/:id', requireAdmin, (req, res) => {
  if (!categoriesDb.has(req.params.id)) {
    return res.status(404).json({ success: false, error: 'Category not found.' });
  }
  categoriesDb.delete(req.params.id);
  broadcastRealtimeEvent('catalog_updated', { action: 'category_deleted', categoryId: req.params.id });
  return res.json({ success: true, message: 'Category deleted.' });
});

// =========================================================================
// 9. WEBSITE SETTINGS & CUSTOMIZATION API (FULL OWNER CONFIGURATION)
// =========================================================================

// Public fetch for website settings
app.get('/api/settings', (req, res) => {
  res.json({
    success: true,
    settings: siteSettings,
  });
});

// Owner-Only Update Settings
app.put('/api/settings', requireAdmin, (req, res) => {
  try {
    const updates = req.body;
    if (!updates || typeof updates !== 'object') {
      return res.status(400).json({ success: false, error: 'Invalid settings payload.' });
    }

    siteSettings = {
      ...siteSettings,
      ...updates,
      // Deep merge hero & banners if provided
      hero: {
        ...siteSettings.hero,
        ...(updates.hero || {}),
      },
      banners: updates.banners || siteSettings.banners,
      bankDetails: {
        ...siteSettings.bankDetails,
        ...(updates.bankDetails || {}),
      },
    };

    // Live broadcast to all open storefronts
    broadcastRealtimeEvent('settings_updated', { settings: siteSettings });

    return res.json({
      success: true,
      message: 'Website settings saved and published successfully.',
      settings: siteSettings,
    });
  } catch (err) {
    console.error('Error saving settings:', err);
    return res.status(500).json({ success: false, error: 'Failed to update website settings.' });
  }
});

// =========================================================================
// 10. CUSTOM CMS PAGES API
// =========================================================================

app.get('/api/custom-pages', (req, res) => {
  const session = getSessionFromReq(req);
  let pages = Array.from(customPagesDb.values());
  if (session?.role !== 'owner') {
    pages = pages.filter((p) => p.isPublished !== false);
  }
  res.json({ success: true, pages });
});

app.post('/api/custom-pages', requireAdmin, (req, res) => {
  try {
    const data = req.body;
    if (!data.title) {
      return res.status(400).json({ success: false, error: 'Page title is required.' });
    }

    const id = data.id || `page-${Date.now()}`;
    const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newPage: CustomPage = {
      id,
      title: data.title.trim(),
      slug,
      content: data.content || '',
      isPublished: data.isPublished !== false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    customPagesDb.set(id, newPage);
    return res.status(201).json({ success: true, page: newPage });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to create page.' });
  }
});

app.put('/api/custom-pages/:id', requireAdmin, (req, res) => {
  const existing = customPagesDb.get(req.params.id);
  if (!existing) {
    return res.status(404).json({ success: false, error: 'Page not found.' });
  }

  const updated: CustomPage = {
    ...existing,
    ...req.body,
    id: existing.id,
    updatedAt: new Date().toISOString(),
  };

  customPagesDb.set(existing.id, updated);
  return res.json({ success: true, page: updated });
});

app.delete('/api/custom-pages/:id', requireAdmin, (req, res) => {
  if (!customPagesDb.has(req.params.id)) {
    return res.status(404).json({ success: false, error: 'Page not found.' });
  }
  customPagesDb.delete(req.params.id);
  return res.json({ success: true, message: 'Page deleted.' });
});

// =========================================================================
// 11. REAL-TIME CUSTOMER <-> OWNER CHAT & MESSAGING API
// =========================================================================

// 1. Get Conversations (Owner gets all; Customer gets their own)
app.get('/api/chat/conversations', (req, res) => {
  const session = getSessionFromReq(req);
  const isOwner = session?.role === 'owner';
  const customerIdQuery = req.query.customerId as string;

  let convs = Array.from(conversationsDb.values());

  if (!isOwner) {
    // Filter to requested customer or session user
    const targetCustId = session?.userId || customerIdQuery;
    if (targetCustId) {
      convs = convs.filter((c) => c.customerId === targetCustId);
    } else {
      convs = [];
    }
  }

  // Sort by latest message time
  convs.sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());

  res.json({
    success: true,
    conversations: convs,
    unreadTotal: convs.reduce((acc, c) => acc + (isOwner ? c.unreadByAdminCount : c.unreadByCustomerCount), 0),
  });
});

// 2. Get Messages for a Conversation
app.get('/api/chat/messages/:conversationId', (req, res) => {
  const convId = req.params.conversationId;
  const session = getSessionFromReq(req);
  const isOwner = session?.role === 'owner';

  const conv = conversationsDb.get(convId);
  if (!conv && !convId.startsWith('conv-')) {
    return res.status(404).json({ success: false, error: 'Conversation not found' });
  }

  // Security: Customer can only view their own conversation
  if (!isOwner && conv && session?.userId && conv.customerId !== session.userId) {
    return res.status(403).json({ success: false, error: 'Forbidden: You cannot access another customer’s chat.' });
  }

  const msgs = Array.from(messagesDb.values())
    .filter((m) => m.conversationId === convId)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  res.json({
    success: true,
    messages: msgs,
    conversation: conv || null,
  });
});

// 3. Send Message (Customer or Owner) — AUTO CREATES CONVERSATION ON FIRST MESSAGE!
app.post('/api/chat/messages', (req, res) => {
  try {
    const {
      senderRole,
      content,
      conversationId: requestedConvId,
      customerId,
      customerName,
      customerPhone,
      customerEmail,
      productAttachment,
    } = req.body;

    if (!content && !productAttachment) {
      return res.status(400).json({ success: false, error: 'Message content or attachment is required.' });
    }

    const session = getSessionFromReq(req);
    const isOwner = session?.role === 'owner';

    // Enforce role security: If sending as owner/staff, session MUST be owner
    let actualSenderRole: ChatMessage['senderRole'] = 'customer';
    let actualSenderName = customerName || 'Customer';
    let actualSenderId = customerId || session?.userId || 'guest-visitor';

    if (senderRole === 'owner' || senderRole === 'admin' || senderRole === 'staff') {
      if (!isOwner) {
        return res.status(403).json({ success: false, error: 'Forbidden: Unauthorized staff impersonation.' });
      }
      actualSenderRole = 'owner';
      actualSenderName = session?.fullName || 'BAARIZ IT Official';
      actualSenderId = session?.userId || ADMIN_CONFIG.id;
    }

    // Determine or create Conversation
    let convId = requestedConvId;
    let targetCustId = customerId || (actualSenderRole === 'customer' ? actualSenderId : '');

    let conv = convId ? conversationsDb.get(convId) : null;

    if (!conv && targetCustId) {
      // Look up conversation by customerId
      conv = Array.from(conversationsDb.values()).find((c) => c.customerId === targetCustId) || null;
      if (conv) {
        convId = conv.id;
      }
    }

    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // Auto-create new conversation if this is first message
    if (!conv) {
      convId = convId || `conv-${targetCustId || Date.now()}`;
      conv = {
        id: convId,
        customerId: targetCustId || 'guest-visitor',
        customerName: customerName || (actualSenderRole === 'customer' ? actualSenderName : 'Customer Inquiry'),
        customerPhone: customerPhone || (session?.phone || ''),
        customerEmail: customerEmail || (session?.email || ''),
        lastMessage: content || 'Sent an attachment',
        lastMessageAt: dateStr,
        unreadByAdminCount: actualSenderRole === 'customer' ? 1 : 0,
        unreadByCustomerCount: actualSenderRole === 'owner' ? 1 : 0,
        status: 'active',
      };
      conversationsDb.set(convId, conv);
    } else {
      // Update existing conversation
      conv.lastMessage = content || 'Sent an attachment';
      conv.lastMessageAt = dateStr;
      if (customerName && conv.customerName === 'Customer') conv.customerName = customerName;
      if (customerPhone && !conv.customerPhone) conv.customerPhone = customerPhone;

      if (actualSenderRole === 'customer') {
        conv.unreadByAdminCount += 1;
      } else {
        conv.unreadByCustomerCount += 1;
      }
      conversationsDb.set(conv.id, conv);
    }

    // Create and save message
    const msgId = `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newMessage: ChatMessage = {
      id: msgId,
      conversationId: conv.id,
      senderId: actualSenderId,
      senderName: actualSenderName,
      senderRole: actualSenderRole,
      content: content ? content.trim() : '',
      timestamp: dateStr,
      isRead: false,
      productAttachment: productAttachment || undefined,
    };

    messagesDb.set(msgId, newMessage);

    // Live broadcast to all connected SSE clients
    broadcastRealtimeEvent('new_message', {
      message: newMessage,
      conversation: conv,
    });

    return res.status(201).json({
      success: true,
      message: newMessage,
      conversation: conv,
    });
  } catch (err) {
    console.error('Error sending chat message:', err);
    return res.status(500).json({ success: false, error: 'Failed to send message.' });
  }
});

// 4. Mark Conversation as Read
app.post('/api/chat/mark-read', (req, res) => {
  const { conversationId, readerRole } = req.body;
  const conv = conversationsDb.get(conversationId);
  if (!conv) {
    return res.json({ success: true });
  }

  if (readerRole === 'admin' || readerRole === 'owner') {
    conv.unreadByAdminCount = 0;
  } else {
    conv.unreadByCustomerCount = 0;
  }

  // Mark all messages in this conversation as read
  for (const msg of messagesDb.values()) {
    if (msg.conversationId === conversationId) {
      msg.isRead = true;
    }
  }

  conversationsDb.set(conv.id, conv);
  broadcastRealtimeEvent('conversation_updated', { conversation: conv });

  return res.json({ success: true, conversation: conv });
});

// 5. Real-Time SSE Stream Endpoint
app.get('/api/chat/stream', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });

  const session = getSessionFromReq(req);
  const role = session?.role || (req.query.role as string) || 'customer';
  const client = {
    res,
    role,
    userId: session?.userId || (req.query.userId as string),
    convId: req.query.convId as string,
  };

  sseClients.add(client);
  res.write(`data: ${JSON.stringify({ type: 'connected', time: Date.now() })}\n\n`);

  req.on('close', () => {
    sseClients.delete(client);
  });
});

// 6. Polling Updates Fallback (Returns events since timestamp)
app.get('/api/chat/updates', (req, res) => {
  const since = Number(req.query.since) || 0;
  const convId = req.query.convId as string;

  const filtered = realtimeEvents.filter((e) => e.timestamp > since);

  // Also return latest conversation & messages if convId given
  let convMessages: ChatMessage[] = [];
  let convData: Conversation | null = null;
  if (convId) {
    convData = conversationsDb.get(convId) || null;
    convMessages = Array.from(messagesDb.values())
      .filter((m) => m.conversationId === convId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  res.json({
    success: true,
    serverTime: Date.now(),
    events: filtered,
    conversation: convData,
    messages: convMessages,
    allConversations: Array.from(conversationsDb.values()),
  });
});

// =========================================================================
// 12. ORDERS API
// =========================================================================

app.get('/api/orders', (req, res) => {
  const session = getSessionFromReq(req);
  const isOwner = session?.role === 'owner';

  let orders = Array.from(ordersDb.values());
  if (!isOwner) {
    if (session?.userId) {
      orders = orders.filter((o) => o.customer.email === session.email || o.customer.phone === session.phone);
    } else {
      orders = [];
    }
  }

  orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json({ success: true, orders });
});

app.post('/api/orders', (req, res) => {
  try {
    const data = req.body;
    if (!data.customer || !data.items || data.items.length === 0) {
      return res.status(400).json({ success: false, error: 'Invalid order payload.' });
    }

    const id = `BIT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id,
      orderNumber: id,
      createdAt: new Date().toISOString(),
      customer: data.customer,
      items: data.items,
      subtotal: Number(data.subtotal) || 0,
      deliveryFee: Number(data.deliveryFee) || 0,
      discount: Number(data.discount) || 0,
      couponCode: data.couponCode || '',
      total: Number(data.total) || 0,
      paymentMethod: data.paymentMethod || 'cod',
      paymentStatus: data.paymentStatus || 'pending',
      transactionId: data.transactionId || '',
      senderNumber: data.senderNumber || '',
      status: 'pending',
      trackingHistory: [
        {
          status: 'pending',
          title: 'Order Placed Successfully',
          timestamp: new Date().toISOString(),
          note: 'Your hardware order has been registered at BAARIZ IT.',
          completed: true,
        },
      ],
      adminNotes: '',
    };

    ordersDb.set(id, newOrder);

    // Deduct stock
    for (const item of newOrder.items) {
      const prod = productsDb.get(item.productId);
      if (prod) {
        prod.stockQuantity = Math.max(0, prod.stockQuantity - (item.quantity || 1));
        if (prod.stockQuantity === 0) prod.stockStatus = 'out_of_stock';
        productsDb.set(prod.id, prod);
      }
    }

    broadcastRealtimeEvent('order_updated', { order: newOrder });

    return res.status(201).json({
      success: true,
      message: 'Order created successfully.',
      order: newOrder,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to place order.' });
  }
});

app.put('/api/orders/:id/status', requireAdmin, (req, res) => {
  const order = ordersDb.get(req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, error: 'Order not found.' });
  }

  const { status, note } = req.body;
  if (status) {
    order.status = status;
    order.trackingHistory.push({
      status,
      title: `Status changed to ${status.toUpperCase()}`,
      timestamp: new Date().toISOString(),
      note: note || `Order updated by shop administrator.`,
      completed: true,
    });
  }

  ordersDb.set(order.id, order);
  broadcastRealtimeEvent('order_updated', { order });

  return res.json({ success: true, order });
});

app.get('/api/orders/track/:query', (req, res) => {
  const q = req.params.query.trim().toLowerCase();
  const order = Array.from(ordersDb.values()).find(
    (o) =>
      o.id.toLowerCase() === q ||
      o.orderNumber.toLowerCase() === q ||
      o.customer.phone.replace(/[^0-9]/g, '') === q.replace(/[^0-9]/g, '')
  );

  if (!order) {
    return res.status(404).json({ success: false, error: 'No order found with provided tracking identifier.' });
  }

  return res.json({ success: true, order });
});

// =========================================================================
// 12. SERVER-SIDE ROLE VERIFICATION FOR /admin AND /admin/*
// =========================================================================

// Intercept direct server requests to /admin & /admin/* to verify roles server-side
app.all(['/admin', '/admin/*'], (req, res, next) => {
  const session = getSessionFromReq(req);
  if (!session || (session.role !== 'owner' && (session.role as string) !== 'admin')) {
    res.status(403);

    // If request wants HTML (e.g. direct browser navigation to /admin)
    if (
      req.accepts('html') &&
      !req.xhr &&
      !req.headers.authorization &&
      !req.path.endsWith('.js') &&
      !req.path.endsWith('.css') &&
      !req.path.endsWith('.json')
    ) {
      return res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>403 Forbidden - BAARIZ IT</title>
  <style>
    body { background-color: #020617; color: #f8fafc; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; }
    .card { background: #0f172a; border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 24px; padding: 40px; max-width: 480px; width: 100%; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); text-align: center; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; background: rgba(239, 68, 68, 0.1); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.2); font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 16px; }
    h1 { font-size: 28px; font-weight: 800; margin: 0 0 12px; color: #ffffff; }
    p { color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 0 0 24px; }
    .btn-group { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
    a.btn-primary { display: inline-flex; align-items: center; justify-content: center; background: #06b6d4; color: #020617; font-weight: 700; text-decoration: none; padding: 12px 20px; border-radius: 12px; font-size: 14px; transition: background 0.2s; }
    a.btn-primary:hover { background: #22d3ee; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">HTTP 403 Forbidden</div>
    <h1>Access Denied</h1>
    <p>Server-side role verification failed. Users with 'customer' or unauthenticated roles are forbidden from accessing /admin or any administrative functionalities.</p>
    <div class="btn-group">
      <a href="/" class="btn-primary">Return to Storefront</a>
    </div>
  </div>
</body>
</html>`);
    }

    return res.json({
      success: false,
      status: 403,
      error: '403 Forbidden',
      message: 'Access Denied: Administrative privileges required to access /admin.',
    });
  }
  next();
});

// =========================================================================
// 13. VITE SPA INTEGRATION & SERVER BOOTSTRAP
// =========================================================================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BAARIZ IT Real-Time Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
