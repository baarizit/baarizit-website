import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './ProductCard';
import {
  ShoppingCart,
  Zap,
  Heart,
  Scale,
  Share2,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  CheckCircle2,
  AlertCircle,
  Cpu,
  ArrowLeft,
  MessageSquare,
  FileText,
  HelpCircle,
} from 'lucide-react';
import { motion } from 'motion/react';

export const ProductDetailPage: React.FC = () => {
  const {
    selectedProduct,
    setActivePage,
    addToCart,
    toggleWishlist,
    isInWishlist,
    addToCompare,
    isInCompare,
    products,
    addToast,
    addReview,
  } = useStore();

  if (!selectedProduct) {
    return (
      <div className="py-20 text-center text-zinc-400">
        <p>No product selected.</p>
        <button
          onClick={() => setActivePage('shop')}
          className="mt-4 px-4 py-2 rounded-xl bg-emerald-500 text-zinc-950 font-bold text-xs"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const [activeImage, setActiveImage] = useState(selectedProduct.mainImage);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'description' | 'warranty' | 'reviews'>('specs');

  // Review form state
  const [revName, setRevName] = useState('');
  const [revComment, setRevComment] = useState('');
  const [revRating, setRevRating] = useState(5);

  const isWishlisted = isInWishlist(selectedProduct.id);
  const isCompared = isInCompare(selectedProduct.id);
  const effectivePrice = selectedProduct.discountPrice || selectedProduct.regularPrice;
  const hasDiscount = selectedProduct.discountPrice && selectedProduct.discountPrice < selectedProduct.regularPrice;
  const savings = hasDiscount ? selectedProduct.regularPrice - (selectedProduct.discountPrice || 0) : 0;

  // Related products from same category
  const relatedProducts = products
    .filter((p) => p.categoryId === selectedProduct.categoryId && p.id !== selectedProduct.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(selectedProduct, quantity, true);
  };

  const handleBuyNow = () => {
    addToCart(selectedProduct, quantity, false);
    setActivePage('checkout');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    addToast('success', 'Product Link Copied', 'Link has been copied to your clipboard.');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revName.trim() || !revComment.trim()) {
      addToast('warning', 'Missing Fields', 'Please provide your name and review text.');
      return;
    }
    addReview({
      productId: selectedProduct.id,
      userName: revName.trim(),
      userEmail: 'reviewer@gmail.com',
      rating: revRating,
      comment: revComment.trim(),
      verifiedPurchase: true,
    });
    setRevName('');
    setRevComment('');
    addToast('success', 'Review Submitted', 'Thank you for your rating on this hardware!');
  };

  return (
    <section className="py-10 bg-zinc-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Back Navigation */}
        <button
          onClick={() => setActivePage('shop')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-emerald-400 transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </button>

        {/* Product Overview Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-zinc-900/60 border border-zinc-800/80 rounded-3xl p-6 sm:p-8">
          {/* Left: Images Gallery (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800">
              <img
                src={activeImage}
                alt={selectedProduct.name}
                className="w-full h-full object-cover object-center"
              />
              {hasDiscount && (
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-rose-600 text-white font-extrabold text-xs uppercase shadow-lg">
                  Save ৳{savings.toLocaleString('en-BD')}
                </span>
              )}
            </div>

            {/* Thumbnail previews */}
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {[selectedProduct.mainImage, ...(selectedProduct.galleryImages || [])].map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`w-16 h-16 rounded-xl overflow-hidden bg-zinc-950 border shrink-0 transition-all cursor-pointer ${
                    activeImage === img ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-zinc-800 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Info & Purchase Controls (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              {/* Category, Brand & SKU */}
              <div className="flex items-center gap-2 flex-wrap text-xs text-zinc-400 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-zinc-800 text-emerald-400 font-bold uppercase">
                  {selectedProduct.brand}
                </span>
                <span>•</span>
                <span>{selectedProduct.categoryName}</span>
                <span>•</span>
                <span className="font-mono text-zinc-500">SKU: {selectedProduct.sku}</span>
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white font-tech leading-snug">
                {selectedProduct.name}
              </h1>

              {/* Rating & Warranty pill */}
              <div className="flex items-center gap-4 mt-3 text-xs text-zinc-300">
                <div className="flex items-center gap-1 text-amber-400 font-semibold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{selectedProduct.rating}</span>
                  <span className="text-zinc-500">({selectedProduct.reviewCount} customer reviews)</span>
                </div>
                <span>•</span>
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <ShieldCheck className="w-4 h-4" />
                  {selectedProduct.warranty}
                </span>
              </div>

              {/* Price Banner */}
              <div className="mt-6 p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex items-baseline justify-between">
                <div>
                  <div className="text-xs text-zinc-400 mb-0.5">Special Price:</div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl sm:text-3xl font-black font-tech text-emerald-400">
                      ৳{effectivePrice.toLocaleString('en-BD')}
                    </span>
                    {hasDiscount && (
                      <span className="text-sm text-zinc-500 line-through">
                        ৳{selectedProduct.regularPrice.toLocaleString('en-BD')}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                      selectedProduct.stockStatus === 'in_stock'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {selectedProduct.stockStatus === 'in_stock' ? 'In Stock in Savar' : 'Limited Units'}
                  </span>
                  <p className="text-[10px] text-zinc-500 mt-1">Available at Shop A/23, 3rd Floor</p>
                </div>
              </div>

              {/* Short Description */}
              <p className="text-xs sm:text-sm text-zinc-300 mt-4 leading-relaxed">
                {selectedProduct.shortDescription}
              </p>

              {/* Key Features Bullet List */}
              {selectedProduct.keyFeatures && selectedProduct.keyFeatures.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider mb-2">
                    Key Highlights:
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-300">
                    {selectedProduct.keyFeatures.map((feat, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Quantity and Actions */}
            <div className="mt-8 pt-6 border-t border-zinc-800">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                {/* Quantity input */}
                <div className="flex items-center border border-zinc-700 bg-zinc-950 rounded-xl p-1 shrink-0 justify-between w-32">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-bold flex items-center justify-center cursor-pointer"
                  >
                    -
                  </button>
                  <span className="font-bold text-sm text-zinc-100 font-mono">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-bold flex items-center justify-center cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  id="pdp-add-to-cart-btn"
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-bold text-xs transition-colors cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4 text-emerald-400" />
                  <span>Add to Cart</span>
                </button>

                {/* Buy Now */}
                <button
                  id="pdp-buy-now-btn"
                  onClick={handleBuyNow}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-extrabold text-xs shadow-lg shadow-emerald-950/60 transition-all cursor-pointer"
                >
                  <Zap className="w-4 h-4" />
                  <span>Buy Now</span>
                </button>
              </div>

              {/* Sub-actions: Wishlist, Compare, Share */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-zinc-800/60 text-xs text-zinc-400">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleWishlist(selectedProduct.id)}
                    className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                      isWishlisted ? 'text-rose-400 font-bold' : 'hover:text-white'
                    }`}
                  >
                    <Heart className="w-4 h-4" fill={isWishlisted ? 'currentColor' : 'none'} />
                    <span>{isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}</span>
                  </button>

                  <button
                    onClick={() => addToCompare(selectedProduct)}
                    className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                      isCompared ? 'text-cyan-400 font-bold' : 'hover:text-white'
                    }`}
                  >
                    <Scale className="w-4 h-4" />
                    <span>Compare</span>
                  </button>
                </div>

                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-emerald-400" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Tabs: Specifications, Description, Warranty, Reviews */}
        <div className="mt-12">
          {/* Tab buttons */}
          <div className="flex items-center gap-2 border-b border-zinc-800 overflow-x-auto pb-px">
            <button
              onClick={() => setActiveTab('specs')}
              className={`flex items-center gap-2 py-3 px-5 text-xs font-bold font-tech uppercase tracking-wider border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'specs'
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>Specifications</span>
            </button>

            <button
              onClick={() => setActiveTab('description')}
              className={`flex items-center gap-2 py-3 px-5 text-xs font-bold font-tech uppercase tracking-wider border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'description'
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Full Description</span>
            </button>

            <button
              onClick={() => setActiveTab('warranty')}
              className={`flex items-center gap-2 py-3 px-5 text-xs font-bold font-tech uppercase tracking-wider border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'warranty'
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Warranty & Terms</span>
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex items-center gap-2 py-3 px-5 text-xs font-bold font-tech uppercase tracking-wider border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'reviews'
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Reviews ({selectedProduct.reviewCount})</span>
            </button>
          </div>

          {/* Tab Content Box */}
          <div className="p-6 sm:p-8 bg-zinc-900/40 border border-zinc-800 border-t-0 rounded-b-3xl">
            {/* 1. Specifications Table */}
            {activeTab === 'specs' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wide">
                  Technical Specifications
                </h3>
                <div className="divide-y divide-zinc-800 border border-zinc-800 rounded-2xl overflow-hidden">
                  {Object.entries(selectedProduct.specifications || {}).map(([key, val], idx) => (
                    <div
                      key={key}
                      className={`grid grid-cols-1 sm:grid-cols-3 p-3.5 text-xs ${
                        idx % 2 === 0 ? 'bg-zinc-900/60' : 'bg-zinc-950/40'
                      }`}
                    >
                      <span className="font-semibold text-zinc-400 capitalize">{key}</span>
                      <span className="sm:col-span-2 text-zinc-100 font-mono">{String(val)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Full Description */}
            {activeTab === 'description' && (
              <div className="prose prose-invert max-w-none text-xs sm:text-sm text-zinc-300 leading-relaxed space-y-4">
                <p>{selectedProduct.fullDescription}</p>
                <p>
                  Purchasing hardware from BAARIZ IT gives you peace of mind with 100% authentic sealed packaging, verified Bangladesh serial barcodes, and direct manufacturer technical support. Drop by our Savar showroom for live inspection.
                </p>
              </div>
            )}

            {/* 3. Warranty & Terms */}
            {activeTab === 'warranty' && (
              <div className="space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-zinc-100">Official {selectedProduct.warranty}</h4>
                    <p className="text-xs text-zinc-400 mt-1">
                      This product is protected by official distributor warranty in Bangladesh. You can claim replacement or servicing at our Savar store (Shop A/23, 3rd Floor, Blind Welfare Shopping Complex) or any authorized service center nationwide.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-start gap-3">
                  <RotateCcw className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-zinc-100">7-Day Replacement Policy</h4>
                    <p className="text-xs text-zinc-400 mt-1">
                      If any manufacturing defect is identified within 7 days of purchase with unhampered box and accessories, instant replacement will be provided. Physical damage or burned pins are not covered under standard warranty.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 4. Customer Reviews */}
            {activeTab === 'reviews' && (
              <div className="space-y-8">
                {/* Form to submit review */}
                <form onSubmit={handleReviewSubmit} className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800">
                  <h4 className="text-xs font-bold text-zinc-100 uppercase tracking-wider mb-3">
                    Write a Review for this Product
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                    <input
                      type="text"
                      required
                      value={revName}
                      onChange={(e) => setRevName(e.target.value)}
                      placeholder="Your Name (e.g. Asif Karim)"
                      className="bg-zinc-900 text-xs text-zinc-100 rounded-xl px-3.5 py-2 border border-zinc-800 focus:border-emerald-500 focus:outline-none"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-400">Rating:</span>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setRevRating(star)}
                          className="text-amber-400"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= revRating ? 'fill-amber-400' : 'text-zinc-700'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea
                    rows={2}
                    required
                    value={revComment}
                    onChange={(e) => setRevComment(e.target.value)}
                    placeholder="Share your feedback regarding performance, thermals, build quality..."
                    className="w-full bg-zinc-900 text-xs text-zinc-100 rounded-xl p-3 border border-zinc-800 focus:border-emerald-500 focus:outline-none resize-none mb-3"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition-colors"
                  >
                    Submit Review
                  </button>
                </form>

                {/* Rating Summary */}
                <div className="text-xs text-zinc-400">
                  <p>Reviews from verified purchasers at BAARIZ IT.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h3 className="text-xl font-bold text-zinc-100 font-tech mb-6">
              Related Hardware from {selectedProduct.categoryName}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} layout="grid" />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
