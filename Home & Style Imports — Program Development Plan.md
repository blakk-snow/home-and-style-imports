# Home & Style Imports — Program Development Plan

**Project:** Home & Style Imports Web App **Document type:** Program Development Plan **Version:** 1.0 (Draft) **Stack:** React · JavaScript · Tailwind CSS · Vite · lucide-react · Firebase Hosting

---

## 1. Project Overview

Home & Style Imports is a small retail shop selling imported general goods and accessories: home décor, clothing, and related items. This project delivers a fast, mobile-friendly **online catalogue** that lets customers browse products and contact the owner directly by **WhatsApp or phone call**.

The app takes **no online payments**. Every sale is completed offline through the owner's WhatsApp or business number.

### 1.1 Problem Statement

Customers currently learn about stock through word of mouth or scattered social media posts. There is no single, organised, always-available place to see what the shop sells.

### 1.2 Proposed Solution

A lightweight web storefront that works as a digital catalogue, with one-tap "Enquire on WhatsApp" and "Call Us" actions on every product.

---

## 2. Goals and Objectives

| # | Objective | Measure of success |
| --- | --- | --- |
| 1 | Present products clearly by category | All stock categories browsable in ≤ 3 taps |
| 2 | Turn browsing into enquiries | Every product page has a working WhatsApp enquiry button |
| 3 | Work well on low-cost phones and slow networks | Lighthouse performance ≥ 85 on mobile |
| 4 | Let the owner update stock without a developer | Owner adds a product in \< 3 minutes (Phase 2) |
| 5 | Keep running costs minimal | Operates within Firebase free (Spark) tier |

---

## 3. Scope

### 3.1 In Scope

- Public catalogue: home, categories, product listing, product detail
- Search, category filter, and sort
- WhatsApp enquiry links (pre-filled message) and click-to-call
- About, Contact, and shop location/hours pages
- Responsive design (mobile-first)
- Basic SEO and social sharing previews
- Owner admin area to manage products (Phase 2)
- Deployment on Firebase Hosting

### 3.2 Out of Scope

- Online payments, checkout, or card/mobile-money integration
- Customer accounts and order tracking
- Delivery or inventory-accounting systems
- Multi-vendor or multi-shop support

---

## 4. Users and Stories

### 4.1 User Roles

- **Customer (public visitor):** browses and enquires; no login.
- **Owner/Admin:** manages products and shop details; signs in with Firebase Authentication.

### 4.2 Key User Stories

**Customer**

- As a customer, I can browse products by category so I find what I want quickly.
- As a customer, I can search by name so I skip scrolling.
- As a customer, I can tap "Enquire on WhatsApp" and land in a chat with the product name already typed.
- As a customer, I can call the shop with one tap.
- As a customer, I can see the shop's location and opening hours.

**Owner**

- As the owner, I can add, edit, hide, or delete a product.
- As the owner, I can mark an item "Out of stock" or "New arrival".
- As the owner, I can upload product photos from my phone.
- As the owner, I can change my WhatsApp/phone numbers in one place.

---

## 5. Functional Requirements

### 5.1 Pages and Routes

| Route | Page | Purpose |
| --- | --- | --- |
| `/` | Home | Hero, featured categories, new arrivals, contact strip |
| `/shop` | All Products | Grid with search, filter, sort |
| `/category/:slug` | Category | Products in one category |
| `/product/:id` | Product Detail | Images, description, price, enquiry buttons |
| `/about` | About | Shop story, values |
| `/contact` | Contact | WhatsApp, phone, address, hours, map link |
| `/admin` | Admin Login | Owner sign-in (Phase 2) |
| `/admin/products` | Product Manager | Create, edit, delete products (Phase 2) |
| `*` | Not Found | Friendly 404 |

### 5.2 Core Features

1. **Product catalogue:** responsive card grid with image, name, price, and availability tag.
2. **Search and filter:** text search, category filter, price sort, "In stock only" toggle.
3. **WhatsApp enquiry:** builds a link in the form `https://wa.me/<number>?text=<encoded message>`. Example message: *"Hello Home & Style Imports, I'm interested in \[Product Name\] (ref: \[ID\]). Is it available?"*
4. **Click-to-call:** `tel:` links for the business number(s).
5. **Floating contact button:** persistent WhatsApp button on all public pages.
6. **Enquiry list (optional enhancement):** customer saves several items, then sends them in one WhatsApp message. No payment involved.
7. **Prices:** shown as guide prices with a note "Price confirmed on enquiry" if the owner prefers.
8. **Admin dashboard (Phase 2):** CRUD for products, image upload, stock status, featured flag.

### 5.3 Non-Functional Requirements

- **Performance:** first load under \~3 s on 4G; images lazy-loaded and compressed.
- **Responsiveness:** works from 320 px phones up to desktop.
- **Accessibility:** semantic HTML, alt text, keyboard navigation, WCAG AA contrast.
- **Security:** Firestore/Storage rules restrict writes to the authenticated owner.
- **Reliability:** hosted on Firebase's global CDN with HTTPS by default.
- **Maintainability:** modular components, consistent naming, short README.

