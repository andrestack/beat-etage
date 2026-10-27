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
  // Old WordPress URLs that search engines and links still point at.
  redirects: {
    '/kurse-infos-und-uebersicht': { status: 308, destination: '/kurse' },
    '/anfaengerinnen': { status: 308, destination: '/kurse' },
    '/mittelstufe': { status: 308, destination: '/kurse' },
    '/fortgeschrittene': { status: 308, destination: '/kurse' },
    '/semi-profis': { status: 308, destination: '/kurse' },
    '/semi-profi-training': { status: 308, destination: '/kurse' },
    '/preise': { status: 308, destination: '/kurse' },
    '/eltern-kind-session': { status: 308, destination: '/kids' },
    '/preise-kids': { status: 308, destination: '/kids' },
    '/wb_kinder': { status: 308, destination: '/kids' },
    '/interactive-event_kinder': { status: 308, destination: '/teams' },
    '/ws_anfaengerinnen': { status: 308, destination: '/workshops' },
    '/ws-mittelstufe': { status: 308, destination: '/workshops' },
    '/fortgeschrittene-ws': { status: 308, destination: '/workshops' },
    '/preise-ws': { status: 308, destination: '/workshops' },
    '/ws-portugal': { status: 308, destination: '/workshops' },
    '/infos-workshop-buchen': { status: 308, destination: '/workshops' },
    '/geschenkgutscheine': { status: 308, destination: '/workshops' },
    '/wb_erwachsene': { status: 308, destination: '/workshops' },
    '/wb_jugendliche': { status: 308, destination: '/workshops' },
    '/teamentwicklung-erwachsene': { status: 308, destination: '/teams' },
    '/teamentwicklung-jugendliche': { status: 308, destination: '/teams' },
    '/interaktives_event_erwachsene': { status: 308, destination: '/teams' },
    '/auftritte': { status: 308, destination: '/teams' },
    '/coaching': { status: 308, destination: '/teams' },
    '/raum': { status: 308, destination: '/kontakt' },
    '/konzept': { status: 308, destination: '/team' },
    '/wirkung': { status: 308, destination: '/team' },
    '/instrumente-und-musik': { status: 308, destination: '/team' },
    '/debatte': { status: 308, destination: '/' },
    '/kundenliste': { status: 308, destination: '/' },
  },
  devToolbar: { enabled: false },
});
