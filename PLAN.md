# Beat-Etage rebuild plan

Status as of 2026-10-27: **first version built and pushed, not deployed yet.** All pages exist in German and English, seeded from the old site's content and photos. Still open: the Vercel project and Keystatic GitHub App, the DNS move, and the items in the README's "Before going live" list.

## Why

beat-etage.de (Percussionstudio Beat-Etage, Berlin) was hacked. The host (all-inkl KAS) found the WordPress backdoor `wp-content/mu-plugins/wp-fixplugin.php`, warned there are probably more files, and may block the account. The live home page was also serving an injected casino block and spam links. Decision: do not restore WordPress. Rebuild as a static Astro + Keystatic site, the same stack as `side-quests/teambeat`, and point the domain at the new host.

Nathan Berg owns the business and will get repo access. Beat-Etage and teambeat are separate businesses with shared values, so this is a separate repo and a separate design.

## Facts (from the interview and the old site)

- **Name:** "Etage" means floor. Nathan first taught in an attic in his hometown, hence the name.
- **Old studio:** Bouchéstraße 75, a 55 m² former classroom in a tall brick ex-girls' school, with a stone smell in the stairwell. Closed for renovation.
- **New studio:** Bouchéstraße 12, Halle 19, Eingang B, 12435 Berlin. Enter via Jordanstraße, where there is parking. Andre has not seen it.
- **Offer:** West African djembe and dunduns, balafon (confirm), handpan and cajón (Alex), adult courses in four levels, parent-and-child sessions on Saturdays (about 45 min), workshops, team and school events, drum repair and re-skinning.
- **Team:** Nathan Berg, Toumany Fofana, Alex Streletz. Janos and Leo are new, so their bios are still needed.
- **Nathan's background:** 90s hip hop in Minden (beatbox, breakdance, graffiti), djembe since 1999, teaching since 2003, psychologist and coach.
- **Feeling:** welcoming, human, open-hearted. Not corporate, not an esoteric drum circle. Nathan separates club culture from drumming, which is warm.
- **Roberta:** Nathan's beige VW camper with a yellow streak. She carries instruments for off-site workshops, otherwise a cargo bike does. "Beige and yellow like Roberta" may become the tagline (ask Nathan).
- **Bookings and payments** run through Eversports. Link to it, do not rebuild it.
- **Prices (old site, confirm before launch):** trial from €10, single ticket from €20, membership from €55/month, 1:1 €30 for 30 min or €45 for 45 min, parent-and-child €24 for 2 people, €33 for 3, €39 for 4, plus €10 per extra person, beginner workshop 2 h €49 (cancel 3 days ahead).

The old text is in `reference/old-site-text/` (gitignored, because it contains bank details). Never copy the IBAN into the site. The postal address (Heidelberger Str. 44 F) appears only in the Impressum and Datenschutz, where German law requires a service address. Nathan should confirm it. Do not carry over the injected casino block from `home.txt`.

## Design update (30.10.2026)

Nathan sent his own palette and a mockup. Now: his six colours, rounded corners (sets it apart from teambeat), a hero like his mockup, acoustic foam from the studio as a background texture, and a collage style (tilted photos, tape, stickers). The floor-directory concept below was dropped; the README's "The idea" and "Design rules" are current. The section below is the original direction, kept for history.

## Design direction

Generated with the design-taste-frontend skill. The full sheet is in `.taste-skill/direction.json` (reprint with `node <skill>/scripts/draw.mjs --show`).

