import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../shop/ProductCard';
import { Flame, Clock, Tag, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export const SpecialOffers: React.FC = () => {
  const { products, coupons, setActivePage, applyCoupon, settings } = useStore();

  const offerProducts = products.filter(
    (p) => p.status === 'active' && (p.isSpecialOffer || (p.discountPrice && p.discountPrice < p.regularPrice))
  );

  const activeCoupon = coupons.find((c) => c.isActive);

  // Live countdown timer for promotional flash deals
  const [timeLeft, setTimeLeft] = useState({ hours: 48, minutes: 35, seconds: 12 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 48, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-16 bg-gradient-to-b from-slate-950 via-slate-900/40 to-slate-950 border-b border-slate-800/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Promotional Banner Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-cyan-950/60 via-slate-900 to-blue-950/60 border border-cyan-500/30 p-6 sm:p-10 mb-12 shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-bold uppercase tracking-wider mb-4">
                <Flame className="w-4 h-4 text-rose-400 animate-bounce" />
                <span>Special Tech Deals & Campaigns</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-tech leading-tight">
                Authentic Hardware & Custom PC Builds at <span className="text-cyan-400">{settings.shopName}</span>
              </h2>

              {activeCoupon ? (
                <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
                  Use coupon code{' '}
                  <span
                    className="px-2.5 py-1 rounded bg-slate-800 text-cyan-300 font-mono font-bold border border-cyan-500/40 cursor-pointer hover:bg-slate-700 transition-colors inline-block"
                    onClick={() => applyCoupon(activeCoupon.code)}
                  >
                    {activeCoupon.code}
                  </span>{' '}
                  for{' '}
                  {activeCoupon.discountType === 'percentage'
                    ? `${activeCoupon.value}% discount`
                    : `৳${activeCoupon.value} discount`}{' '}
                  on minimum spend of ৳{activeCoupon.minSpend.toLocaleString('en-BD')}!
                </p>
              ) : (
                <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
                  Enjoy genuine hardware components, official manufacturer warranty, and competitive pricing in Savar Bus Stand.
                </p>
              )}
            </div>

            {/* Countdown Box */}
            <div className="flex flex-col items-start lg:items-end gap-3 shrink-0">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>Campaign Window:</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex flex-col items-center bg-slate-900/90 border border-slate-700 px-4 py-2.5 rounded-xl shadow-lg">
                  <span className="text-2xl font-bold font-tech text-cyan-400">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase font-medium">Hours</span>
                </div>
                <span className="text-xl font-bold text-slate-600">:</span>
                <div className="flex flex-col items-center bg-slate-900/90 border border-slate-700 px-4 py-2.5 rounded-xl shadow-lg">
                  <span className="text-2xl font-bold font-tech text-cyan-400">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase font-medium">Mins</span>
                </div>
                <span className="text-xl font-bold text-slate-600">:</span>
                <div className="flex flex-col items-center bg-slate-900/90 border border-slate-700 px-4 py-2.5 rounded-xl shadow-lg">
                  <span className="text-2xl font-bold font-tech text-cyan-400">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase font-medium">Secs</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Special Products Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-100 font-tech">
              Special Offers & Deals
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Limited-time discounts on hardware and computer components.
            </p>
          </div>
          <button
            onClick={() => setActivePage('shop')}
            className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors group cursor-pointer"
          >
            <span>Browse All Items</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        {/* Deals Grid or Clean Empty State */}
        {offerProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {offerProducts.slice(0, 4).map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
              >
                <ProductCard product={product} layout="grid" />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-8 sm:p-10 text-center flex flex-col items-center justify-center">
            <Tag className="w-10 h-10 text-cyan-400/50 mb-3" />
            <h4 className="text-sm font-bold text-slate-200">No active discounted offers right now</h4>
            <p className="text-xs text-slate-400 max-w-sm mt-1 mb-4">
              Discounted campaigns or special offer products marked in the Admin Panel will be highlighted here.
            </p>
            <button
              onClick={() => setActivePage('shop')}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              Browse Full Catalog
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
