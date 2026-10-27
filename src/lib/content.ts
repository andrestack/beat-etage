import { createReader } from '@keystatic/core/reader';
import type { ImageMetadata } from 'astro';
import keystaticConfig from '../../keystatic.config';

export type Locale = 'de' | 'en';
export const LOCALES: Locale[] = ['de', 'en'];

const reader = createReader(process.cwd(), keystaticConfig);

export async function getSingleton<T = any>(key: string, locale: Locale): Promise<T> {
  const entry = await (reader.singletons as any)[`${key}_${locale}`].read();
  if (!entry) throw new Error(`Missing content: src/content/${locale}/${key}.yaml`);
  return entry as T;
}

export async function getEntries<T = any>(key: string, locale: Locale): Promise<{ slug: string; entry: T }[]> {
  return (await (reader.collections as any)[`${key}_${locale}`].all()) as { slug: string; entry: T }[];
}

// Keystatic stores image fields as paths relative to the YAML file
// ("../../assets/media/foo.jpg"); map them onto Astro's optimised assets.
const media = import.meta.glob<{ default: ImageMetadata }>('../assets/media/**/*.{jpg,jpeg,png,webp,gif,svg}', { eager: true });
export function img(path: string | null | undefined): ImageMetadata | undefined {
  if (!path) return undefined;
  const rel = path.replace(/^(?:\.\.\/)+assets\/media\//, '');
  const hit = media[`../assets/media/${rel}`];
  if (!hit) throw new Error(`Image not found in src/assets/media: ${rel}`);
  return hit.default;
}

/** Prefix internal links with the locale ("/kontakt" → "/en/kontakt"). */
export function href(locale: Locale, path: string): string {
  if (!path.startsWith('/') || locale === 'de') return path;
  return path === '/' ? '/en' : `/en${path}`;
}

/** The same page in the other language. */
export function switchLocale(pathname: string, to: Locale): string {
  const bare = pathname.replace(/^\/en(?=\/|$)/, '') || '/';
  return href(to, bare);
}
