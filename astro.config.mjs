import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import keystatic from '@keystatic/astro';

// Site pages prerender to static HTML; only /keystatic (admin) and its API
// run on demand, as Vercel functions.
export default defineConfig({
  site: 'https://beat-etage.de',
  output: 'static',
  adapter: vercel(),
  integrations: [react(), keystatic()],
  trailingSlash: 'ignore',
  devToolbar: { enabled: false },
});
