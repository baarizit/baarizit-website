import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Search,
  Package,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Cpu,
  FileCode,
  Download,
  Copy,
  Check,
  Globe,
  ExternalLink,
  Layers,
  ArrowRight,
  FileText,
} from 'lucide-react';
import {
  generateSitemapXml,
  generateRobotsTxt,
  buildSitemapEntries,
  calculateSitemapStats,
  downloadSitemapXml,
  downloadRobotsTxt,
  getCleanBaseUrl,
} from '../../services/sitemapService';

export const AboutPage: React.FC = () => {
  const { settings, setActivePage } = useStore();

  return (
    <section className="py-12 bg-slate-950 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold border border-cyan-500/20 mb-3">
            <Cpu className="w-4 h-4" />
            <span>About BAARIZ IT</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-tech">
            More Tech, More Possibilities
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Savar’s premier computer, laptop, gaming rig, and component specialist.
          </p>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-10">
          <h2 className="text-lg font-bold text-white font-tech">Who We Are</h2>
          <p>
            Located at the heart of Savar (National Blind Welfare Association Shopping Complex, 3rd Floor, Block A, Shop A/23), <strong>BAARIZ IT</strong> was founded to provide computer enthusiasts, gamers, students, and corporate businesses in Savar and greater Dhaka with 100% authentic tech products at honest, competitive prices.
          </p>

          <h2 className="text-lg font-bold text-white font-tech pt-4">Our Specialty & Mission</h2>
          <p>
            Whether you are building a competitive esports gaming desktop, upgrading high-speed DDR5 RAM, sourcing genuine replacement laptop batteries/keyboards, or needing micro-soldering motherboard servicing, our team delivers dedicated technical support and manufacturer-backed warranties.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
              <ShieldCheck className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
              <h4 className="font-bold text-slate-100 text-xs">Official Warranty</h4>
              <p className="text-[11px] text-slate-400 mt-1">Direct distributor replacement guarantee</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
              <Truck className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
              <h4 className="font-bold text-slate-100 text-xs">Express Delivery</h4>
              <p className="text-[11px] text-slate-400 mt-1">Same day in Savar, fast nationwide dispatch</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
              <Phone className="w-6 h-6 text-amber-400 mx-auto mb-2" />
              <h4 className="font-bold text-slate-100 text-xs">Direct Hotline</h4>
              <p className="text-[11px] text-slate-400 mt-1">{settings.phone}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const OrderTrackingPage: React.FC = () => {
  const { orders } = useStore();
  const [trackingId, setTrackingId] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<any>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    const found = orders.find(
      (o: any) =>
        (o.id && o.id.toLowerCase() === trackingId.trim().toLowerCase()) ||
        (o.customerPhone && o.customerPhone.includes(trackingId.trim())) ||
        (o.customer?.phone && o.customer.phone.includes(trackingId.trim()))
    );
    setSearchedOrder(found || null);
  };

  return (
    <section className="py-12 bg-slate-950 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold border border-cyan-500/20 mb-3">
            <Package className="w-4 h-4" />
            <span>Order Dispatch & Status</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white font-tech">
            Track Your Order
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Enter your Order ID (e.g. BIT-2026-001) or Mobile Number to check real-time processing status.
          </p>
        </div>

        <form onSubmit={handleTrack} className="flex gap-2 max-w-lg mx-auto mb-8">
          <div className="relative flex-1">
            <input
              type="text"
              required
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              placeholder="e.g. BIT-2026-001 or 01622615188"
              className="w-full bg-slate-900 text-xs text-white rounded-xl pl-9 pr-3 py-3 border border-slate-800 focus:outline-none focus:border-cyan-500 font-mono"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-colors"
          >
            Track Status
          </button>
        </form>

        {hasSearched && searchedOrder && (
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="font-mono text-cyan-400 font-bold text-sm">Order #{searchedOrder.id}</span>
                <p className="text-xs text-slate-400 mt-0.5">
                  Placed on {new Date(searchedOrder.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-cyan-950/60 text-cyan-400 border border-cyan-500/30">
                {searchedOrder.status}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block">Customer Information</span>
                <strong className="text-slate-200 block mt-1">
                  {searchedOrder.customerName || searchedOrder.customer?.fullName}
                </strong>
                <span className="text-slate-400">
                  {searchedOrder.customerPhone || searchedOrder.customer?.phone}
                </span>
                <p className="text-slate-500 mt-1">
                  {searchedOrder.shippingAddress || searchedOrder.customer?.address}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block">Payment Summary</span>
                <div className="text-lg font-bold font-tech text-emerald-400 mt-1">
                  ৳{(searchedOrder.totalAmount || searchedOrder.total || 0).toLocaleString('en-BD')}
                </div>
                <span className="font-mono text-slate-400 uppercase text-[11px]">
                  Method: {searchedOrder.paymentMethod}
                </span>
              </div>
            </div>
          </div>
        )}

        {hasSearched && !searchedOrder && (
          <div className="p-8 text-center bg-slate-900/60 rounded-3xl border border-slate-800 text-slate-400 text-xs">
            No order found matching "{trackingId}". Please verify your order number or call 01622615188.
          </div>
        )}
      </div>
    </section>
  );
};

export const WarrantyPolicyPage: React.FC = () => {
  return (
    <section className="py-12 bg-slate-950 min-h-screen text-slate-300 text-xs sm:text-sm">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        <h1 className="text-3xl font-extrabold text-white font-tech mb-4">
          Warranty & Replacement Policy
        </h1>
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 leading-relaxed">
          <p>
            At <strong>BAARIZ IT</strong>, all brand-new computer components, laptops, and peripherals carry official manufacturer and authorized distributor warranties in Bangladesh (e.g. 1 to 5 years depending on the brand).
          </p>
          <h3 className="text-base font-bold text-white font-tech">7-Day Replacement Guarantee</h3>
          <p>
            If a brand-new product has a hardware manufacturing defect upon unboxing, BAARIZ IT provides an immediate product swap within 7 days of purchase, subject to original packaging, serial tags, and accessories being in pristine condition.
          </p>
          <h3 className="text-base font-bold text-white font-tech">Warranty Claim Procedure</h3>
          <p>
            You can bring your device/component directly to our showroom at Shop A/23, 3rd Floor, National Blind Welfare Complex, Savar Bus Stand, or contact our helpline at 01622615188.
          </p>
        </div>
      </div>
    </section>
  );
};

export const TermsPage: React.FC = () => {
  return (
    <section className="py-12 bg-slate-950 min-h-screen text-slate-300 text-xs sm:text-sm">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        <h1 className="text-3xl font-extrabold text-white font-tech mb-4">
          Terms & Conditions
        </h1>
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 leading-relaxed">
          <p>
            Welcome to BAARIZ IT. By purchasing from our online store or physical showroom in Savar, you agree to the following terms:
          </p>
          <h3 className="text-base font-bold text-white font-tech">Pricing & Availability</h3>
          <p>
            Product prices and availability are subject to market currency fluctuations and distributor inventory. In the rare event of price misalignment, our team will notify you prior to shipment.
          </p>
          <h3 className="text-base font-bold text-white font-tech">Delivery Guidelines</h3>
          <p>
            Same-day delivery is available for orders within Savar municipality area. Nationwide courier deliveries take 24–48 hours via express courier partners.
          </p>
        </div>
      </div>
    </section>
  );
};

export const PrivacyPage: React.FC = () => {
  return (
    <section className="py-12 bg-slate-950 min-h-screen text-slate-300 text-xs sm:text-sm">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        <h1 className="text-3xl font-extrabold text-white font-tech mb-4">
          Privacy Policy
        </h1>
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 leading-relaxed">
          <p>
            BAARIZ IT is committed to safeguarding customer personal data. We only collect details essential for fulfilling orders, managing warranty serial tracking, and communicating order delivery updates.
          </p>
          <p>
            We never share or sell customer mobile numbers or shipping addresses to third-party advertisers.
          </p>
        </div>
      </div>
    </section>
  );
};

/**
 * Public Dynamic Sitemap & SEO Registry View
 */
export const SitemapPage: React.FC = () => {
  const { products, categories, customPages, services, settings, setActivePage, setCategoryFilter, openProductDetail, addToast } = useStore();
  const [copied, setCopied] = useState(false);

  const baseUrl = getCleanBaseUrl();
  const entries = useMemo(() => {
    return buildSitemapEntries({ products, categories, customPages, services, settings });
  }, [products, categories, customPages, services, settings]);

  const xml = useMemo(() => generateSitemapXml(entries), [entries]);
  const stats = useMemo(() => calculateSitemapStats(entries), [entries]);

  const handleCopy = () => {
    navigator.clipboard.writeText(xml);
    setCopied(true);
    addToast('success', 'XML Copied', 'Sitemap XML copied to your clipboard.');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-12 bg-slate-950 min-h-screen text-slate-300 text-xs sm:text-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-blue-950/40 border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold border border-cyan-500/20 mb-2">
              <FileCode className="w-4 h-4" />
              <span>Dynamic XML Sitemap</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-tech">
              BAARIZ IT Sitemap Directory
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Real-time directory indexing all active products, categories, and custom pages for Google Search, Bing, and web visitors.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold border border-slate-700 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
              <span>{copied ? 'Copied' : 'Copy XML'}</span>
            </button>

            <button
              onClick={() => downloadSitemapXml(xml)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download sitemap.xml</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-slate-500 text-xs block">Total Indexable URLs</span>
            <div className="text-2xl font-bold font-tech text-cyan-400 mt-1">{stats.totalUrls}</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-slate-500 text-xs block">Hardware Products</span>
            <div className="text-2xl font-bold font-tech text-emerald-400 mt-1">{stats.productUrls}</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-slate-500 text-xs block">Categories</span>
            <div className="text-2xl font-bold font-tech text-amber-400 mt-1">{stats.categoryUrls}</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-slate-500 text-xs block">Product Visuals</span>
            <div className="text-2xl font-bold font-tech text-pink-400 mt-1">{stats.totalImages}</div>
          </div>
        </div>

        {/* Categorized Directory Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Core Pages */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white font-tech uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>Core Sections</span>
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setActivePage('home')}
                  className="text-slate-300 hover:text-cyan-400 flex items-center justify-between w-full py-1 group"
                >
                  <span>Home — BAARIZ IT Outlet Savar</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-cyan-400 transition-opacity" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('shop')}
                  className="text-slate-300 hover:text-cyan-400 flex items-center justify-between w-full py-1 group"
                >
                  <span>Shop Hardware Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-cyan-400 transition-opacity" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('pc-builder')}
                  className="text-slate-300 hover:text-cyan-400 flex items-center justify-between w-full py-1 group"
                >
                  <span>Custom PC Builder</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-cyan-400 transition-opacity" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('services')}
                  className="text-slate-300 hover:text-cyan-400 flex items-center justify-between w-full py-1 group"
                >
                  <span>Servicing & Repair Lab</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-cyan-400 transition-opacity" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('offers')}
                  className="text-slate-300 hover:text-cyan-400 flex items-center justify-between w-full py-1 group"
                >
                  <span>Special Offers & Deals</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-cyan-400 transition-opacity" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('about')}
                  className="text-slate-300 hover:text-cyan-400 flex items-center justify-between w-full py-1 group"
                >
                  <span>About Us</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-cyan-400 transition-opacity" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('contact')}
                  className="text-slate-300 hover:text-cyan-400 flex items-center justify-between w-full py-1 group"
                >
                  <span>Contact & Savar Showroom Map</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-cyan-400 transition-opacity" />
                </button>
              </li>
            </ul>
          </div>

          {/* Active Categories */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white font-tech uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Hardware Categories ({categories.length})</span>
            </h3>
            {categories.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No categories added yet. Add items in Admin.</p>
            ) : (
              <ul className="space-y-2 text-xs max-h-60 overflow-y-auto pr-2">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() => {
                        setCategoryFilter(cat.id);
                        setActivePage('shop');
                      }}
                      className="text-slate-300 hover:text-cyan-400 flex items-center justify-between w-full py-1 group"
                    >
                      <span>{cat.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {cat.itemCount || 0} items
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Active Products Index */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white font-tech uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Active Hardware Catalog ({products.length} Items)</span>
          </h3>
          {products.length === 0 ? (
            <p className="text-xs text-slate-500 italic">
              Hardware catalog starts completely empty in fresh installation. Add products in the Admin Console.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs max-h-80 overflow-y-auto pr-2">
              {products.map((p) => (
                <div
                  key={p.id}
                  onClick={() => openProductDetail(p)}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-cyan-500/40 cursor-pointer flex items-center gap-3 transition-colors"
                >
                  <img
                    src={p.mainImage}
                    alt={p.name}
                    className="w-10 h-10 rounded-lg object-cover bg-slate-900 shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="font-bold text-slate-200 block truncate">{p.name}</span>
                    <span className="text-[10px] text-cyan-400 font-mono">
                      ৳{(p.discountPrice || p.regularPrice).toLocaleString('en-BD')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

/**
 * Dynamic Custom CMS Page Renderer
 */
export const DynamicCustomPageView: React.FC<{ pageSlug: string }> = ({ pageSlug }) => {
  const { customPages, setActivePage } = useStore();

  const page = customPages.find(
    (p) => p.slug === pageSlug || p.id === pageSlug || `page-${p.slug}` === pageSlug
  );

  if (!page) {
    return (
      <section className="py-16 bg-slate-950 min-h-screen flex items-center justify-center text-center px-4">
        <div className="max-w-md space-y-4">
          <FileText className="w-12 h-12 text-slate-600 mx-auto" />
          <h2 className="text-2xl font-bold font-tech text-white">Page Not Found</h2>
          <p className="text-xs text-slate-400">
            The requested custom page could not be found or has not been published yet.
          </p>
          <button
            onClick={() => setActivePage('home')}
            className="px-6 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
          >
            Back to Home
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-slate-950 min-h-screen text-slate-300 text-xs sm:text-sm">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold border border-cyan-500/20 mb-2">
            <FileText className="w-4 h-4" />
            <span>BAARIZ IT</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white font-tech">{page.title}</h1>
          <p className="text-xs text-slate-500 mt-1">
            Last updated: {new Date(page.updatedAt || page.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="p-6 sm:p-10 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 leading-relaxed text-slate-300 whitespace-pre-line">
          {page.content}
        </div>
      </div>
    </section>
  );
};
