import React from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Cpu,
  ArrowRight,
  ShieldCheck,
  Zap,
  Wrench,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import { motion } from 'motion/react';

export const HeroSection: React.FC = () => {
  const { setActivePage, setCategoryFilter, settings } = useStore();
  const hero = settings.hero || {
    badgeText: 'PREMIER COMPUTER & TECH SHOP IN SAVAR',
    headlineMain: 'More Tech,',
    headlineHighlight: 'More Possibilities.',
    subtitle: 'Quality Computers, Laptops, Components & Accessories at Competitive Prices.',
    button1Text: 'Shop Now',
    button1Action: 'shop',
    button2Text: 'Build Your PC',
    button2Action: 'pc-builder',
    bannerImage: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=1000&auto=format&fit=crop&q=80',
    featuresList: [
      '100% Authentic Products',
      'Official Manufacturer Warranty',
      'Same-Day Delivery in Savar',
      'Expert On-Site Servicing & Repairs',
    ],
  };

  const handleAction = (action: string) => {
    if (action === 'shop') {
      setCategoryFilter('all');
    }
    setActivePage(action as any);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900/60 to-slate-950 border-b border-slate-800/80 py-14 lg:py-22">
      {/* Background Decorative Tech Grid & Flares */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-950/30 via-slate-950/60 to-transparent pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading & CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 flex flex-col items-start text-left"
          >
            {/* Top Eyebrow Badge */}
            {hero.badgeText && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-6 shadow-sm">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                <span>{hero.badgeText}</span>
              </div>
            )}

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] font-tech">
              {hero.headlineMain}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400">
                {hero.headlineHighlight}
              </span>
            </h1>

            {/* Subheading */}
            <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              {hero.subtitle}
            </p>

            {/* CTA Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4 w-full sm:w-auto">
              {hero.button1Text && (
                <button
                  id="hero-primary-btn"
                  onClick={() => handleAction(hero.button1Action || 'shop')}
                  className="flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-950/60 hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] transition-all cursor-pointer group"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{hero.button1Text}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              )}

              {hero.button2Text && (
                <button
                  id="hero-secondary-btn"
                  onClick={() => handleAction(hero.button2Action || 'pc-builder')}
                  className="flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-100 font-bold text-sm border border-cyan-500/40 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-all cursor-pointer group shadow-sm"
                >
                  <Cpu className="w-4 h-4 text-cyan-400 group-hover:rotate-45 transition-transform" />
                  <span>{hero.button2Text}</span>
                </button>
              )}

              <button
                id="hero-services-link-btn"
                onClick={() => setActivePage('services')}
                className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 text-sm font-medium transition-colors cursor-pointer"
              >
                <Wrench className="w-4 h-4 text-cyan-400" />
                <span>Tech Services</span>
              </button>
            </div>

            {/* Value Highlights */}
            {hero.featuresList && hero.featuresList.length > 0 && (
              <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 w-full text-left">
                {hero.featuresList.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="text-xs text-slate-300 font-medium">{feat}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Right Column: Visual Tech Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-3 shadow-2xl">
              <div className="relative h-80 sm:h-96 rounded-xl overflow-hidden bg-slate-950">
                <img
                  src={hero.bannerImage || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=1000&auto=format&fit=crop&q=80'}
                  alt="BAARIZ IT Store Showcase"
                  className="w-full h-full object-cover object-center opacity-90 hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                {/* Floating Info Tag */}
                <div className="absolute top-4 left-4 p-3 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/60 shadow-xl max-w-[220px]">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-cyan-400" />
                    <span className="text-[11px] font-bold text-slate-100">{settings.shopName}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {settings.tagline}
                  </p>
                </div>

                <div className="absolute bottom-4 right-4 p-3.5 rounded-xl bg-slate-900/95 backdrop-blur-md border border-cyan-500/30 shadow-2xl text-right">
                  <div className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
                    Savar Outlet
                  </div>
                  <div className="text-xs font-bold text-white mt-0.5">
                    Shop A/23, 3rd Floor
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Hotline: <strong className="text-cyan-400">{settings.phone}</strong>
                  </div>
                </div>
              </div>

              {/* Bottom Quick Chips */}
              <div className="mt-3 flex items-center justify-between gap-2 px-2 text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5 truncate">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{settings.address}</span>
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
