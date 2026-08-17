import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Phone,
  MessageCircle,
  X,
  MessageSquare,
  Headphones,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const FloatingContactButtons: React.FC = () => {
  const { settings, setIsChatDrawerOpen } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  const cleanPhone = (settings.phone || '01911000000').replace(/[^0-9]/g, '');
  const cleanWhatsapp = (settings.whatsapp || settings.phone || '01911000000').replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/88${cleanWhatsapp}?text=${encodeURIComponent(
    'Hello BAARIZ IT! I need information regarding hardware components, PC pricing, or repair in Savar.'
  )}`;

  return (
    <div
      id="floating-contact-container"
      className="fixed z-40 right-4 sm:right-6 bottom-20 lg:bottom-6 flex flex-col items-end gap-2.5"
    >
      {/* Expanded Action Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="flex flex-col gap-2 p-2 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-cyan-500/30 shadow-2xl shadow-cyan-950/60 max-w-xs"
          >
            {/* Header info */}
            <div className="px-3 py-1.5 border-b border-slate-800 flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3 h-3" />
                BAARIZ IT Support
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-500 hover:text-slate-300 p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </div>

            {/* 1. Live Chat Button */}
            <button
              onClick={() => {
                setIsOpen(false);
                setIsChatDrawerOpen(true);
              }}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-emerald-950/60 hover:border-emerald-500/40 border border-transparent text-slate-200 hover:text-emerald-300 text-xs font-semibold transition-all text-left"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <p className="leading-tight">Live Tech Chat</p>
                <p className="text-[10px] text-slate-400 font-normal">Real-time with hardware technician</p>
              </div>
            </button>

            {/* 2. WhatsApp Direct Link */}
            <a
              id="floating-whatsapp-btn"
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-emerald-950/60 hover:border-emerald-500/40 border border-transparent text-slate-200 hover:text-emerald-300 text-xs font-semibold transition-all text-left"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <MessageCircle className="w-4 h-4 fill-white/20" />
              </div>
              <div>
                <p className="leading-tight">WhatsApp Messenger</p>
                <p className="text-[10px] text-slate-400 font-normal">{settings.phone}</p>
              </div>
            </a>

            {/* 3. Direct Phone Call Link */}
            <a
              id="floating-call-btn"
              href={`tel:${cleanPhone}`}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-cyan-950/60 hover:border-cyan-500/40 border border-transparent text-slate-200 hover:text-cyan-300 text-xs font-semibold transition-all text-left"
            >
              <div className="w-7 h-7 rounded-lg bg-cyan-600 text-white flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <p className="leading-tight">Call Hotline Now</p>
                <p className="text-[10px] text-slate-400 font-normal">Instant voice support</p>
              </div>
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Single Floating Toggle Button */}
      <motion.button
        id="floating-support-master-btn"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3.5 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-xl shadow-cyan-950/70 border border-cyan-300/40 transition-all cursor-pointer group"
        aria-label="Contact and Support"
      >
        <div className="relative flex items-center justify-center">
          {isOpen ? (
            <X className="w-5 h-5 text-slate-950" />
          ) : (
            <Headphones className="w-5 h-5 text-slate-950 group-hover:rotate-12 transition-transform" />
          )}
          {!isOpen && (
            <span className="flex h-2.5 w-2.5 absolute -top-1 -right-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
            </span>
          )}
        </div>
        <span className="hidden sm:inline font-tech tracking-wide font-extrabold">
          {isOpen ? 'Close' : 'Quick Help'}
        </span>
      </motion.button>
    </div>
  );
};
