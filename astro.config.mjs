// @ts-check
import { defineConfig, passthroughImageService } from 'astro/config';

import robotsTxt from "astro-robots-txt";
import tailwindcss from "@tailwindcss/vite";
import vercel from '@astrojs/vercel';
import compress from "astro-compress";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    robotsTxt({
      policy: [{
        userAgent: '*',
        disallow: ''
      }]
    }), sitemap(), compress()],
  image: {
    service: passthroughImageService(),
  },
  output: 'server',
  adapter: vercel(),
  i18n: {
    defaultLocale: "it",
    locales: ["it", "en"],
  }
});