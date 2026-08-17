import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Star, CheckCircle2, MessageSquarePlus, MessageSquare, ThumbsUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CustomerReviews: React.FC = () => {
  const { reviews, addReview, addToast, settings } = useStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const approvedReviews = reviews.filter((r) => r.status === 'approved');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) {
      addToast('warning', 'Missing Details', 'Please enter your name and review comment.');
      return;
    }
    addReview({
      productId: 'general',
      userName: name.trim(),
      userEmail: email.trim() || 'customer@gmail.com',
      rating,
      comment: comment.trim(),
      verifiedPurchase: true,
    });
    setName('');
    setEmail('');
    setComment('');
    setShowAddModal(false);
  };

  return (
    <section className="py-16 bg-slate-950/90 border-b border-slate-800/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10"
        >
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-cyan-400">
              Community Feedback
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-tech mt-1">
              Customer Reviews
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Real feedback from customers who purchased hardware or services at {settings.shopName}.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-cyan-500/30 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] text-xs font-semibold transition-all cursor-pointer"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Write a Review</span>
          </button>
        </motion.div>

        {/* Reviews Grid or Clean Empty State */}
        {approvedReviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {approvedReviews.map((rev, idx) => (
              <motion.div
                key={rev.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 flex flex-col justify-between shadow-sm relative overflow-hidden transition-all"
              >
                <div>
                  {/* Rating & Verified */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                    {rev.verifiedPurchase && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-cyan-400 font-semibold">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed italic line-clamp-4">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-slate-100">{rev.userName}</h4>
                    <span className="text-[10px] text-slate-500">{rev.date}</span>
                  </div>
                  <ThumbsUp className="w-3.5 h-3.5 text-slate-500" />
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-8 sm:p-12 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mb-3">
              <MessageSquare className="w-6 h-6 text-cyan-400/60" />
            </div>
            <h3 className="text-sm font-bold text-slate-200">No customer reviews yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mt-1 mb-5">
              Be the first customer to share your experience with {settings.shopName}.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-bold transition-colors cursor-pointer"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Leave the First Review</span>
            </button>
          </div>
        )}
      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl"
            >
              <h3 className="text-lg font-bold text-slate-100 font-tech mb-1">
                Share Your Experience
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Let fellow tech buyers in Savar know about your purchase or service with {settings.shopName}.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Your Name / Location
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Tanvir Ahmed (Savar)"
                    className="w-full bg-slate-950 text-xs text-slate-100 rounded-xl px-3.5 py-2.5 border border-slate-800 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. user@gmail.com"
                    className="w-full bg-slate-950 text-xs text-slate-100 rounded-xl px-3.5 py-2.5 border border-slate-800 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Star Rating (1 - 5)
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="p-1.5 rounded-lg text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs text-slate-400 font-bold ml-2">{rating} / 5 Stars</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Your Review Feedback
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write about product quality, pricing, warranty support, or staff assistance..."
                    className="w-full bg-slate-950 text-xs text-slate-100 rounded-xl p-3 border border-slate-800 focus:border-cyan-500 focus:outline-none resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all cursor-pointer"
                  >
                    Submit Review
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
