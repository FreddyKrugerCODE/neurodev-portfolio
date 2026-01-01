import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite'; // Your original Tailwind
import sitemap from '@astrojs/sitemap';      // The new Sitemap
import partytown from '@astrojs/partytown';  // Off-main-thread analytics

// https://astro.build/config
export default defineConfig({
  site: 'https://www.neurodevai.com', // <--- IMPORTANT: Required for Sitemap

  vite: {
    plugins: [tailwindcss()] // Keeps your styles working
  },

  integrations: [
    // PERFORMANCE: Move analytics to web worker (boosts Lighthouse Performance score)
    partytown({
      config: {
        forward: ["dataLayer.push"], // Required for GA4
      },
    }),
    sitemap({
      // Filter out pages you don't want indexed
      filter: (page) => page !== 'https://www.neurodevai.com/404',
      
      // Custom logic to make the sitemap "strong"
      changefreq: 'weekly',
      priority: 0.7, 
      lastmod: new Date(),
      
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
    })
  ]
});