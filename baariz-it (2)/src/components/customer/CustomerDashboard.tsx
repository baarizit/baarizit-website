import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  User,
  ShoppingBag,
  Heart,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Send,
  Lock,
  Edit3,
  Eye,
  FileText,
  Package,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../../types';

export const CustomerDashboard: React.FC = () => {
  const {
    currentUser,
    currentCustomer,
    customers,
    orders,
    wishlist,
    products,
    logoutUser,
    setActivePage,
    updateCustomerProfile,
    changeCustomerPassword,
    setIsAuthModalOpen,
    addToCart,
    toggleWishlist,
    openProductDetail,
    conversations,
    messages,
    sendMessage,
    markConversationAsRead,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    settings,
    addToast,
  } = useStore();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'orders' | 'profile' | 'wishlist' | 'chat' | 'notifications'
  >('overview');

  // Selected order for modal
  const [viewingOrderId, setViewingOrderId] = useState<string | null>(null);

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState(currentUser?.fullName || '');
  const [profileEmail, setProfileEmail] = useState(currentUser?.email || '');
  const [profilePhone, setProfilePhone] = useState(currentUser?.phone || '');
  const [profileAddress, setProfileAddress] = useState(currentUser?.address || '');
  const [profileDistrict, setProfileDistrict] = useState(currentUser?.district || 'Dhaka (Savar)');

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState<{ success?: boolean; message?: string }>({});

  // Chat message input in dashboard tab
  const [chatInput, setChatInput] = useState('');

  if (!currentUser || currentUser.role !== 'customer') {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-zinc-100 font-tech">Customer Account Required</h2>
        <p className="text-zinc-400 text-sm max-w-md mt-2 mb-6">
          Sign in with your email or mobile number to access your personal dashboard, track shipments, and chat with technical support.
        </p>
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="px-6 py-3 rounded-2xl bg-amber-500 text-zinc-950 font-bold text-sm hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
        >
          Sign In or Register
        </button>
      </div>
    );
  }

  // Filter customer's orders
  const customerOrders = orders.filter(
    (o) =>
      o.customer.phone === currentUser.phone ||
      (currentUser.email && o.customer.email === currentUser.email)
  );

  const totalSpent = customerOrders.reduce((sum, o) => sum + o.total, 0);

  // Filter customer wishlist products
  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  // Customer conversation
  const customerConversation = conversations.find(
    (c) => c.customerId === currentUser.id || c.customerPhone === currentUser.phone
  );
  const convId = customerConversation?.id || `conv-${currentUser.id}`;
  const customerMessages = messages.filter((m) => m.conversationId === convId);

  // Customer notifications
  const customerNotifs = notifications.filter(
    (n) =>
      n.recipientRole === 'customer' ||
      n.recipientRole === 'all' ||
      n.recipientId === currentUser.id
  );

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCustomerProfile({
      fullName: profileName.trim(),
      email: profileEmail.trim(),
      phone: profilePhone.trim(),
      address: profileAddress.trim(),
      district: profileDistrict.trim(),
    });
    setIsEditingProfile(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus({});

    if (newPassword !== confirmNewPassword) {
      setPasswordStatus({ success: false, message: 'New passwords do not match.' });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordStatus({ success: false, message: 'New password must be at least 6 characters.' });
      return;
    }

    const res = await changeCustomerPassword(currentPassword, newPassword);
    setPasswordStatus(res);
    if (res.success) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    sendMessage({
      senderRole: 'customer',
      customerId: currentUser.id,
      content: chatInput.trim(),
      conversationId: convId,
    });
    setChatInput('');
  };

  const selectedOrder = orders.find((o) => o.id === viewingOrderId);

  return (
    <div className="min-h-screen bg-zinc-950 py-8 px-4 sm:px-6 lg:px-8 text-zinc-100 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Top Header Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 mb-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-2xl shadow-inner font-tech">
                {currentUser.fullName.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-bold font-tech text-zinc-100">
                    {currentUser.fullName}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Verified Customer
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-zinc-400 mt-1.5">
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-zinc-500" />
                    {currentUser.phone}
                  </span>
                  {currentUser.email && (
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-zinc-500" />
                      {currentUser.email}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                    {currentUser.district || 'Savar, Dhaka'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  logoutUser();
                  setActivePage('home');
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white text-xs font-semibold transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1 space-y-2">
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-3 shadow-md space-y-1">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-amber-500 text-zinc-950 font-bold shadow-md'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Package className="w-4 h-4" />
                  <span>Overview</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-70" />
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-amber-500 text-zinc-950 font-bold shadow-md'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-4 h-4" />
                  <span>Order History</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-zinc-800 text-zinc-300">
                  {customerOrders.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('wishlist')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'wishlist'
                    ? 'bg-amber-500 text-zinc-950 font-bold shadow-md'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Heart className="w-4 h-4" />
                  <span>Wishlist Items</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-zinc-800 text-zinc-300">
                  {wishlist.length}
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('chat');
                  if (customerConversation) {
                    markConversationAsRead(customerConversation.id, 'customer');
                  }
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'chat'
                    ? 'bg-amber-500 text-zinc-950 font-bold shadow-md'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-4 h-4" />
                  <span>Tech Support Chat</span>
                </div>
                {customerConversation && customerConversation.unreadByCustomerCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-red-500 text-white font-bold animate-pulse">
                    {customerConversation.unreadByCustomerCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  setActiveTab('notifications');
                  markAllNotificationsAsRead('customer');
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'notifications'
                    ? 'bg-amber-500 text-zinc-950 font-bold shadow-md'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Bell className="w-4 h-4" />
                  <span>Notifications</span>
                </div>
                {customerNotifs.filter((n) => !n.isRead).length > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500 text-zinc-950 font-bold">
                    {customerNotifs.filter((n) => !n.isRead).length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-amber-500 text-zinc-950 font-bold shadow-md'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Settings className="w-4 h-4" />
                  <span>Profile & Security</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-70" />
              </button>
            </div>

            {/* Quick Hotline helper */}
            <div className="p-4 rounded-3xl bg-zinc-900/60 border border-zinc-800/80 text-xs space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>BAARIZ IT Official Desk</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Savar Bus Stand Outlet: 3rd Floor, Shop A/23. Hotlines: <strong>01622615188</strong>
              </p>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-md">
                    <span className="text-xs text-zinc-400 font-medium">Total Orders</span>
                    <h3 className="text-3xl font-bold text-zinc-100 font-tech mt-1">
                      {customerOrders.length}
                    </h3>
                    <p className="text-[11px] text-zinc-500 mt-1">Direct purchases & builds</p>
                  </div>

                  <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-md">
                    <span className="text-xs text-zinc-400 font-medium">Total Spent</span>
                    <h3 className="text-3xl font-bold text-amber-400 font-tech mt-1">
                      ৳{totalSpent.toLocaleString()}
                    </h3>
                    <p className="text-[11px] text-zinc-500 mt-1">Official invoice values</p>
                  </div>

                  <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-md">
                    <span className="text-xs text-zinc-400 font-medium">Wishlist Items</span>
                    <h3 className="text-3xl font-bold text-zinc-100 font-tech mt-1">
                      {wishlist.length}
                    </h3>
                    <p className="text-[11px] text-zinc-500 mt-1">Saved for later purchase</p>
                  </div>
                </div>

                {/* Recent Orders Overview */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-md">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold font-tech text-zinc-100">Recent Orders</h3>
                    {customerOrders.length > 0 && (
                      <button
                        onClick={() => setActiveTab('orders')}
                        className="text-xs text-amber-400 font-semibold hover:underline"
                      >
                        View All Orders
                      </button>
                    )}
                  </div>

                  {customerOrders.length === 0 ? (
                    <div className="text-center py-10">
                      <ShoppingBag className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
                      <p className="text-sm font-semibold text-zinc-300">No orders placed yet</p>
                      <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                        Explore our catalog of authentic PC components, laptops, and custom gaming rigs.
                      </p>
                      <button
                        onClick={() => setActivePage('shop')}
                        className="mt-4 px-5 py-2.5 rounded-xl bg-amber-500 text-zinc-950 font-bold text-xs hover:bg-amber-400 transition-all cursor-pointer"
                      >
                        Browse Shop Catalog
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {customerOrders.slice(0, 3).map((order) => (
                        <div
                          key={order.id}
                          className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-zinc-700 transition-all"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-amber-400 text-xs">
                                {order.id}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                                  order.status === 'delivered'
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    : order.status === 'shipped'
                                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                }`}
                              >
                                {order.status}
                              </span>
                            </div>
                            <p className="text-xs text-zinc-400 mt-1">
                              {order.items.length} item(s) • Total: ৳{order.total.toLocaleString()} • {order.createdAt}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setViewingOrderId(order.id)}
                              className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-colors"
                            >
                              Details
                            </button>
                            <button
                              onClick={() => {
                                setActivePage('order-tracking');
                              }}
                              className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-400 text-xs font-semibold transition-colors flex items-center gap-1.5"
                            >
                              <Truck className="w-3.5 h-3.5" />
                              <span>Track</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-md space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-xl font-bold font-tech text-zinc-100">Your Order History</h3>
                    <p className="text-xs text-zinc-400">
                      Track delivery milestones, verify items, and check official warranty status.
                    </p>
                  </div>
                </div>

                {customerOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-zinc-300">No orders found</p>
                    <p className="text-xs text-zinc-500 mt-1">
                      Your completed and in-progress orders will appear here automatically.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {customerOrders.map((order) => (
                      <div
                        key={order.id}
                        className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
                          <div>
                            <span className="text-[11px] text-zinc-500">Order ID:</span>
                            <span className="font-mono font-bold text-amber-400 ml-1 text-sm">
                              {order.id}
                            </span>
                            <span className="text-xs text-zinc-400 ml-3">
                              Placed on {order.createdAt}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${
                                order.status === 'delivered'
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : order.status === 'shipped'
                                  ? 'bg-blue-500/20 text-blue-400'
                                  : 'bg-amber-500/20 text-amber-400'
                              }`}
                            >
                              {order.status}
                            </span>
                          </div>
                        </div>

                        {/* Items list */}
                        <div className="space-y-2">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-3">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-10 h-10 rounded-lg object-cover bg-zinc-900 border border-zinc-800"
                                  referrerPolicy="no-referrer"
                                />
                                <div>
                                  <p className="font-semibold text-zinc-200">{item.name}</p>
                                  <p className="text-[11px] text-zinc-500">
                                    Qty: {item.quantity} × ৳{item.price.toLocaleString()}
                                  </p>
                                </div>
                              </div>
                              <span className="font-semibold text-zinc-300">
                                ৳{(item.price * item.quantity).toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Footer summary & actions */}
                        <div className="pt-3 border-t border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                          <div className="text-zinc-400">
                            Payment: <strong className="text-zinc-200 uppercase">{order.paymentMethod}</strong> ({order.paymentStatus})
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-amber-400 font-tech">
                              Total: ৳{order.total.toLocaleString()}
                            </span>
                            <button
                              onClick={() => setViewingOrderId(order.id)}
                              className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold cursor-pointer"
                            >
                              View Invoice
                            </button>
                            <button
                              onClick={() => setActivePage('order-tracking')}
                              className="px-3 py-1.5 rounded-xl bg-amber-500 text-zinc-950 font-bold hover:bg-amber-400 cursor-pointer"
                            >
                              Track Live
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* WISHLIST TAB */}
            {activeTab === 'wishlist' && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold font-tech text-zinc-100">Saved Wishlist</h3>
                    <p className="text-xs text-zinc-400">
                      Keep track of hardware components and gadgets you plan to purchase.
                    </p>
                  </div>
                </div>

                {wishlistProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-zinc-300">Your wishlist is empty</p>
                    <p className="text-xs text-zinc-500 mt-1">
                      Click the heart icon on any product card in the shop catalog to save it here.
                    </p>
                    <button
                      onClick={() => setActivePage('shop')}
                      className="mt-4 px-5 py-2.5 rounded-xl bg-amber-500 text-zinc-950 font-bold text-xs hover:bg-amber-400 transition-all cursor-pointer"
                    >
                      Browse Products
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {wishlistProducts.map((prod) => (
                      <div
                        key={prod.id}
                        className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-4"
                      >
                        <div
                          className="flex items-center gap-3 cursor-pointer flex-1"
                          onClick={() => openProductDetail(prod)}
                        >
                          <img
                            src={prod.images[0] || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=300'}
                            alt={prod.name}
                            className="w-14 h-14 rounded-xl object-cover bg-zinc-900 border border-zinc-800"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <h4 className="text-xs font-bold text-zinc-200 line-clamp-1 hover:text-amber-400">
                              {prod.name}
                            </h4>
                            <p className="text-xs font-bold text-amber-400 mt-0.5">
                              ৳{prod.price.toLocaleString()}
                            </p>
                            <span className="text-[10px] text-zinc-500">{prod.brand}</span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 shrink-0">
                          <button
                            onClick={() => addToCart(prod, 1, true)}
                            className="px-3 py-1.5 rounded-xl bg-amber-500 text-zinc-950 font-bold text-[11px] hover:bg-amber-400 cursor-pointer"
                          >
                            Add to Cart
                          </button>
                          <button
                            onClick={() => toggleWishlist(prod.id)}
                            className="p-1.5 text-zinc-500 hover:text-red-400 text-center"
                            title="Remove from wishlist"
                          >
                            <Trash2 className="w-3.5 h-3.5 mx-auto" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* CHAT TAB */}
            {activeTab === 'chat' && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-md flex flex-col h-[600px]">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold font-tech text-zinc-100">
                        BAARIZ IT Official Technical Desk
                      </h3>
                      <p className="text-xs text-emerald-400 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        Live & Connected • Savar Outlet Support
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages Box */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4">
                  {customerMessages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-500 text-xs">
                      <Sparkles className="w-8 h-8 text-amber-500/40 mb-2" />
                      <p className="font-semibold text-zinc-300">Need PC building advice or warranty support?</p>
                      <p className="mt-1">
                        Send a message below. Our hardware engineers respond promptly during shop hours.
                      </p>
                    </div>
                  ) : (
                    customerMessages.map((msg) => {
                      const isMe = msg.senderRole === 'customer';
                      return (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                        >
                          <span className="text-[10px] text-zinc-500 mb-1 px-1">
                            {msg.senderName} • {msg.timestamp}
                          </span>
                          <div
                            className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                              isMe
                                ? 'bg-amber-500 text-zinc-950 font-medium rounded-tr-none'
                                : 'bg-zinc-800 text-zinc-100 rounded-tl-none border border-zinc-700/60'
                            }`}
                          >
                            {msg.content}
                            {msg.productAttachment && (
                              <div className="mt-2.5 p-2 rounded-xl bg-black/20 border border-white/10 flex items-center gap-2.5">
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
                    })
                  )}
                </div>

                {/* Input box */}
                <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-zinc-800">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type your question or hardware requirement..."
                    className="flex-1 bg-zinc-950 text-xs text-zinc-100 rounded-2xl px-4 py-3 border border-zinc-800 focus:border-amber-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send</span>
                  </button>
                </form>
              </div>
            )}

            {/* NOTIFICATIONS TAB */}
            {activeTab === 'notifications' && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-md space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-xl font-bold font-tech text-zinc-100">Account Notifications</h3>
                    <p className="text-xs text-zinc-400">
                      Real-time updates regarding your orders, support chats, and promotions.
                    </p>
                  </div>
                  {customerNotifs.length > 0 && (
                    <button
                      onClick={() => markAllNotificationsAsRead('customer')}
                      className="text-xs text-amber-400 hover:underline cursor-pointer"
                    >
                      Mark All as Read
                    </button>
                  )}
                </div>

                {customerNotifs.length === 0 ? (
                  <div className="text-center py-12">
                    <Bell className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-zinc-300">No notifications yet</p>
                    <p className="text-xs text-zinc-500 mt-1">
                      You will receive alerts here when order tracking updates or support replies.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {customerNotifs.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          markNotificationAsRead(notif.id);
                          if (notif.linkPage) setActivePage(notif.linkPage as any);
                        }}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                          notif.isRead
                            ? 'bg-zinc-950/60 border-zinc-800/60 text-zinc-400'
                            : 'bg-zinc-950 border-amber-500/40 text-zinc-200 shadow-md'
                        }`}
                      >
                        <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 shrink-0 mt-0.5">
                          <Bell className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-zinc-100">{notif.title}</h4>
                            <span className="text-[10px] text-zinc-500">{notif.createdAt}</span>
                          </div>
                          <p className="text-xs text-zinc-400 mt-1">{notif.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* PROFILE & SECURITY TAB */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                {/* Profile Form */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-md">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold font-tech text-zinc-100">Personal Information</h3>
                      <p className="text-xs text-zinc-400">
                        Default shipping recipient info for fast one-click checkout.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(!isEditingProfile)}
                      className="px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{isEditingProfile ? 'Cancel' : 'Edit Profile'}</span>
                    </button>
                  </div>

                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          disabled={!isEditingProfile}
                          value={profileName}
                          onChange={(e) => setProfileName(e.target.value)}
                          className="w-full bg-zinc-950 disabled:opacity-60 text-xs text-zinc-100 rounded-xl px-3.5 py-2.5 border border-zinc-800 focus:border-amber-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1">
                          Mobile Number
                        </label>
                        <input
                          type="tel"
                          disabled={!isEditingProfile}
                          value={profilePhone}
                          onChange={(e) => setProfilePhone(e.target.value)}
                          className="w-full bg-zinc-950 disabled:opacity-60 text-xs text-zinc-100 rounded-xl px-3.5 py-2.5 border border-zinc-800 focus:border-amber-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          disabled={!isEditingProfile}
                          value={profileEmail}
                          onChange={(e) => setProfileEmail(e.target.value)}
                          className="w-full bg-zinc-950 disabled:opacity-60 text-xs text-zinc-100 rounded-xl px-3.5 py-2.5 border border-zinc-800 focus:border-amber-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1">
                          District / Area
                        </label>
                        <input
                          type="text"
                          disabled={!isEditingProfile}
                          value={profileDistrict}
                          onChange={(e) => setProfileDistrict(e.target.value)}
                          placeholder="e.g. Savar, Dhaka"
                          className="w-full bg-zinc-950 disabled:opacity-60 text-xs text-zinc-100 rounded-xl px-3.5 py-2.5 border border-zinc-800 focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Detailed Street / House Address
                      </label>
                      <textarea
                        rows={2}
                        disabled={!isEditingProfile}
                        value={profileAddress}
                        onChange={(e) => setProfileAddress(e.target.value)}
                        placeholder="e.g. House 14, Road 3, Bank Colony, Savar"
                        className="w-full bg-zinc-950 disabled:opacity-60 text-xs text-zinc-100 rounded-xl p-3 border border-zinc-800 focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    {isEditingProfile && (
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-amber-500 text-zinc-950 font-bold text-xs hover:bg-amber-400 transition-all cursor-pointer"
                      >
                        Save Profile Changes
                      </button>
                    )}
                  </form>
                </div>

                {/* Password Change Form */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-md">
                  <h3 className="text-lg font-bold font-tech text-zinc-100 mb-1">
                    Security & Password
                  </h3>
                  <p className="text-xs text-zinc-400 mb-4">
                    Keep your account secure with a strong password.
                  </p>

                  {passwordStatus.message && (
                    <div
                      className={`mb-4 p-3 rounded-xl text-xs flex items-center gap-2 ${
                        passwordStatus.success
                          ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                          : 'bg-red-500/10 border border-red-500/30 text-red-300'
                      }`}
                    >
                      {passwordStatus.success ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-400" />
                      )}
                      <span>{passwordStatus.message}</span>
                    </div>
                  )}

                  <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        required
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-zinc-950 text-xs text-zinc-100 rounded-xl px-3.5 py-2.5 border border-zinc-800 focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        New Password (Min 6 chars)
                      </label>
                      <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-zinc-950 text-xs text-zinc-100 rounded-xl px-3.5 py-2.5 border border-zinc-800 focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        required
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-zinc-950 text-xs text-zinc-100 rounded-xl px-3.5 py-2.5 border border-zinc-800 focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-amber-500 text-zinc-950 font-bold text-xs hover:bg-amber-400 transition-all cursor-pointer"
                    >
                      Update Password
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Details & Invoice Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative my-8">
              <button
                onClick={() => setViewingOrderId(null)}
                className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800"
              >
                ✕
              </button>

              <div className="border-b border-zinc-800 pb-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-tech font-bold text-sm">
                      BIT
                    </div>
                    <div>
                      <h3 className="text-xl font-bold font-tech text-zinc-100">
                        {settings.shopName} Invoice
                      </h3>
                      <p className="text-xs text-zinc-400">Order ID: {selectedOrder.id}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    {selectedOrder.status}
                  </span>
                </div>
              </div>

              {/* Order Content */}
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
                  <div>
                    <span className="text-zinc-500 block">Deliver To:</span>
                    <strong className="text-zinc-200 block text-sm">
                      {selectedOrder.customer.fullName}
                    </strong>
                    <span className="text-zinc-400">{selectedOrder.customer.phone}</span>
                    <p className="text-zinc-400 mt-1">
                      {selectedOrder.customer.address}, {selectedOrder.customer.district}
                    </p>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Payment Details:</span>
                    <strong className="text-zinc-200 block uppercase">
                      {selectedOrder.paymentMethod}
                    </strong>
                    <span className="text-zinc-400">Status: {selectedOrder.paymentStatus}</span>
                    <p className="text-zinc-400 mt-1">Date: {selectedOrder.createdAt}</p>
                  </div>
                </div>

                {/* Items */}
                <div className="border border-zinc-800 rounded-2xl overflow-hidden">
                  <div className="bg-zinc-950 p-3 font-semibold text-zinc-400 border-b border-zinc-800 flex justify-between">
                    <span>Product Item</span>
                    <span>Total</span>
                  </div>
                  <div className="p-3 space-y-2 divide-y divide-zinc-800/60">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="pt-2 first:pt-0 flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-zinc-200">{item.name}</p>
                          <p className="text-[11px] text-zinc-500">
                            Qty: {item.quantity} × ৳{item.price.toLocaleString()}
                          </p>
                        </div>
                        <span className="font-bold text-zinc-200">
                          ৳{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total breakdown */}
                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1.5">
                  <div className="flex justify-between text-zinc-400">
                    <span>Subtotal:</span>
                    <span>৳{selectedOrder.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Delivery Fee:</span>
                    <span>৳{selectedOrder.deliveryFee.toLocaleString()}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Discount:</span>
                      <span>-৳{selectedOrder.discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-bold text-amber-400 pt-2 border-t border-zinc-800">
                    <span>Grand Total:</span>
                    <span>৳{selectedOrder.total.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => {
                      window.print();
                    }}
                    className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-200 hover:bg-zinc-700 text-xs font-semibold cursor-pointer"
                  >
                    Print Invoice
                  </button>
                  <button
                    onClick={() => {
                      setViewingOrderId(null);
                      setActivePage('order-tracking');
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-500 text-zinc-950 font-bold text-xs hover:bg-amber-400 cursor-pointer"
                  >
                    Track Shipment
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
