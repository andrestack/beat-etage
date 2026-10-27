import { config, fields, singleton, collection } from '@keystatic/core';

// Every page exists once per locale. German is the primary site at `/`,
// English mirrors it under `/en`.
const LOCALES = [
  { code: 'de', label: 'Deutsch' },
  { code: 'en', label: 'English' },
] as const;

// Keystatic keeps each entry's images in its own folder (and moves files there
// on save), so every singleton/collection per locale gets a separate directory.
// IMG_DIR/IMG_PUB are set right before that entry's schema is built.
let IMG_DIR = '';
let IMG_PUB = '';
const img = (label: string) => fields.image({ label, directory: IMG_DIR, publicPath: IMG_PUB });

const link = (label: string) =>
  fields.object({ label: fields.text({ label: 'Text' }), href: fields.text({ label: 'Link' }) }, { label });

const seo = fields.object(
  { title: fields.text({ label: 'Seitentitel' }), description: fields.text({ label: 'Beschreibung', multiline: true }) },
  { label: 'SEO' },
);

const RICH = 'Leerzeile = neuer Absatz · Zeile mit "- " = Aufzählung · ## = Zwischenüberschrift · **fett**';
const rich = (label: string) => fields.text({ label, multiline: true, description: RICH });

function build() {
  const schemas = {
    settings: {
      label: 'Einstellungen',
      schema: {
        siteName: fields.text({ label: 'Name' }),
        tagline: fields.text({ label: 'Untertitel (z. B. handmade polyrhythm)' }),
        nav: fields.array(link('Link'), { label: 'Navigation', itemLabel: (p) => p.fields.label.value }),
        cta: link('Button in der Kopfzeile'),
        booking: fields.object(
          {
            url: fields.text({ label: 'Eversports-Link (leer = Button öffnet eine E-Mail)' }),
            label: fields.text({ label: 'Text' }),
          },
          { label: 'Buchung' },
        ),
        email: fields.text({ label: 'E-Mail' }),
        phone: fields.text({ label: 'Telefon' }),
        address: fields.array(fields.text({ label: 'Zeile' }), { label: 'Adresse', itemLabel: (p) => p.value }),
        socials: fields.array(link('Link'), { label: 'Social Links', itemLabel: (p) => p.fields.label.value }),
        legalLinks: fields.array(link('Link'), { label: 'Rechtliches', itemLabel: (p) => p.fields.label.value }),
        footerSignoff: fields.text({ label: 'Footer: Schlusssatz' }),
        footerText: fields.text({ label: 'Footer: Text', multiline: true }),
        imprint: fields.text({ label: 'Footer: Copyright' }),
      },
    },
    home: {
      label: 'Startseite',
      schema: {
        seo,
        hero: fields.object(
          {
            title: fields.text({ label: 'Überschrift' }),
            text: fields.text({ label: 'Text', multiline: true }),
            image: img('Bild'),
            imageAlt: fields.text({ label: 'Bildbeschreibung' }),
            imageCaption: fields.text({ label: 'Bildunterschrift' }),
          },
          { label: 'Anfang' },
        ),
        board: fields.object(
          {
            title: fields.text({ label: 'Überschrift der Tafel' }),
            rows: fields.array(
              fields.object({
                label: fields.text({ label: 'Etage (z. B. EG, 1. OG)' }),
                title: fields.text({ label: 'Name' }),
                text: fields.text({ label: 'Text', multiline: true }),
                price: fields.text({ label: 'Preis / Info (kurz)' }),
                href: fields.text({ label: 'Link' }),
              }),
              { label: 'Etagen', itemLabel: (p) => `${p.fields.label.value} · ${p.fields.title.value}` },
            ),
          },
          { label: 'Etagen-Tafel' },
        ),
        intro: fields.object(
          {
            title: fields.text({ label: 'Überschrift' }),
            note: fields.text({ label: 'Text', multiline: true }),
            facts: fields.array(
              fields.object({ value: fields.text({ label: 'Zahl / Wert' }), text: fields.text({ label: 'Erklärung' }) }),
              { label: 'Fakten', itemLabel: (p) => p.fields.value.value },
            ),
          },
          { label: 'Einleitung' },
        ),
        tilesTitle: fields.text({ label: 'Überschrift der Fototafeln' }),
        about: fields.object(
          {
            title: fields.text({ label: 'Überschrift' }),
            body: rich('Text'),
            image: img('Bild'),
            imageAlt: fields.text({ label: 'Bildbeschreibung' }),
            link: link('Link'),
          },
          { label: 'Über die Beat-Etage' },
        ),
        visit: fields.object(
          {
            title: fields.text({ label: 'Überschrift' }),
            text: fields.text({ label: 'Text', multiline: true }),
          },
          { label: 'Besuch' },
        ),
      },
    },
    team: {
      label: 'Team',
      schema: {
        seo,
        title: fields.text({ label: 'Überschrift' }),
        intro: fields.text({ label: 'Einleitung', multiline: true }),
        members: fields.array(
          fields.object({
            name: fields.text({ label: 'Name' }),
            role: fields.text({ label: 'Rolle' }),
            bio: rich('Bio'),
            image: img('Foto'),
            link: link('Link'),
          }),
          { label: 'Lehrer:innen', itemLabel: (p) => p.fields.name.value },
        ),
      },
    },
    kontakt: {
      label: 'Kontakt & Anfahrt',
      schema: {
        seo,
        title: fields.text({ label: 'Überschrift' }),
        intro: fields.text({ label: 'Einleitung', multiline: true }),
        directions: rich('Anfahrt'),
        roomTitle: fields.text({ label: 'Raum: Überschrift' }),
        roomText: rich('Raum: Text'),
        image: img('Raumfoto'),
        imageAlt: fields.text({ label: 'Bildbeschreibung' }),
        imageCaption: fields.text({ label: 'Bildunterschrift' }),
      },
    },
    impressum: { label: 'Impressum', schema: { title: fields.text({ label: 'Überschrift' }), body: rich('Text') } },
    datenschutz: { label: 'Datenschutz', schema: { title: fields.text({ label: 'Überschrift' }), body: rich('Text') } },
  };

  const floorSchema = {
    title: fields.slug({ name: { label: 'Name' } }),
    label: fields.text({ label: 'Etage (z. B. 1. OG)' }),
    seo,
    intro: fields.text({ label: 'Einleitung', multiline: true }),
    image: img('Bild'),
    imageAlt: fields.text({ label: 'Bildbeschreibung' }),
    classes: fields.array(
      fields.object({
        name: fields.text({ label: 'Name' }),
        when: fields.text({ label: 'Wann' }),
        price: fields.text({ label: 'Preis' }),
        note: fields.text({ label: 'Hinweis', multiline: true }),
      }),
      { label: 'Angebote', itemLabel: (p) => p.fields.name.value },
    ),
    body: rich('Text'),
    ctaLabel: fields.text({ label: 'Button: Text' }),
    ctaHref: fields.text({ label: 'Button: Link (leer = Buchungs-Link aus den Einstellungen)' }),
  };

  return { schemas, floorSchema };
}

