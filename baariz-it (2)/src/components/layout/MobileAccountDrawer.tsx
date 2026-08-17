import React from 'react';
import { useStore } from '../../context/StoreContext';
import {
  X,
  User,
  ShoppingBag,
  Heart,
  MessageSquare,
  LogOut,
  ShieldCheck,
  Package,
  MapPin,
  HelpCircle,
  LogIn,
  UserPlus,
  Cpu,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MobileAccountDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileAccountDrawer: React.FC<MobileAccountDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    currentUser,
    logoutUser,
    setIsAuthModalOpen,
    setActivePage,
    setIsChatDrawerOpen,
    settings,
    wishlist,
  } = useStore();

  const handleOpenAuth = (mode?: 'login' | 'register') => {
    onClose();
    setIsAuthModalOpen(true);
  };

  const handleNavigate = (page: any) => {
    onClose();
    setActivePage(page);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          {/* Drawer / Bottom Sheet */}
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className="relative w-full sm:max-w-md max-h-[85vh] overflow-y-auto bg-slate-900/95 backdrop-blur-2xl border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl z-10 text-slate-100 flex flex-col"
          >
            {/* Top Sheet Handle (Mobile Indicator) */}
            <div className="sm:hidden w-12 h-1.5 bg-slate-700 rounded-full mx-auto mb-4" />

            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100 font-tech">
                    {currentUser ? 'My Account' : 'Welcome to BAARIZ IT'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {currentUser ? currentUser.email : 'Premier Computer Shop in Savar'}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                aria-label="Close Account Menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Area */}
            <div className="py-4 space-y-4">
              {currentUser ? (
                /* LOGGED IN USER CONTENT */
                <div className="space-y-3">
                  {/* User Profile Card */}
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center font-bold text-slate-950 text-sm shrink-0">
                        {currentUser.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-sm text-slate-100 truncate">
                          {currentUser.fullName}
                        </p>
                        <p className="text-xs text-slate-400 truncate">
                          {currentUser.phone || currentUser.email}
                        </p>
                      </div>
                    </div>

                    <span className="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase">
                      {currentUser.role}
                    </span>
                  </div>

                  {/* Navigation Links for Customer */}
                  <div className="space-y-1 pt-1">
                    {currentUser.role === 'customer' ? (
                      <>
                        <button
                          onClick={() => handleNavigate('customer-dashboard')}
                          className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800 text-left transition-colors text-xs font-semibold text-slate-200"
                        >
                          <div className="flex items-center gap-3">
                            <User className="w-4 h-4 text-cyan-400" />
                            <span>My Profile & Dashboard</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-500" />
                        </button>

                        <button
                          onClick={() => handleNavigate('customer-dashboard')}
                          className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800 text-left transition-colors text-xs font-semibold text-slate-200"
                        >
                          <div className="flex items-center gap-3">
                            <ShoppingBag className="w-4 h-4 text-blue-400" />
                            <span>My Orders & Invoices</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-500" />
                        </button>

                        <button
                          onClick={() => handleNavigate('wishlist')}
                          className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800 text-left transition-colors text-xs font-semibold text-slate-200"
                        >
                          <div className="flex items-center gap-3">
                            <Heart className="w-4 h-4 text-rose-400" />
                            <span>Wishlist Products ({wishlist.length})</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-500" />
                        </button>

                        <button
                          onClick={() => {
                            onClose();
                            setIsChatDrawerOpen(true);
                          }}
                          className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800 text-left transition-colors text-xs font-semibold text-slate-200"
                        >
                          <div className="flex items-center gap-3">
                            <MessageSquare className="w-4 h-4 text-emerald-400" />
                            <span>Live Support Messages</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-500" />
                        </button>
                      </>
                    ) : (
                      /* Admin/Owner link */
                      <button
                        onClick={() => handleNavigate('admin')}
                        className="w-full flex items-center justify-between p-3.5 rounded-xl bg-cyan-950/50 hover:bg-cyan-900/60 border border-cyan-500/40 text-left transition-colors text-xs font-bold text-cyan-300"
                      >
                        <div className="flex items-center gap-3">
                          <ShieldCheck className="w-4 h-4 text-cyan-400" />
                          <span>Enter Admin Console</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-cyan-400" />
                      </button>
                    )}
                  </div>

                  {/* Sign Out Button */}
                  <div className="pt-2 border-t border-slate-800">
                    <button
                      onClick={() => {
                        logoutUser();
                        onClose();
                        setActivePage('home');
                      }}
                      className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out from Account</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* NOT LOGGED IN CONTENT */
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/40 border border-cyan-500/20 text-center">
                    <p className="text-xs text-slate-300 mb-3">
                      Sign in to track orders in real-time, view invoices, save custom PC builds, and request quick warranty assistance.
                    </p>

                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        onClick={() => handleOpenAuth('login')}
                        className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
                      >
                        <LogIn className="w-4 h-4" />
                        <span>Sign In</span>
                      </button>

                      <button
                        onClick={() => handleOpenAuth('register')}
                        className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs border border-slate-700 transition-all cursor-pointer"
                      >
                        <UserPlus className="w-4 h-4 text-cyan-400" />
                        <span>Register</span>
                      </button>
                    </div>
                  </div>

                  {/* Quick Assistance Links */}
                  <div className="space-y-1">
                    <button
                      onClick={() => handleNavigate('order-tracking')}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/30 hover:bg-slate-800 text-left transition-colors text-xs font-medium text-slate-300"
                    >
                      <div className="flex items-center gap-3">
                        <Package className="w-4 h-4 text-cyan-400" />
                        <span>Track Order by Phone / Invoice</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </button>

                    <button
                      onClick={() => {
                        onClose();
                        setIsChatDrawerOpen(true);
                      }}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/30 hover:bg-slate-800 text-left transition-colors text-xs font-medium text-slate-300"
                    >
                      <div className="flex items-center gap-3">
                        <MessageSquare className="w-4 h-4 text-emerald-400" />
                        <span>Live Tech Support Chat</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </button>

                    <button
                      onClick={() => handleNavigate('contact')}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/30 hover:bg-slate-800 text-left transition-colors text-xs font-medium text-slate-300"
                    >
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-blue-400" />
                        <span>Shop Location & Savar Outlet</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Safe Area & Help */}
            <div className="pt-3 border-t border-slate-800/80 text-center text-[11px] text-slate-500">
              Hotline: <strong className="text-cyan-400 font-semibold">{settings.phone}</strong> • Savar City
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
