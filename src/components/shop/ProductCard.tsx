import React from 'react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import {
  ShoppingCart,
  Zap,
  Heart,
  Scale,
  Eye,
  ShieldCheck,
  Star,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
  layout?: 'grid' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, layout = 'grid' }) => {
  const {
    openProductDetail,
    addToCart,
    buyNow,
    toggleWishlist,
    isInWishlist,
    addToCompare,
    isInCompare,
    setQuickViewProduct,
  } = useStore();

  const isWishlisted = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);
  const effectivePrice = product.discountPrice || product.regularPrice;
  const hasDiscount = product.discountPrice && product.discountPrice < product.regularPrice;
  const savings = hasDiscount ? product.regularPrice - (product.discountPrice || 0) : 0;

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    buyNow(product, 1);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1, true);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCompare(product);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  if (layout === 'list') {
    return (
      <div
        id={`product-card-${product.id}`}
        onClick={() => openProductDetail(product)}
        className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-cyan-500/40 transition-all cursor-pointer shadow-sm hover:shadow-xl hover:shadow-cyan-950/20"
      >
        {/* Thumbnail */}
        <div className="relative w-full sm:w-48 h-44 rounded-xl overflow-hidden bg-slate-950 shrink-0 border border-slate-800">
          <img
            src={product.mainImage}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
          {hasDiscount && (
            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-rose-600 text-white font-extrabold text-[10px] uppercase shadow-md">
              Save ৳{savings.toLocaleString('en-BD')}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
              {product.brand}
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-[11px] text-slate-400">{product.categoryName}</span>
            <span className="text-slate-600">•</span>
            <span className="text-[10px] text-slate-500 font-mono">SKU: {product.sku}</span>
          </div>

          <h3 className="text-sm sm:text-base font-bold text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-2">
            {product.name}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
            {product.shortDescription}
          </p>

          <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
            <span className="flex items-center gap-1 text-amber-400 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              {product.rating} ({product.reviewCount})
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              {product.warranty}
            </span>
            <span
              className={`flex items-center gap-1 font-medium ${
                product.stockStatus === 'in_stock' ? 'text-cyan-400' : 'text-amber-400'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              {product.stockStatus === 'in_stock' ? 'In Stock' : 'Limited Stock'}
            </span>
          </div>
        </div>

        {/* Price & Actions */}
        <div className="w-full sm:w-56 flex flex-col items-start sm:items-end justify-between self-stretch sm:border-l sm:border-slate-800/80 sm:pl-4">
          <div>
            <div className="text-xl font-bold font-tech text-cyan-400">
              ৳{effectivePrice.toLocaleString('en-BD')}
            </div>
            {hasDiscount && (
              <div className="text-xs text-slate-500 line-through">
                ৳{product.regularPrice.toLocaleString('en-BD')}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 w-full mt-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors cursor-pointer"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(34,211,238,0.4)]"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Buy Now</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Standard Grid Card
  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => openProductDetail(product)}
      className="group relative flex flex-col justify-between rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-cyan-500/40 p-2.5 sm:p-3.5 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-xl hover:shadow-cyan-950/20"
    >
      {/* Top Badges & Actions Overlay */}
      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-slate-950 border border-slate-800/80 mb-2 sm:mb-3.5">
        <img
          src={product.mainImage}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Discount / Tag Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {hasDiscount && (
            <span className="px-1.5 sm:px-2 py-0.5 rounded-md bg-rose-600/90 text-white font-extrabold text-[9px] sm:text-[10px] uppercase shadow-md backdrop-blur-xs">
              -
              {product.discountPercentage ||
                Math.round(
                  ((product.regularPrice - (product.discountPrice || 0)) / product.regularPrice) * 100
                )}
              % OFF
            </span>
          )}
          {product.isSpecialOffer && (
            <span className="px-1.5 sm:px-2 py-0.5 rounded-md bg-amber-500/90 text-black font-extrabold text-[9px] sm:text-[10px] uppercase shadow-md">
              Hot Offer
            </span>
          )}
        </div>

        {/* Quick Action Floating Buttons (Wishlist, Compare, Quickview) */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 z-10 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleWishlist}
            className={`p-1.5 sm:p-2 rounded-lg backdrop-blur-md border transition-colors cursor-pointer ${
              isWishlisted
                ? 'bg-rose-600 text-white border-rose-500'
                : 'bg-slate-900/80 text-slate-300 hover:text-white border-slate-700 hover:bg-slate-800'
            }`}
            title="Add to Wishlist"
            aria-label="Wishlist"
          >
            <Heart className="w-3 sm:w-3.5 h-3 sm:h-3.5" fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>

          <button
            onClick={handleCompare}
            className={`p-1.5 sm:p-2 rounded-lg backdrop-blur-md border transition-colors cursor-pointer ${
              isCompared
                ? 'bg-cyan-600 text-white border-cyan-500'
                : 'bg-slate-900/80 text-slate-300 hover:text-white border-slate-700 hover:bg-slate-800'
            }`}
            title="Compare Product"
            aria-label="Compare"
          >
            <Scale className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
          </button>

          <button
            onClick={handleQuickView}
            className="p-1.5 sm:p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 backdrop-blur-md transition-colors cursor-pointer hidden sm:flex items-center justify-center"
            title="Quick View"
            aria-label="Quick View"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Stock Status Pill on Image */}
        <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md bg-slate-950/80 backdrop-blur-md border border-slate-800 text-slate-300">
          <span className="flex items-center gap-1 font-medium text-cyan-400">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            <span className="truncate">{product.stockStatus === 'in_stock' ? 'In Stock' : 'Limited'}</span>
          </span>
          <span className="text-slate-400 truncate max-w-[60px] sm:max-w-[100px]">{product.brand}</span>
        </div>
      </div>

      {/* Product Information */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Rating and SKU */}
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400 mb-1">
            <div className="flex items-center gap-1 text-amber-400 font-semibold">
              <Star className="w-2.5 sm:w-3 h-2.5 sm:h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-slate-500">({product.reviewCount})</span>
            </div>
            <span className="text-slate-500 font-mono text-[9px] sm:text-[10px] truncate max-w-[70px] sm:max-w-none">
              {product.sku}
            </span>
          </div>

          {/* Product Name */}
          <h3 className="text-xs sm:text-sm font-bold text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>

          {/* Key Tagline / Warranty */}
          <div className="flex items-center gap-1 mt-1.5 text-[10px] sm:text-[11px] text-slate-400">
            <ShieldCheck className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-cyan-400 shrink-0" />
            <span className="truncate">{product.warranty}</span>
          </div>
        </div>

        {/* Price & Action Buttons */}
        <div className="mt-2.5 sm:mt-4 pt-2 sm:pt-3 border-t border-slate-800/80">
          <div className="flex items-baseline justify-between gap-1 mb-2 sm:mb-3">
            <div>
              <span className="text-[11px] sm:text-xs text-slate-400 font-mono mr-0.5 sm:mr-1">৳</span>
              <span className="text-sm sm:text-base md:text-lg font-bold font-tech text-cyan-400">
                {effectivePrice.toLocaleString('en-BD')}
              </span>
            </div>
            {hasDiscount && (
              <span className="text-[10px] sm:text-xs text-slate-500 line-through">
                ৳{product.regularPrice.toLocaleString('en-BD')}
              </span>
            )}
          </div>

          {/* Buttons: Add to Cart + Buy Now */}
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
            <button
              onClick={handleAddToCart}
              className="flex items-center justify-center gap-1 py-1.5 sm:py-2 px-1 sm:px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-[11px] sm:text-xs transition-colors cursor-pointer"
            >
              <ShoppingCart className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-cyan-400" />
              <span className="truncate">Add</span>
            </button>

            <button
              onClick={handleBuyNow}
              className="flex items-center justify-center gap-1 py-1.5 sm:py-2 px-1 sm:px-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-[11px] sm:text-xs transition-colors cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(34,211,238,0.4)]"
            >
              <Zap className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
              <span className="truncate">Buy Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
