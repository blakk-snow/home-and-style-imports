# Home & Style Imports

A mobile-first catalogue for a small Accra shop. Customers browse products and enquire on WhatsApp or by phone. There is no checkout, no customer account, and no online payment.

This is the Phase 1 site from the program plan: a Vite + React app, styled with Tailwind, reading a static catalogue. Firebase Hosting is ready to deploy. Owner login and live stock editing are Phase 2.

The planning documents in the repo root are the source spec. This README is how to run and change the site.

## Run it

```bash
npm install
npm run dev
```

Open the printed local URL. `npm test` checks price formatting, search, and WhatsApp link building. `npm run build` makes a `dist/` folder and writes a static HTML file per route so WhatsApp and Facebook can read the right title and image without running JavaScript.

## Before this goes live

Everything a customer could act on is sample data, on purpose. The owner still needs to supply the real details (see section 18 of the program plan).

Edit `src/data/config.js`:

- `whatsappNumber` and `phoneNumbers` — international digits only, no `+` and no spaces. Example: `233244123456`
- `address`, `mapsQuery`, `openingHours`
- `siteUrl`, or set `VITE_SITE_URL` at build time

Then replace `src/data/products.js` with real stock. Photos go in `public/images/products/`. A product needs `id`, `ref`, `slug`, `name`, `description`, `alt`, `category` (a slug from `src/data/categories.js`), `price` (or `null` for “Ask for price”), `image`, `inStock`, `isNew`, `featured`, and `createdAt`.

Do not launch with the sample number `233200000000`. The amber note at the top of every page is there so nobody treats this preview as the live shop.

## What is in this build

Public routes: `/`, `/shop`, `/category/:slug`, `/product/:slug`, `/about`, `/contact`, `/visit` (same page as contact, scrolled to the map), and a 404.

Shop search, category chips, price and name sort, and an “in stock only” switch are stored in the URL, so a filtered view can be shared.

Every product can open WhatsApp with a pre-filled message:

`Hello Home & Style Imports, I'm interested in Ceramic Table Vase (ref: HS-0142). Is it available?`

The heart saves pieces on this phone only (no account, no server). “Send on WhatsApp” turns that list into one message. Nothing is reserved until the shop replies.

Shoes, ladies' bags, phone accessories and small gadgets are in the catalogue as sample pieces. Clothing, totes, jewellery and gifts are listed too, but they have no photos yet. Those pages ask the customer to enquire rather than showing an empty grid. Add products in those categories and they appear automatically.

## Decisions that differ from a literal reading of the plan

- Product URLs use the slug (`/product/ceramic-table-vase`), not the id. The id is still the enquiry ref. Slugs are what you want when a link is pasted into WhatsApp.
- Mobile navigation follows the mockups: a bottom bar for Home, Shop, Visit and Contact, plus the floating WhatsApp button. Desktop uses the top bar from the plan.
- The map is a link out to Google Maps, not an embedded map. That keeps the page light.
- Phase 1 does not include the admin screens. Draft Firestore and Storage rules are in the repo for Phase 2. They are not deployed, and `OWNER_UID` must be replaced before they are.

## Deploy

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

`firebase.json` already points Hosting at `dist`, rewrites unknown paths to `index.html`, and serves the prerendered route files first. That is what makes a shared product link show the right preview. Use a preview channel (`firebase hosting:channel:deploy preview`) before pointing a custom domain at it.

Copy `.env.example` to `.env` only when you add Firebase keys in Phase 2. Do not commit `.env`.
