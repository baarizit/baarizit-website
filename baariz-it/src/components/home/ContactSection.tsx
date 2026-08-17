import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Phone, MessageCircle, Mail, MapPin, Send, Clock, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export const ContactSection: React.FC = () => {
  const { settings, addToast } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'product-inquiry',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const cleanPhone = settings.phone.replace(/[^0-9]/g, '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.message.trim()) {
      addToast('warning', 'Incomplete Form', 'Please enter your name, phone number, and message.');
      return;
    }

    setIsSubmitted(true);
    addToast('success', 'Message Sent!', 'Thank you! A BAARIZ IT tech expert will call you shortly.');
    setTimeout(() => {
      setFormData({
        name: '',
        phone: '',
        email: '',
        subject: 'product-inquiry',
        message: '',
      });
      setIsSubmitted(false);
    }, 4000);
  };

  return (
    <section className="py-16 bg-slate-950/90 border-b border-slate-800/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <span className="text-xs uppercase font-bold tracking-widest text-cyan-400">
            Get in Touch
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-tech mt-1">
            Contact BAARIZ IT
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Have questions about PC compatibility, stock availability, or laptop repair quote? Reach us instantly.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Contact Methods Cards (5 cols) with slide-in from left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="lg:col-span-5 flex flex-col gap-4"
          >
            {/* Direct Call Card */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-4 hover:border-cyan-500/30 transition-all">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 uppercase font-semibold">Phone Support</span>
                  <div className="text-base font-bold text-slate-100 font-tech">{settings.phone}</div>
                </div>
              </div>
              <a
                id="contact-call-now-btn"
                href={`tel:${cleanPhone}`}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all"
              >
                Call Now
              </a>
            </div>

            {/* Direct WhatsApp Card */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-4 hover:border-cyan-500/30 transition-all">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 uppercase font-semibold">WhatsApp Chat</span>
                  <div className="text-base font-bold text-slate-100 font-tech">{settings.phone}</div>
                </div>
              </div>
              <a
                id="contact-whatsapp-chat-btn"
                href={`https://wa.me/88${cleanPhone}?text=${encodeURIComponent(
                  'Hello BAARIZ IT! I have a question regarding PC parts / Laptop service.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all"
              >
                Chat
              </a>
            </div>

            {/* Email Support Card */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3.5 hover:border-slate-700 transition-all">
              <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Email Address</span>
                <div className="text-sm font-bold text-slate-100">{settings.email}</div>
              </div>
            </div>

            {/* Business Hours Card */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3.5 hover:border-slate-700 transition-all">
              <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mt-0.5">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Store Opening Hours</span>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  <strong className="text-slate-100">Saturday – Thursday:</strong> 10:00 AM – 9:00 PM<br />
                  <strong className="text-slate-100">Friday:</strong> 3:00 PM – 9:30 PM (After Jumu'ah)
                </p>
              </div>
            </div>
          </motion.div>

          {/* Online Message Form (7 cols) with slide-in from right */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl"
          >
            <h3 className="text-lg font-bold text-slate-100 font-tech mb-1">
              Send an Instant Inquiry
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Fill in your inquiry and our tech team will reach out with pricing, compatibility, and availability.
            </p>

            {isSubmitted ? (
              <div className="p-8 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 text-center flex flex-col items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-cyan-400 mb-3" />
                <h4 className="text-base font-bold text-cyan-300">Message Received!</h4>
                <p className="text-xs text-slate-300 mt-1 max-w-sm">
                  Thank you for contacting BAARIZ IT. Our Savar team is reviewing your message and will call you back shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Shakil Mahmud"
                      className="w-full bg-slate-950 text-xs text-slate-100 rounded-xl px-3.5 py-2.5 border border-slate-800 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. 017XXXXXXXX"
                      className="w-full bg-slate-950 text-xs text-slate-100 rounded-xl px-3.5 py-2.5 border border-slate-800 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. user@example.com"
                      className="w-full bg-slate-950 text-xs text-slate-100 rounded-xl px-3.5 py-2.5 border border-slate-800 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Inquiry Subject
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-slate-950 text-xs text-slate-100 rounded-xl px-3.5 py-2.5 border border-slate-800 focus:border-cyan-500 focus:outline-none"
                    >
                      <option value="product-inquiry">Product Stock & Price Inquiry</option>
                      <option value="pc-build-quote">Custom Gaming PC Quotation</option>
                      <option value="laptop-service">Laptop Repair & Servicing</option>
                      <option value="warranty-claim">Official Warranty Claim</option>
                      <option value="corporate-bulk">Corporate / Bulk Office Order</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Your Message / Requirements *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe the product you want, your PC build budget, or laptop issue..."
                    className="w-full bg-slate-950 text-xs text-slate-100 rounded-xl p-3 border border-slate-800 focus:border-cyan-500 focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-950/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.35)] transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message to BAARIZ IT</span>
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
