import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.neurodevai.com', // Crucial: Must match your domain exactly
  integrations: [
    sitemap({
      // Filter out pages you don't want indexed (like a 404 page)
      filter: (page) => page !== 'https://www.neurodevai.com/404',
      
      // Custom logic to make the sitemap "strong"
      changefreq: 'weekly',
      priority: 0.7, // Default priority for all pages
      lastmod: new Date(),
      
      // function to assign specific priorities based on the URL
      serialize(item) {
        // High Priority: Homepage
        if (item.url === 'https://www.neurodevai.com/') {
          item.priority = 1.0;
          item.changefreq = 'daily';
        }
        // Medium-High Priority: Services & Case Studies
        else if (item.url.includes('/magento-services') || item.url.includes('/case-studies')) {
          item.priority = 0.9;
          item.changefreq = 'weekly';
        }
        // Low Priority: Legal pages
        else if (item.url.includes('/privacy') || item.url.includes('/terms')) {
          item.priority = 0.3;
          item.changefreq = 'yearly';
        }
        
        return item;
      },
    }),
  ],
});