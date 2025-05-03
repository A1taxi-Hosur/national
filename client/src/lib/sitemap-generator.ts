import { Product } from "@shared/schema";
import { siteInfo } from "./seo-config";

/**
 * Generate a sitemap.xml content for the website
 * This can be exported to a file that search engines can crawl
 */
export async function generateSitemapXml(): Promise<string> {
  try {
    // Fetch all product data to include in sitemap
    const productsResponse = await fetch('/api/products');
    if (!productsResponse.ok) {
      throw new Error('Failed to fetch products');
    }
    const products: Product[] = await productsResponse.json();
    
    // Static page URLs
    const staticPages = [
      { url: '/', priority: '1.0', changeFreq: 'daily' },
      { url: '/products', priority: '0.9', changeFreq: 'daily' },
      { url: '/about', priority: '0.7', changeFreq: 'weekly' },
      { url: '/contact', priority: '0.8', changeFreq: 'weekly' },
      { url: '/auth', priority: '0.3', changeFreq: 'monthly' },
    ];
    
    // Current date for lastmod
    const currentDate = new Date().toISOString().split('T')[0];
    
    // XML header
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
    
    // Add static pages
    staticPages.forEach(page => {
      xml += `
  <url>
    <loc>${siteInfo.siteUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changeFreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
    });
    
    // Add dynamic product pages
    products.forEach(product => {
      xml += `
  <url>
    <loc>${siteInfo.siteUrl}/products/${product.id}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });
    
    // Close XML
    xml += `
</urlset>`;
    
    return xml;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return '';
  }
}

/**
 * Download the generated sitemap as an XML file
 */
export function downloadSitemap(sitemapXml: string): void {
  const blob = new Blob([sitemapXml], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'sitemap.xml';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Generate a robots.txt content for the website
 * This controls how search engines crawl the site
 */
export function generateRobotsTxt(): string {
  return `User-agent: *
Allow: /
Disallow: /auth
Disallow: /admin

Sitemap: ${siteInfo.siteUrl}/sitemap.xml
`;
}