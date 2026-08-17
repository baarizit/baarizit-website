import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Search,
  X,
  TrendingUp,
  ArrowRight,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MobileSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_SEARCHES = [
  'Ryzen 5 5600',
  'RTX 4060',
  'DDR4 16GB',
  '1TB NVMe SSD',
  'B550 Motherboard',
  'Gaming Laptop',
  'Mechanical Keyboard',
  '24 Inch IPS Monitor',
];

export const MobileSearchModal: React.FC<MobileSearchModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    products,
    setSearchQuery,
    setActivePage,
    openProductDetail,
    categories,
    setCategoryFilter,
  } = useStore();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const searchResults = query.trim()
    ? products
        .filter((p) => {
          const q = query.toLowerCase();
          return (
            p.name.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q) ||
            p.categoryName.toLowerCase().includes(q)
          );
        })
        .slice(0, 10)
    : [];

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (query.trim()) {
      setSearchQuery(query.trim());
      setActivePage('shop');
      onClose();
    }
  };

  const handleSelectProduct = (prod: (typeof products)[0]) => {
    openProductDetail(prod);
    onClose();
  };

  const handlePopularSearch = (term: string) => {
    setQuery(term);
    setSearchQuery(term);
    setActivePage('shop');
    onClose();
  };

  const handleCategoryClick = (catId: string) => {
    setCategoryFilter(catId);
    setActivePage('shop');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/98 backdrop-blur-2xl text-slate-100">
          {/* Top Search Bar Header */}
          <div className="p-4 border-b border-slate-800 flex items-center gap-3">
            <form
              onSubmit={handleSearchSubmit}
              className="flex-1 relative flex items-center"
            >
              <Search className="w-4 h-4 text-cyan-400 absolute left-3 pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search Ryzen, RTX 4070, RAM, SSD, Laptop..."
                className="w-full bg-slate-900 text-sm text-slate-100 placeholder-slate-500 rounded-xl pl-9 pr-10 py-3 border border-slate-800 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/40"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-3 p-1 rounded-md text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>

            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800 text-xs font-semibold shrink-0"
            >
              Cancel
            </button>
          </div>

          {/* Search Content & Results Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {query.trim().length > 0 ? (
              /* Live Results */
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Found {searchResults.length} matching products</span>
                  <button
                    onClick={() => handleSearchSubmit()}
                    className="text-cyan-400 font-semibold hover:underline flex items-center gap-1"
                  >
                    <span>View all in Shop</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {searchResults.length > 0 ? (
                  <div className="space-y-2">
                    {searchResults.map((prod) => (
                      <div
                        key={prod.id}
                        onClick={() => handleSelectProduct(prod)}
                        className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-cyan-500/40 cursor-pointer transition-all"
                      >
                        <img
                          src={prod.mainImage}
                          alt={prod.name}
                          className="w-12 h-12 object-cover rounded-lg bg-slate-950 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-100 truncate">
                            {prod.name}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {prod.brand} • {prod.categoryName}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-bold text-cyan-400">
                              ৳{(prod.discountPrice || prod.regularPrice).toLocaleString('en-BD')}
                            </span>
                            {prod.discountPrice && (
                              <span className="text-[10px] text-slate-500 line-through">
                                ৳{prod.regularPrice.toLocaleString('en-BD')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-slate-900/40 border border-slate-800/60 rounded-2xl">
                    <p className="text-xs text-slate-400">
                      No hardware matching "<strong className="text-slate-200">{query}</strong>"
                    </p>
                    <button
                      onClick={() => handleSearchSubmit()}
                      className="mt-3 px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
                    >
                      Search All Catalog
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Suggestions & Trending Searches */
              <div className="space-y-5">
                {/* Popular Keywords */}
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
                    <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Popular Searches</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_SEARCHES.map((term) => (
                      <button
                        key={term}
                        onClick={() => handlePopularSearch(term)}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 hover:text-cyan-300 transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Popular Categories */}
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Hardware Categories</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.slice(0, 8).map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryClick(cat.id)}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left text-xs font-medium text-slate-300 hover:text-cyan-400 transition-colors"
                      >
                        <span className="truncate">{cat.name}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
