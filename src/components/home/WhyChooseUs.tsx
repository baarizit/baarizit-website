import React from 'react';
import {
  ShieldCheck,
  BadgePercent,
  Headphones,
  Wrench,
  Smile,
  Award,
} from 'lucide-react';
import { motion } from 'motion/react';

export const WhyChooseUs: React.FC = () => {
  const cards = [
    {
      title: 'Genuine Products',
      description: '100% brand new, authentic products sourced directly from official authorized distributors in Bangladesh with original serial barcodes.',
      icon: <ShieldCheck className="w-6 h-6 text-cyan-400" />,
      tag: '100% Authentic',
    },
    {
      title: 'Competitive Pricing',
      description: 'Best market rates in Savar and Dhaka with transparent pricing, zero hidden charges, and special student/bulk combo packages.',
      icon: <BadgePercent className="w-6 h-6 text-blue-400" />,
      tag: 'Best Value',
    },
    {
      title: 'Expert Support',
      description: 'Experienced hardware engineers and certified technicians to guide you through PC building, component compatibility, and upgrades.',
      icon: <Headphones className="w-6 h-6 text-amber-400" />,
      tag: 'Free Consultation',
    },
    {
      title: 'Quality Service',
      description: 'State-of-the-art repair lab in Savar Shopping Complex for precision micro-soldering, laptop cleaning, and custom liquid cooling loops.',
      icon: <Wrench className="w-6 h-6 text-cyan-400" />,
      tag: 'Fast Turnaround',
    },
    {
      title: 'Customer Satisfaction',
      description: 'Dedicated post-purchase aftersales assistance, friendly communication, on-site setup guidance, and thousands of happy gamers and professionals.',
      icon: <Smile className="w-6 h-6 text-blue-400" />,
      tag: '5-Star Rated',
    },
    {
      title: 'Warranty Support',
      description: 'Hassle-free official manufacturer warranty claim handling, replacement support, and emergency temporary backup parts.',
      icon: <Award className="w-6 h-6 text-rose-400" />,
      tag: 'Official Warranty',
    },
  ];

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
            Why Choose BAARIZ IT
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-tech mt-1">
            Your Trusted Tech Partner in Savar
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            We deliver unmatched reliability, genuine hardware, and dedicated after-sales care for enthusiasts and businesses alike.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, idx) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.45, delay: idx * 0.08 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 hover:bg-slate-900 transition-all group shadow-sm hover:shadow-xl hover:shadow-cyan-950/25 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center group-hover:scale-110 group-hover:border-cyan-500/30 transition-all">
                    {card.icon}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {card.tag}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                  {card.title}
                </h3>

                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {card.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
