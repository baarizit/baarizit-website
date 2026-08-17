import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  X,
  ShoppingCart,
  Zap,
  Heart,
  Scale,
  ShieldCheck,
  Star,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const QuickViewModal: React.FC = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    openProductDetail,
    toggleWishlist,
    isInWishlist,
    addToCompare,
    isInCompare,
    setActivePage,
  } = useStore();

  const [quantity, setQuantity] = useState(1);

  if (!quickViewProduct) return null;

  const isWishlisted = isInWishlist(quickViewProduct.id);
  const isCompared = isInCompare(quickViewProduct.id);
  const effectivePrice = quickViewProduct.discountPrice || quickViewProduct.regularPrice;
  const hasDiscount = quickViewProduct.discountPrice && quickViewProduct.discountPrice < quickViewProduct.regularPrice;

  const handleAddToCart = () => {
    addToCart(quickViewProduct, quantity, true);
    setQuickViewProduct(null);
  };

  const handleBuyNow = () => {
    addToCart(quickViewProduct, quantity, false);
    setQuickViewProduct(null);
    setActivePage('checkout');
  };

  const handleViewFull = () => {
    openProductDetail(quickViewProduct);
    setQuickViewProduct(null);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            onClick={() => setQuickViewProduct(null)}
            className="absolute top-4 right-4 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start mt-2">
            {/* Image */}
            <div className="aspect-square rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 relative">
              <img
                src={quickViewProduct.mainImage}
                alt={quickViewProduct.name}
                className="w-full h-full object-cover"
              />
              {hasDiscount && (
                <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-rose-600 text-white font-extrabold text-[10px] uppercase shadow-md">
                  Discount
                </span>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1">
                  <span className="text-emerald-400 font-bold uppercase">{quickViewProduct.brand}</span>
                  <span>•</span>
                  <span>{quickViewProduct.categoryName}</span>
                </div>

                <h3 className="text-base font-bold text-zinc-100 leading-snug">
                  {quickViewProduct.name}
                </h3>

                <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold my-2">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{quickViewProduct.rating}</span>
                  <span className="text-zinc-500">({quickViewProduct.reviewCount} reviews)</span>
                </div>

                <div className="flex items-baseline gap-2 my-2">
                  <span className="text-2xl font-bold font-tech text-emerald-400">
                    ৳{effectivePrice.toLocaleString('en-BD')}
                  </span>
                  {hasDiscount && (
                    <span className="text-xs text-zinc-500 line-through">
                      ৳{quickViewProduct.regularPrice.toLocaleString('en-BD')}
                    </span>
                  )}
                </div>

                <p className="text-xs text-zinc-300 line-clamp-3 leading-relaxed mt-2">
                  {quickViewProduct.shortDescription}
                </p>

                <div className="flex items-center gap-2 mt-3 text-xs text-zinc-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{quickViewProduct.warranty}</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-medium">
                    {quickViewProduct.stockStatus === 'in_stock' ? 'In Stock' : 'Limited'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 pt-4 border-t border-zinc-800 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-zinc-700 bg-zinc-950 rounded-xl p-1 shrink-0 justify-between w-28">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-7 h-7 rounded-lg bg-zinc-900 text-zinc-200 font-bold flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="font-bold text-xs text-zinc-100">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-7 h-7 rounded-lg bg-zinc-900 text-zinc-200 font-bold flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-bold text-xs transition-colors"
                  >
                    <ShoppingCart className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Add to Cart</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleBuyNow}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-md transition-colors"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Buy Now</span>
                  </button>

                  <button
                    onClick={handleViewFull}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold border border-zinc-700 transition-colors"
                  >
                    <span>Full Details</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
