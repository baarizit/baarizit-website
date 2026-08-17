import React from 'react';
import { useStore } from '../../context/StoreContext';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    cartTotal,
    appliedCoupon,
    removeCoupon,
    setActivePage,
  } = useStore();

  if (!isCartOpen) return null;

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setActivePage('checkout');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-full max-w-md bg-zinc-900 border-l border-zinc-800 h-full flex flex-col justify-between shadow-2xl"
        >
          {/* Header */}
          <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-zinc-100 font-tech">
                Shopping Cart ({cart.reduce((acc, item) => acc + item.quantity, 0)})
              </h3>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-zinc-800/80">
            {cart.length > 0 ? (
              cart.map((item) => {
                const effectivePrice = item.product.discountPrice || item.product.regularPrice;
                return (
                  <div key={item.product.id} className="py-4 first:pt-0 last:pb-0 flex gap-3.5">
                    <img
                      src={item.product.mainImage}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-xl object-cover bg-zinc-950 border border-zinc-800 shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-zinc-100 truncate">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-zinc-500 hover:text-rose-400 p-0.5 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-xs font-bold font-tech text-emerald-400 mt-1">
                        ৳{effectivePrice.toLocaleString('en-BD')}
                      </div>

                      {/* Quantity buttons */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center border border-zinc-800 bg-zinc-950 rounded-lg p-0.5">
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                            className="w-6 h-6 rounded bg-zinc-900 text-zinc-300 font-bold flex items-center justify-center hover:bg-zinc-800"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-zinc-100 font-mono">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                            className="w-6 h-6 rounded bg-zinc-900 text-zinc-300 font-bold flex items-center justify-center hover:bg-zinc-800"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-[11px] text-zinc-400 font-mono">
                          = ৳{(effectivePrice * item.quantity).toLocaleString('en-BD')}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-16 text-center text-zinc-500 flex flex-col items-center justify-center">
                <ShoppingCart className="w-12 h-12 text-zinc-700 mb-3" />
                <p className="text-sm font-semibold text-zinc-300">Your cart is empty</p>
                <p className="text-xs text-zinc-500 mt-1">Explore our PC parts & laptops catalog</p>
              </div>
            )}
          </div>

          {/* Footer & Checkout button */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-zinc-800 bg-zinc-950/60 space-y-3">
              {appliedCoupon && (
                <div className="flex items-center justify-between text-xs text-emerald-400 bg-emerald-950/30 border border-emerald-500/30 p-2 rounded-xl">
                  <span>Coupon ({appliedCoupon.code}) Applied:</span>
                  <div className="flex items-center gap-1.5">
                    <span>
                      -৳
                      {(appliedCoupon.type === 'fixed'
                        ? appliedCoupon.discountValue
                        : (cartSubtotal * appliedCoupon.discountValue) / 100
                      ).toLocaleString('en-BD')}
                    </span>
                    <button
                      onClick={removeCoupon}
                      className="text-rose-400 hover:text-rose-300 font-bold ml-1"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-1.5 text-xs text-zinc-400">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-mono text-zinc-200">
                    ৳{cartSubtotal.toLocaleString('en-BD')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Savar Express Delivery:</span>
                  <span className="text-emerald-400 font-medium">Free</span>
                </div>
                <div className="pt-2 border-t border-zinc-800 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-zinc-100">Grand Total:</span>
                  <span className="text-xl font-bold font-tech text-emerald-400">
                    ৳{cartTotal.toLocaleString('en-BD')}
                  </span>
                </div>
              </div>

              <button
                id="cart-proceed-checkout-btn"
                onClick={handleProceedToCheckout}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-lg shadow-emerald-950/60 transition-all cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-500">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Original Brand Warranty • Cash / bKash / Nagad</span>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
