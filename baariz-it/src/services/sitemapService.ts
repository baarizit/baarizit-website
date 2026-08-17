import { Product, CategoryInfo, CustomPage, ServiceItem, SiteSettings } from '../types';

export interface SitemapUrlEntry {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
  type: 'home' | 'core' | 'product' | 'category' | 'page' | 'service';
  title?: string;
  images?: {
    loc: string;
    title?: string;
    caption?: string;
  }[];
}

export interface SitemapOptions {
  baseUrl?: string;
  includeImages?: boolean;
  includeDrafts?: boolean;
  includeServices?: boolean;
  includeCustomPages?: boolean;
  includeCategories?: boolean;
  includeProducts?: boolean;
  includeStaticPages?: boolean;
  defaultProductChangefreq?: 'daily' | 'weekly' | 'monthly';
  defaultProductPriority?: number;
  defaultCategoryPriority?: number;
}

export interface SitemapStats {
  totalUrls: number;
  productUrls: number;
  categoryUrls: number;
  customPageUrls: number;
  serviceUrls: number;
  staticUrls: number;
  totalImages: number;
  lastGenerated: string;
}

export interface SitemapValidationResult {
  isValid: boolean;
  urlCount: number;
  warnings: string[];
  errors: string[];
}

/**
 * Escapes special XML characters to prevent parsing errors
 */
export function escapeXml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Formats a date string into standard ISO 8601 YYYY-MM-DD
 */
export function formatIsoDate(dateInput?: string | Date): string {
  try {
    const d = dateInput ? new Date(dateInput) : new Date();
    if (isNaN(d.getTime())) {
      return new Date().toISOString().split('T')[0];
    }
    return d.toISOString().split('T')[0];
  } catch {
    return new Date().toISOString().split('T')[0];
  }
}

/**
 * Resolves the active base URL with proper protocol
 */
