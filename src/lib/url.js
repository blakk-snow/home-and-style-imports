import { shop } from "../data/config.js";

export function absoluteUrl(path = "/") {
  const base = String(shop.siteUrl).replace(/\/$/, "");
  if (!path) return base;
  if (/^https?:\/\//.test(path)) return path;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
