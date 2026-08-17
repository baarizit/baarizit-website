import {
  CategoryInfo,
  Product,
  ServiceItem,
  Review,
  Order,
  Coupon,
  SiteSettings,
  BrandInfo,
  CustomPage,
  Customer,
  StockMovementLog,
  Conversation,
  ChatMessage,
  AppNotification,
} from '../types';

export const INITIAL_SETTINGS: SiteSettings = {
  shopName: 'BAARIZ IT',
  tagline: 'More Tech, More Possibilities',
  phone: '01622615188',
  whatsapp: '01622615188',
  email: 'baarizit@gmail.com',
  address: 'Shop A/23, 3rd Floor, Block A, National Blind Welfare Association Shopping Complex, Savar Bus Stand',
  fullAddress: 'National Blind Welfare Association Shopping Complex, 3rd Floor, Block A, Shop A/23, Savar Bus Stand, Savar, Dhaka, Bangladesh',
  googleMapsEmbedUrl: 'https://maps.google.com/maps?q=National%20Blind%20Welfare%20Association%20Shopping%20Complex%2C%20Savar%20Bus%20Stand%2C%20Savar%2C%20Dhaka&t=&z=16&ie=UTF8&iwloc=&output=embed',
  businessHours: 'Saturday – Thursday: 10:00 AM – 9:00 PM | Friday: 3:00 PM – 9:30 PM',
  logoUrl: '',
  faviconUrl: '',
  announcementText: 'Welcome to BAARIZ IT — More Tech, More Possibilities | Savar, Dhaka, Bangladesh',
  isAnnouncementEnabled: true,
  themeAccent: 'cyan',
  fontStyle: 'sans',
  deliveryFeeSavar: 60,
  deliveryFeeDhaka: 100,
  deliveryFeeNationwide: 150,
  freeDeliveryThreshold: 0,
  estimatedDeliveryDhaka: '24 - 48 Hours',
  estimatedDeliveryOutside: '2 - 4 Days',
  isCodEnabled: true,
  isBkashEnabled: false,
  bkashNumber: '',
  bkashInstructions: 'Send Money to personal bKash or make Merchant Payment, then input the Transaction ID.',
  isNagadEnabled: false,
  nagadNumber: '',
  nagadInstructions: 'Send Money to personal Nagad number, then provide your Transaction ID and Sender Number.',
  isBankEnabled: false,
  bankDetails: {
    bankName: '',
    accountName: 'BAARIZ IT',
    accountNumber: '',
    branch: '',
    routingNumber: '',
  },
  facebookUrl: '',
  whatsappUrl: 'https://wa.me/8801622615188',
  youtubeUrl: '',
  instagramUrl: '',
  tiktokUrl: '',
  footerDescription: 'BAARIZ IT is your premier destination for genuine computer components, custom gaming PCs, laptops, and professional repair servicing in Savar, Dhaka.',
  copyrightText: '© 2026 BAARIZ IT. All Rights Reserved.',
  metaTitle: 'BAARIZ IT — More Tech, More Possibilities | Computer & Laptop Shop Savar',
  metaDescription: 'Shop genuine PC components, gaming laptops, processors, graphics cards, and expert PC servicing at BAARIZ IT in Savar Bus Stand, Dhaka.',
  keywords: 'computer shop savar, baariz it, pc builder bangladesh, laptop repair savar, graphics card bd, processor price bd',
  ogImage: '',
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
    featuresList: [
      '100% Authentic Products',
      'Official Manufacturer Warranty',
      'Same-Day Delivery in Savar',
      'Expert On-Site Servicing & Repairs',
    ],
  },
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

// STRICT FRESH INSTALLATION — ALL BUSINESS RECORDS START EMPTY
export const CATEGORIES_DATA: CategoryInfo[] = [];

export const INITIAL_PRODUCTS: Product[] = [];

export const SERVICES_DATA: ServiceItem[] = [];

export const REVIEWS_DATA: Review[] = [];

export const INITIAL_ORDERS: Order[] = [];

export const INITIAL_COUPONS: Coupon[] = [];

export const INITIAL_BRANDS: BrandInfo[] = [];

export const INITIAL_CUSTOM_PAGES: CustomPage[] = [];

export const INITIAL_CUSTOMERS: Customer[] = [];

export const INITIAL_STOCK_LOGS: StockMovementLog[] = [];

export const INITIAL_CONVERSATIONS: Conversation[] = [];

export const INITIAL_MESSAGES: ChatMessage[] = [];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [];
