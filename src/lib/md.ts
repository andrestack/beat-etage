// Minimal rich text for Keystatic multiline fields, so editors can write
// plain text: blank line = new paragraph, "- " = bullet, "## " = heading,
// "![caption](image.jpg)" = figure, **bold**.
import { img } from './content';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const inline = (s: string) =>
  esc(s)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" rel="noopener">$1</a>')
    .replace(/\n/g, '<br>');

export function md(src: string | null | undefined): string {
  if (!src) return '';
  return src.trim().split(/\n\s*\n/).map((block) => {
    const lines = block.split('\n');
    const fig = block.trim().match(/^!\[(.*?)\]\((.+?)\)$/);
    if (fig) {
      const meta = img(fig[2]);
      const cap = fig[1] ? `<figcaption>${esc(fig[1])}</figcaption>` : '';
      return meta ? `<figure><img src="${meta.src}" width="${meta.width}" height="${meta.height}" alt="${esc(fig[1])}" loading="lazy">${cap}</figure>` : '';
    }
    if (block.startsWith('## ')) return `<h2>${inline(block.slice(3))}</h2>`;
    if (lines.every((l) => l.trimStart().startsWith('- '))) {
      return `<ul>${lines.map((l) => `<li>${inline(l.trimStart().slice(2))}</li>`).join('')}</ul>`;
    }
    return `<p>${inline(block)}</p>`;
  }).join('');
}
