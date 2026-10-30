# Beat-Etage: beat-etage.de

Website of the Percussionstudio Beat-Etage in Berlin-Treptow (Nathan Berg). Built with **Astro** and the **Keystatic** CMS, hosted on **Vercel**. It replaces the old WordPress site, which was hacked in October 2026. There is no WordPress, no database and no PHP: every page is static HTML, and only the `/keystatic` admin runs as a Vercel function.

Read `PLAN.md` for why it exists, what was decided and what is still open.

## Run it

```bash
npm install
npm run dev        # http://localhost:4321, CMS at /keystatic (edits files on disk)
npm run build      # static build, run this before you push
```

German is the main site at `/`. English mirrors it under `/en`.

## Where things are

| What | Where |
|---|---|
| Content (texts, prices, floors) | `src/content/<de\|en>/*.yaml`, edited through `/keystatic` |
| Photos | `src/assets/media/<de\|en>/<entry>/` (Keystatic moves them here on save) |
| Content model | `keystatic.config.ts` |
| Pages | `src/pages/` (`[floor].astro` renders every floor from `src/content/<locale>/floors/`) |
| Components | `src/components/` |
| Styles and design tokens | `src/styles/global.css` |
| UI strings that aren't content (button labels, headings) | `src/lib/i18n.ts` |
| Redirects from old WordPress URLs | `redirects` in `astro.config.mjs` |
| Security headers | `vercel.json` |
| Design direction | `.taste-skill/direction.json` is the original sheet; the palette and shape have since moved to Nathan's palette and rounded corners (see Design rules). The CSS wins. |

### The idea

*"Etage" means floor:* Nathan first taught in an attic in his hometown, hence the name. That story stays ("Warum eigentlich Etage?" on the home page). The earlier floor-directory layout (Dach, 3. OG … Keller, "Hausverzeichnis") was our invention, not Nathan's, and was dropped on 30.10.2026. Offers are still stored as Keystatic entries under "Angebote" (internally the `floors` collection; route keys unchanged). Their old "Etage" field is now the **sticker**: a short fact stuck on the photo ("Wöchentlich", "Kein Mindestalter"). `Board.astro` is no longer used.

The look is a **collage**, like the noticeboard on the studio door: photos slightly tilted with a strip of tape on top, round stickers on the corners, facts as coloured notes, text pinned on rounded cards over acoustic foam.

### Design rules

- Palette is Nathan's (Oct 2026): Naturweiß `#F5F0E6` ground, Fichtenholz `#DCC9A5` panels, Ockergelb `#D9B65D` accent and buttons, Walnuss `#40362F` text. Trommelbraun `#936A4D` only for large type or shapes (4.2:1 on white), Salbeigrün `#A5AE91` only for dots and shapes, never text. Small brown text uses `--soft` (`#6E4F39`). Tokens are at the top of `global.css`.
- Rounded corners everywhere (`--r`, `--r-sm`, pills for labels). This deliberately sets it apart from teambeat, which is square.
- Acoustic foam from the studio walls (`--foam`) is a background texture for coloured fields (visit, call to action). Text never sits directly on foam: put it on a rounded Naturweiß card, like a note pinned to the studio door.
- One typeface, Hanken Grotesk, self-hosted through `@fontsource` (no requests to Google; this matters for GDPR).
- Collage tilts use the CSS `rotate` property scaled by `--k` (smaller on phones), so they never fight the reveal motion's `transform`. Photo frames don't clip (the radius sits on the img) so the tape can overlap the edge.
- No shadows. No icons in boxes.
- No cookies, no analytics, no third-party embeds. Keep it that way, or update the Datenschutz text.
- Photos need descriptive `alt` text (Keystatic field "Bildbeschreibung").

## Booking

