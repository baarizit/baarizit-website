import React from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Home,
  LayoutGrid,
  Search,
  ShoppingCart,
  User,
} from 'lucide-react';

interface MobileBottomNavProps {
  onOpenSearch?: () => void;
  onOpenAccount?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onOpenSearch,
  onOpenAccount,
}) => {
  const {
    activePage,
    setActivePage,
    cartCount,
    setIsCartDrawerOpen,
    currentUser,
    setCategoryFilter,
  } = useStore();

  return (
    <nav
      id="mobile-bottom-nav"
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-2xl border-t border-slate-800/90 px-2 py-1.5 shadow-[0_-8px_25px_rgba(0,0,0,0.5)]"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 8px), 8px)' }}
    >
      <div className="grid grid-cols-5 items-center justify-around max-w-lg mx-auto">
        {/* 1. Home */}
        <button
          id="mobile-nav-home"
          onClick={() => setActivePage('home')}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer min-h-[44px] ${
            activePage === 'home'
              ? 'text-cyan-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className={`w-5 h-5 mb-0.5 ${activePage === 'home' ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]' : ''}`} />
          <span className="text-[10px] tracking-tight">Home</span>
        </button>

        {/* 2. Categories / Hardware */}
        <button
          id="mobile-nav-categories"
          onClick={() => {
            setCategoryFilter('all');
            setActivePage('shop');
          }}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer min-h-[44px] ${
            activePage === 'shop'
              ? 'text-cyan-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <LayoutGrid className={`w-5 h-5 mb-0.5 ${activePage === 'shop' ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]' : ''}`} />
          <span className="text-[10px] tracking-tight">Categories</span>
        </button>

        {/* 3. Search */}
        <button
          id="mobile-nav-search"
          onClick={onOpenSearch}
          className="flex flex-col items-center justify-center py-1 px-1 rounded-xl text-slate-400 hover:text-cyan-300 transition-all cursor-pointer min-h-[44px]"
        >
          <Search className="w-5 h-5 mb-0.5 text-cyan-400" />
          <span className="text-[10px] tracking-tight">Search</span>
        </button>

        {/* 4. Cart with Badge */}
        <button
          id="mobile-nav-cart"
          onClick={() => setIsCartDrawerOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-1 rounded-xl text-slate-400 hover:text-slate-200 transition-all relative cursor-pointer min-h-[44px]"
        >
          <div className="relative mb-0.5">
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-cyan-400 text-slate-950 font-extrabold text-[9px] w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight">Cart</span>
        </button>

        {/* 5. Account / User Profile */}
        <button
          id="mobile-nav-account"
          onClick={onOpenAccount}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer min-h-[44px] ${
            activePage === 'customer-dashboard'
              ? 'text-cyan-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative mb-0.5">
            <User className={`w-5 h-5 ${currentUser ? 'text-cyan-400' : ''}`} />
            {currentUser && (
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-cyan-400 border border-slate-950"></span>
            )}
          </div>
          <span className="text-[10px] tracking-tight truncate max-w-[50px]">
            {currentUser ? currentUser.fullName.split(' ')[0] : 'Account'}
          </span>
        </button>
      </div>
    </nav>
  );
};
