import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCategory } from '../../types';
import {
  Search,
  ShoppingCart,
  Heart,
  Scale,
  Menu,
  X,
  Cpu,
  Monitor,
  Laptop,
  Phone,
  User as UserIcon,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Wrench,
  Flame,
  Tag,
  MapPin,
  ExternalLink,
  Bell,
  MessageSquare,
  LogOut,
  ShoppingBag,
  Settings as SettingsIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MobileAccountDrawer } from './MobileAccountDrawer';
import { MobileSearchModal } from './MobileSearchModal';

export const Navbar: React.FC = () => {
  const {
    activePage,
    setActivePage,
    categories,
    products,
    setCategoryFilter,
    filters,
    setSearchQuery,
    cartCount,
    cartSubtotal,
    setIsCartDrawerOpen,
    wishlist,
    compareList,
    currentUser,
    logoutUser,
    setIsAuthModalOpen,
    settings,
    openProductDetail,
    unreadNotificationsCount,
    unreadMessagesCount,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setIsChatDrawerOpen,
  } = useStore();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [isCategoriesDropdownOpen, setIsCategoriesDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const [isMobileAccountOpen, setIsMobileAccountOpen] = useState(false);
  const [isMobileSearchModalOpen, setIsMobileSearchModalOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const notifDropdownRef = useRef<HTMLDivElement>(null);

  // Autocomplete results
  const searchResults = searchInput.trim()
    ? products
        .filter((p) => {
          const q = searchInput.toLowerCase();
          return (
            p.name.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q) ||
            p.categoryName.toLowerCase().includes(q)
          );
        })
        .slice(0, 6)
    : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setIsUserDropdownOpen(false);
      }
      if (
        notifDropdownRef.current &&
        !notifDropdownRef.current.contains(event.target as Node)
      ) {
        setIsNotifDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchQuery(searchInput.trim());
      setActivePage('shop');
      setIsSearchOpen(false);
    }
  };

  const handleSelectProduct = (prod: (typeof products)[0]) => {
    openProductDetail(prod);
    setIsSearchOpen(false);
    setSearchInput('');
  };

  const handleCategorySelect = (catId: ProductCategory | 'all') => {
    setCategoryFilter(catId);
    setIsCategoriesDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/95 backdrop-blur-xl border-b border-slate-800/80">
      {/* 1. Top Announcement Bar - Mobile Compact & Zero Overflow */}
      <div id="top-announcement-bar" className="bg-gradient-to-r from-cyan-950 via-slate-950 to-blue-950 border-b border-cyan-500/30 text-xs py-1.5 px-3 sm:px-4 text-cyan-200">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <div className="flex items-center gap-2 min-w-0">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-semibold text-[10px] sm:text-[11px] border border-cyan-500/30 shrink-0">
              <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-cyan-400" />
              Savar, Dhaka
            </span>
            <span className="font-medium text-slate-200 text-[11px] sm:text-xs truncate">
              {settings.announcementText || 'Welcome to BAARIZ IT — More Tech, More Possibilities'}
            </span>
          </div>
          <div className="flex items-center gap-3 text-slate-400 text-[11px] shrink-0 ml-auto sm:ml-0">
            <span className="hidden md:inline-flex items-center gap-1">
              <MapPin className="w-3 h-3 text-cyan-400" />
              Savar Bus Stand (Shop A/23)
            </span>
            <a
              id="top-phone-link"
              href={`tel:${settings.phone.replace(/[^0-9]/g, '')}`}
              className="inline-flex items-center gap-1 text-slate-300 hover:text-cyan-400 font-semibold transition-colors"
            >
              <Phone className="w-3 h-3 text-cyan-400" />
              <span>{settings.phone}</span>
            </a>
            <button
              id="top-track-order-btn"
              onClick={() => setActivePage('order-tracking')}
              className="text-cyan-300 hover:text-cyan-200 underline transition-colors cursor-pointer"
            >
              Track Order
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          {/* Logo & Tagline */}
          <div
            id="brand-logo-container"
            onClick={() => setActivePage('home')}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group shrink-0 min-w-0"
          >
            <div className="relative flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 p-0.5 shadow-lg shadow-cyan-950/50 group-hover:scale-105 transition-transform shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Cpu className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
              </div>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <span className="font-tech text-lg sm:text-2xl font-bold tracking-wider text-white group-hover:text-cyan-400 transition-colors truncate">
                  BAARIZ <span className="text-cyan-400">IT</span>
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest px-1 sm:px-1.5 py-0.2 sm:py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
                  BD
                </span>
              </div>
              <span className="text-[9px] sm:text-[10px] text-slate-400 tracking-wider uppercase font-medium truncate hidden min-[360px]:block">
                {settings.tagline || 'More Tech, More Possibilities'}
              </span>
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <div
            ref={searchContainerRef}
            className="hidden md:flex flex-1 max-w-md relative"
          >
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <input
                id="main-search-input"
                type="text"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                placeholder="Search AMD Ryzen, RTX 4070, Laptop, RAM, SSD, Keyboard..."
                className="w-full bg-slate-900/90 text-sm text-slate-100 placeholder-slate-500 rounded-xl pl-10 pr-20 py-2.5 border border-slate-800 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/50 transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <button
                id="search-submit-btn"
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
              >
                Search
              </button>
            </form>

            {/* Instant Autocomplete Results */}
            <AnimatePresence>
              {isSearchOpen && searchInput.trim().length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-slate-900/98 backdrop-blur-xl border border-slate-800 rounded-xl shadow-2xl p-2 z-50 overflow-hidden"
                >
                  <div className="text-[11px] font-semibold text-slate-400 px-3 py-1 border-b border-slate-800 flex justify-between items-center">
                    <span>Matching Products ({searchResults.length})</span>
                    <button
                      type="button"
                      onClick={() => handleSearchSubmit({ preventDefault: () => {} } as any)}
                      className="text-cyan-400 hover:underline cursor-pointer"
                    >
                      View All Results
                    </button>
                  </div>
                  {searchResults.length > 0 ? (
                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60 mt-1">
                      {searchResults.map((prod) => (
                        <div
                          key={prod.id}
                          onClick={() => handleSelectProduct(prod)}
                          className="flex items-center gap-3 p-2.5 hover:bg-slate-800/80 rounded-lg cursor-pointer transition-colors"
                        >
                          <img
                            src={prod.mainImage}
                            alt={prod.name}
                            className="w-10 h-10 object-cover rounded-md bg-slate-950 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-100 truncate">
                              {prod.name}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              {prod.brand} • <span className="text-slate-500">{prod.sku}</span>
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-xs font-bold text-cyan-400">
                              ৳{(prod.discountPrice || prod.regularPrice).toLocaleString('en-BD')}
                            </p>
                            {prod.discountPrice && (
                              <p className="text-[10px] text-slate-500 line-through">
                                ৳{prod.regularPrice.toLocaleString('en-BD')}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-xs text-slate-400">
                      No matching products found for "{searchInput}".
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action Tools: Responsive Priority to prevent overflow */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-3 shrink-0">
            {/* Mobile Search Icon Button */}
            <button
              id="mobile-header-search-btn"
              onClick={() => setIsMobileSearchModalOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-300 hover:text-cyan-400 hover:bg-slate-900 transition-colors"
              aria-label="Open Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* PC Builder Button - Desktop Highlight */}
            <button
              id="nav-pc-builder-btn"
              onClick={() => setActivePage('pc-builder')}
              className={`hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                activePage === 'pc-builder'
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.4)]'
                  : 'bg-slate-900/90 text-cyan-400 hover:text-cyan-300 border-cyan-500/30 hover:border-cyan-500/60 hover:bg-slate-800'
              }`}
            >
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>PC Builder</span>
              <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 text-[10px] uppercase font-bold border border-cyan-500/30">
                Custom
              </span>
            </button>

            {/* Compare Button - Hidden on small mobile to preserve header density */}
            <button
              id="nav-compare-btn"
              onClick={() => setActivePage('compare')}
              className="hidden sm:flex relative p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
              title="Compare Products"
              aria-label="Compare"
            >
              <Scale className="w-5 h-5" />
              {compareList.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-cyan-500 text-slate-950 font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-950">
                  {compareList.length}
                </span>
              )}
            </button>

            {/* Wishlist Button - Hidden on small mobile */}
            <button
              id="nav-wishlist-btn"
              onClick={() => {
                setActivePage('wishlist');
              }}
              className="hidden sm:flex relative p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
              title="Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-950">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Cart Button */}
            <button
              id="nav-cart-btn"
              onClick={() => setIsCartDrawerOpen(true)}
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-100 p-2 sm:px-3.5 sm:py-2 rounded-xl border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-cyan-400" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-cyan-400 text-slate-950 font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col text-left leading-tight">
                <span className="text-[10px] text-slate-400 uppercase font-medium">Cart</span>
                <span className="text-xs font-bold text-slate-100">
                  ৳{cartSubtotal.toLocaleString('en-BD')}
                </span>
              </div>
            </button>

            {/* Notification Bell Dropdown - Desktop / Tablet */}
            <div ref={notifDropdownRef} className="relative hidden md:block">
              <button
                id="nav-notification-bell-btn"
                onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
                className="relative p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
                title="Notifications"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-950 animate-pulse">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {isNotifDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900/98 backdrop-blur-2xl border border-slate-800 rounded-2xl shadow-2xl p-4 z-50 text-xs"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-amber-400" />
                        <span className="font-bold text-slate-100 font-tech">Notifications</span>
                      </div>
                      {unreadNotificationsCount > 0 && (
                        <button
                          onClick={() => {
                            markAllNotificationsAsRead(currentUser?.role === 'customer' ? 'customer' : 'admin');
                          }}
                          className="text-[11px] text-cyan-400 hover:underline"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="max-h-72 overflow-y-auto space-y-2">
                      {notifications.length === 0 ? (
                        <p className="text-center py-6 text-slate-500">No notifications yet.</p>
                      ) : (
                        notifications.slice(0, 5).map((n) => (
                          <div
                            key={n.id}
                            onClick={() => {
                              markNotificationAsRead(n.id);
                              setIsNotifDropdownOpen(false);
                              if (n.linkPage) setActivePage(n.linkPage as any);
                            }}
                            className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                              n.isRead
                                ? 'bg-slate-950/40 border-slate-800/60 text-slate-400'
                                : 'bg-slate-950 border-amber-500/30 text-slate-200 shadow'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-100 text-[11px]">{n.title}</span>
                              <span className="text-[10px] text-slate-500">{n.createdAt}</span>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>

                    {currentUser?.role === 'customer' && (
                      <div className="pt-2 border-t border-slate-800 mt-3 text-center">
                        <button
                          onClick={() => {
                            setIsNotifDropdownOpen(false);
                            setActivePage('customer-dashboard');
                          }}
                          className="text-cyan-400 font-semibold text-xs hover:underline"
                        >
                          View all in Customer Dashboard →
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Profile / Account Button */}
            <div ref={userDropdownRef} className="relative">
              <button
                id="nav-user-auth-btn"
                onClick={() => {
                  // On mobile screens, open the clean Mobile Account Drawer bottom sheet
                  if (window.innerWidth < 768) {
                    setIsMobileAccountOpen(true);
                  } else {
                    if (!currentUser) {
                      setIsAuthModalOpen(true);
                    } else {
                      setIsUserDropdownOpen(!isUserDropdownOpen);
                    }
                  }
                }}
                className={`flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                  currentUser && currentUser.role !== 'customer'
                    ? 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300'
                    : currentUser
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                    : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700'
                }`}
                aria-label="User Account"
              >
                <UserIcon className="w-4 h-4 text-cyan-400" />
                <span className="hidden sm:inline">
                  {currentUser ? (
                    currentUser.role !== 'customer' ? (
                      <span className="font-semibold text-cyan-300 uppercase">
                        Admin ({currentUser.role})
                      </span>
                    ) : (
                      currentUser.fullName.split(' ')[0]
                    )
                  ) : (
                    'Account'
                  )}
                </span>
                {currentUser && <ChevronDown className="w-3 h-3 opacity-60 hidden sm:inline" />}
              </button>

              {/* User Account Dropdown Menu - Desktop Only */}
              <AnimatePresence>
                {isUserDropdownOpen && currentUser && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="hidden md:block absolute right-0 mt-2 w-64 bg-slate-900/98 backdrop-blur-2xl border border-slate-800 rounded-2xl shadow-2xl p-3 z-50 text-xs space-y-1.5"
                  >
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 mb-2">
                      <p className="font-bold text-slate-100 text-xs truncate">
                        {currentUser.fullName}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {currentUser.phone || currentUser.email}
                      </p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-500/20 text-cyan-300 uppercase">
                        {currentUser.role === 'customer' ? 'Customer Account' : `${currentUser.role} Role`}
                      </span>
                    </div>

                    {currentUser.role === 'customer' ? (
                      <>
                        <button
                          onClick={() => {
                            setActivePage('customer-dashboard');
                            setIsUserDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-slate-200 hover:bg-slate-800 transition-colors"
                        >
                          <UserIcon className="w-4 h-4 text-amber-400" />
                          <span>My Dashboard & Profile</span>
                        </button>

                        <button
                          onClick={() => {
                            setActivePage('customer-dashboard');
                            setIsUserDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-slate-200 hover:bg-slate-800 transition-colors"
                        >
                          <ShoppingBag className="w-4 h-4 text-blue-400" />
                          <span>Order History & Invoices</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsChatDrawerOpen(true);
                            setIsUserDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-slate-200 hover:bg-slate-800 transition-colors"
                        >
                          <MessageSquare className="w-4 h-4 text-emerald-400" />
                          <span>Live Tech Support Chat</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setActivePage('admin');
                            setIsUserDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-cyan-300 font-semibold hover:bg-slate-800 transition-colors"
                        >
                          <ShieldCheck className="w-4 h-4 text-cyan-400" />
                          <span>Admin Control Console</span>
                        </button>
                      </>
                    )}

                    <div className="pt-2 border-t border-slate-800">
                      <button
                        onClick={() => {
                          logoutUser();
                          setIsUserDropdownOpen(false);
                          setActivePage('home');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-red-400 hover:bg-red-500/10 transition-colors font-semibold"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 sm:p-2.5 rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-slate-800 cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* 3. Navigation Links Row - Desktop */}
        <nav className="hidden lg:flex items-center justify-between border-t border-slate-800/60 py-2.5">
          <div className="flex items-center gap-1">
            {/* Home */}
            <button
              id="nav-link-home"
              onClick={() => setActivePage('home')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                activePage === 'home'
                  ? 'text-cyan-400 bg-cyan-500/10 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              Home
            </button>

            {/* Shop All */}
            <button
              id="nav-link-shop"
              onClick={() => {
                setCategoryFilter('all');
                setActivePage('shop');
              }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                activePage === 'shop' && filters.category === 'all'
                  ? 'text-cyan-400 bg-cyan-500/10 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              Shop
            </button>

            {/* Categories Dropdown */}
            <div className="relative">
              <button
                id="nav-dropdown-categories"
                onClick={() => setIsCategoriesDropdownOpen(!isCategoriesDropdownOpen)}
                onMouseEnter={() => setIsCategoriesDropdownOpen(true)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  isCategoriesDropdownOpen
                    ? 'text-cyan-400 bg-slate-900'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <span>Categories</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              <AnimatePresence>
                {isCategoriesDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    onMouseLeave={() => setIsCategoriesDropdownOpen(false)}
                    className="absolute top-full left-0 mt-1 w-96 bg-slate-900/98 backdrop-blur-2xl border border-slate-800 rounded-2xl shadow-2xl p-3 grid grid-cols-2 gap-1.5 z-50"
                  >
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => handleCategorySelect(cat.id)}
                        className="flex items-center gap-2.5 p-2 rounded-xl text-left text-xs font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-800/90 transition-colors group cursor-pointer"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/40 group-hover:bg-cyan-400 transition-colors"></span>
                        <span className="truncate">{cat.name}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* PC Builder link */}
            <button
              id="nav-link-pcbuilder"
              onClick={() => setActivePage('pc-builder')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                activePage === 'pc-builder'
                  ? 'text-cyan-400 bg-cyan-500/10 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              PC Builder
            </button>

            {/* Services */}
            <button
              id="nav-link-services"
              onClick={() => setActivePage('services')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                activePage === 'services'
                  ? 'text-cyan-400 bg-cyan-500/10 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              Services & Repair
            </button>

            {/* Special Offers */}
            <button
              id="nav-link-offers"
              onClick={() => setActivePage('offers')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                activePage === 'offers'
                  ? 'text-amber-400 bg-amber-500/10 font-semibold'
                  : 'text-slate-300 hover:text-amber-400 hover:bg-slate-900'
              }`}
            >
              <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Special Offers</span>
            </button>

            {/* About Us */}
            <button
              id="nav-link-about"
              onClick={() => setActivePage('about')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                activePage === 'about'
                  ? 'text-cyan-400 bg-cyan-500/10 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              About Us
            </button>

            {/* Contact */}
            <button
              id="nav-link-contact"
              onClick={() => setActivePage('contact')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                activePage === 'contact'
                  ? 'text-cyan-400 bg-cyan-500/10 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              Contact & Location
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-400 flex items-center gap-1.5 bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-800">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span className="font-medium text-slate-300">100% Genuine Official Warranty</span>
            </span>
          </div>
        </nav>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-slate-950/98 backdrop-blur-2xl border-b border-slate-800 px-4 py-5 overflow-hidden max-h-[85vh] overflow-y-auto shadow-2xl"
          >
            {/* Mobile Search Button in Drawer */}
            <div className="mb-4">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsMobileSearchModalOpen(true);
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 hover:border-cyan-500/40"
              >
                <div className="flex items-center gap-2.5">
                  <Search className="w-4 h-4 text-cyan-400" />
                  <span>Search components, laptops, GPUs...</span>
                </div>
                <span className="text-[10px] text-cyan-400 font-semibold">Search</span>
              </button>
            </div>

            <div className="flex flex-col gap-1 text-xs sm:text-sm font-medium">
              <button
                onClick={() => {
                  setActivePage('home');
                  setIsMobileMenuOpen(false);
                }}
                className={`p-2.5 rounded-xl text-left flex items-center justify-between transition-colors ${
                  activePage === 'home' ? 'bg-cyan-500/10 text-cyan-300 font-semibold' : 'text-slate-200 hover:bg-slate-900'
                }`}
              >
                <span>Home</span>
              </button>

              <button
                onClick={() => {
                  setCategoryFilter('all');
                  setActivePage('shop');
                  setIsMobileMenuOpen(false);
                }}
                className={`p-2.5 rounded-xl text-left flex items-center justify-between transition-colors ${
                  activePage === 'shop' && filters.category === 'all' ? 'bg-cyan-500/10 text-cyan-300 font-semibold' : 'text-slate-200 hover:bg-slate-900'
                }`}
              >
                <span>Shop All Hardware</span>
              </button>

              <button
                onClick={() => {
                  setActivePage('pc-builder');
                  setIsMobileMenuOpen(false);
                }}
                className="p-2.5 rounded-xl text-left text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 hover:bg-cyan-950/60 flex items-center justify-between font-bold"
              >
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <span>PC Builder (Custom Rig)</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] uppercase font-bold border border-cyan-500/30">
                  Tool
                </span>
              </button>

              <button
                onClick={() => {
                  setActivePage('offers');
                  setIsMobileMenuOpen(false);
                }}
                className="p-2.5 rounded-xl text-left text-amber-300 bg-amber-950/30 border border-amber-500/30 hover:bg-amber-950/50 flex items-center justify-between font-bold"
              >
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>Hot Deals & Offers</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] uppercase font-bold">
                  Sale
                </span>
              </button>

              <button
                onClick={() => {
                  setActivePage('services');
                  setIsMobileMenuOpen(false);
                }}
                className="p-2.5 rounded-xl text-left text-slate-200 hover:bg-slate-900 flex items-center gap-2"
              >
                <Wrench className="w-4 h-4 text-slate-400" />
                <span>Diagnostics & Repair Services</span>
              </button>

              <button
                onClick={() => {
                  setActivePage('order-tracking');
                  setIsMobileMenuOpen(false);
                }}
                className="p-2.5 rounded-xl text-left text-cyan-300 hover:bg-slate-900 flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 text-cyan-400" />
                <span>Track Order by Invoice / Phone</span>
              </button>

              <button
                onClick={() => {
                  setIsChatDrawerOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="p-2.5 rounded-xl text-left text-emerald-400 bg-emerald-950/30 border border-emerald-500/30 hover:bg-emerald-950/50 flex items-center justify-between font-semibold"
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>Live Tech Support Chat</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </button>

              <button
                onClick={() => {
                  setActivePage('about');
                  setIsMobileMenuOpen(false);
                }}
                className="p-2.5 rounded-xl text-left text-slate-200 hover:bg-slate-900"
              >
                About BAARIZ IT
              </button>

              <button
                onClick={() => {
                  setActivePage('contact');
                  setIsMobileMenuOpen(false);
                }}
                className="p-2.5 rounded-xl text-left text-slate-200 hover:bg-slate-900"
              >
                Contact & Shop Location (Savar)
              </button>

              {/* Categories list in mobile */}
              <div className="mt-3 pt-3 border-t border-slate-800">
                <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider px-2">
                  Component Categories
                </span>
                <div className="grid grid-cols-2 gap-1.5 mt-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.id)}
                      className="p-2 text-left text-xs text-slate-300 hover:text-cyan-400 rounded-lg hover:bg-slate-900 truncate flex items-center gap-1.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/40"></span>
                      <span className="truncate">{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* User Sign In / Account status */}
              <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
                {currentUser ? (
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs text-slate-300">
                      Signed in as <strong className="text-cyan-400">{currentUser.fullName.split(' ')[0]}</strong>
                    </span>
                    <button
                      onClick={() => {
                        logoutUser();
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-xs text-rose-400 font-semibold hover:underline"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsMobileAccountOpen(true);
                    }}
                    className="w-full py-2 rounded-xl bg-slate-900 border border-slate-800 text-center text-xs font-semibold text-cyan-400 hover:bg-slate-800"
                  >
                    Customer Sign In / Register
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dedicated Mobile Account Sheet & Search Modal */}
      <MobileAccountDrawer
        isOpen={isMobileAccountOpen}
        onClose={() => setIsMobileAccountOpen(false)}
      />

      <MobileSearchModal
        isOpen={isMobileSearchModalOpen}
        onClose={() => setIsMobileSearchModalOpen(false)}
      />
    </header>
  );
};
