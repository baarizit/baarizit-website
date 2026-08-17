import React from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Cpu,
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActivePage, settings, setCategoryFilter } = useStore();

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-sm">
      {/* Top Value Badges */}
      <div className="border-b border-slate-800/80 py-8 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center shrink-0 border border-cyan-500/20 text-cyan-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wide">100% Genuine Tech</h4>
                <p className="text-[11px] text-slate-400">Authentic products with official manufacturer warranty</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20 text-blue-400">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wide">Fast Local & BD Delivery</h4>
                <p className="text-[11px] text-slate-400">Same day delivery in Savar & fast nationwide courier</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center shrink-0 border border-cyan-500/20 text-cyan-400">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wide">Expert Tech Support</h4>
                <p className="text-[11px] text-slate-400">Direct phone & WhatsApp assistance for PC building</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-500/20 text-amber-400">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wide">Warranty & Service</h4>
                <p className="text-[11px] text-slate-400">Hassle-free replacement and repair lab in Savar</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div
              onClick={() => setActivePage('home')}
              className="flex items-center gap-3 cursor-pointer group w-fit"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-0.5 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <div>
                <span className="font-tech text-xl font-bold tracking-wider text-white">
                  BAARIZ <span className="text-cyan-400">IT</span>
                </span>
                <p className="text-[11px] text-slate-400 tracking-wider uppercase font-medium">
                  {settings.tagline || 'More Tech, More Possibilities'}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              BAARIZ IT is Savar’s premier computer, laptop, and PC component shop. We specialize in custom gaming desktop builds, laptop hardware upgrades, genuine parts, and expert chip-level repair services.
            </p>

            <div className="flex flex-col gap-2 text-xs text-slate-300 mt-2">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  National Blind Welfare Association Shopping Complex, 3rd Floor, Block A, Shop A/23, Savar Bus Stand, Savar, Dhaka, Bangladesh
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                <a href={`tel:${settings.phone.replace(/[^0-9]/g, '')}`} className="hover:text-cyan-400 font-semibold transition-colors">
                  {settings.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Sat–Thu: 10:00 AM – 9:00 PM | Fri: 3:00 PM – 9:30 PM</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider mb-4 border-l-2 border-cyan-500 pl-2">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => setActivePage('home')} className="hover:text-cyan-400 transition-colors cursor-pointer">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => { setCategoryFilter('all'); setActivePage('shop'); }} className="hover:text-cyan-400 transition-colors cursor-pointer">
                  Shop All Hardware
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('pc-builder')} className="hover:text-cyan-400 transition-colors cursor-pointer font-medium text-cyan-400">
                  Custom PC Builder
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('services')} className="hover:text-cyan-400 transition-colors cursor-pointer">
                  Repair & Servicing
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('offers')} className="hover:text-amber-400 transition-colors cursor-pointer text-amber-400">
                  Special Offers & Deals
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('about')} className="hover:text-cyan-400 transition-colors cursor-pointer">
                  About BAARIZ IT
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('contact')} className="hover:text-cyan-400 transition-colors cursor-pointer">
                  Contact & Map
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('sitemap-page')} className="hover:text-cyan-400 transition-colors cursor-pointer text-cyan-400/90 font-medium">
                  Sitemap & SEO Directory
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service & Policies */}
          <div>
            <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider mb-4 border-l-2 border-blue-500 pl-2">
              Customer Service
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => setActivePage('contact')} className="hover:text-cyan-400 transition-colors cursor-pointer">
                  Contact Us
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('order-tracking')} className="hover:text-cyan-400 transition-colors cursor-pointer">
                  Track Your Order
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('warranty-policy')} className="hover:text-cyan-400 transition-colors cursor-pointer">
                  Warranty Policy
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('terms')} className="hover:text-cyan-400 transition-colors cursor-pointer">
                  Delivery Information
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('privacy')} className="hover:text-cyan-400 transition-colors cursor-pointer">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('terms')} className="hover:text-cyan-400 transition-colors cursor-pointer">
                  Terms & Conditions
                </button>
              </li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div>
            <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider mb-4 border-l-2 border-cyan-500 pl-2">
              Top Categories
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => { setCategoryFilter('desktop-pc'); }} className="hover:text-cyan-400 transition-colors cursor-pointer">
                  Desktop PC & Workstations
                </button>
              </li>
              <li>
                <button onClick={() => { setCategoryFilter('laptop'); }} className="hover:text-cyan-400 transition-colors cursor-pointer">
                  Laptops & MacBooks
                </button>
              </li>
              <li>
                <button onClick={() => { setCategoryFilter('graphics-card'); }} className="hover:text-cyan-400 transition-colors cursor-pointer">
                  GeForce RTX & Radeon GPUs
                </button>
              </li>
              <li>
                <button onClick={() => { setCategoryFilter('processor'); }} className="hover:text-cyan-400 transition-colors cursor-pointer">
                  Intel 14th Gen & Ryzen CPUs
                </button>
              </li>
              <li>
                <button onClick={() => { setCategoryFilter('ram'); }} className="hover:text-cyan-400 transition-colors cursor-pointer">
                  DDR5 & DDR4 RAM
                </button>
              </li>
              <li>
                <button onClick={() => { setCategoryFilter('ssd'); }} className="hover:text-cyan-400 transition-colors cursor-pointer">
                  NVMe M.2 SSDs
                </button>
              </li>
              <li>
                <button onClick={() => { setCategoryFilter('laptop-battery'); }} className="hover:text-cyan-400 transition-colors cursor-pointer">
                  Laptop Battery & Keyboards
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Methods Banner */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <span className="text-xs font-semibold text-slate-300">Accepted Payment Methods:</span>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded-md bg-pink-950/40 border border-pink-500/30 text-pink-400 font-bold text-[11px]">
                bKash
              </span>
              <span className="px-2.5 py-1 rounded-md bg-amber-950/40 border border-amber-500/30 text-amber-400 font-bold text-[11px]">
                Nagad
              </span>
              <span className="px-2.5 py-1 rounded-md bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 font-bold text-[11px]">
                Cash on Delivery
              </span>
              <span className="px-2.5 py-1 rounded-md bg-blue-950/40 border border-blue-500/30 text-blue-400 font-bold text-[11px]">
                Bank Transfer
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700 text-slate-300 font-bold text-[11px]">
                Visa / Mastercard
              </span>
            </div>
          </div>
          <div className="text-xs text-slate-500 text-center md:text-right">
            <span>Official Shop: Shop A/23, 3rd Floor, Savar Bus Stand</span>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© 2026 BAARIZ IT. All Rights Reserved. More Tech, More Possibilities.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => setActivePage('privacy')} className="hover:text-slate-300 transition-colors">
              Privacy
            </button>
            <span>•</span>
            <button onClick={() => setActivePage('terms')} className="hover:text-slate-300 transition-colors">
              Terms of Service
            </button>
            <span>•</span>
            <button onClick={() => setActivePage('sitemap-page')} className="hover:text-cyan-400 transition-colors">
              Sitemap (XML)
            </button>
            <span>•</span>
            <button onClick={() => setActivePage('admin')} className="hover:text-cyan-400 transition-colors">
              Staff Portal
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