---

## 6. Technology Stack

| Layer | Technology | Role |
| --- | --- | --- |
| UI library | React (JavaScript) | Component-based interface |
| Build tool | Vite | Fast dev server and optimised builds |
| Styling | Tailwind CSS | Utility-first, mobile-first styling |
| Icons | lucide-react | Consistent icon set (MessageCircle, Phone, MapPin, Search, etc.) |
| Routing | React Router | Client-side navigation |
| Database | Cloud Firestore | Products, categories, shop settings |
| Auth | Firebase Authentication | Owner login (Email/Password) |
| Image storage | Firebase Storage | Product photos |
| Hosting | Firebase Hosting | Deployment, SSL, CDN |
| Version control | Git + GitHub | Source tracking |

> **Note:** If Phase 2 is delayed, Phase 1 can read products from a static `products.json` file, so the shop can launch without any backend.

---

## 7. System Architecture

```
Customer / Owner Browser
        │
   React SPA (Vite build)
        │
  ┌─────┼───────────────┐
  │     │               │
Firestore  Storage     Auth
(products, (images)   (owner only)
 settings)
        │
 Firebase Hosting (CDN + HTTPS)
```

External hand-offs (no data stored): `wa.me` WhatsApp links and `tel:` phone links.

### 7.1 Suggested Folder Structure

```
home-style-imports/
├── public/                # favicon, og-image
├── src/
│   ├── components/        # Navbar, Footer, ProductCard, WhatsAppButton, SearchBar
│   ├── pages/             # Home, Shop, Category, ProductDetail, About, Contact, admin/*
│   ├── hooks/             # useProducts, useAuth
│   ├── lib/               # firebase.js, whatsapp.js, formatters.js
│   ├── data/              # products.json (Phase 1 fallback), config.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css          # Tailwind directives
├── firebase.json
├── firestore.rules
├── storage.rules
├── tailwind.config.js
├── vite.config.js
└── .env                   # Firebase keys (never commit)
```

### 7.2 Central Configuration

Keep all owner-editable details in one file (`src/data/config.js`) or one Firestore `settings` document: `shopName`, `whatsappNumber` (international format, no `+`), `phoneNumbers[]`, `address`, `openingHours`, `socialLinks`, `currency`.

---

## 8. Data Model (Firestore)

**`products/{productId}`**

| Field | Type | Notes |
| --- | --- | --- |
| name | string | Required |
| slug | string | URL-friendly |
| description | string | Materials, size, colours |
| category | string | Category slug |
| price | number | Optional if "Ask for price" |
| images | array | Storage URLs; first is the cover |
| inStock | boolean | Controls availability tag |
| featured | boolean | Shown on Home |
| isNew | boolean | "New arrival" badge |
| sizes / colours | array | Optional (clothing) |
| createdAt, updatedAt | timestamp | Sorting |

**`categories/{categoryId}`:** `name`, `slug`, `image`, `order` **`settings/shop`:** contact and shop details (section 7.2)

Suggested starting categories: Home Décor, Kitchen & Dining, Bedding & Textiles, Clothing, Bags & Accessories, Jewellery, Gifts & Novelties.

---

## 9. UI/UX Design Plan

- **Approach:** mobile-first; most customers will arrive from a WhatsApp or social media link on a phone.
- **Look and feel:** warm, clean, boutique feel; generous whitespace; photo-led. Define brand colours (primary, accent, neutral) and one heading font plus one body font in `tailwind.config.js`.
- **Navigation:** sticky top bar (logo, Shop, Categories, Contact) with a mobile menu; sticky bottom/floating WhatsApp button.
- **Product card:** square image, name, price, stock tag, small WhatsApp icon.
- **Product page:** image gallery, details, large green WhatsApp CTA, secondary Call button, "Share" action.
- **Icons (lucide-react):** `MessageCircle`, `Phone`, `MapPin`, `Search`, `Menu`, `X`, `Heart`, `ShoppingBag` (decorative only), `Clock`, `Share2`.
- **Wireframes:** sketch Home, Shop, and Product Detail first for owner approval before coding.

---

## 10. Development Phases and Timeline

Estimated for one developer working part-time; adjust as needed.

| Phase | Activities | Deliverable | Duration |
| --- | --- | --- | --- |
| **0. Discovery** | Meet owner; collect logo, photos, product list, contact details; agree on categories and tone | Signed-off requirements, content checklist | Week 1 |
| **1. Design** | Colour/typography choices, wireframes, component list | Approved wireframes | Week 1–2 |
| **2. Setup** | Vite + React project, Tailwind, lucide-react, routing, Firebase project, Git repo | Running skeleton | Week 2 |
| **3. Core build** | Layout, Home, Shop, Category, Product Detail, search/filter, WhatsApp and call buttons, About, Contact | Working catalogue (static JSON data) | Week 3–4 |
| **4. Launch (MVP)** | Testing, SEO, performance tuning, Firebase Hosting deploy, custom domain | **Live public site** | Week 5 |
| **5. Admin (Phase 2)** | Firebase Auth, Firestore integration, product CRUD, image upload, security rules | Owner can manage stock | Week 6–7 |
| **6. Handover** | Owner training, short user guide, backup and maintenance notes | Documentation and training | Week 8 |

