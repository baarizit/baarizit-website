import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product, Order, OrderStatus, CategoryInfo, CustomPage, Customer } from '../../types';
import { apiVerifyAdmin } from '../../services/api';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Clock,
  Truck,
  Search,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  X,
  Printer,
  Save,
  FileCode,
  FileText,
  Eye,
  ExternalLink,
  Globe,
  MessageSquare,
  UserCheck,
  UserX,
  Ban,
  Send,
  Phone,
  Mail,
  Lock,
  Sliders,
  MapPin,
  Sparkles,
  CreditCard,
  ImageIcon,
  Loader2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SitemapManager } from './SitemapManager';
import { AdminLogin } from './AdminLogin';
import { AccessDenied } from './AccessDenied';

export const AdminDashboard: React.FC = () => {
  const {
    currentUser,
    isAdminVerified,
    products,
    categories,
    orders,
    customPages,
    customers,
    toggleBlockCustomer,
    updateCustomerNotes,
    conversations,
    messages,
    sendMessage,
    markConversationAsRead,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    updateCategory,
    deleteCategory,
    addCustomPage,
    updateCustomPage,
    deleteCustomPage,
    updateOrderStatus,
    settings,
    updateSettings,
    setActivePage,
    addToast,
  } = useStore();

  const [activeTab, setActiveTab] = useState<
    'products' | 'orders' | 'categories' | 'sitemap' | 'pages' | 'customers' | 'chat' | 'settings'
  >('sitemap');

  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  // Customer Management state
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerStatusFilter, setCustomerStatusFilter] = useState<'all' | 'active' | 'blocked'>('all');
  const [editingNotesCustomerId, setEditingNotesCustomerId] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState('');

  // Live Chat Management state
  const [selectedChatConvId, setSelectedChatConvId] = useState<string | null>(null);
  const [adminChatInput, setAdminChatInput] = useState('');

  // Product Form Modal state (Create / Edit)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: '',
    brand: '',
    categoryId: 'processor',
    regularPrice: 10000,
    discountPrice: 0,
    sku: '',
    stockStatus: 'in_stock',
    stockQuantity: 10,
    warranty: '3 Years Official Warranty',
    mainImage: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&auto=format&fit=crop&q=80',
    shortDescription: '',
    fullDescription: '',
    isFeatured: false,
    isSpecialOffer: false,
    status: 'active',
  });

  // Custom Page Form Modal state
  const [isPageModalOpen, setIsPageModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<CustomPage | null>(null);
  const [pageForm, setPageForm] = useState<Partial<CustomPage>>({
    title: '',
    slug: '',
    content: '',
    isPublished: true,
  });

  // Category Modal state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryForm, setCategoryForm] = useState<Partial<CategoryInfo>>({
    name: '',
    slug: '',
    description: '',
    isActive: true,
  });

  // Settings form state
  const [settingsForm, setSettingsForm] = useState({ ...settings });

  // Server-Side Role Verification Guard
  const [authStatus, setAuthStatus] = useState<'checking' | 'authorized' | 'forbidden' | 'unauthenticated'>('checking');
  const [serverAuthError, setServerAuthError] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    const verifyWithServer = async () => {
      const token = localStorage.getItem('baariz_it_token');
      if (!token) {
        if (isMounted) {
          setAuthStatus('unauthenticated');
        }
        return;
      }

      try {
        const verifyRes = await apiVerifyAdmin(token);
        if (!isMounted) return;

        if (verifyRes.status === 403 || !verifyRes.isAdmin) {
          setAuthStatus('forbidden');
          setServerAuthError(verifyRes.error || '403 Forbidden: Access Denied. Admin privileges required.');
        } else if (verifyRes.success && verifyRes.isAdmin) {
          setAuthStatus('authorized');
        } else {
          setAuthStatus('unauthenticated');
        }
      } catch {
        if (isMounted) {
          setAuthStatus('forbidden');
          setServerAuthError('403 Forbidden: Server verification failed.');
        }
      }
    };

    verifyWithServer();
    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  if (authStatus === 'checking') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-400">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mb-3" />
        <p className="text-sm font-medium">Verifying administrative credentials with server...</p>
      </div>
    );
  }

  if (authStatus === 'unauthenticated') {
    return <AdminLogin />;
  }

  if (authStatus === 'forbidden') {
    return <AccessDenied serverError={serverAuthError} />;
  }

  // Calculate high-level financial stats
  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((acc, o) => acc + (o.total || 0), 0);

  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      brand: '',
      categoryId: categories[0]?.id || 'processor',
      regularPrice: 5000,
      discountPrice: 0,
      sku: `BIT-${Date.now().toString().slice(-4)}`,
      stockStatus: 'in_stock',
      stockQuantity: 10,
      warranty: '2 Years Official Warranty',
      mainImage: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&auto=format&fit=crop&q=80',
      shortDescription: '',
      fullDescription: '',
      isFeatured: false,
      isSpecialOffer: false,
      status: 'active',
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProductForm({ ...prod });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name?.trim() || !productForm.brand?.trim()) {
      addToast('warning', 'Missing Information', 'Please provide product name and brand.');
      return;
    }

    const catObj = categories.find((c) => c.id === productForm.categoryId);
    const slug =
      productForm.slug ||
      productForm.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        ...productForm,
        slug,
        categoryName: catObj ? catObj.name : 'Hardware',
        updatedAt: new Date().toISOString(),
      });
      addToast('success', 'Product Updated', `${productForm.name} saved successfully.`);
    } else {
      addProduct({
        name: productForm.name || '',
        slug,
        brand: productForm.brand || '',
        categoryId: (productForm.categoryId as string) || 'hardware',
        categoryName: catObj ? catObj.name : 'Hardware',
        regularPrice: Number(productForm.regularPrice) || 0,
        discountPrice: productForm.discountPrice ? Number(productForm.discountPrice) : undefined,
        sku: productForm.sku || `BIT-${Date.now().toString().slice(-4)}`,
        barcode: `880${Date.now().toString().slice(-7)}`,
        stockStatus: productForm.stockStatus || 'in_stock',
        stockQuantity: Number(productForm.stockQuantity) || 1,
        lowStockThreshold: 2,
        warranty: productForm.warranty || 'Official Warranty',
        condition: 'brand_new',
        mainImage:
          productForm.mainImage ||
          'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&auto=format&fit=crop&q=80',
        images: [],
        shortDescription: productForm.shortDescription || '',
        fullDescription: productForm.fullDescription || '',
        specifications: { Model: productForm.name || '' },
        tags: [productForm.brand || '', catObj?.name || 'Hardware'],
        isFeatured: Boolean(productForm.isFeatured),
        isSpecialOffer: Boolean(productForm.isSpecialOffer),
        rating: 5.0,
        reviewCount: 1,
        status: (productForm.status as any) || 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      addToast('success', 'Product Created', 'New item added to BAARIZ IT catalog & dynamic sitemap.');
    }
    setIsProductModalOpen(false);
  };

  // Custom Page Handlers
  const handleOpenAddPage = () => {
    setEditingPage(null);
    setPageForm({
      title: '',
      slug: '',
      content: '',
      isPublished: true,
    });
    setIsPageModalOpen(true);
  };

  const handleOpenEditPage = (page: CustomPage) => {
    setEditingPage(page);
    setPageForm({ ...page });
    setIsPageModalOpen(true);
  };

  const handleSavePage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pageForm.title?.trim()) {
      addToast('warning', 'Title Required', 'Please enter a page title.');
      return;
    }

    const slug =
      pageForm.slug?.trim() ||
      pageForm.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    if (editingPage) {
      updateCustomPage(editingPage.id, {
        ...pageForm,
        slug,
        updatedAt: new Date().toISOString(),
      });
      addToast('success', 'Page Updated', `Page "${pageForm.title}" has been updated.`);
    } else {
      addCustomPage({
        title: pageForm.title || '',
        slug,
        content: pageForm.content || '',
        isPublished: pageForm.isPublished !== false,
      });
      addToast('success', 'Custom Page Created', 'Page added and auto-indexed in sitemap.');
    }
    setIsPageModalOpen(false);
  };

  // Category Handlers
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name?.trim()) return;

    const slug =
      categoryForm.slug ||
      categoryForm.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    addCategory({
      name: categoryForm.name,
      slug,
      description: categoryForm.description || '',
      isActive: categoryForm.isActive !== false,
      order: categories.length + 1,
    });

    addToast('success', 'Category Created', `Category ${categoryForm.name} added to catalog & sitemap.`);
    setIsCategoryModalOpen(false);
    setCategoryForm({ name: '', slug: '', description: '', isActive: true });
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(settingsForm);
    addToast('success', 'Store Settings Updated', 'Changes applied across BAARIZ IT.');
  };

  // Filtered orders
  const filteredOrders = orders.filter((ord) => {
    const matchesStatus = orderStatusFilter === 'all' || ord.status === orderStatusFilter;
    const name = ord.customer?.fullName || '';
    const phone = ord.customer?.phone || '';
    const matchesSearch =
      ord.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      name.toLowerCase().includes(orderSearch.toLowerCase()) ||
      phone.includes(orderSearch);
    return matchesStatus && matchesSearch;
  });

  // Filtered products
  const filteredProductsList = products.filter((p) => {
    const q = productSearch.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
  });

  return (
    <section className="py-10 bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Dashboard Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold border border-cyan-500/20 mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>BAARIZ IT Admin Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-tech">
              Store & SEO Management Portal
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActivePage('sitemap-page')}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 flex items-center gap-1.5"
            >
              <FileCode className="w-4 h-4 text-cyan-400" />
              <span>Public Sitemap View</span>
            </button>
            <button
              onClick={() => setActivePage('home')}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800"
            >
              View Live Store
            </button>
            <button
              onClick={handleOpenAddProduct}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-md transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>
          </div>
        </div>

        {/* Stats Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 font-semibold uppercase">Total Sales Revenue</span>
              <div className="text-2xl font-bold font-tech text-emerald-400 mt-1">
                ৳{totalRevenue.toLocaleString('en-BD')}
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 font-semibold uppercase">Total Orders</span>
              <div className="text-2xl font-bold font-tech text-cyan-400 mt-1">
                {orders.length} Orders
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 font-semibold uppercase">Catalog Products</span>
              <div className="text-2xl font-bold font-tech text-amber-400 mt-1">
                {products.length} Products
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Package className="w-5 h-5" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 font-semibold uppercase">Pending Orders</span>
              <div className="text-2xl font-bold font-tech text-rose-400 mt-1">
                {pendingOrdersCount} Pending
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-800 overflow-x-auto pb-px">
          <button
            onClick={() => setActiveTab('sitemap')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold font-tech uppercase tracking-wider border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'sitemap'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-4 h-4 text-cyan-400" />
            <span>SEO & Sitemap.xml</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold font-tech uppercase tracking-wider border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'products'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold font-tech uppercase tracking-wider border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'orders'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold font-tech uppercase tracking-wider border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'categories'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Categories ({categories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('pages')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold font-tech uppercase tracking-wider border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'pages'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Custom Pages ({customPages.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('customers')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold font-tech uppercase tracking-wider border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'customers'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Customers CRM ({customers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold font-tech uppercase tracking-wider border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'chat'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>
              Support Chat
              {conversations.filter((c) => c.unreadByAdminCount > 0).length > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-red-500 text-white font-bold animate-pulse">
                  {conversations.filter((c) => c.unreadByAdminCount > 0).length}
                </span>
              )}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold font-tech uppercase tracking-wider border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'settings'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Shop Settings</span>
          </button>
        </div>

        {/* TAB: SEO & SITEMAP GENERATOR */}
        {activeTab === 'sitemap' && <SitemapManager />}

        {/* TAB: PRODUCTS MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search products by SKU, name, brand..."
                  className="w-full bg-slate-950 text-xs text-white rounded-xl pl-9 pr-3 py-2 border border-slate-800"
                />
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400">
                  Total Products: <strong className="text-white">{filteredProductsList.length}</strong>
                </span>
                <button
                  onClick={handleOpenAddProduct}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/40">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 uppercase tracking-wider">
                    <th className="p-3.5">Product</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Price</th>
                    <th className="p-3.5">Stock</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {filteredProductsList.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500">
                        No products in catalog. Click "Add Product" above to create your first hardware listing.
                      </td>
                    </tr>
                  ) : (
                    filteredProductsList.map((prod) => (
                      <tr key={prod.id} className="hover:bg-slate-900/60 transition-colors">
                        <td className="p-3.5">
                          <div className="flex items-center gap-3">
                            <img
                              src={prod.mainImage}
                              alt={prod.name}
                              className="w-10 h-10 rounded-lg object-cover bg-slate-950 border border-slate-800 shrink-0"
                            />
                            <div className="min-w-0">
                              <span className="font-bold text-white block truncate max-w-xs sm:max-w-sm">
                                {prod.name}
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono">
                                {prod.brand} • SKU: {prod.sku}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="p-3.5 font-medium text-slate-400">{prod.categoryName}</td>

                        <td className="p-3.5">
                          <div className="font-bold font-tech text-emerald-400">
                            ৳{(prod.discountPrice || prod.regularPrice).toLocaleString('en-BD')}
                          </div>
                          {prod.discountPrice && (
                            <div className="text-[10px] text-slate-500 line-through">
                              ৳{prod.regularPrice.toLocaleString('en-BD')}
                            </div>
                          )}
                        </td>

                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              prod.stockStatus === 'in_stock'
                                ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/30'
                                : 'bg-amber-950/40 text-amber-400 border border-amber-500/30'
                            }`}
                          >
                            {prod.stockStatus === 'in_stock' ? 'In Stock' : 'Limited'}
                          </span>
                        </td>

                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              prod.status === 'active'
                                ? 'bg-cyan-950/40 text-cyan-400 border border-cyan-500/30'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {prod.status || 'active'}
                          </span>
                        </td>

                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEditProduct(prod)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                              title="Edit Product"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete product ${prod.name}?`)) {
                                  deleteProduct(prod.id);
                                  addToast('info', 'Deleted', 'Product removed from catalog and sitemap.');
                                }
                              }}
                              className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-500/30"
                              title="Delete Product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Search by order ID, customer name, phone..."
                  className="w-full bg-slate-950 text-xs text-white rounded-xl pl-9 pr-3 py-2 border border-slate-800"
                />
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Status:</span>
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="bg-slate-950 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 border border-slate-800"
                >
                  <option value="all">All Orders</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/40">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 uppercase tracking-wider">
                    <th className="p-3.5">Order ID</th>
                    <th className="p-3.5">Customer Details</th>
                    <th className="p-3.5">Payment</th>
                    <th className="p-3.5">Total Amount</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500">
                        No orders recorded yet. Incoming orders from customers will appear here.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-900/60 transition-colors">
                        <td className="p-3.5">
                          <span className="font-mono font-bold text-white">{ord.id}</span>
                          <p className="text-[10px] text-slate-500">{new Date(ord.createdAt).toLocaleDateString()}</p>
                        </td>

                        <td className="p-3.5">
                          <div className="font-bold text-slate-200">{ord.customer?.fullName}</div>
                          <p className="text-slate-400 text-[11px]">{ord.customer?.phone}</p>
                          <p className="text-[10px] text-slate-500 truncate max-w-xs">{ord.customer?.address}</p>
                        </td>

                        <td className="p-3.5">
                          <span className="font-mono uppercase font-bold text-cyan-400 text-[11px]">
                            {ord.paymentMethod}
                          </span>
                          {ord.transactionId && (
                            <p className="text-[10px] text-slate-500 font-mono">Trx: {ord.transactionId}</p>
                          )}
                        </td>

                        <td className="p-3.5 font-bold font-tech text-emerald-400 text-sm">
                          ৳{(ord.total || 0).toLocaleString('en-BD')}
                        </td>

                        <td className="p-3.5">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                              ord.status === 'delivered'
                                ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/30'
                                : ord.status === 'shipped'
                                ? 'bg-cyan-950/40 text-cyan-400 border border-cyan-500/30'
                                : ord.status === 'confirmed'
                                ? 'bg-purple-950/40 text-purple-400 border border-purple-500/30'
                                : ord.status === 'cancelled'
                                ? 'bg-rose-950/40 text-rose-400 border border-rose-500/30'
                                : 'bg-amber-950/40 text-amber-400 border border-amber-500/30'
                            }`}
                          >
                            {ord.status}
                          </span>
                        </td>

                        <td className="p-3.5 text-right">
                          <select
                            value={ord.status}
                            onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                            className="bg-slate-950 text-xs text-slate-200 rounded-lg px-2.5 py-1 border border-slate-700 cursor-pointer"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: CATEGORIES MANAGEMENT */}
        {activeTab === 'categories' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-400">
                Total Categories: <strong className="text-white">{categories.length}</strong>
              </span>
              <button
                onClick={() => setIsCategoryModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((c) => (
                <div
                  key={c.id}
                  className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-bold text-white text-xs">{c.name}</h4>
                    <span className="text-[11px] text-slate-400 font-mono">ID: {c.slug || c.id}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-400 px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800">
                      {c.itemCount || 0} items
                    </span>
                    <button
                      onClick={() => {
                        if (confirm(`Delete category ${c.name}?`)) {
                          deleteCategory(c.id);
                          addToast('info', 'Deleted', 'Category removed.');
                        }
                      }}
                      className="p-1 rounded-lg text-rose-400 hover:bg-rose-950/40"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: CUSTOM PAGES (CMS) */}
        {activeTab === 'pages' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-tech">
                  Published Custom Pages ({customPages.length})
                </h4>
                <p className="text-[11px] text-slate-400">
                  Custom CMS content pages are automatically added to sitemap.xml with priority 0.7.
                </p>
              </div>

              <button
                onClick={handleOpenAddPage}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Create Custom Page</span>
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/40">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 uppercase tracking-wider">
                    <th className="p-3.5">Page Title</th>
                    <th className="p-3.5">Slug / URL</th>
                    <th className="p-3.5">Publish Status</th>
                    <th className="p-3.5">Last Updated</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {customPages.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500">
                        No custom pages created yet. Click "Create Custom Page" to add policies, return guides, or PC building articles.
                      </td>
                    </tr>
                  ) : (
                    customPages.map((pg) => (
                      <tr key={pg.id} className="hover:bg-slate-900/60 transition-colors">
                        <td className="p-3.5 font-bold text-white">{pg.title}</td>
                        <td className="p-3.5 font-mono text-cyan-400 text-[11px]">/#page={pg.slug}</td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              pg.isPublished
                                ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/30'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {pg.isPublished ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-400">{new Date(pg.updatedAt).toLocaleDateString()}</td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEditPage(pg)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                              title="Edit Page"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete page "${pg.title}"?`)) {
                                  deleteCustomPage(pg.id);
                                  addToast('info', 'Deleted', 'Page removed from store and sitemap.');
                                }
                              }}
                              className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-500/30"
                              title="Delete Page"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: CUSTOMERS CRM */}
        {activeTab === 'customers' && (
          <div className="space-y-6">
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-900/60 border border-slate-800">
              <div className="flex-1 max-w-md relative">
                <input
                  type="text"
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  placeholder="Search customers by name, phone (016...), email..."
                  className="w-full bg-slate-950 text-xs text-white rounded-xl pl-9 pr-4 py-2.5 border border-slate-800 focus:border-cyan-400 focus:outline-none"
                />
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>

              {/* Status Filters */}
              <div className="flex items-center gap-2">
                {(['all', 'active', 'blocked'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setCustomerStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase transition-all capitalize ${
                      customerStatusFilter === st
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'bg-slate-800/80 text-slate-400 hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Customers Table */}
            <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-900/40 shadow-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 uppercase tracking-wider">
                    <th className="p-4">Customer Details</th>
                    <th className="p-4">Mobile & Email</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Orders & Lifetime Spend</th>
                    <th className="p-4">Account Status</th>
                    <th className="p-4">Staff Notes</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {customers
                    .filter((c) => {
                      const matchesStatus =
                        customerStatusFilter === 'all' ||
                        (customerStatusFilter === 'active' && !c.isBlocked) ||
                        (customerStatusFilter === 'blocked' && c.isBlocked);
                      const q = customerSearch.toLowerCase();
                      const matchesSearch =
                        c.fullName.toLowerCase().includes(q) ||
                        c.phone.includes(q) ||
                        c.email.toLowerCase().includes(q);
                      return matchesStatus && matchesSearch;
                    })
                    .map((cust) => {
                      const custOrders = orders.filter(
                        (o) => o.customer?.phone === cust.phone || (cust.email && o.customer?.email === cust.email)
                      );
                      const totalSpent = custOrders.reduce((sum, o) => sum + o.total, 0);

                      return (
                        <tr key={cust.id} className="hover:bg-slate-900/60 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold font-tech text-sm">
                                {cust.fullName.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <span className="font-bold text-white block">{cust.fullName}</span>
                                <span className="text-[10px] text-slate-500 font-mono">ID: {cust.id}</span>
                              </div>
                            </div>
                          </td>

                          <td className="p-4">
                            <div className="space-y-0.5">
                              <span className="font-mono text-cyan-400 block font-semibold">{cust.phone}</span>
                              <span className="text-slate-400 block text-[11px]">{cust.email}</span>
                            </div>
                          </td>

                          <td className="p-4">
                            <span className="text-slate-300 block">{cust.district || 'Savar, Dhaka'}</span>
                            <span className="text-[11px] text-slate-500 block truncate max-w-[160px]">
                              {cust.address || 'Address on next checkout'}
                            </span>
                          </td>

                          <td className="p-4">
                            <span className="font-bold font-mono text-emerald-400 block">
                              ৳{totalSpent.toLocaleString('en-BD')}
                            </span>
                            <span className="text-[11px] text-slate-500 block">
                              {custOrders.length} Completed Order(s)
                            </span>
                          </td>

                          <td className="p-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                cust.isBlocked
                                  ? 'bg-rose-950/60 text-rose-400 border border-rose-500/30'
                                  : 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                              }`}
                            >
                              {cust.isBlocked ? (
                                <>
                                  <Ban className="w-3 h-3" />
                                  <span>Blocked</span>
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>Active</span>
                                </>
                              )}
                            </span>
                          </td>

                          <td className="p-4">
                            {editingNotesCustomerId === cust.id ? (
                              <div className="space-y-1.5 min-w-[180px]">
                                <textarea
                                  rows={2}
                                  value={notesDraft}
                                  onChange={(e) => setNotesDraft(e.target.value)}
                                  placeholder="Internal admin remarks..."
                                  className="w-full bg-slate-950 text-white rounded-lg p-1.5 text-[11px] border border-slate-700"
                                />
                                <div className="flex gap-1.5">
                                  <button
                                    onClick={() => {
                                      updateCustomerNotes(cust.id, notesDraft);
                                      setEditingNotesCustomerId(null);
                                    }}
                                    className="px-2 py-0.5 rounded bg-cyan-500 text-slate-950 font-bold text-[10px]"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => setEditingNotesCustomerId(null)}
                                    className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div
                                onClick={() => {
                                  setEditingNotesCustomerId(cust.id);
                                  setNotesDraft(cust.notes || '');
                                }}
                                className="cursor-pointer group flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200"
                                title="Click to edit admin notes"
                              >
                                <span className="italic line-clamp-2">
                                  {cust.notes || 'No remarks. Click to add.'}
                                </span>
                                <Edit2 className="w-3 h-3 opacity-0 group-hover:opacity-100 text-cyan-400 shrink-0" />
                              </div>
                            )}
                          </td>

                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* Open Chat */}
                              <button
                                onClick={() => {
                                  const conv = conversations.find((c) => c.customerId === cust.id);
                                  setSelectedChatConvId(conv?.id || `conv-${cust.id}`);
                                  setActiveTab('chat');
                                }}
                                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 transition-colors"
                                title="Open Live Chat Thread"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                              </button>

                              {/* Toggle Block */}
                              <button
                                onClick={() => toggleBlockCustomer(cust.id)}
                                className={`p-2 rounded-xl border transition-colors ${
                                  cust.isBlocked
                                    ? 'bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-400 border-emerald-500/30'
                                    : 'bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border-rose-500/30'
                                }`}
                                title={cust.isBlocked ? 'Unblock Customer Account' : 'Block Customer Account'}
                              >
                                {cust.isBlocked ? <UserCheck className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>

              {customers.length === 0 && (
                <div className="p-12 text-center text-slate-500 space-y-2">
                  <Users className="w-12 h-12 mx-auto text-slate-700" />
                  <p className="text-sm font-semibold text-slate-300">Clean Database — Zero Customers</p>
                  <p className="text-xs max-w-sm mx-auto">
                    New customers who register or place orders on BAARIZ IT will automatically appear in this centralized CRM.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: REAL-TIME SUPPORT CHAT DESK */}
        {activeTab === 'chat' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-3 min-h-[620px]">
            {/* Left Conversations List */}
            <div className="border-r border-slate-800 bg-slate-950/40 p-4 space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h4 className="font-bold text-white font-tech text-sm flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-cyan-400" />
                  <span>Support Inquiries</span>
                </h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-300 font-mono">
                  {conversations.length} Active
                </span>
              </div>

              <div className="space-y-2 overflow-y-auto max-h-[520px]">
                {conversations.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-xs">
                    No active support conversations right now.
                  </div>
                ) : (
                  conversations.map((c) => {
                    const isSelected = selectedChatConvId === c.id;
                    return (
                      <div
                        key={c.id}
                        onClick={() => {
                          setSelectedChatConvId(c.id);
                          markConversationAsRead(c.id, 'admin');
                        }}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-cyan-500/10 border-cyan-500/50 text-white shadow-md'
                            : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs truncate text-white">{c.customerName}</span>
                          <span className="text-[10px] text-slate-500">{c.lastMessageTimestamp}</span>
                        </div>
                        <p className="text-[11px] text-cyan-400 font-mono mt-0.5">{c.customerPhone}</p>
                        <p className="text-[11px] text-slate-400 truncate mt-1">{c.lastMessage}</p>

                        {c.unreadByAdminCount > 0 && (
                          <div className="mt-2 flex justify-end">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500 text-white animate-pulse">
                              {c.unreadByAdminCount} New
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right Chat Thread & Reply Console */}
            <div className="md:col-span-2 flex flex-col h-full bg-slate-900/30">
              {selectedChatConvId ? (
                <>
                  {/* Active Header */}
                  <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-white font-tech">
                        {conversations.find((c) => c.id === selectedChatConvId)?.customerName || 'Customer Thread'}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Official BAARIZ IT Support Desk • Active Session
                      </p>
                    </div>
                  </div>

                  {/* Messages Feed */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-3 min-h-[380px] max-h-[420px]">
                    {messages
                      .filter((m) => m.conversationId === selectedChatConvId)
                      .map((msg) => {
                        const isAdmin = msg.senderRole === 'admin' || msg.senderRole === 'staff';
                        return (
                          <div
                            key={msg.id}
                            className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}
                          >
                            <span className="text-[10px] text-slate-500 mb-0.5 px-1">
                              {msg.senderName} • {msg.timestamp}
                            </span>
                            <div
                              className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                                isAdmin
                                  ? 'bg-cyan-500 text-slate-950 font-medium rounded-tr-none shadow-md'
                                  : 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700/80'
                              }`}
                            >
                              {msg.content}
                              {msg.productAttachment && (
                                <div className="mt-2.5 p-2 rounded-xl bg-black/20 border border-white/10 flex items-center gap-2">
                                  <img
                                    src={msg.productAttachment.image}
                                    alt={msg.productAttachment.name}
                                    className="w-8 h-8 rounded-lg object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                  <div className="text-[11px]">
                                    <p className="font-bold line-clamp-1">{msg.productAttachment.name}</p>
                                    <p>৳{msg.productAttachment.price.toLocaleString()}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  {/* Quick templates */}
                  <div className="px-4 py-2 border-t border-slate-800 bg-slate-950/60 flex items-center gap-2 overflow-x-auto">
                    {[
                      'In stock at Savar Outlet Shop A/23!',
                      'Full 3-year warranty included.',
                      'Your order has been packed and handed to courier.',
                    ].map((tpl, idx) => (
                      <button
                        key={idx}
                        onClick={() => setAdminChatInput(tpl)}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-[11px] text-slate-300 whitespace-nowrap"
                      >
                        "{tpl}"
                      </button>
                    ))}
                  </div>

                  {/* Reply Form */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!adminChatInput.trim() || !selectedChatConvId) return;

                      const conv = conversations.find((c) => c.id === selectedChatConvId);
                      sendMessage({
                        senderRole: 'admin',
                        customerId: conv?.customerId || 'guest',
                        content: adminChatInput.trim(),
                        conversationId: selectedChatConvId,
                      });
                      setAdminChatInput('');
                    }}
                    className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
                  >
                    <input
                      type="text"
                      value={adminChatInput}
                      onChange={(e) => setAdminChatInput(e.target.value)}
                      placeholder="Type official reply to customer..."
                      className="flex-1 bg-slate-900 text-xs text-white rounded-xl px-4 py-3 border border-slate-800 focus:border-cyan-400 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>Reply</span>
                    </button>
                  </form>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-500 text-xs">
                  <MessageSquare className="w-12 h-12 text-slate-700 mb-3" />
                  <p className="font-bold text-slate-300 text-sm">Select a Conversation</p>
                  <p className="mt-1 max-w-xs">
                    Choose an inquiry from the left panel to reply in real time as BAARIZ IT official staff.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: SITE SETTINGS & FULL OWNER CUSTOMIZATION */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white font-tech flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-cyan-400" />
                  <span>BAARIZ IT Website & Storefront Customization</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Update business phone, address, banners, announcement bar, delivery fees, and content live in database.
                </p>
              </div>
              <button
                type="button"
                onClick={handleSaveSettings}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors shadow-lg shadow-cyan-500/20 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save All Changes</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 1. Basic Business & Contact Info */}
              <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
                <h4 className="font-bold text-sm text-cyan-400 font-tech flex items-center gap-2 pb-2 border-b border-slate-800">
                  <Phone className="w-4 h-4" />
                  <span>1. Business & Contact Numbers</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Shop Name</label>
                    <input
                      type="text"
                      value={settingsForm.shopName || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, shopName: e.target.value })}
                      className="w-full bg-slate-950 text-xs text-white rounded-xl px-3 py-2 border border-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Tagline</label>
                    <input
                      type="text"
                      value={settingsForm.tagline || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                      className="w-full bg-slate-950 text-xs text-white rounded-xl px-3 py-2 border border-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Hotline</label>
                    <input
                      type="text"
                      value={settingsForm.phonePrimary || settingsForm.phone || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, phonePrimary: e.target.value, phone: e.target.value })}
                      className="w-full bg-slate-950 text-xs text-white rounded-xl px-3 py-2 border border-slate-800 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Secondary / WhatsApp Phone</label>
                    <input
                      type="text"
                      value={settingsForm.phoneSecondary || settingsForm.whatsapp || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, phoneSecondary: e.target.value, whatsapp: e.target.value })}
                      className="w-full bg-slate-950 text-xs text-white rounded-xl px-3 py-2 border border-slate-800 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Official Email</label>
                    <input
                      type="email"
                      value={settingsForm.email || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                      className="w-full bg-slate-950 text-xs text-white rounded-xl px-3 py-2 border border-slate-800 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Business Operating Hours</label>
                    <input
                      type="text"
                      value={settingsForm.businessHours || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, businessHours: e.target.value })}
                      className="w-full bg-slate-950 text-xs text-white rounded-xl px-3 py-2 border border-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Physical Outlet & Maps Location */}
              <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
                <h4 className="font-bold text-sm text-cyan-400 font-tech flex items-center gap-2 pb-2 border-b border-slate-800">
                  <MapPin className="w-4 h-4" />
                  <span>2. Savar Outlet Address & Google Maps</span>
                </h4>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Display Address (Header & Footer)</label>
                  <input
                    type="text"
                    value={settingsForm.displayAddress || settingsForm.address || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, displayAddress: e.target.value, address: e.target.value })}
                    className="w-full bg-slate-950 text-xs text-white rounded-xl px-3 py-2 border border-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Detailed Physical Address</label>
                  <textarea
                    rows={2}
                    value={settingsForm.fullAddress || settingsForm.address || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, fullAddress: e.target.value })}
                    className="w-full bg-slate-950 text-xs text-white rounded-xl p-3 border border-slate-800 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Google Maps Embed URL</label>
                  <input
                    type="text"
                    value={settingsForm.googleMapsEmbedUrl || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, googleMapsEmbedUrl: e.target.value })}
                    placeholder="https://www.google.com/maps/embed?..."
                    className="w-full bg-slate-950 text-xs text-white rounded-xl px-3 py-2 border border-slate-800 font-mono"
                  />
                </div>
              </div>

              {/* 3. Announcement Bar & Top Notice */}
              <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
                <h4 className="font-bold text-sm text-cyan-400 font-tech flex items-center gap-2 pb-2 border-b border-slate-800">
                  <Sparkles className="w-4 h-4" />
                  <span>3. Announcement Bar</span>
                </h4>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="announcementToggle"
                    checked={settingsForm.isAnnouncementEnabled}
                    onChange={(e) => setSettingsForm({ ...settingsForm, isAnnouncementEnabled: e.target.checked })}
                    className="w-4 h-4 rounded text-cyan-500 bg-slate-950 border-slate-800"
                  />
                  <label htmlFor="announcementToggle" className="text-xs font-semibold text-slate-200 cursor-pointer">
                    Enable Top Announcement Bar on public website
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Announcement Message Text</label>
                  <input
                    type="text"
                    value={settingsForm.announcementText || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, announcementText: e.target.value })}
                    placeholder="e.g. ⚡ Genuine Computer Hardware & Savar Express Same-Day Delivery! Call 01622615188"
                    className="w-full bg-slate-950 text-xs text-white rounded-xl px-3 py-2 border border-slate-800"
                  />
                </div>
              </div>

              {/* 4. Delivery Fees & Thresholds */}
              <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
                <h4 className="font-bold text-sm text-cyan-400 font-tech flex items-center gap-2 pb-2 border-b border-slate-800">
                  <Truck className="w-4 h-4" />
                  <span>4. Delivery Fees & Logistics (BDT)</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Savar Local Fee (৳)</label>
                    <input
                      type="number"
                      value={settingsForm.deliveryFeeSavar || 60}
                      onChange={(e) => setSettingsForm({ ...settingsForm, deliveryFeeSavar: Number(e.target.value) })}
                      className="w-full bg-slate-950 text-xs text-white rounded-xl px-3 py-2 border border-slate-800 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Dhaka Metro Fee (৳)</label>
                    <input
                      type="number"
                      value={settingsForm.deliveryFeeDhaka || 100}
                      onChange={(e) => setSettingsForm({ ...settingsForm, deliveryFeeDhaka: Number(e.target.value) })}
                      className="w-full bg-slate-950 text-xs text-white rounded-xl px-3 py-2 border border-slate-800 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Nationwide Fee (৳)</label>
                    <input
                      type="number"
                      value={settingsForm.deliveryFeeNationwide || 150}
                      onChange={(e) => setSettingsForm({ ...settingsForm, deliveryFeeNationwide: Number(e.target.value) })}
                      className="w-full bg-slate-950 text-xs text-white rounded-xl px-3 py-2 border border-slate-800 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Free Delivery Minimum Spend (৳)</label>
                  <input
                    type="number"
                    value={settingsForm.freeDeliveryThreshold || 50000}
                    onChange={(e) => setSettingsForm({ ...settingsForm, freeDeliveryThreshold: Number(e.target.value) })}
                    className="w-full bg-slate-950 text-xs text-white rounded-xl px-3 py-2 border border-slate-800 font-mono"
                  />
                </div>
              </div>

              {/* 5. Payment Gateways (bKash, Nagad, Bank) */}
              <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4 lg:col-span-2">
                <h4 className="font-bold text-sm text-cyan-400 font-tech flex items-center gap-2 pb-2 border-b border-slate-800">
                  <CreditCard className="w-4 h-4" />
                  <span>5. Payment Gateways & Manual Instructions</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-pink-400">bKash Merchant / Personal Number</label>
                      <input
                        type="checkbox"
                        checked={settingsForm.isBkashEnabled}
                        onChange={(e) => setSettingsForm({ ...settingsForm, isBkashEnabled: e.target.checked })}
                      />
                    </div>
                    <input
                      type="text"
                      value={settingsForm.bkashNumber || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, bkashNumber: e.target.value })}
                      placeholder="01622615188"
                      className="w-full bg-slate-950 text-xs text-white rounded-xl px-3 py-2 border border-slate-800 font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-orange-400">Nagad Merchant / Personal Number</label>
                      <input
                        type="checkbox"
                        checked={settingsForm.isNagadEnabled}
                        onChange={(e) => setSettingsForm({ ...settingsForm, isNagadEnabled: e.target.checked })}
                      />
                    </div>
                    <input
                      type="text"
                      value={settingsForm.nagadNumber || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, nagadNumber: e.target.value })}
                      placeholder="01622615188"
                      className="w-full bg-slate-950 text-xs text-white rounded-xl px-3 py-2 border border-slate-800 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* 6. Homepage Hero Banner Configuration */}
              <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4 lg:col-span-2">
                <h4 className="font-bold text-sm text-cyan-400 font-tech flex items-center gap-2 pb-2 border-b border-slate-800">
                  <ImageIcon className="w-4 h-4" />
                  <span>6. Homepage Hero Banner Customization</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Badge Text</label>
                    <input
                      type="text"
                      value={settingsForm.hero?.badgeText || ''}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          hero: { ...settingsForm.hero, badgeText: e.target.value },
                        })
                      }
                      className="w-full bg-slate-950 text-xs text-white rounded-xl px-3 py-2 border border-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Headline Main</label>
                    <input
                      type="text"
                      value={settingsForm.hero?.headlineMain || ''}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          hero: { ...settingsForm.hero, headlineMain: e.target.value },
                        })
                      }
                      className="w-full bg-slate-950 text-xs text-white rounded-xl px-3 py-2 border border-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Subtitle Text</label>
                  <textarea
                    rows={2}
                    value={settingsForm.hero?.subtitle || ''}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        hero: { ...settingsForm.hero, subtitle: e.target.value },
                      })
                    }
                    className="w-full bg-slate-950 text-xs text-white rounded-xl p-3 border border-slate-800 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Hero Banner Image URL</label>
                  <input
                    type="url"
                    value={settingsForm.hero?.bannerImage || ''}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        hero: { ...settingsForm.hero, bannerImage: e.target.value },
                      })
                    }
                    className="w-full bg-slate-950 text-xs text-white rounded-xl px-3 py-2 border border-slate-800 font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={handleSaveSettings}
                className="flex items-center gap-2 px-8 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-colors shadow-lg shadow-cyan-500/20 cursor-pointer"
              >
                <Save className="w-5 h-5" />
                <span>Save All Website Settings</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Product Create / Edit Modal */}
      <AnimatePresence>
        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <h3 className="text-base font-bold text-white font-tech">
                  {editingProduct ? 'Edit Product' : 'Add New Hardware to Catalog & Sitemap'}
                </h3>
                <button onClick={() => setIsProductModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Product Title *</label>
                    <input
                      type="text"
                      required
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      placeholder="e.g. AMD Ryzen 7 7800X3D Desktop Processor"
                      className="w-full bg-slate-950 text-white rounded-xl px-3 py-2 border border-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Brand *</label>
                    <input
                      type="text"
                      required
                      value={productForm.brand}
                      onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                      placeholder="e.g. AMD, ASUS, Intel, Corsair"
                      className="w-full bg-slate-950 text-white rounded-xl px-3 py-2 border border-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Category</label>
                    <select
                      value={productForm.categoryId}
                      onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                      className="w-full bg-slate-950 text-white rounded-xl px-3 py-2 border border-slate-800"
                    >
                      {categories.length === 0 ? (
                        <option value="hardware">General Hardware</option>
                      ) : (
                        categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Regular Price (৳) *</label>
                    <input
                      type="number"
                      required
                      value={productForm.regularPrice}
                      onChange={(e) => setProductForm({ ...productForm, regularPrice: Number(e.target.value) })}
                      className="w-full bg-slate-950 text-white rounded-xl px-3 py-2 border border-slate-800 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Discount Price (৳)</label>
                    <input
                      type="number"
                      value={productForm.discountPrice || ''}
                      onChange={(e) => setProductForm({ ...productForm, discountPrice: Number(e.target.value) || 0 })}
                      className="w-full bg-slate-950 text-white rounded-xl px-3 py-2 border border-slate-800 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">SKU / Model</label>
                    <input
                      type="text"
                      value={productForm.sku}
                      onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                      className="w-full bg-slate-950 text-white rounded-xl px-3 py-2 border border-slate-800 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Stock Status</label>
                    <select
                      value={productForm.stockStatus}
                      onChange={(e) => setProductForm({ ...productForm, stockStatus: e.target.value as any })}
                      className="w-full bg-slate-950 text-white rounded-xl px-3 py-2 border border-slate-800"
                    >
                      <option value="in_stock">In Stock</option>
                      <option value="limited">Limited Stock</option>
                      <option value="out_of_stock">Out of Stock</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Warranty Term</label>
                    <input
                      type="text"
                      value={productForm.warranty}
                      onChange={(e) => setProductForm({ ...productForm, warranty: e.target.value })}
                      placeholder="e.g. 3 Years Official Warranty"
                      className="w-full bg-slate-950 text-white rounded-xl px-3 py-2 border border-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Image URL (Google Image XML Indexable)</label>
                  <input
                    type="url"
                    value={productForm.mainImage}
                    onChange={(e) => setProductForm({ ...productForm, mainImage: e.target.value })}
                    className="w-full bg-slate-950 text-white rounded-xl px-3 py-2 border border-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Short Description (SEO Snippet)</label>
                  <textarea
                    rows={2}
                    value={productForm.shortDescription}
                    onChange={(e) => setProductForm({ ...productForm, shortDescription: e.target.value })}
                    className="w-full bg-slate-950 text-white rounded-xl p-3 border border-slate-800 resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
                  >
                    Save Product
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom Page Modal */}
      <AnimatePresence>
        {isPageModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <h3 className="text-base font-bold text-white font-tech">
                  {editingPage ? 'Edit Custom CMS Page' : 'Create Custom CMS Page'}
                </h3>
                <button onClick={() => setIsPageModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSavePage} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Page Title *</label>
                  <input
                    type="text"
                    required
                    value={pageForm.title}
                    onChange={(e) => setPageForm({ ...pageForm, title: e.target.value })}
                    placeholder="e.g. Return & Exchange Policy or EMI Financing"
                    className="w-full bg-slate-950 text-white rounded-xl px-3 py-2 border border-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">URL Slug (Optional)</label>
                  <input
                    type="text"
                    value={pageForm.slug}
                    onChange={(e) => setPageForm({ ...pageForm, slug: e.target.value })}
                    placeholder="e.g. return-exchange-policy"
                    className="w-full bg-slate-950 text-white rounded-xl px-3 py-2 border border-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Page Body Content</label>
                  <textarea
                    rows={6}
                    value={pageForm.content}
                    onChange={(e) => setPageForm({ ...pageForm, content: e.target.value })}
                    placeholder="Write detailed page article or instructions..."
                    className="w-full bg-slate-950 text-white rounded-xl p-3 border border-slate-800 resize-none font-sans"
                  />
                </div>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={pageForm.isPublished}
                    onChange={(e) => setPageForm({ ...pageForm, isPublished: e.target.checked })}
                    className="rounded text-cyan-500 focus:ring-cyan-500"
                  />
                  <span className="text-slate-300">Publish immediately & include in dynamic sitemap</span>
                </label>

                <div className="flex gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsPageModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
                  >
                    Save Page
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Category Modal */}
      <AnimatePresence>
        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <h3 className="text-base font-bold text-white font-tech">Add Hardware Category</h3>
                <button onClick={() => setIsCategoryModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Category Name *</label>
                  <input
                    type="text"
                    required
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                    placeholder="e.g. Graphics Card or NVMe SSD"
                    className="w-full bg-slate-950 text-white rounded-xl px-3 py-2 border border-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Description</label>
                  <input
                    type="text"
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                    placeholder="Brief description for SEO"
                    className="w-full bg-slate-950 text-white rounded-xl px-3 py-2 border border-slate-800"
                  />
                </div>

                <div className="flex gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsCategoryModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
                  >
                    Create Category
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
