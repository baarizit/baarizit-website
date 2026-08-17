import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../shop/ProductCard';
import { ArrowRight, Sparkles, PackageOpen, PlusCircle } from 'lucide-react';
import { motion } from 'motion/react';

export const FeaturedProducts: React.FC = () => {
  const { products, categories, setActivePage, setCategoryFilter, currentUser } = useStore();
  const [selectedCat, setSelectedCat] = useState<string>('all');

  const activeProducts = products.filter((p) => p.status === 'active');

  const displayList =
    selectedCat === 'all'
      ? activeProducts.slice(0, 8)
      : activeProducts.filter((p) => p.categoryId === selectedCat || p.categoryName === selectedCat).slice(0, 8);

  return (
    <section className="py-16 bg-slate-950/80 border-b border-slate-800/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10"
        >
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold border border-cyan-500/20 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Top Hardware & Gear</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-tech">
              Featured Products
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Genuine components, high performance laptops, and desktop hardware with official warranty in Savar.
            </p>
          </div>

          {/* Filter Tabs if categories exist */}
          {categories.length > 0 && (
            <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 overflow-x-auto max-w-full">
              <button
                onClick={() => setSelectedCat('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCat === 'all'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm shadow-cyan-950/50'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All Products
              </button>
              {categories.slice(0, 5).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCat(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCat === cat.id
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm shadow-cyan-950/50'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Products Grid or Clean Empty State */}
        {displayList.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {displayList.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.45, delay: (idx % 4) * 0.08, ease: 'easeOut' }}
              >
                <ProductCard product={product} layout="grid" />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-10 sm:p-14 text-center flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mb-4">
              <PackageOpen className="w-7 h-7 text-cyan-400/60" />
            </div>
            <h3 className="text-base font-bold text-slate-200">No products available yet</h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mt-1 mb-6">
              Products added from the Admin Panel will be listed here with live pricing, stock status, and specifications.
            </p>
            {currentUser?.role === 'owner' || currentUser?.role === 'manager' ? (
              <button
                onClick={() => setActivePage('admin')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer shadow-lg shadow-cyan-950/50"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Products in Admin Panel</span>
              </button>
            ) : (
              <button
                onClick={() => setActivePage('contact')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
              >
                <span>Contact BAARIZ IT for Inquiries</span>
              </button>
            )}
          </div>
        )}

        {/* Bottom CTA if products exist */}
        {products.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-12 text-center"
          >
            <button
              onClick={() => {
                setCategoryFilter('all');
                setActivePage('shop');
              }}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-cyan-500/40 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.25)] font-bold text-sm transition-all cursor-pointer group"
            >
              <span>Explore Entire Catalog ({products.length} Products)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};