const singletons: Record<string, ReturnType<typeof singleton>> = {};
const collections: Record<string, ReturnType<typeof collection>> = {};
const singletonKeys = Object.keys(build().schemas) as (keyof ReturnType<typeof build>['schemas'])[];
for (const { code, label } of LOCALES) {
  for (const key of singletonKeys) {
    IMG_DIR = `src/assets/media/${code}/${key}`;
    IMG_PUB = `../../assets/media/${code}/${key}/`;
    const def = build().schemas[key];
    singletons[`${key}_${code}`] = singleton({
      label: `${def.label} (${label})`,
      path: `src/content/${code}/${key}`,
      format: { data: 'yaml' },
      schema: def.schema as any,
    });
  }
  IMG_DIR = `src/assets/media/${code}/floors`;
  IMG_PUB = `../../../assets/media/${code}/floors/`;
  collections[`floors_${code}`] = collection({
    label: `Etagen (${label})`,
    slugField: 'title',
    path: `src/content/${code}/floors/*`,
    format: { data: 'yaml' },
    schema: build().floorSchema,
  });
}

// Dev edits files on disk; production builds read and commit through GitHub.
// PUBLIC_KEYSTATIC_STORAGE=local|github overrides either way. It's inlined into
// the admin bundle, so on Vercel it only takes effect after a redeploy.
const storageKind = import.meta.env.PUBLIC_KEYSTATIC_STORAGE ?? (import.meta.env.DEV ? 'local' : 'github');

export default config({
  storage: storageKind === 'local' ? { kind: 'local' } : { kind: 'github', repo: 'andrestack/beat-etage' },
  ui: {
    brand: { name: 'Beat-Etage' },
    navigation: {
      Deutsch: [...Object.keys(singletons), ...Object.keys(collections)].filter((k) => k.endsWith('_de')),
      English: [...Object.keys(singletons), ...Object.keys(collections)].filter((k) => k.endsWith('_en')),
    },
  },
  singletons,
  collections,
});
