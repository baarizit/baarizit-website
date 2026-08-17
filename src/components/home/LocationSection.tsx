import React from 'react';
import { useStore } from '../../context/StoreContext';
import { MapPin, Navigation, Phone, Clock, MessageCircle, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';

export const LocationSection: React.FC = () => {
  const { settings } = useStore();

  const cleanPhone = settings.phone.replace(/[^0-9]/g, '');
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    'National Blind Welfare Association Shopping Complex Savar Dhaka Bangladesh'
  )}`;

  return (
    <section className="py-16 bg-slate-950 border-b border-slate-800/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <span className="text-xs uppercase font-bold tracking-widest text-cyan-400">
            Physical Outlet
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-tech mt-1">
            Visit BAARIZ IT Shop in Savar
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Experience hardware in person, test gaming rigs, drop off laptops for servicing, or pick up online orders directly.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Shop Address & Landmark Details (5 cols) with slide-in from left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl"
          >
            <div className="space-y-6">
              <div>
                <span className="text-[11px] uppercase font-bold tracking-wider text-cyan-400">
                  Store Location
                </span>
                <h3 className="text-xl font-bold text-white font-tech mt-1">
                  BAARIZ IT Computer & Laptop Store
                </h3>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-300">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0 text-cyan-400 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-100 block">Exact Address:</span>
                    <p className="text-slate-400 mt-0.5 leading-relaxed">
                      National Blind Welfare Association Shopping Complex, 3rd Floor, Block A, Shop A/23, Savar Bus Stand, Savar, Dhaka, Bangladesh
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shrink-0 text-blue-400 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-100 block">Business Hours:</span>
                    <p className="text-slate-400 mt-0.5">
                      Saturday – Thursday: 10:00 AM – 9:00 PM<br />
                      Friday: 3:00 PM – 9:30 PM
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0 text-cyan-400 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-100 block">Direct Hotline:</span>
                    <a
                      href={`tel:${cleanPhone}`}
                      className="text-cyan-400 font-bold hover:underline"
                    >
                      {settings.phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap gap-3">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all"
              >
                <Navigation className="w-4 h-4" />
                <span>Get Directions</span>
              </a>

              <a
                href={`https://wa.me/88${cleanPhone}?text=${encodeURIComponent(
                  'Hello BAARIZ IT! I am visiting your shop at Savar Shopping Complex. What is the best route?'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-xs border border-slate-700 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-cyan-400" />
                <span>WhatsApp Shop</span>
              </a>
            </div>
          </motion.div>

          {/* Embedded Google Map (7 cols) with slide-in from right */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="lg:col-span-7 rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl relative min-h-[380px]"
          >
            <iframe
              title="BAARIZ IT Store Map Savar"
              src="https://maps.google.com/maps?q=National%20Blind%20Welfare%20Association%20Shopping%20Complex%2C%20Savar%20Bus%20Stand%2C%20Savar%2C%20Dhaka&t=&z=16&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full min-h-[380px] border-0 filter invert-[0.9] hue-rotate-[170deg] contrast-[1.2] opacity-90 hover:opacity-100 transition-opacity"
              loading="lazy"
              allowFullScreen
            />
            <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-slate-950/90 backdrop-blur-md border border-slate-800 text-xs text-slate-300 flex items-center justify-between pointer-events-none">
              <span className="flex items-center gap-1.5 font-medium">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                Savar Bus Stand Landmark Complex (3rd Floor, Shop A/23)
              </span>
              <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">23.8475° N, 90.2575° E</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