- **Direction:** "The page is the object", seed 1435580476.
- **Idea:** *On this page, the building's floor directory board (the Etage) becomes the layout.* Each offer gets its own floor.
- **Floors (top to bottom on the board):** Dach (about us and team), 3. OG teams and events, 2. OG workshops, 1. OG adult courses, EG parents and kids, Keller drum repair. Floor labels are words, not 01/02/03, so the board passes the no-index-numbering rule.
- **Palette:** keep the dealt proportions (one ground, one ink, one accent). Replace the dealt navy and pink with Roberta's colours: beige ground, yellow streak as the accent, dark ink.
- **Type:** the dealt Times-style serif was too dry, so the type slot was redrawn: Hanken Grotesk, self-hosted via `@fontsource` (no Google Fonts request).
- **Hero:** the dealt hero needs a photo of the room. Until Nathan's photos arrive, draw the board in code. Swap in real photos from his phone later.
- **Live thing:** the directory board itself. Click a floor and the board opens that floor's classes, times and prices.
- **Pictures:** the project's own first (Nathan's phone), then credited open-collection pictures (brick, Treptow, instruments). Never present found pictures as Nathan's own room or team.
- **Rules that hold:** no eyebrows, no monospace, no gradients, no shadows at rest, no thin rules, two typefaces at most, headlines of two lines or fewer. Gate with `lint.mjs` and `inspect.mjs`.

## Launch scope (minimum)

German first, English mirrored under `/en`.

- Home (the board)
- The five floors, each with its classes, times and prices
- Team (Nathan, Toumany, Alex, Janos, Leo)
- Room and directions (Halle 19, Eingang B, via Jordanstraße)
- Contact (email, phone, Instagram, Facebook, YouTube, Urban Sports Club)
- Impressum and Datenschutz

Left out of launch: "kritische Debatte", "Wirkung der Musik", "Kundenliste", Portugal workshop, own booking. Add later if Nathan wants them.

## Build steps

1. **Strip teambeat.** Remove teambeat's pages, content YAML and everything under `src/assets/media/`, plus its logo and `DESIGN.md` references. Update `package.json` name, `astro.config.mjs` site URL, `keystatic.config.ts` and the README. Keep the Astro, Keystatic and Vercel plumbing.
2. **Content model in Keystatic:** floors (name, intro, classes with level, day, time, price, booking URL), team members, settings (contact, social links, Impressum and Datenschutz text), and German and English variants.
3. **Tokens:** Roberta palette and the redrawn type as CSS custom properties.
4. **Build the board and the five floors**, then team, room, contact, legal.
5. **Gate:** `lint.mjs`, `inspect.mjs` at 1440, 768 and 390 with 0 FAIL. Look at every screenshot.
6. **Real content:** Nathan's class photos, bios, prices, balafon yes or no, and the booking and social links.
7. **Impressum and Datenschutz:** reuse the old text only after Nathan reads it through. A static site with no cookies, no form backend and no analytics needs much less than the WordPress text. Embeds (YouTube) need a click-to-load or privacy-friendly embed.
8. **Contact:** `mailto:` links for launch. A form endpoint (n8n webhook) comes later.
9. **Deploy:** push to a new GitHub repo, create a Vercel project, run the Keystatic GitHub App setup (see the README checklist). Note the Vercel Hobby limits recorded in the teambeat README.
10. **Domain:** confirm who can change the DNS for beat-etage.de at all-inkl. Point it at Vercel before the account gets blocked.

## Security follow-ups (for Nathan and the IT contractor, not part of the code)

- Take the old site down. It still serves spam links.
- Change the WordPress admin, all-inkl KAS, FTP, database and email passwords. Change any other account that reused them.
- Check the mailbox for unexpected forwarding rules or sent mail.
- Do not tick the "I have cleaned the account" box in KAS until the webspace is emptied or restored from a backup older than 24.09.2026.
- Keep a copy of `wp-content/uploads` (images only, no plugins or themes) from a backup older than 24.09.2026 before the account is blocked, so the original photos survive.
- Facebook and YouTube are separate from the hack, but check them too.

## What Nathan sends

1. Class and workshop list with level, day, time, duration and price.
2. Bios and photos for Toumany, Alex, Janos and Leo, and a current photo of himself.
3. Photos of lessons, instruments and the Halle 19 room. Roberta and the cargo bike too.
4. Balafon: yes or no.
5. Links: Eversports, Instagram, Facebook, YouTube, Urban Sports Club.
6. The legal details for the Impressum.
7. The original `wp-content/uploads` folder.

## For Nathan's own agent

Repo: add the GitHub URL here once it exists. Start by reading this file, `README.md` and `.taste-skill/direction.json`. Content lives in Keystatic (`npm run dev`, then `/keystatic`). Do not change route keys or the floor structure without discussing it. Run `npm run build` before pushing.