export function getCleanBaseUrl(customBaseUrl?: string): string {
  if (customBaseUrl && customBaseUrl.trim()) {
    let url = customBaseUrl.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`;
    }
    return url.replace(/\/+$/, '');
  }

  if (typeof window !== 'undefined' && window.location && window.location.origin) {
    return window.location.origin.replace(/\/+$/, '');
  }

  return 'https://baarizit.com';
}

/**
 * Gathers and builds all dynamic and static sitemap entries
 */
export function buildSitemapEntries(
  data: {
    products: Product[];
    categories: CategoryInfo[];
    customPages?: CustomPage[];
    services?: ServiceItem[];
    settings?: Partial<SiteSettings>;
  },
  options: SitemapOptions = {}
): SitemapUrlEntry[] {
  const baseUrl = getCleanBaseUrl(options.baseUrl);
  const includeImages = options.includeImages !== false;
  const includeProducts = options.includeProducts !== false;
  const includeCategories = options.includeCategories !== false;
  const includeCustomPages = options.includeCustomPages !== false;
  const includeServices = options.includeServices !== false;
  const includeStaticPages = options.includeStaticPages !== false;
  const today = formatIsoDate(new Date());

  const entries: SitemapUrlEntry[] = [];

  // 1. Core & Static Main Pages
  if (includeStaticPages) {
    // Homepage
    entries.push({
      loc: `${baseUrl}/`,
      lastmod: today,
      changefreq: 'daily',
      priority: 1.0,
      type: 'home',
      title: 'Home — BAARIZ IT Tech & PC Shop Savar',
    });

    // Shop Catalog
    entries.push({
      loc: `${baseUrl}/#shop`,
      lastmod: today,
      changefreq: 'daily',
      priority: 0.9,
      type: 'core',
      title: 'Shop All Computer Hardware & Components',
    });

    // Custom PC Builder
    entries.push({
      loc: `${baseUrl}/#pc-builder`,
      lastmod: today,
      changefreq: 'weekly',
      priority: 0.9,
      type: 'core',
      title: 'Custom PC Builder & Compatibility Customizer',
    });

    // Servicing & Repair Lab
    entries.push({
      loc: `${baseUrl}/#services`,
      lastmod: today,
      changefreq: 'weekly',
      priority: 0.85,
      type: 'core',
      title: 'Hardware Servicing, Upgrades & Repair Lab',
    });

    // Special Deals & Offers
    entries.push({
      loc: `${baseUrl}/#offers`,
      lastmod: today,
      changefreq: 'daily',
      priority: 0.85,
      type: 'core',
      title: 'Special Deals, Flash Sales & Discounts',
    });

    // About Us
    entries.push({
      loc: `${baseUrl}/#about`,
      lastmod: today,
      changefreq: 'monthly',
      priority: 0.6,
      type: 'core',
      title: 'About BAARIZ IT Savar',
    });

    // Contact & Outlet Location
    entries.push({
      loc: `${baseUrl}/#contact`,
      lastmod: today,
      changefreq: 'monthly',
      priority: 0.7,
      type: 'core',
      title: 'Contact Us & Store Location Map',
    });

    // Order Tracking
    entries.push({
      loc: `${baseUrl}/#order-tracking`,
      lastmod: today,
      changefreq: 'monthly',
      priority: 0.5,
      type: 'core',
      title: 'Live Order Tracking & Status Check',
    });

    // Warranty & Return Policy
    entries.push({
      loc: `${baseUrl}/#warranty-policy`,
      lastmod: today,
      changefreq: 'monthly',
      priority: 0.5,
      type: 'core',
      title: 'Official Warranty & Replacement Terms',
    });

    // Terms of Service
    entries.push({
      loc: `${baseUrl}/#terms`,
      lastmod: today,
      changefreq: 'yearly',
      priority: 0.4,
      type: 'core',
      title: 'Terms of Service & Sales Agreement',
    });

    // Privacy Policy
    entries.push({
      loc: `${baseUrl}/#privacy`,
      lastmod: today,
      changefreq: 'yearly',
      priority: 0.4,
      type: 'core',
      title: 'Privacy Policy & Customer Data Protection',
    });
  }

  // 2. Active Hardware Categories
  if (includeCategories && data.categories) {
    data.categories
      .filter((cat) => cat.isActive !== false)
      .forEach((cat) => {
        const slug = cat.slug || cat.id;
        entries.push({
          loc: `${baseUrl}/#category=${encodeURIComponent(slug)}`,
          lastmod: today,
          changefreq: 'weekly',
          priority: options.defaultCategoryPriority || 0.8,
          type: 'category',
          title: `${cat.name} — Hardware & Accessories in Savar`,
        });
      });
  }

  // 3. Active Products
  if (includeProducts && data.products) {
    data.products
      .filter((p) => (options.includeDrafts ? true : p.status === 'active' || !p.status))
      .forEach((prod) => {
        const slug = prod.slug || prod.id;
        const lastmod = formatIsoDate(prod.updatedAt || prod.createdAt || new Date());

        // Gather all valid product images for image sitemap
        const productImages: { loc: string; title?: string; caption?: string }[] = [];
        if (includeImages) {
          if (prod.mainImage && prod.mainImage.startsWith('http')) {
            productImages.push({
              loc: prod.mainImage,
              title: `${prod.name} ${prod.brand ? `by ${prod.brand}` : ''}`,
              caption: prod.shortDescription || `${prod.name} available at BAARIZ IT Savar`,
            });
          }
          if (Array.isArray(prod.images)) {
            prod.images.forEach((imgUrl) => {
              if (imgUrl && imgUrl.startsWith('http') && imgUrl !== prod.mainImage) {
                productImages.push({
                  loc: imgUrl,
                  title: `${prod.name} gallery image`,
                });
              }
            });
          }
        }

        // Determine priority based on popularity/stock
        let priority = options.defaultProductPriority || 0.8;
        if (prod.isFeatured || prod.isBestSeller) {
          priority = 0.9;
        } else if (prod.stockStatus === 'out_of_stock') {
          priority = 0.6;
        }

        entries.push({
          loc: `${baseUrl}/#product=${encodeURIComponent(slug)}`,
          lastmod,
          changefreq: prod.stockStatus === 'in_stock' ? 'daily' : 'weekly',
          priority,
          type: 'product',
          title: `${prod.name} — ${prod.brand} Price in BD`,
          images: productImages.length > 0 ? productImages : undefined,
        });
      });
  }

  // 4. Published Custom CMS Pages
  if (includeCustomPages && data.customPages) {
    data.customPages
      .filter((page) => page.isPublished !== false)
      .forEach((page) => {
        const slug = page.slug || page.id;
        const lastmod = formatIsoDate(page.updatedAt || page.createdAt || new Date());
        entries.push({
          loc: `${baseUrl}/#page=${encodeURIComponent(slug)}`,
          lastmod,
          changefreq: 'monthly',
          priority: 0.7,
          type: 'page',
          title: page.title,
        });
      });
  }

  // 5. Active Lab Tech Services
  if (includeServices && data.services) {
    data.services
      .filter((srv) => srv.isActive !== false)
      .forEach((srv) => {
        entries.push({
          loc: `${baseUrl}/#service=${encodeURIComponent(srv.id)}`,
          lastmod: today,
          changefreq: 'monthly',
          priority: 0.7,
          type: 'service',
          title: `${srv.title} — Laptop & PC Servicing in Savar`,
        });
      });
  }

  return entries;
}

/**
 * Converts sitemap entries into standard XML string
 */
