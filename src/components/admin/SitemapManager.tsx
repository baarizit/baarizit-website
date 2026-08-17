import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  generateSitemapXml,
  generateRobotsTxt,
  buildSitemapEntries,
  calculateSitemapStats,
  validateSitemapXml,
  downloadSitemapXml,
  downloadRobotsTxt,
  getCleanBaseUrl,
  SitemapUrlEntry,
  SitemapOptions,
} from '../../services/sitemapService';
import {
  FileCode,
  Download,
  Copy,
  Check,
  RefreshCw,
  Search,
  ExternalLink,
  ShieldCheck,
  Globe,
  Layers,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  FileText,
  Eye,
  Settings2,
  Send,
  Zap,
} from 'lucide-react';

export const SitemapManager: React.FC = () => {
  const { products, categories, customPages, services, settings, addToast } = useStore();

  const [copiedXml, setCopiedXml] = useState(false);
  const [copiedRobots, setCopiedRobots] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'xml' | 'robots' | 'urls' | 'submission'>('overview');
  const [urlSearch, setUrlSearch] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [customDomain, setCustomDomain] = useState('');

  // Sitemap Configuration Options
  const [options, setOptions] = useState<SitemapOptions>({
    includeImages: true,
    includeProducts: true,
    includeCategories: true,
    includeCustomPages: true,
    includeServices: true,
    includeStaticPages: true,
    defaultProductChangefreq: 'daily',
    defaultProductPriority: 0.8,
    defaultCategoryPriority: 0.8,
  });

  // Effective Base URL
  const effectiveBaseUrl = useMemo(() => {
    return getCleanBaseUrl(customDomain);
  }, [customDomain]);

  // Dynamic Entries
  const sitemapEntries = useMemo(() => {
    return buildSitemapEntries(
      {
        products,
        categories,
        customPages,
        services,
        settings,
      },
      {
        ...options,
        baseUrl: effectiveBaseUrl,
      }
    );
  }, [products, categories, customPages, services, settings, options, effectiveBaseUrl]);

  // Generated XML
  const sitemapXml = useMemo(() => {
    return generateSitemapXml(sitemapEntries);
  }, [sitemapEntries]);

  // Generated Robots.txt
  const robotsTxt = useMemo(() => {
    return generateRobotsTxt(effectiveBaseUrl, '/sitemap.xml');
  }, [effectiveBaseUrl]);

  // Sitemap Stats
  const stats = useMemo(() => {
    return calculateSitemapStats(sitemapEntries);
  }, [sitemapEntries]);

  // Validation
  const validation = useMemo(() => {
    return validateSitemapXml(sitemapXml);
  }, [sitemapXml]);

  // Filtered URLs for explorer table
  const filteredEntries = useMemo(() => {
    return sitemapEntries.filter((entry) => {
      const matchesSearch =
        entry.loc.toLowerCase().includes(urlSearch.toLowerCase()) ||
        (entry.title && entry.title.toLowerCase().includes(urlSearch.toLowerCase()));
      const matchesType = selectedTypeFilter === 'all' || entry.type === selectedTypeFilter;
      return matchesSearch && matchesType;
    });
  }, [sitemapEntries, urlSearch, selectedTypeFilter]);

  // Action Handlers
  const handleCopyXml = () => {
    navigator.clipboard.writeText(sitemapXml);
    setCopiedXml(true);
    addToast('success', 'XML Copied to Clipboard', 'The full sitemap.xml is ready to paste.');
    setTimeout(() => setCopiedXml(false), 2500);
  };

  const handleCopyRobots = () => {
    navigator.clipboard.writeText(robotsTxt);
    setCopiedRobots(true);
    addToast('success', 'Robots.txt Copied', 'Robots.txt content copied to clipboard.');
    setTimeout(() => setCopiedRobots(false), 2500);
  };

  const handleCopySitemapUrl = () => {
    const fullUrl = `${effectiveBaseUrl}/sitemap.xml`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedUrl(true);
    addToast('success', 'Sitemap URL Copied', fullUrl);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  const handleDownloadXml = () => {
    downloadSitemapXml(sitemapXml, 'sitemap.xml');
    addToast('success', 'Sitemap Downloaded', 'sitemap.xml file saved to your device.');
  };

  const handleDownloadRobots = () => {
    downloadRobotsTxt(robotsTxt, 'robots.txt');
    addToast('success', 'Robots.txt Downloaded', 'robots.txt file saved to your device.');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-slate-900/60 to-blue-950/40 border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold border border-cyan-500/30 mb-2">
            <Zap className="w-3.5 h-3.5" />
            <span>Dynamic XML Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-tech text-white">
            SEO & Dynamic Sitemap Generator
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Automatically synchronizes active products, hardware categories, and custom CMS pages into compliant XML format for Google, Bing, and Search Engine crawlers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopySitemapUrl}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            {copiedUrl ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
            <span>{copiedUrl ? 'Copied URL' : 'Copy Sitemap URL'}</span>
          </button>

          <button
            onClick={handleDownloadXml}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download sitemap.xml</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold uppercase">Total URLs</span>
            <Globe className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-tech text-cyan-400">{stats.totalUrls}</div>
          <span className="text-[10px] text-slate-500">Indexed for search</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold uppercase">Products</span>
            <Layers className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-tech text-emerald-400">{stats.productUrls}</div>
          <span className="text-[10px] text-slate-500">Active hardware items</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold uppercase">Categories</span>
            <FileCode className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-tech text-amber-400">{stats.categoryUrls}</div>
          <span className="text-[10px] text-slate-500">Catalog taxonomies</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold uppercase">Custom Pages</span>
            <FileText className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-tech text-purple-400">{stats.customPageUrls}</div>
          <span className="text-[10px] text-slate-500">Published CMS</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold uppercase">Images Indexed</span>
            <ImageIcon className="w-4 h-4 text-pink-400" />
          </div>
          <div className="text-2xl font-bold font-tech text-pink-400">{stats.totalImages}</div>
          <span className="text-[10px] text-slate-500">Google Image tags</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold uppercase">Validation</span>
            {validation.isValid ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400" />
            )}
          </div>
          <div className={`text-base font-bold font-tech ${validation.isValid ? 'text-emerald-400' : 'text-rose-400'}`}>
            {validation.isValid ? '100% Valid' : 'Needs Check'}
          </div>
          <span className="text-[10px] text-slate-500">XML Schema standard</span>
        </div>
      </div>

      {/* Sub Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`flex items-center gap-2 py-2.5 px-4 text-xs font-bold font-tech uppercase tracking-wider border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
            activeSubTab === 'overview'
              ? 'border-cyan-500 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Settings2 className="w-4 h-4" />
          <span>Config & Options</span>
        </button>

        <button
          onClick={() => setActiveSubTab('urls')}
          className={`flex items-center gap-2 py-2.5 px-4 text-xs font-bold font-tech uppercase tracking-wider border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
            activeSubTab === 'urls'
              ? 'border-cyan-500 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Indexed URLs ({sitemapEntries.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('xml')}
          className={`flex items-center gap-2 py-2.5 px-4 text-xs font-bold font-tech uppercase tracking-wider border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
            activeSubTab === 'xml'
              ? 'border-cyan-500 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileCode className="w-4 h-4" />
          <span>Raw XML Viewer</span>
        </button>

        <button
          onClick={() => setActiveSubTab('robots')}
          className={`flex items-center gap-2 py-2.5 px-4 text-xs font-bold font-tech uppercase tracking-wider border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
            activeSubTab === 'robots'
              ? 'border-cyan-500 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Robots.txt</span>
        </button>

        <button
          onClick={() => setActiveSubTab('submission')}
          className={`flex items-center gap-2 py-2.5 px-4 text-xs font-bold font-tech uppercase tracking-wider border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
            activeSubTab === 'submission'
              ? 'border-cyan-500 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Search Engine Ping</span>
        </button>
      </div>

      {/* SUB TAB 1: CONFIG & OPTIONS */}
      {activeSubTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Domain & Base URL Settings */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white font-tech uppercase tracking-wider flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-400" />
                <span>Base Domain & Deployment Target</span>
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Production Domain (Optional Override)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                    placeholder="e.g. https://baarizit.com"
                    className="flex-1 bg-slate-950 text-xs text-white rounded-xl px-3.5 py-2.5 border border-slate-800 font-mono focus:border-cyan-500 focus:outline-none"
                  />
                  {customDomain && (
                    <button
                      onClick={() => setCustomDomain('')}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-semibold"
                    >
                      Reset to Auto
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5">
                  Active Domain: <strong className="text-cyan-400 font-mono">{effectiveBaseUrl}</strong>
                </p>
              </div>

              {/* Toggles */}
              <div className="pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={options.includeProducts}
                    onChange={(e) => setOptions({ ...options, includeProducts: e.target.checked })}
                    className="rounded text-cyan-500 focus:ring-cyan-500"
                  />
                  <div>
                    <span className="font-semibold text-slate-200 block">Include Products</span>
                    <span className="text-[10px] text-slate-400">Index active hardware catalog items</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={options.includeCategories}
                    onChange={(e) => setOptions({ ...options, includeCategories: e.target.checked })}
                    className="rounded text-cyan-500 focus:ring-cyan-500"
                  />
                  <div>
                    <span className="font-semibold text-slate-200 block">Include Categories</span>
                    <span className="text-[10px] text-slate-400">Index hardware taxonomy filters</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={options.includeCustomPages}
                    onChange={(e) => setOptions({ ...options, includeCustomPages: e.target.checked })}
                    className="rounded text-cyan-500 focus:ring-cyan-500"
                  />
                  <div>
                    <span className="font-semibold text-slate-200 block">Include Custom Pages</span>
                    <span className="text-[10px] text-slate-400">Index published CMS content pages</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={options.includeImages}
                    onChange={(e) => setOptions({ ...options, includeImages: e.target.checked })}
                    className="rounded text-cyan-500 focus:ring-cyan-500"
                  />
                  <div>
                    <span className="font-semibold text-slate-200 block">Google Image XML Tags</span>
                    <span className="text-[10px] text-slate-400">Attach product image loc and titles</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={options.includeServices}
                    onChange={(e) => setOptions({ ...options, includeServices: e.target.checked })}
                    className="rounded text-cyan-500 focus:ring-cyan-500"
                  />
                  <div>
                    <span className="font-semibold text-slate-200 block">Include Repair Services</span>
                    <span className="text-[10px] text-slate-400">Index repair lab services in Savar</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={options.includeStaticPages}
                    onChange={(e) => setOptions({ ...options, includeStaticPages: e.target.checked })}
                    className="rounded text-cyan-500 focus:ring-cyan-500"
                  />
                  <div>
                    <span className="font-semibold text-slate-200 block">Include Core Pages</span>
                    <span className="text-[10px] text-slate-400">Home, PC builder, warranty, terms</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Change Frequency & Priority Presets */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white font-tech uppercase tracking-wider flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-emerald-400" />
                <span>Crawl Frequency & Search Priority Defaults</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Product Changefreq</label>
                  <select
                    value={options.defaultProductChangefreq || 'daily'}
                    onChange={(e) =>
                      setOptions({ ...options, defaultProductChangefreq: e.target.value as any })
                    }
                    className="w-full bg-slate-950 text-white rounded-xl px-3 py-2 border border-slate-800"
                  >
                    <option value="daily">Daily (Recommended for stock)</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Product Priority</label>
                  <select
                    value={options.defaultProductPriority || 0.8}
                    onChange={(e) =>
                      setOptions({ ...options, defaultProductPriority: Number(e.target.value) })
                    }
                    className="w-full bg-slate-950 text-white rounded-xl px-3 py-2 border border-slate-800"
                  >
                    <option value={1.0}>1.0 (Highest)</option>
                    <option value={0.9}>0.9 (High)</option>
                    <option value={0.8}>0.8 (Standard)</option>
                    <option value={0.7}>0.7 (Moderate)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Category Priority</label>
                  <select
                    value={options.defaultCategoryPriority || 0.8}
                    onChange={(e) =>
                      setOptions({ ...options, defaultCategoryPriority: Number(e.target.value) })
                    }
                    className="w-full bg-slate-950 text-white rounded-xl px-3 py-2 border border-slate-800"
                  >
                    <option value={0.9}>0.9 (High)</option>
                    <option value={0.8}>0.8 (Standard)</option>
                    <option value={0.7}>0.7 (Moderate)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Side SEO Checklist & Quick Actions */}
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white font-tech uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>SEO Performance Health</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-200 block">Dynamic Real-Time Sync</strong>
                    <span className="text-slate-400">Sitemap automatically refreshes when products or pages change.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-200 block">XML Encoding & Schema Safe</strong>
                    <span className="text-slate-400">All special symbols (&, &lt;, &gt;) are escaped to prevent crawl failures.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-200 block">Google Image Extensions</strong>
                    <span className="text-slate-400">Product visuals are indexed for Google Images and rich results.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-200 block">Robots.txt Synchronized</strong>
                    <span className="text-slate-400">Direct pointer to sitemap.xml with admin route safety protections.</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-2">
                <button
                  onClick={handleCopyXml}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy Complete XML</span>
                </button>

                <button
                  onClick={handleDownloadXml}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download sitemap.xml</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB TAB 2: INDEXED URLS EXPLORER */}
      {activeSubTab === 'urls' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                value={urlSearch}
                onChange={(e) => setUrlSearch(e.target.value)}
                placeholder="Search indexed URLs or title..."
                className="w-full bg-slate-950 text-xs text-white rounded-xl pl-9 pr-3 py-2 border border-slate-800 focus:outline-none focus:border-cyan-500"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-400">Filter Type:</span>
              <select
                value={selectedTypeFilter}
                onChange={(e) => setSelectedTypeFilter(e.target.value)}
                className="bg-slate-950 text-xs text-white rounded-lg px-2.5 py-1.5 border border-slate-800"
              >
                <option value="all">All Types ({sitemapEntries.length})</option>
                <option value="home">Home</option>
                <option value="core">Core Pages</option>
                <option value="product">Products</option>
                <option value="category">Categories</option>
                <option value="page">Custom CMS Pages</option>
                <option value="service">Services</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/40">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 uppercase tracking-wider">
                  <th className="p-3.5">URL Location & Title</th>
                  <th className="p-3.5">Type</th>
                  <th className="p-3.5">Last Modified</th>
                  <th className="p-3.5">Frequency</th>
                  <th className="p-3.5">Priority</th>
                  <th className="p-3.5">Images</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {filteredEntries.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">
                      No URLs matching your search query.
                    </td>
                  </tr>
                ) : (
                  filteredEntries.map((entry, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/60 transition-colors">
                      <td className="p-3.5 max-w-md">
                        <div className="font-mono text-cyan-400 text-[11px] truncate block">
                          {entry.loc}
                        </div>
                        {entry.title && (
                          <span className="text-[11px] text-slate-400 block truncate mt-0.5">
                            {entry.title}
                          </span>
                        )}
                      </td>

                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            entry.type === 'product'
                              ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/30'
                              : entry.type === 'category'
                              ? 'bg-amber-950/40 text-amber-400 border border-amber-500/30'
                              : entry.type === 'page'
                              ? 'bg-purple-950/40 text-purple-400 border border-purple-500/30'
                              : entry.type === 'service'
                              ? 'bg-pink-950/40 text-pink-400 border border-pink-500/30'
                              : 'bg-cyan-950/40 text-cyan-400 border border-cyan-500/30'
                          }`}
                        >
                          {entry.type}
                        </span>
                      </td>

                      <td className="p-3.5 font-mono text-[11px] text-slate-400">
                        {entry.lastmod || 'Today'}
                      </td>

                      <td className="p-3.5 font-mono text-[11px] text-slate-300">
                        {entry.changefreq || 'weekly'}
                      </td>

                      <td className="p-3.5 font-mono font-bold text-emerald-400">
                        {entry.priority?.toFixed(1) || '0.8'}
                      </td>

                      <td className="p-3.5">
                        {entry.images && entry.images.length > 0 ? (
                          <span className="px-2 py-0.5 rounded-full bg-pink-950/40 text-pink-400 text-[10px] font-bold border border-pink-500/30">
                            {entry.images.length} img
                          </span>
                        ) : (
                          <span className="text-slate-600 text-[10px]">—</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB TAB 3: RAW XML CODE VIEWER */}
      {activeSubTab === 'xml' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-slate-300">
                Format: <strong className="text-cyan-400">XML 1.0 (UTF-8)</strong>
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400">{sitemapEntries.length} URL nodes</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyXml}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                {copiedXml ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedXml ? 'Copied' : 'Copy XML'}</span>
              </button>
              <button
                onClick={handleDownloadXml}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 overflow-x-auto max-h-[500px] overflow-y-auto">
            <pre className="font-mono text-xs text-emerald-300 leading-relaxed whitespace-pre selection:bg-cyan-500 selection:text-slate-950">
              {sitemapXml}
            </pre>
          </div>
        </div>
      )}

      {/* SUB TAB 4: ROBOTS.TXT */}
      {activeSubTab === 'robots' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-tech">
                Robots.txt Directive File
              </h4>
              <p className="text-[11px] text-slate-400">
                Instructs search crawlers which paths are accessible and where the sitemap is located.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyRobots}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                {copiedRobots ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedRobots ? 'Copied' : 'Copy Text'}</span>
              </button>
              <button
                onClick={handleDownloadRobots}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download robots.txt</span>
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 overflow-x-auto">
            <pre className="font-mono text-xs text-cyan-300 leading-relaxed whitespace-pre">
              {robotsTxt}
            </pre>
          </div>
        </div>
      )}

      {/* SUB TAB 5: SEARCH ENGINE PING & SUBMISSION */}
      {activeSubTab === 'submission' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white font-tech uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>Google Search Console Submission</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              To index BAARIZ IT on Google Search, add your domain in Google Search Console and submit the sitemap URL.
            </p>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-400 flex items-center justify-between">
              <span className="truncate">{effectiveBaseUrl}/sitemap.xml</span>
              <button
                onClick={handleCopySitemapUrl}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 shrink-0 ml-2"
                title="Copy URL"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>

            <ol className="list-decimal list-inside text-xs text-slate-400 space-y-1.5 pt-2">
              <li>Log in to <strong className="text-white">Google Search Console</strong>.</li>
              <li>Navigate to <strong className="text-white">Sitemaps</strong> in the left sidebar.</li>
              <li>Enter <strong className="text-cyan-400">sitemap.xml</strong> and click Submit.</li>
              <li>Google will begin indexing your products and categories.</li>
            </ol>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white font-tech uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Bing & IndexNow Protocol</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Bing Webmaster Tools and modern search engines support instant indexing via sitemaps and IndexNow protocols.
            </p>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-300">
                <span>Active Status:</span>
                <span className="text-emerald-400 font-bold">Ready for Crawlers</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Sitemap Endpoint:</span>
                <span className="font-mono text-cyan-400">/sitemap.xml</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Robots.txt Location:</span>
                <span className="font-mono text-cyan-400">/robots.txt</span>
              </div>
            </div>

            <button
              onClick={() => {
                window.open(
                  `https://www.google.com/ping?sitemap=${encodeURIComponent(`${effectiveBaseUrl}/sitemap.xml`)}`,
                  '_blank'
                );
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Ping Google Sitemap Service</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
