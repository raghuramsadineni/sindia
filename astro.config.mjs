// @ts-check
import { defineConfig, passthroughImageService } from 'astro/config';

import robotsTxt from "astro-robots-txt";
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';
import compress from "astro-compress";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), robotsTxt({
    policy: [{
      userAgent: '*',
      disallow: ''
    }]
  }), sitemap(), compress()],
  image: {
    service: passthroughImageService(),
  },
  output: 'hybrid',
  adapter: vercel(),
  i18n: {
    defaultLocale: "it",
    locales: ["it", "en"],
  }
});