export function generateSitemapXml(
  entriesOrData:
    | SitemapUrlEntry[]
    | {
        products: Product[];
        categories: CategoryInfo[];
        customPages?: CustomPage[];
        services?: ServiceItem[];
        settings?: Partial<SiteSettings>;
      },
  options: SitemapOptions = {}
): string {
  const entries: SitemapUrlEntry[] = Array.isArray(entriesOrData)
    ? entriesOrData
    : buildSitemapEntries(entriesOrData, options);

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  xml += '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"\n';
  xml += '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

  for (const entry of entries) {
    xml += '  <url>\n';
    xml += `    <loc>${escapeXml(entry.loc)}</loc>\n`;
    if (entry.lastmod) {
      xml += `    <lastmod>${entry.lastmod}</lastmod>\n`;
    }
    if (entry.changefreq) {
      xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
    }
    if (entry.priority !== undefined) {
      xml += `    <priority>${entry.priority.toFixed(1)}</priority>\n`;
    }

    // Google Image Extension
    if (entry.images && entry.images.length > 0) {
      for (const img of entry.images) {
        xml += '    <image:image>\n';
        xml += `      <image:loc>${escapeXml(img.loc)}</image:loc>\n`;
        if (img.title) {
          xml += `      <image:title>${escapeXml(img.title)}</image:title>\n`;
        }
        if (img.caption) {
          xml += `      <image:caption>${escapeXml(img.caption)}</image:caption>\n`;
        }
        xml += '    </image:image>\n';
      }
    }

    xml += '  </url>\n';
  }

  xml += '</urlset>';
  return xml;
}

/**
 * Generates an SEO-optimized robots.txt referencing the sitemap
 */
export function generateRobotsTxt(baseUrl?: string, sitemapPath: string = '/sitemap.xml'): string {
  const cleanBase = getCleanBaseUrl(baseUrl);
  const sitemapUrl = `${cleanBase}${sitemapPath.startsWith('/') ? sitemapPath : `/${sitemapPath}`}`;

  return `# ===================================================
# Robots.txt for BAARIZ IT E-commerce Platform
# Savar Bus Stand, Dhaka, Bangladesh
# ===================================================

User-agent: *
Allow: /
Disallow: /admin
Disallow: /checkout
Disallow: /cart

# Crawl delay rule for gentle server load
Crawl-delay: 1

# Google Search & Bing Dynamic Sitemap Reference
Sitemap: ${sitemapUrl}
`;
}

/**
 * Calculates statistics from sitemap entries
 */
export function calculateSitemapStats(entries: SitemapUrlEntry[]): SitemapStats {
  let productUrls = 0;
  let categoryUrls = 0;
  let customPageUrls = 0;
  let serviceUrls = 0;
  let staticUrls = 0;
  let totalImages = 0;

  for (const entry of entries) {
    if (entry.type === 'product') productUrls++;
    else if (entry.type === 'category') categoryUrls++;
    else if (entry.type === 'page') customPageUrls++;
    else if (entry.type === 'service') serviceUrls++;
    else staticUrls++;

    if (entry.images) {
      totalImages += entry.images.length;
    }
  }

  return {
    totalUrls: entries.length,
    productUrls,
    categoryUrls,
    customPageUrls,
    serviceUrls,
    staticUrls,
    totalImages,
    lastGenerated: new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }),
  };
}

/**
 * Validates XML string for well-formedness and schema compliance
 */
export function validateSitemapXml(xmlString: string): SitemapValidationResult {
  const warnings: string[] = [];
  const errors: string[] = [];

  if (!xmlString.trim().startsWith('<?xml')) {
    warnings.push('XML declaration <?xml version="1.0" ...?> is recommended at the start.');
  }

  if (!xmlString.includes('<urlset')) {
    errors.push('Missing <urlset> root tag.');
  }
  if (!xmlString.includes('</urlset>')) {
    errors.push('Missing closing </urlset> tag.');
  }

  // Count url tags
  const openUrlCount = (xmlString.match(/<url>/g) || []).length;
  const closeUrlCount = (xmlString.match(/<\/url>/g) || []).length;
  if (openUrlCount !== closeUrlCount) {
    errors.push(`Mismatched <url> tags: found ${openUrlCount} open and ${closeUrlCount} closing tags.`);
  }

  if (openUrlCount > 50000) {
    warnings.push(
      `Sitemap contains ${openUrlCount} URLs. Standard sitemaps should be capped at 50,000 URLs per file.`
    );
  }

  // Check unescaped ampersands
  const unescapedAmp = xmlString.match(/&(?!amp;|lt;|gt;|quot;|apos;)/g);
  if (unescapedAmp) {
    errors.push(`Found ${unescapedAmp.length} unescaped '&' characters in XML.`);
  }

  return {
    isValid: errors.length === 0,
    urlCount: openUrlCount,
    warnings,
    errors,
  };
}

/**
 * Triggers a direct browser file download for sitemap.xml
 */
export function downloadSitemapXml(
  xmlContent: string,
  filename: string = 'sitemap.xml'
): void {
  try {
    const blob = new Blob([xmlContent], { type: 'application/xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Failed to download sitemap XML:', err);
  }
}

/**
 * Triggers a direct browser file download for robots.txt
 */
export function downloadRobotsTxt(
  robotsContent: string,
  filename: string = 'robots.txt'
): void {
  try {
    const blob = new Blob([robotsContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Failed to download robots.txt:', err);
  }
}