Bookings run through Eversports. The "Termine & Buchung" buttons point at the studio calendar (`https://www.eversports.de/scl/percussionstudio-beat-etage`, taken from the old site's own links; Eversports blocks automated checks, so click it once to confirm). Change it in Keystatic under **Einstellungen → Buchung**. If the field is empty, the buttons open an email instead. Memberships and trial offers live at `https://www.eversports.de/sp/percussionstudio-beat-etage`.

## CMS on the live site (Keystatic GitHub mode)

Every save in `/keystatic` on the deployed site commits to `main` in `andrestack/beat-etage`. A GitHub Action (`.github/workflows/vercel-deploy-hook.yml`) then calls a Vercel deploy hook, and the change is live about a minute later. (Vercel Hobby won't Git-deploy commits from anyone but the account owner on a private repo; the hook doesn't care who made the commit. Hobby is also non-commercial only, so check the plan before launch.)

Keystatic needs a GitHub App to log editors in. Create it once, from your machine:

1. Run `PUBLIC_KEYSTATIC_STORAGE=github npm run dev` and open http://127.0.0.1:4321/keystatic.
2. Click **Log in with GitHub**. You land on `/keystatic/setup`. Leave the organisation field empty because the repo belongs to a user account. Click **Create GitHub App**, name it (e.g. `beat-etage-keystatic`) and install it on **andrestack/beat-etage only**.
3. Keystatic writes the four variables below into `.env`, which git ignores. Keep that file. You need the values for Vercel.

| Variable | What it is |
|---|---|
| `KEYSTATIC_GITHUB_CLIENT_ID` | GitHub App client ID |
| `KEYSTATIC_GITHUB_CLIENT_SECRET` | GitHub App client secret |
| `KEYSTATIC_SECRET` | Random string that signs login cookies (32+ chars) |
| `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` | The app's URL name. Baked into the admin page at build time, so a change needs a redeploy. |

4. In the app's settings (`https://github.com/settings/apps/<app-slug>`), add a callback URL for every domain the CMS runs on:
   - `https://<project>.vercel.app/api/keystatic/github/oauth/callback`
   - `https://beat-etage.de/api/keystatic/github/oauth/callback` (after the domain moves)

Editors log in with their own GitHub account, which needs **write** access to the repo (*Settings → Collaborators*).

## Deploy checklist (Vercel)

1. **Push** to `main`. Vercel builds whatever is on `main`.
2. **GitHub App:** create it as described above, copy the four values out of `.env`.
3. **Vercel project:** *Add New → Project → Import* `andrestack/beat-etage`. Vercel detects Astro; the defaults are right. Add the four variables for **Production and Preview**, then deploy.
4. **Callback URL:** add the `*.vercel.app` callback to the GitHub App.
5. **Deploy hook:** in Vercel *Settings → Git → Deploy Hooks* create a hook `keystatic` for `main`. In GitHub *Settings → Secrets and variables → Actions* add its URL as the secret `VERCEL_DEPLOY_HOOK`. Treat the URL like a password.
6. **Smoke test:** open `https://<project>.vercel.app/keystatic`, log in, change one word and save. A commit lands on `main` and a new deployment starts.
7. **Domain:** add `beat-etage.de` (and `www`) in Vercel, then change the DNS at all-inkl. Add the second callback URL. Do this last.
   - Change **only** the apex `A` record and the `www` `CNAME`, to the values Vercel shows.
   - Leave the **MX, SPF, DKIM and other TXT records untouched**, and do not move the nameservers. `kontakt@beat-etage.de` is the contact address of the whole site and probably lives at all-inkl; moving the wrong record takes email down.
   - Afterwards check two old URLs with and without a trailing slash (for example `/preise` and `/eltern-kind-session/`); each should redirect to the new page.
8. **Hosting account:** Vercel Hobby is for non-commercial use. Decide which account and plan hosts this business site before launch, and make sure the Vercel data processing agreement mentioned in the Datenschutz applies to that account.

## Before going live

- [ ] **Impressum and Datenschutz** are drafts written for a static site (no cookies, no tracking, Vercel as host). Nathan must read and confirm them. The address in the Impressum is his postal address from the old Impressum.
- [ ] **Prices and dates:** confirm every price against what Nathan charges today. Two things go stale: the early-bird deadline (31.12.2026) and the Spring Camp dates (6–9 May 2027) on the Workshops floor.
- [ ] **Eversports link:** click the calendar link once and confirm it opens the right studio.
- [ ] **Keystatic admin:** run `npm run dev`, open `/keystatic`, check that images show in Startseite and an Etage, save one change and commit the normalised YAML before Nathan's first save.
- [ ] **Balafon:** confirm it is currently offered. It is mentioned on the home page, in the team texts and in the camps.
- [ ] **Teachers Janos and Leo:** add to "Team" once there are bios and photos.
- [ ] **Halle 19 photos:** the contact page shows the old room at Bouchéstraße 75 with an honest caption. Replace it with a photo of the new room.
- [ ] **Photos from the old site:** the teachers and team photos come from the old site (the ones without text baked in). The photo of a child with Nathan (Eltern & Kinder) should be confirmed with the parents.
- [ ] **Stickers and tagline:** Nathan should check the sticker texts on each offer and the line "Rhythmus · Gemeinschaft · Begegnung" under the hero.
- [ ] **Roberta:** she appears on the "Teams & Events" floor ("Die Trommeln kommen mit"). Nathan should check the wording.
- [ ] **Redirects:** `vercel.json` maps the old WordPress URLs to the new pages. Check the important ones after the domain moves.

## For an AI agent working on this repo

Read `PLAN.md`, this file and `.taste-skill/direction.json` first. Content changes belong in `src/content/`, not in components. Keep the house rules above. Run `npm run build` before pushing, and never commit anything from `reference/` (it holds scraped old-site text, including bank details).
