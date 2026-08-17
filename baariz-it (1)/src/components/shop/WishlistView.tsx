import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Heart, Trash2, ShoppingCart, ArrowLeft, Zap } from 'lucide-react';

export const WishlistView: React.FC = () => {
  const {
    wishlist,
    products,
    toggleWishlist,
    addToCart,
    openProductDetail,
    setActivePage,
  } = useStore();

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  if (wishlistedProducts.length === 0) {
    return (
      <section className="py-20 bg-zinc-950 min-h-[70vh] flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-4 text-rose-500">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-zinc-100 font-tech">Your Wishlist is Empty</h2>
          <p className="text-xs text-zinc-400 mt-2">
            Save items you like by clicking the heart icon on any product card.
          </p>
          <button
            onClick={() => setActivePage('shop')}
            className="mt-6 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-md transition-colors cursor-pointer"
          >
            Explore Catalog
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-zinc-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-zinc-800 mb-8">
          <div>
            <button
              onClick={() => setActivePage('shop')}
              className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-emerald-400 mb-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Store</span>
            </button>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 font-tech">
              My Saved Wishlist ({wishlistedProducts.length})
            </h1>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistedProducts.map((prod) => {
            const effPrice = prod.discountPrice || prod.regularPrice;
            return (
              <div
                key={prod.id}
                className="group relative flex flex-col justify-between rounded-2xl bg-zinc-900/60 border border-zinc-800 p-4"
              >
                <div>
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 mb-3">
                    <img
                      src={prod.mainImage}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <button
                      onClick={() => toggleWishlist(prod.id)}
                      className="absolute top-2.5 right-2.5 p-2 rounded-lg bg-zinc-900/80 text-rose-400 hover:bg-rose-600 hover:text-white border border-zinc-700 transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="text-[10px] uppercase font-bold text-emerald-400">
                    {prod.brand}
                  </span>
                  <h3
                    onClick={() => openProductDetail(prod)}
                    className="text-xs font-bold text-zinc-100 hover:text-emerald-300 transition-colors line-clamp-2 cursor-pointer mt-0.5"
                  >
                    {prod.name}
                  </h3>

                  <div className="mt-2 text-base font-bold font-tech text-emerald-400">
                    ৳{effPrice.toLocaleString('en-BD')}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-800 flex gap-2">
                  <button
                    onClick={() => addToCart(prod, 1, true)}
                    className="flex-1 flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs"
                  >
                    <ShoppingCart className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Add to Cart</span>
                  </button>
                  <button
                    onClick={() => {
                      addToCart(prod, 1, false);
                      setActivePage('checkout');
                    }}
                    className="flex-1 flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Buy Now</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
