// The "book" button goes to Eversports once its URL is set in Keystatic settings;
// until then it opens an email, so the button never dead-ends.
export function bookingHref(settings: { booking: { url?: string | null }; email: string }, subject = 'Buchungsanfrage'): string {
  const url = settings.booking.url?.trim();
  return url || `mailto:${settings.email}?subject=${encodeURIComponent(subject)}`;
}

export const isExternal = (href: string) => /^(https?:|mailto:|tel:)/.test(href);
