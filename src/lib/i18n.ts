import type { Locale } from './content';

// UI strings that are not editable content. Everything else lives in Keystatic.
const S = {
  de: {
    skip: 'Zum Inhalt springen',
    menu: 'Menü',
    langName: 'English',
    langCode: 'EN',
    classes: 'Angebote',
    toFloor: 'Zur Etage',
    allFloors: 'Alle Etagen',
    ctaTitle: 'Lust, es auszuprobieren?',
    ctaText: 'Komm vorbei: Du brauchst keine Vorkenntnisse, nur Lust auf Rhythmus.',
    when: 'Wann',
    price: 'Preis',
    contactTitle: 'Schreib uns',
    callUs: 'Anrufen',
    mailUs: 'E-Mail schreiben',
    home: 'Zur Startseite',
    photoBy: 'Foto',
  },
  en: {
    skip: 'Skip to content',
    menu: 'Menu',
    langName: 'Deutsch',
    langCode: 'DE',
    classes: 'What’s on',
    toFloor: 'Go to this floor',
    allFloors: 'All floors',
    ctaTitle: 'Want to give it a try?',
    ctaText: 'Come by: you need no experience, just a taste for rhythm.',
    when: 'When',
    price: 'Price',
    contactTitle: 'Write to us',
    callUs: 'Call',
    mailUs: 'Send an email',
    home: 'Back to the home page',
    photoBy: 'Photo',
  },
} as const;

export const t = (locale: Locale) => S[locale];
