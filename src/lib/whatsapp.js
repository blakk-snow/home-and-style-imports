import { shop } from "../data/config.js";

export function waLink(message, number = shop.whatsappNumber) {
  const digits = String(number).replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function telLink(number = shop.phoneNumbers[0]) {
  const digits = String(number).replace(/\D/g, "");
  return `tel:+${digits}`;
}

export function generalEnquiryMessage() {
  return `Hello ${shop.name}, I'd like to ask about your products.`;
}

export function categoryEnquiryMessage(categoryName) {
  return `Hello ${shop.name}, I'd like to know what you have in ${categoryName} at the moment.`;
}

export function productEnquiryMessage(product, { colour, size } = {}) {
  const detail = [colour, size].filter(Boolean).join(", ");
  const extra = detail ? ` (${detail})` : "";
  return `Hello ${shop.name}, I'm interested in ${product.name}${extra} (ref: ${product.ref}). Is it available?`;
}

export function listEnquiryMessage(items) {
  const lines = items.map((item) => {
    const detail = [item.colour, item.size].filter(Boolean).join(", ");
    const extra = detail ? ` — ${detail}` : "";
    return `• ${item.name}${extra} (ref: ${item.ref})`;
  });
  return `Hello ${shop.name}, I'd like to enquire about:\n${lines.join("\n")}\nAre these available?`;
}