---

## 11. Deployment Plan

1. Create a Firebase project and register a web app.
2. Store config keys in `.env` using `VITE_` prefixes (add `.env` to `.gitignore`).
3. Install tools: `npm install -g firebase-tools`, then `firebase login`.
4. Run `firebase init` and select **Hosting** (plus Firestore and Storage in Phase 2). Set public directory to `dist` and configure as a single-page app (rewrite all routes to `/index.html`).
5. Build and deploy: `npm run build` then `firebase deploy`.
6. Connect a custom domain (e.g. `homeandstyleimports.com`) via Hosting settings; HTTPS is automatic.
7. Use preview channels (`firebase hosting:channel:deploy preview`) to let the owner review changes before going live.

---

## 12. Security and Privacy

- **Firestore rules:** public read for `products`, `categories`, `settings`; write only for the authenticated owner's UID.
- **Storage rules:** public read for images; owner-only upload; limit file type and size (e.g. images under 2 MB).
- **Auth:** a single owner account with a strong password; enable email verification and password reset.
- **Secrets:** Firebase web config is not secret, but protection comes from the security rules above; enable **Firebase App Check** if abuse appears.
- **Privacy:** the site collects no customer data. Customers share information only inside WhatsApp or calls. Add a short privacy note on the Contact page.

---

## 13. Testing Plan

| Type | What is checked |
| --- | --- |
| Functional | All links, filters, search, WhatsApp/call buttons open correctly with the right number and message |
| Responsive | Phones (small/large), tablet, desktop |
| Cross-browser | Chrome, Safari (iOS), Samsung Internet, Firefox |
| Performance | Lighthouse (mobile), image sizes, lazy loading |
| Accessibility | Keyboard use, contrast, alt text |
| Security | Confirm non-owners cannot write to Firestore/Storage |
| User acceptance | Owner and 3–5 sample customers try the site and give feedback |

---

## 14. SEO and Promotion

- Unique `<title>` and meta description per page; Open Graph image so links look good when shared on WhatsApp and Facebook.
- Clean URLs, `sitemap.xml`, and `robots.txt`.
- Register the shop on Google Business Profile and link to the site.
- Add the site link to WhatsApp Business profile, Instagram, and Facebook bios.
- Print a QR code for the shop counter and packaging.
- Optional: Firebase/Google Analytics to see popular products and enquiry clicks.

---

## 15. Risks and Mitigation

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Owner slow to supply photos/prices | Delays launch | Set content deadline in Discovery; launch with a starter set of 20–30 products |
| Poor image quality or very large files | Slow site | Provide photo guidelines; compress on upload |
| Outdated stock information | Customer frustration | "Out of stock" toggle; "Availability confirmed on enquiry" note |
| Wrong WhatsApp number format | Broken links | Single config value, tested before launch |
| Owner loses admin password | No stock updates | Password reset email; documented recovery steps |
| Free-tier limits exceeded | Unexpected cost | Monitor usage; compress images; upgrade only if needed |
| Scope creep (e.g. adding payments) | Delay | Change-request process; log ideas for a future version |

---

## 16. Maintenance and Future Enhancements

**Ongoing:** update dependencies quarterly, review Firebase usage monthly, back up Firestore data periodically, renew the domain annually.

**Possible future versions:** enquiry list/wishlist, WhatsApp Catalogue sync, customer reviews, promotions and discount banners, multi-language support, installable PWA, simple analytics dashboard for the owner.

---

## 17. Deliverables Checklist

- [ ] Approved requirements and wireframes
- [ ] Source code in a Git repository
- [ ] Live site on Firebase Hosting (with custom domain)
- [ ] Admin dashboard and owner login (Phase 2)
- [ ] Firestore and Storage security rules
- [ ] Short owner user guide (adding products, updating contacts)
- [ ] Handover session and credentials transfer

---

## 18. Information Needed from the Owner

1. Official shop name spelling, logo, and brand colours (if any)
2. WhatsApp number and business phone number(s)
3. Physical address, map location, and opening hours
4. Product categories and at least 20–30 products with photos, descriptions, and prices
5. Whether prices should be displayed or "ask on enquiry"
6. Social media links
7. Preferred domain name
8. Short "About the shop" text

---

## 19. Approval

| Role | Name | Signature | Date |
| --- | --- | --- | --- |
| Project Owner |  |  |  |
| Developer |  |  |  |