import { defineConfig } from "astro/config"
import tailwind from "@astrojs/tailwind"
import sitemap from "@astrojs/sitemap"
import mdx from "@astrojs/mdx"

// https://astro.build/config
export default defineConfig({
  site: "https://dbiswas.com/",
  trailingSlash: "always",
  integrations: [
    tailwind({
      config: { applyBaseStyles: false },
    }),
    sitemap(),
    mdx(),
  ],
})
