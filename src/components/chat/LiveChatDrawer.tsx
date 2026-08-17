import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ShieldCheck,
  Phone,
  Image,
  ArrowUpRight,
  Minimize2,
  Maximize2,
  ChevronDown,
  ArrowDown,
  Clock,
  CheckCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const LiveChatDrawer: React.FC = () => {
  const {
    currentUser,
    isChatDrawerOpen,
    setIsChatDrawerOpen,
    conversations,
    messages,
    sendMessage,
    markConversationAsRead,
    unreadMessagesCount,
    setIsAuthModalOpen,
    settings,
    products,
  } = useStore();

  const [inputMsg, setInputMsg] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isSupportTyping, setIsSupportTyping] = useState(false);
  const [isUserTyping, setIsUserTyping] = useState(false);
  const [showScrollBottomBtn, setShowScrollBottomBtn] = useState(false);
  const [newMessagesWhileScrolled, setNewMessagesWhileScrolled] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const userTypingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const supportReplyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Identify current customer / visitor ID
  const custId = currentUser?.role === 'customer' ? currentUser.id : 'guest-visitor';
  const myConv = conversations.find(
    (c) => c.customerId === custId || (currentUser?.phone && c.customerPhone === currentUser.phone)
  );
  const convId = myConv?.id || `conv-${custId}`;
  const myMessages = messages.filter((m) => m.conversationId === convId);

  // Smooth scroll to bottom function with RAF
  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    requestAnimationFrame(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTo({
          top: chatContainerRef.current.scrollHeight,
          behavior,
        });
      }
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior, block: 'end' });
      }
      setNewMessagesWhileScrolled(0);
      setShowScrollBottomBtn(false);
    });
  }, []);

  // Monitor scroll position to show/hide "Scroll to Bottom" button
  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

    if (distanceFromBottom > 120) {
      setShowScrollBottomBtn(true);
    } else {
      setShowScrollBottomBtn(false);
      setNewMessagesWhileScrolled(0);
    }
  };

  // Scroll to bottom when messages change or typing state changes
  useEffect(() => {
    if (isChatDrawerOpen && !isMinimized) {
      if (!showScrollBottomBtn) {
        const timer = setTimeout(() => {
          scrollToBottom('smooth');
        }, 50);
        return () => clearTimeout(timer);
      } else {
        setNewMessagesWhileScrolled((prev) => prev + 1);
      }
    }
  }, [myMessages.length, isSupportTyping, isChatDrawerOpen, isMinimized, scrollToBottom, showScrollBottomBtn]);

  // Initial scroll when opening or un-minimizing drawer
  useEffect(() => {
    if (isChatDrawerOpen && !isMinimized) {
      const timer = setTimeout(() => {
        scrollToBottom('auto');
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isChatDrawerOpen, isMinimized, scrollToBottom]);

  // Mark as read when open
  useEffect(() => {
    if (isChatDrawerOpen && myConv) {
      markConversationAsRead(myConv.id, 'customer');
    }
  }, [isChatDrawerOpen, myConv?.unreadByCustomerCount, markConversationAsRead, myConv]);

  // Clean up timeouts
  useEffect(() => {
    return () => {
      if (userTypingTimeoutRef.current) clearTimeout(userTypingTimeoutRef.current);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMsg(e.target.value);
    setIsUserTyping(true);

    if (userTypingTimeoutRef.current) {
      clearTimeout(userTypingTimeoutRef.current);
    }
    userTypingTimeoutRef.current = setTimeout(() => {
      setIsUserTyping(false);
    }, 1500);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const query = inputMsg.trim();
    if (!query) return;

    // Send customer message to backend
    sendMessage({
      senderRole: 'customer',
      customerId: custId,
      content: query,
      conversationId: convId,
    });

    setInputMsg('');
    setIsUserTyping(false);

    // Trigger instant smooth scroll
    setTimeout(() => {
      scrollToBottom('smooth');
    }, 50);
  };

  const handleQuickQuestion = (suggestion: string) => {
    sendMessage({
      senderRole: 'customer',
      customerId: custId,
      content: suggestion,
      conversationId: convId,
    });

    setTimeout(() => {
      scrollToBottom('smooth');
    }, 50);
  };

  return (
    <>
      {/* Floating Chat Bubble */}
      {!isChatDrawerOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsChatDrawerOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-3 px-4 py-3 rounded-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-2xl shadow-amber-500/30 border border-amber-400/50 cursor-pointer transition-all group"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 transition-transform group-hover:scale-110" />
            {unreadMessagesCount > 0 && (
              <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold animate-pulse">
                {unreadMessagesCount}
              </span>
            )}
          </div>
          <span className="hidden sm:inline font-tech tracking-wide uppercase">
            Live Support Chat
          </span>
        </motion.button>
      )}

      {/* Floating Chat Drawer Window */}
      <AnimatePresence>
        {isChatDrawerOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${
              isMinimized
                ? 'w-72 h-14'
                : 'w-[calc(100vw-2rem)] sm:w-96 h-[540px] max-h-[85vh]'
            }`}
          >
            {/* Header */}
            <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between select-none">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold font-tech text-xs shadow-inner">
                    BIT
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-zinc-950 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-100 font-tech flex items-center gap-1.5">
                    <span>{settings.shopName} Support</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase font-semibold">
                      Online
                    </span>
                  </h4>
                  <p className="text-[10px] text-zinc-400">Savar Hardware & Rig Specialists</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
                  title={isMinimized ? 'Expand' : 'Minimize'}
                >
                  {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => setIsChatDrawerOpen(false)}
                  className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
                  title="Close Chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Body (if not minimized) */}
            {!isMinimized && (
              <>
                {/* Guest alert prompt */}
                {currentUser?.role !== 'customer' && (
                  <div className="bg-amber-500/10 border-b border-amber-500/20 px-3.5 py-2 flex items-center justify-between text-[11px] text-amber-300">
                    <span>Chatting as Guest. Sign in for persistent history.</span>
                    <button
                      onClick={() => setIsAuthModalOpen(true)}
                      className="font-bold underline text-amber-400 ml-2 cursor-pointer hover:text-amber-300"
                    >
                      Login
                    </button>
                  </div>
                )}

                {/* Messages feed container */}
                <div
                  ref={chatContainerRef}
                  onScroll={handleScroll}
                  className="flex-1 overflow-y-auto p-4 space-y-3 bg-zinc-950/50 scroll-smooth relative"
                >
                  {myMessages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-500 text-xs">
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3 shadow-md shadow-amber-500/5">
                        <Bot className="w-6 h-6" />
                      </div>
                      <p className="font-bold text-zinc-200 text-sm font-tech">
                        How can BAARIZ IT assist you today?
                      </p>
                      <p className="mt-1 text-[11px] text-zinc-400 max-w-[240px]">
                        Ask about stock availability in Savar City Centre, custom PC builds, or same-day delivery.
                      </p>
                      <div className="mt-4 flex flex-col gap-1.5 w-full">
                        {[
                          'Do you have same-day delivery in Savar?',
                          'Can you recommend a gaming build under ৳60k?',
                          'What is the warranty policy on graphics cards?',
                          'Where is your physical shop in Savar?',
                        ].map((suggestion, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleQuickQuestion(suggestion)}
                            className="text-left px-3 py-2 rounded-xl bg-zinc-900/90 border border-zinc-800 hover:border-amber-500/50 hover:bg-zinc-850 text-[11px] text-zinc-300 transition-all cursor-pointer shadow-sm"
                          >
                            "{suggestion}"
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <>
                      {myMessages.map((msg) => {
                        const isMe = msg.senderRole === 'customer';
                        return (
                          <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.2 }}
                            className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                          >
                            <span className="text-[9px] text-zinc-500 mb-0.5 px-1 flex items-center gap-1">
                              <span>{msg.senderName}</span>
                              <span>•</span>
                              <span>{msg.timestamp}</span>
                            </span>
                            <div
                              className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                                isMe
                                  ? 'bg-amber-500 text-zinc-950 font-medium rounded-tr-none shadow-md shadow-amber-500/10'
                                  : 'bg-zinc-850 text-zinc-100 rounded-tl-none border border-zinc-700/60 shadow-md'
                              }`}
                            >
                              <p className="whitespace-pre-line">{msg.content}</p>
                              {msg.productAttachment && (
                                <div className="mt-2.5 p-2 rounded-xl bg-black/30 border border-white/10 flex items-center gap-2.5">
                                  <img
                                    src={msg.productAttachment.image}
                                    alt={msg.productAttachment.name}
                                    className="w-10 h-10 rounded-lg object-cover bg-zinc-900 shrink-0"
                                    referrerPolicy="no-referrer"
                                  />
                                  <div className="text-[11px] min-w-0">
                                    <p className="font-bold line-clamp-1 text-zinc-100">{msg.productAttachment.name}</p>
                                    <p className="text-amber-400 font-mono font-semibold">
                                      ৳{msg.productAttachment.price.toLocaleString('en-BD')}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </>
                  )}

                  {/* Animated Typing Indicator */}
                  <AnimatePresence>
                    {isSupportTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col items-start"
                      >
                        <span className="text-[9px] text-zinc-500 mb-0.5 px-1 flex items-center gap-1">
                          <Bot className="w-2.5 h-2.5 text-amber-400" />
                          <span>BAARIZ IT Support</span>
                        </span>
                        <div className="bg-zinc-850 text-zinc-300 rounded-2xl rounded-tl-none border border-zinc-700/60 px-4 py-3 shadow-md flex items-center gap-2">
                          <span className="text-[11px] text-zinc-400 font-tech">Specialist is typing</span>
                          <div className="flex items-center gap-1">
                            <motion.span
                              animate={{ y: [0, -5, 0] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                              className="w-1.5 h-1.5 rounded-full bg-amber-400"
                            />
                            <motion.span
                              animate={{ y: [0, -5, 0] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                              className="w-1.5 h-1.5 rounded-full bg-amber-400"
                            />
                            <motion.span
                              animate={{ y: [0, -5, 0] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                              className="w-1.5 h-1.5 rounded-full bg-amber-400"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Bottom anchor */}
                  <div ref={messagesEndRef} className="h-1" />
                </div>

                {/* Floating "Scroll to bottom" button when user scrolls up */}
                <AnimatePresence>
                  {showScrollBottomBtn && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: 10 }}
                      onClick={() => scrollToBottom('smooth')}
                      className="absolute bottom-16 right-4 z-20 px-3 py-1.5 rounded-full bg-zinc-800/90 hover:bg-zinc-700 border border-zinc-700 text-white text-[11px] font-semibold flex items-center gap-1.5 shadow-xl backdrop-blur-sm cursor-pointer transition-all"
                    >
                      <ArrowDown className="w-3.5 h-3.5 text-amber-400" />
                      <span>Jump to Latest</span>
                      {newMessagesWhileScrolled > 0 && (
                        <span className="w-4 h-4 rounded-full bg-amber-500 text-zinc-950 font-bold text-[9px] flex items-center justify-center">
                          {newMessagesWhileScrolled}
                        </span>
                      )}
                    </motion.button>
                  )}
                </AnimatePresence>

                {/* User typing hint */}
                {isUserTyping && (
                  <div className="px-4 py-1 bg-zinc-950/80 text-[10px] text-zinc-500 italic flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    <span>You are typing...</span>
                  </div>
                )}

                {/* Input form */}
                <form
                  onSubmit={handleSend}
                  className="p-3 bg-zinc-950 border-t border-zinc-800 flex items-center gap-2 relative z-10"
                >
                  <input
                    type="text"
                    value={inputMsg}
                    onChange={handleInputChange}
                    placeholder="Type a message or ask support..."
                    className="flex-1 bg-zinc-900 text-xs text-zinc-100 rounded-xl px-3.5 py-2.5 border border-zinc-800 focus:border-amber-500 focus:outline-none transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={!inputMsg.trim()}
                    className={`p-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                      inputMsg.trim()
                        ? 'bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-md shadow-amber-500/20'
                        : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                    }`}
                    title="Send Message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
