// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://poloslounge.com',
  // Match the live site's URL style exactly: /gallery (no trailing slash), served from gallery.html
  trailingSlash: 'never',
  build: { format: 'file' },
  image: { responsiveStyles: false },
});
