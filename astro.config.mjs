// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import preact from "@astrojs/preact";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  site: "https://ariandervishaj.ch",
  integrations: [
    preact(),
    icon(),
    sitemap({
      serialize(item) {
        // Just set priority and lastmod
        if (item.url === 'https://ariandervishaj.ch/') {
          item.priority = 1.0;
        } else if (item.url.includes('/portfolio/projects/')) {
          item.priority = 0.8;
        }

        // Convert Date to ISO string
        item.lastmod = new Date().toISOString();

        return item;
      }
    })
  ],

  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    shikiConfig: {
      theme: 'github-dark'
    },
  },
});