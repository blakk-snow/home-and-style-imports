import { shop } from "../data/config.js";

export function formatPrice(amount) {
  if (amount == null || amount === "") return "Ask for price";
  const value = Number(amount);
  if (Number.isNaN(value)) return "Ask for price";
  const formatted = new Intl.NumberFormat("en-GH", {
    maximumFractionDigits: 0,
  }).format(value);
  return `${shop.currencyLabel} ${formatted}`;
}

export function formatPhone(internationalDigits) {
  const digits = String(internationalDigits).replace(/\D/g, "");
  if (digits.startsWith("233") && digits.length === 12) {
    return `+233 ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
  }
  return `+${digits}`;
}

export function categoryBySlug(categories, slug) {
  return categories.find((category) => category.slug === slug) || null;
}

export function productBySlug(products, slug) {
  return products.find((product) => product.slug === slug) || null;
}

export function productsInCategory(products, slug) {
  return products.filter((product) => product.category === slug);
}

export function categoryName(categories, slug) {
  return categoryBySlug(categories, slug)?.name || slug;
}

export function searchProducts(
  products,
  categories,
  { query = "", category = "", inStockOnly = false, sort = "newest" } = {},
) {
  const needle = query.trim().toLowerCase();

  const list = products.filter((product) => {
    if (category && product.category !== category) return false;
    if (inStockOnly && !product.inStock) return false;
    if (!needle) return true;
    const haystack = [
      product.name,
      product.description,
      product.ref,
      product.id,
      categoryName(categories, product.category),
      ...(product.colours || []).map((colour) => colour.name),
      ...(product.sizes || []),
      ...(product.details || []).map((detail) => `${detail.label} ${detail.value}`),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(needle);
  });

  const byName = (a, b) => a.name.localeCompare(b.name, "en");
  return [...list].sort((a, b) => {
    if (sort === "price-asc") {
      return (a.price ?? Infinity) - (b.price ?? Infinity) || byName(a, b);
    }
    if (sort === "price-desc") {
      return (b.price ?? -Infinity) - (a.price ?? -Infinity) || byName(a, b);
    }
    if (sort === "name") return byName(a, b);
    return String(b.createdAt).localeCompare(String(a.createdAt)) || byName(a, b);
  });
}

export function relatedProducts(products, product, limit = 3) {
  const others = products.filter((item) => item.id !== product.id);
  const same = others.filter((item) => item.category === product.category);
  const rest = others.filter((item) => item.category !== product.category);
  return [...same, ...rest].slice(0, limit);
}

export function enquiryKey(product, colour, size) {
  return [product.id, colour || "", size || ""].join("|");
}
