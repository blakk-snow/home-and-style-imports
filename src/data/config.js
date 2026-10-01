/**
 * Shop-wide settings. Replace the sample phone, address and site URL before launch.
 * WhatsApp number: international digits only, no plus sign and no spaces.
 */
const envUrl = import.meta.env?.VITE_SITE_URL;

export const shop = {
  name: "Home & Style Imports",
  shortName: "Home & Style",
  tagline: "Imported décor, clothing and accessories",
  description:
    "Browse imported décor, kitchen pieces and textiles from Home & Style Imports in Accra. Enquire on WhatsApp — there is no online checkout.",
  shopDescription:
    "All pieces currently in the online catalogue. Guide prices in cedis, confirmed when you enquire.",
  aboutDescription:
    "Home & Style Imports is a small Accra shop. This site is a catalogue — message or call to buy. No accounts and no online payment.",
  contactDescription:
    "Message Home & Style Imports on WhatsApp, call the shop, or visit during opening hours. The site does not take payments.",
  siteUrl: (envUrl || "https://homeandstyleimports.com").replace(/\/$/, ""),
  whatsappNumber: "233200000000",
  phoneNumbers: ["233200000000"],
  currency: "GHS",
  currencyLabel: "GH₵",
  address: {
    line1: "Osu",
    line2: "Accra",
    region: "Greater Accra",
    country: "Ghana",
    note: "Street address is shared when you enquire.",
  },
  mapsQuery: "Osu, Accra, Ghana",
  openingHours: [
    { label: "Monday – Saturday", value: "8:30am – 7:00pm" },
    { label: "Sunday", value: "Closed" },
  ],
  hoursSummary: "Mon–Sat 8:30am – 7pm · Sun closed",
  schemaHours: "Mo-Sa 08:30-19:00",
  sampleData: true,
};

export function mapsUrl() {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shop.mapsQuery)}`;
}
