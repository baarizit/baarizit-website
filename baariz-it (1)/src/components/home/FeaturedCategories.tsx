import React from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Monitor,
  Laptop,
  Cpu,
  CircuitBoard,
  HardDrive,
  Database,
  Disc,
  Tv,
  Keyboard,
  Mouse,
  Headphones,
  Zap,
  Box,
  Wind,
  BatteryCharging,
  Type,
  Plug,
  Wifi,
  Layers,
  ArrowRight,
  PlusCircle,
} from 'lucide-react';
import { motion } from 'motion/react';

// Icon map helper
export const getCategoryIcon = (iconName?: string, className = 'w-6 h-6') => {
  switch (iconName) {
    case 'Monitor':
      return <Monitor className={className} />;
    case 'Laptop':
      return <Laptop className={className} />;
    case 'Cpu':
    case 'Microchip':
      return <Cpu className={className} />;
    case 'CircuitBoard':
      return <CircuitBoard className={className} />;
    case 'HardDrive':
      return <HardDrive className={className} />;
    case 'Database':
      return <Database className={className} />;
    case 'Disc':
      return <Disc className={className} />;
    case 'Tv':
      return <Tv className={className} />;
    case 'Keyboard':
      return <Keyboard className={className} />;
    case 'Mouse':
      return <Mouse className={className} />;
    case 'Headphones':
      return <Headphones className={className} />;
    case 'Zap':
      return <Zap className={className} />;
    case 'Box':
      return <Box className={className} />;
    case 'Wind':
      return <Wind className={className} />;
    case 'BatteryCharging':
      return <BatteryCharging className={className} />;
    case 'Type':
      return <Type className={className} />;
    case 'Plug':
      return <Plug className={className} />;
    case 'Wifi':
      return <Wifi className={className} />;
    default:
      return <Layers className={className} />;
  }
};

export const FeaturedCategories: React.FC = () => {
  const { categories, products, setCategoryFilter, setActivePage, currentUser } = useStore();

  const activeCategories = categories.filter((c) => c.isActive !== false);

  const handleCategoryClick = (categoryId: string) => {
    setCategoryFilter(categoryId);
  };

  return (
    <section className="py-16 bg-slate-950 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8"
        >
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-cyan-400">
              Explore Hardware
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-tech mt-1">
              Hardware Categories
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Browse top-tier hardware, laptops, custom PC components, and authentic replacement accessories.
            </p>
          </div>

          <button
            id="view-all-categories-btn"
            onClick={() => {
              setCategoryFilter('all');
              setActivePage('shop');
            }}
            className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors group cursor-pointer"
          >
            <span>View All Products</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        {/* Categories List or Clean Empty State */}
        {activeCategories.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
            {activeCategories.map((cat, idx) => {
              const productCount = products.filter(
                (p) => p.categoryId === cat.id || p.categoryName === cat.name
              ).length;

              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: Math.min(idx * 0.03, 0.4) }}
                  onClick={() => handleCategoryClick(cat.id)}
                  className="group relative flex flex-col items-center text-center p-4 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer shadow-sm hover:shadow-lg hover:shadow-cyan-950/30"
                >
                  <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-300 group-hover:text-cyan-400 group-hover:border-cyan-500/40 group-hover:scale-110 transition-all mb-3">
                    {getCategoryIcon(cat.iconName, 'w-6 h-6')}
                  </div>

                  <h3 className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition-colors line-clamp-1">
                    {cat.name}
                  </h3>

                  <span className="text-[10px] text-slate-500 group-hover:text-slate-400 mt-1">
                    {productCount} {productCount === 1 ? 'Item' : 'Items'}
                  </span>

                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-cyan-400 group-hover:w-12 transition-all rounded-full" />
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-8 sm:p-12 text-center flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mb-4">
              <Layers className="w-7 h-7 text-cyan-400/60" />
            </div>
            <h3 className="text-base font-bold text-slate-200">No categories added yet</h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mt-1 mb-6">
              The category list is currently empty. Categories added in the Admin Panel will automatically appear here.
            </p>
            {currentUser?.role === 'owner' || currentUser?.role === 'manager' ? (
              <button
                onClick={() => setActivePage('admin')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-bold transition-colors cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Categories in Admin Panel</span>
              </button>
            ) : (
              <button
                onClick={() => setActivePage('shop')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
              >
                <span>Browse Products Catalog</span>
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
