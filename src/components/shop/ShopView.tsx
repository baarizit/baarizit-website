import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './ProductCard';
import {
  Grid,
  List,
  Search,
  X,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  PackageOpen,
  PlusCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ShopView: React.FC = () => {
  const {
    products,
    categories,
    brands,
    filters,
    setFilters,
    resetFilters,
    filteredProducts,
    setCategoryFilter,
    currentUser,
    setActivePage,
    settings,
  } = useStore();

  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Extract unique brands from products & brand list
  const allBrands = useMemo(() => {
    const brandsSet = new Set<string>();
    brands.forEach((b) => brandsSet.add(b.name));
    products.forEach((p) => {
      if (p.brand) brandsSet.add(p.brand);
    });
    return Array.from(brandsSet).sort();
  }, [products, brands]);

  const activeCategoryObj = categories.find((c) => c.id === filters.category);

  return (
    <section className="py-10 bg-slate-950 min-h-screen text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <span>Home</span>
              <span>/</span>
              <span className="text-cyan-400 font-semibold">Shop Catalog</span>
              {activeCategoryObj && (
                <>
                  <span>/</span>
                  <span className="text-slate-200">{activeCategoryObj.name}</span>
                </>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-tech">
              {activeCategoryObj ? activeCategoryObj.name : 'Hardware & PC Catalog'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile Filter Trigger */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 text-slate-200 border border-slate-800 text-xs font-semibold"
            >
              <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
              <span>Filters</span>
            </button>

            {/* Layout Toggle */}
            <div className="flex items-center p-1 bg-slate-900 rounded-xl border border-slate-800">
              <button
                onClick={() => setLayout('grid')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  layout === 'grid' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400 hover:text-white'
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLayout('list')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  layout === 'list' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400 hover:text-white'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Grid: Sidebar Filters (3 Cols) + Products (9 Cols) */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Filters Sidebar (3 Cols) */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6 bg-slate-900/60 p-5 rounded-2xl border border-slate-800 sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Filter Products
              </span>
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-cyan-300 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Keyword Search */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Search</label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={filters.searchQuery}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))
                  }
                  placeholder="Search name, SKU, brand..."
                  className="w-full bg-slate-950 text-xs text-slate-100 rounded-xl pl-9 pr-3 py-2 border border-slate-800 focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Categories */}
            {categories.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Category</label>
                <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                  <button
                    onClick={() => setCategoryFilter('all')}
                    className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center justify-between ${
                      filters.category === 'all'
                        ? 'bg-cyan-500/20 text-cyan-400 font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <span>All Hardware</span>
                    <span className="text-[10px] opacity-70">{products.length}</span>
                  </button>
                  {categories.map((c) => {
                    const count = products.filter(
                      (p) => p.categoryId === c.id || p.categoryName === c.name
                    ).length;
                    return (
                      <button
                        key={c.id}
                        onClick={() => setCategoryFilter(c.id)}
                        className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center justify-between ${
                          filters.category === c.id
                            ? 'bg-cyan-500/20 text-cyan-400 font-bold'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        <span className="truncate">{c.name}</span>
                        <span className="text-[10px] opacity-70">{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Brands */}
            {allBrands.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Brand</label>
                <select
                  value={filters.brand}
                  onChange={(e) => setFilters((prev) => ({ ...prev, brand: e.target.value }))}
                  className="w-full bg-slate-950 text-xs text-slate-200 rounded-xl px-3 py-2 border border-slate-800 focus:border-cyan-500 focus:outline-none"
                >
                  <option value="">All Brands</option>
                  {allBrands.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Price Filter */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
                <span>Max Price</span>
                <span className="font-bold text-cyan-400">
                  ৳{filters.maxPrice.toLocaleString('en-BD')}
                </span>
              </div>
              <input
                type="range"
                min={500}
                max={500000}
                step={1000}
                value={filters.maxPrice}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))
                }
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            {/* Quick Checkbox Toggles */}
            <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={filters.stockOnly}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, stockOnly: e.target.checked }))
                  }
                  className="rounded bg-slate-950 border-slate-800 text-cyan-500 focus:ring-0"
                />
                <span>In-Stock Only</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={filters.offersOnly}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, offersOnly: e.target.checked }))
                  }
                  className="rounded bg-slate-950 border-slate-800 text-cyan-500 focus:ring-0"
                />
                <span>Special Offers Only</span>
              </label>
            </div>
          </aside>

          {/* Products Content Area (9 Cols) */}
          <div className="lg:col-span-9 space-y-6">
            {/* Top Bar: Results Count & Sort Dropdown */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="text-xs text-slate-400">
                Showing{' '}
                <span className="font-bold text-white">{filteredProducts.length}</span> results
                {filters.category !== 'all' && (
                  <span>
                    {' '}
                    in <span className="text-cyan-400 font-semibold">{filters.category}</span>
                  </span>
                )}
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">Sort By:</span>
                <select
                  value={filters.sortBy}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }))
                  }
                  className="bg-slate-950 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 border border-slate-800 focus:border-cyan-500 focus:outline-none"
                >
                  <option value="featured">Featured First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Customer Rated</option>
                  <option value="newest">Newest Arrivals</option>
                  <option value="discount">Highest Discount</option>
                </select>
              </div>
            </div>

            {/* Products Grid or List or Clean Empty State */}
            {filteredProducts.length > 0 ? (
              <div
                className={
                  layout === 'grid'
                    ? 'grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-5'
                    : 'flex flex-col gap-4'
                }
              >
                {filteredProducts.map((prod) => (
                  <ProductCard key={prod.id} product={prod} layout={layout} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="p-12 rounded-3xl bg-slate-900/40 border border-dashed border-slate-800 text-center flex flex-col items-center justify-center">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mb-4">
                  <PackageOpen className="w-7 h-7 text-cyan-400/60" />
                </div>
                <h3 className="text-base font-bold text-slate-200">No products available in catalog</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  The store inventory is currently empty. Use the Admin Dashboard to add products with pricing and stock.
                </p>
                {currentUser?.role === 'owner' || currentUser?.role === 'manager' ? (
                  <button
                    onClick={() => setActivePage('admin')}
                    className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-colors cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Add Products in Admin Panel</span>
                  </button>
                ) : null}
              </div>
            ) : (
              <div className="p-12 rounded-3xl bg-slate-900/40 border border-slate-800 text-center flex flex-col items-center justify-center">
                <Search className="w-10 h-10 text-slate-600 mb-3" />
                <h3 className="text-base font-bold text-slate-200">No Matching Products Found</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  Try adjusting your price range, clearing brand/category filters, or searching for another keyword.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-colors cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl p-6 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <h3 className="text-base font-bold text-white font-tech">Filter Catalog</h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Filter Controls */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Search</label>
                  <input
                    type="text"
                    value={filters.searchQuery}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))
                    }
                    placeholder="Search keyword..."
                    className="w-full bg-slate-950 text-xs text-slate-100 rounded-xl px-3 py-2 border border-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => setCategoryFilter(e.target.value as any)}
                    className="w-full bg-slate-950 text-xs text-slate-100 rounded-xl px-3 py-2 border border-slate-800"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Brand</label>
                  <select
                    value={filters.brand}
                    onChange={(e) => setFilters((prev) => ({ ...prev, brand: e.target.value }))}
                    className="w-full bg-slate-950 text-xs text-slate-100 rounded-xl px-3 py-2 border border-slate-800"
                  >
                    <option value="">All Brands</option>
                    {allBrands.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Max Price: ৳{filters.maxPrice.toLocaleString('en-BD')}
                  </label>
                  <input
                    type="range"
                    min={500}
                    max={500000}
                    step={1000}
                    value={filters.maxPrice}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))
                    }
                    className="w-full accent-cyan-500"
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-800">
                  <button
                    onClick={resetFilters}
                    className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="flex-1 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs cursor-pointer"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
