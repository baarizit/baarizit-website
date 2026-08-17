import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { PCBuilderSlot, Product } from '../../types';
import {
  Cpu,
  CircuitBoard,
  HardDrive,
  Database,
  Disc,
  Tv,
  Keyboard,
  Mouse,
  Zap,
  Box,
  Wind,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ShoppingCart,
  Printer,
  Share2,
  RefreshCw,
  Info,
  X,
  Search,
  Layers,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

interface SlotDefinition {
  slot: PCBuilderSlot;
  title: string;
  categoryKeywords: string[];
  required: boolean;
  icon: any;
  description: string;
}

const BUILDER_SLOTS: SlotDefinition[] = [
  {
    slot: 'processor',
    title: 'Processor (CPU)',
    categoryKeywords: ['processor', 'cpu', 'intel', 'ryzen'],
    required: true,
    icon: Cpu,
    description: 'The computational brain of your system.',
  },
  {
    slot: 'motherboard',
    title: 'Motherboard',
    categoryKeywords: ['motherboard', 'mainboard'],
    required: true,
    icon: CircuitBoard,
    description: 'Connects all components, power phases, and I/O.',
  },
  {
    slot: 'ram',
    title: 'RAM (Memory)',
    categoryKeywords: ['ram', 'memory', 'ddr4', 'ddr5'],
    required: true,
    icon: HardDrive,
    description: 'High-speed system memory for responsive multitasking.',
  },
  {
    slot: 'ssd',
    title: 'Storage (SSD)',
    categoryKeywords: ['ssd', 'nvme', 'm.2'],
    required: true,
    icon: Database,
    description: 'Fast NVMe solid state drive for OS and apps.',
  },
  {
    slot: 'hdd',
    title: 'Storage (HDD)',
    categoryKeywords: ['hdd', 'hard drive', 'hard disk'],
    required: false,
    icon: Disc,
    description: 'High-capacity storage for archives and media.',
  },
  {
    slot: 'graphics-card',
    title: 'Graphics Card (GPU)',
    categoryKeywords: ['graphics-card', 'gpu', 'geforce', 'radeon', 'rtx'],
    required: false,
    icon: Cpu,
    description: 'Dedicated card for 3D rendering and high-refresh gaming.',
  },
  {
    slot: 'power-supply',
    title: 'Power Supply (PSU)',
    categoryKeywords: ['power-supply', 'psu', 'power'],
    required: true,
    icon: Zap,
    description: 'Clean, reliable wattage for all components.',
  },
  {
    slot: 'casing',
    title: 'Casing',
    categoryKeywords: ['casing', 'case', 'chassis'],
    required: true,
    icon: Box,
    description: 'High-airflow cabinet with dust filters.',
  },
  {
    slot: 'cpu-cooler',
    title: 'CPU Cooler',
    categoryKeywords: ['cooler', 'cpu-cooler', 'aio', 'liquid'],
    required: false,
    icon: Wind,
    description: 'Air tower or liquid AIO thermal management.',
  },
  {
    slot: 'monitor',
    title: 'Monitor',
    categoryKeywords: ['monitor', 'display', 'screen'],
    required: false,
    icon: Tv,
    description: 'High refresh rate IPS/OLED display.',
  },
  {
    slot: 'keyboard',
    title: 'Keyboard',
    categoryKeywords: ['keyboard'],
    required: false,
    icon: Keyboard,
    description: 'Mechanical keyboard with tactile switches.',
  },
  {
    slot: 'mouse',
    title: 'Mouse',
    categoryKeywords: ['mouse'],
    required: false,
    icon: Mouse,
    description: 'High-precision optical gaming sensor mouse.',
  },
];

export const PCBuilder: React.FC = () => {
  const {
    pcBuild,
    setPcBuildComponent,
    clearPcBuild,
    pcBuildTotal,
    pcBuildCompatibility,
    addPcBuildToCart,
    products,
    addToast,
    settings,
    currentUser,
    setActivePage,
  } = useStore();

  const [activeSlotModal, setActiveSlotModal] = useState<SlotDefinition | null>(null);
  const [modalSearch, setModalSearch] = useState('');

  const selectedSlotsCount = Object.values(pcBuild).filter(Boolean).length;

  const handleOpenSlotModal = (slotConfig: SlotDefinition) => {
    setActiveSlotModal(slotConfig);
    setModalSearch('');
  };

  const handleSelectProduct = (product: Product) => {
    if (!activeSlotModal) return;
    setPcBuildComponent(activeSlotModal.slot, product);
    setActiveSlotModal(null);
  };

  const handleRemoveComponent = (slot: PCBuilderSlot) => {
    setPcBuildComponent(slot, null);
  };

  const handleAddAllToCart = () => {
    if (selectedSlotsCount === 0) {
      addToast('warning', 'No Components Selected', 'Please choose parts before adding to cart.');
      return;
    }
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
    addPcBuildToCart();
  };

  const handlePrintQuotation = () => {
    window.print();
  };

  const handleShareBuild = () => {
    const componentList = Object.entries(pcBuild)
      .filter(([_, p]) => Boolean(p))
      .map(([slot, p]) => {
        const prod = p as Product;
        return `${slot.toUpperCase()}: ${prod.name} (৳${(prod.discountPrice || prod.regularPrice).toLocaleString('en-BD')})`;
      })
      .join('\n');

    const text = `🖥️ ${settings.shopName} Custom PC Build Quote\nEstimated Total: ৳${pcBuildTotal.toLocaleString(
      'en-BD'
    )}\n\n${componentList}\n\n${settings.address} | Hotline: ${settings.phone}`;

    navigator.clipboard.writeText(text);
    addToast('success', 'Quotation Copied', 'PC configuration text copied to clipboard!');
  };

  // Filter products for the active selection modal
  const eligibleProducts = activeSlotModal
    ? products.filter((p) => {
        if (p.status === 'hidden' || p.status === 'draft') return false;

        // Check if assigned explicitly or matches slot keyword
        const matchesExplicitSlot = p.pcBuilderSlot === activeSlotModal.slot;
        const matchesCategory = activeSlotModal.categoryKeywords.some(
          (k) =>
            p.categoryId.toLowerCase().includes(k) ||
            p.categoryName?.toLowerCase().includes(k) ||
            p.name.toLowerCase().includes(k)
        );

        if (!matchesExplicitSlot && !matchesCategory) return false;

        if (modalSearch.trim()) {
          const q = modalSearch.toLowerCase();
          return (
            p.name.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q)
          );
        }
        return true;
      })
    : [];

  return (
    <section className="py-12 bg-slate-950 min-h-screen text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-8 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold border border-cyan-500/20 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart PC Customizer</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-tech">
              Custom PC Builder
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Select components, verify socket & memory compatibility, estimate system wattage, and calculate instant quotations at {settings.shopName}.
            </p>
          </div>

          {/* Quick Actions Bar */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handlePrintQuotation}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-cyan-400" />
              <span>Print Quotation</span>
            </button>

            <button
              onClick={handleShareBuild}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-cyan-400" />
              <span>Share Quote</span>
            </button>

            {selectedSlotsCount > 0 && (
              <button
                onClick={clearPcBuild}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reset Build</span>
              </button>
            )}
          </div>
        </div>

        {/* Builder Layout: Slots on Left (8 cols), Summary & Compatibility on Right (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
          {/* Component Slots */}
          <div className="lg:col-span-8 space-y-3.5">
            {BUILDER_SLOTS.map((slotDef) => {
              const selectedProduct = pcBuild[slotDef.slot];
              const IconComp = slotDef.icon;

              return (
                <div
                  key={slotDef.slot}
                  className={`p-4 rounded-2xl border transition-all ${
                    selectedProduct
                      ? 'bg-slate-900/80 border-cyan-500/40 shadow-lg shadow-cyan-950/20'
                      : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Left: Slot Icon + Title */}
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
                          selectedProduct
                            ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                            : 'bg-slate-950 text-slate-400 border-slate-800'
                        }`}
                      >
                        <IconComp className="w-5 h-5" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-100 truncate">
                            {slotDef.title}
                          </h3>
                          {slotDef.required && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400 font-semibold border border-cyan-500/20">
                              Required
                            </span>
                          )}
                        </div>

                        {selectedProduct ? (
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-cyan-300 font-medium truncate max-w-sm">
                              {selectedProduct.name}
                            </span>
                            <span className="text-[11px] text-slate-500">
                              • {selectedProduct.warranty}
                            </span>
                          </div>
                        ) : (
                          <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                            {slotDef.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right: Price & Selection Actions */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                      {selectedProduct ? (
                        <>
                          <div className="text-right">
                            <div className="text-sm font-extrabold text-white">
                              ৳
                              {(
                                selectedProduct.discountPrice || selectedProduct.regularPrice
                              ).toLocaleString('en-BD')}
                            </div>
                            {selectedProduct.discountPrice && (
                              <div className="text-[10px] text-slate-500 line-through">
                                ৳{selectedProduct.regularPrice.toLocaleString('en-BD')}
                              </div>
                            )}
                          </div>

                          <button
                            onClick={() => handleOpenSlotModal(slotDef)}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
                          >
                            Change
                          </button>

                          <button
                            onClick={() => handleRemoveComponent(slotDef.slot)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleOpenSlotModal(slotDef)}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-bold transition-all cursor-pointer hover:shadow-[0_0_12px_rgba(34,211,238,0.2)]"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Choose Component</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Summary Box & Live Compatibility */}
          <div className="lg:col-span-4 space-y-6">
            {/* Total Quotation Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 shadow-2xl sticky top-24">
              <h2 className="text-base font-bold text-slate-100 font-tech mb-4">
                Build Quotation Summary
              </h2>

              <div className="space-y-3 pb-4 border-b border-slate-800 text-xs text-slate-300">
                <div className="flex items-center justify-between">
                  <span>Selected Components</span>
                  <span className="font-bold text-white">
                    {selectedSlotsCount} / {BUILDER_SLOTS.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Estimated Total Power</span>
                  <span className="font-bold text-cyan-400">
                    ~{pcBuildCompatibility.totalTdp} Watts
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Recommended PSU</span>
                  <span className="font-bold text-cyan-400">
                    {pcBuildCompatibility.recommendedPsuWattage}W or Higher
                  </span>
                </div>
              </div>

              {/* Total Price Display */}
              <div className="py-4">
                <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                  Estimated Total
                </span>
                <div className="text-3xl font-extrabold text-cyan-400 font-tech mt-0.5">
                  ৳{pcBuildTotal.toLocaleString('en-BD')}
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Includes full assembly, cable management & testing at {settings.shopName} Savar.
                </p>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddAllToCart}
                disabled={selectedSlotsCount === 0}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:pointer-events-none text-slate-950 font-bold text-sm shadow-lg shadow-cyan-950/50 hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] transition-all cursor-pointer mb-4"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add Custom PC to Cart</span>
              </button>

              {/* Compatibility Check Feedback Box */}
              <div
                className={`p-4 rounded-2xl border text-xs ${
                  pcBuildCompatibility.isCompatible
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                }`}
              >
                <div className="flex items-center gap-2 font-bold mb-1.5">
                  {pcBuildCompatibility.isCompatible ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Compatibility Verified</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      <span>Compatibility Warnings</span>
                    </>
                  )}
                </div>

                {pcBuildCompatibility.warnings.length > 0 && (
                  <ul className="space-y-1 list-disc list-inside text-[11px] text-rose-200 mt-2">
                    {pcBuildCompatibility.warnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                )}

                {pcBuildCompatibility.notes.length > 0 && (
                  <ul className="space-y-0.5 list-disc list-inside text-[11px] text-emerald-200/80 mt-1">
                    {pcBuildCompatibility.notes.map((n, i) => (
                      <li key={i}>{n}</li>
                    ))}
                  </ul>
                )}

                {selectedSlotsCount === 0 && (
                  <p className="text-[11px] text-slate-400">
                    Select components to trigger automated hardware socket & memory compatibility verification.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Component Selection Modal */}
      <AnimatePresence>
        {activeSlotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-3xl max-h-[85vh] bg-slate-900 border border-slate-800 rounded-3xl flex flex-col shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase font-bold text-cyan-400 tracking-wider">
                    Select Component
                  </span>
                  <h3 className="text-xl font-bold text-white font-tech">
                    {activeSlotModal.title}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveSlotModal(null)}
                  className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search Bar */}
              <div className="p-4 border-b border-slate-800 bg-slate-950/50">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={modalSearch}
                    onChange={(e) => setModalSearch(e.target.value)}
                    placeholder={`Search ${activeSlotModal.title} by brand, model or SKU...`}
                    className="w-full bg-slate-900 text-xs text-slate-100 rounded-xl pl-10 pr-4 py-2.5 border border-slate-800 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Product List or Empty State */}
              <div className="p-6 overflow-y-auto space-y-3 flex-1">
                {eligibleProducts.length > 0 ? (
                  eligibleProducts.map((prod) => (
                    <div
                      key={prod.id}
                      className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-cyan-500/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
                    >
                      <div className="flex items-center gap-3.5">
                        <img
                          src={prod.mainImage}
                          alt={prod.name}
                          className="w-14 h-14 rounded-xl object-cover bg-slate-900 border border-slate-800 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                              {prod.brand}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              SKU: {prod.sku}
                            </span>
                            {prod.stockQuantity <= 0 && (
                              <span className="text-[10px] text-rose-400 font-bold">
                                Out of Stock
                              </span>
                            )}
                          </div>
                          <h4 className="text-xs font-bold text-slate-100 mt-1 line-clamp-1">
                            {prod.name}
                          </h4>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {prod.warranty}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                        <div className="text-right">
                          <div className="text-sm font-extrabold text-cyan-400">
                            ৳{(prod.discountPrice || prod.regularPrice).toLocaleString('en-BD')}
                          </div>
                          {prod.discountPrice && (
                            <div className="text-[10px] text-slate-500 line-through">
                              ৳{prod.regularPrice.toLocaleString('en-BD')}
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => handleSelectProduct(prod)}
                          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all cursor-pointer shadow-sm hover:shadow-[0_0_12px_rgba(34,211,238,0.3)]"
                        >
                          Select
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center flex flex-col items-center justify-center">
                    <Layers className="w-12 h-12 text-slate-600 mb-3" />
                    <h4 className="text-sm font-bold text-slate-200">
                      No components found for this slot
                    </h4>
                    <p className="text-xs text-slate-400 max-w-sm mt-1 mb-4">
                      {modalSearch
                        ? 'No products matched your search term.'
                        : `No inventory records match "${activeSlotModal.title}" yet.`}
                    </p>
                    {currentUser?.role === 'owner' || currentUser?.role === 'manager' ? (
                      <button
                        onClick={() => {
                          setActiveSlotModal(null);
                          setActivePage('admin');
                        }}
                        className="px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-bold transition-colors cursor-pointer"
                      >
                        Add Components in Admin Panel
                      </button>
                    ) : null}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
