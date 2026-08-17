import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ServiceItem } from '../../types';
import {
  Wrench,
  Cpu,
  Tv,
  BatteryCharging,
  Keyboard,
  Disc,
  Download,
  Flame,
  Zap,
  Droplet,
  Search,
  CheckCircle2,
  Clock,
  Phone,
  MessageCircle,
  X,
  PlusCircle,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ServicesView: React.FC = () => {
  const { services, addToast, settings, currentUser, setActivePage } = useStore();
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [bookingName, setBookingName] = useState('');
  const [bookingPhone, setBookingPhone] = useState('');
  const [bookingDevice, setBookingDevice] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');

  const cleanPhone = settings.phone.replace(/[^0-9]/g, '');

  const getServiceIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Cpu':
        return <Cpu className="w-6 h-6 text-cyan-400" />;
      case 'Tv':
        return <Tv className="w-6 h-6 text-cyan-400" />;
      case 'BatteryCharging':
        return <BatteryCharging className="w-6 h-6 text-amber-400" />;
      case 'Keyboard':
        return <Keyboard className="w-6 h-6 text-cyan-400" />;
      case 'Disc':
        return <Disc className="w-6 h-6 text-purple-400" />;
      case 'Download':
        return <Download className="w-6 h-6 text-cyan-400" />;
      case 'Flame':
        return <Flame className="w-6 h-6 text-rose-400" />;
      case 'Zap':
        return <Zap className="w-6 h-6 text-amber-400" />;
      case 'Droplet':
        return <Droplet className="w-6 h-6 text-blue-400" />;
      case 'Search':
        return <Search className="w-6 h-6 text-cyan-400" />;
      default:
        return <Wrench className="w-6 h-6 text-cyan-400" />;
    }
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingName.trim() || !bookingPhone.trim()) {
      addToast('warning', 'Missing Details', 'Please provide your name and contact phone number.');
      return;
    }

    addToast(
      'success',
      'Service Appointment Requested',
      `Thank you ${bookingName}! Our Savar lab technician will call you at ${bookingPhone} to confirm.`
    );
    setSelectedService(null);
    setBookingName('');
    setBookingPhone('');
    setBookingDevice('');
    setBookingNotes('');
  };

  return (
    <section className="py-12 bg-slate-950 min-h-screen text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold border border-cyan-500/20 mb-3">
            <Wrench className="w-3.5 h-3.5" />
            <span>Savar Repair & Upgrade Lab</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-tech">
            Tech Services & Hardware Repair
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Professional hardware repairs, display swaps, chip-level troubleshooting, thermal repasting, and custom assembly at {settings.shopName}.
          </p>
        </div>

        {/* Lab Highlights Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-100">Same-Day Express Service</h4>
              <p className="text-[11px] text-slate-400">Quick OS setup, thermal paste, and RAM/SSD upgrade</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-100">Original Replacement Parts</h4>
              <p className="text-[11px] text-slate-400">Genuine laptop displays, batteries, keyboards & adapters</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-100">Direct Lab Hotline</h4>
              <a href={`tel:${cleanPhone}`} className="text-[11px] text-cyan-400 font-bold hover:underline">
                Call {settings.phone} for quote
              </a>
            </div>
          </div>
        </div>

        {/* Services Grid or Clean Empty State */}
        {services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, idx) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 hover:bg-slate-900 transition-all flex flex-col justify-between group shadow-sm hover:shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                      {getServiceIcon(service.iconName)}
                    </div>
                    <span className="text-[11px] font-mono font-bold text-cyan-400 px-2.5 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30">
                      From ৳{service.priceStarting?.toLocaleString('en-BD')}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {service.description}
                  </p>

                  {service.features && service.features.length > 0 && (
                    <ul className="mt-3 space-y-1">
                      {service.features.map((feat, i) => (
                        <li key={i} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                          <CheckCircle2 className="w-3 h-3 text-cyan-400 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Turnaround: {service.turnaroundTime}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedService(service)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-colors cursor-pointer"
                  >
                    Book Service / Quote
                  </button>

                  <a
                    href={`https://wa.me/88${cleanPhone}?text=${encodeURIComponent(
                      `Hello ${settings.shopName}! I need assistance with ${service.title}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 transition-colors"
                    title="WhatsApp Inquiry"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-10 sm:p-14 text-center flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mb-4">
              <Wrench className="w-7 h-7 text-cyan-400/60" />
            </div>
            <h3 className="text-base font-bold text-slate-200">No services listed yet</h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mt-1 mb-6">
              You can define repair offerings, diagnostics, thermal tuning, and maintenance packages in the Admin Panel.
            </p>
            {currentUser?.role === 'owner' || currentUser?.role === 'manager' ? (
              <button
                onClick={() => setActivePage('admin')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer shadow-lg shadow-cyan-950/50"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create Services in Admin Panel</span>
              </button>
            ) : (
              <a
                href={`tel:${cleanPhone}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
              >
                <Phone className="w-4 h-4 text-cyan-400" />
                <span>Call Hotline for Service Assistance ({settings.phone})</span>
              </a>
            )}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                <div>
                  <span className="text-[10px] uppercase font-bold text-cyan-400">
                    Book Service Slot
                  </span>
                  <h3 className="text-base font-bold text-white font-tech">
                    {selectedService.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedService(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleBookingSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={bookingName}
                    onChange={(e) => setBookingName(e.target.value)}
                    placeholder="e.g. Shakil Mahmud"
                    className="w-full bg-slate-950 text-xs text-slate-100 rounded-xl px-3.5 py-2.5 border border-slate-800 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Contact Phone Number (Bangladeshi) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={bookingPhone}
                    onChange={(e) => setBookingPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full bg-slate-950 text-xs text-slate-100 rounded-xl px-3.5 py-2.5 border border-slate-800 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Device Model / Specifications
                  </label>
                  <input
                    type="text"
                    value={bookingDevice}
                    onChange={(e) => setBookingDevice(e.target.value)}
                    placeholder="e.g. Asus TUF Gaming F15 or Desktop Core i5"
                    className="w-full bg-slate-950 text-xs text-slate-100 rounded-xl px-3.5 py-2.5 border border-slate-800 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Issue Description / Special Requests
                  </label>
                  <textarea
                    rows={3}
                    value={bookingNotes}
                    onChange={(e) => setBookingNotes(e.target.value)}
                    placeholder="Describe problem (e.g. heating issue, no display, blue screen, keyboard replacement)..."
                    className="w-full bg-slate-950 text-xs text-slate-100 rounded-xl p-3 border border-slate-800 focus:border-cyan-500 focus:outline-none resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedService(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    Confirm Request
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
