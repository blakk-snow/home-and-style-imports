import { shop, mapsUrl } from "../data/config.js";
import { categories } from "../data/categories.js";
import { products } from "../data/products.js";
import { categoryBySlug, productBySlug, formatPhone } from "./catalog.js";
import { absoluteUrl } from "./url.js";

export function fullTitle(title) {
  return title ? `${title} · ${shop.name}` : shop.name;
}

function localBusiness() {
  return {
    "@context": "https://schema.org",
    "@type": "HomeGoodsStore",
    name: shop.name,
    url: absoluteUrl("/"),
    image: absoluteUrl("/og.jpg"),
    telephone: `+${shop.phoneNumbers[0]}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: shop.address.line2,
      addressRegion: shop.address.region,
      addressCountry: "GH",
    },
    openingHours: shop.schemaHours,
    hasMap: mapsUrl(),
  };
}

function productSchema(product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: absoluteUrl(product.image),
    sku: product.ref,
    brand: { "@type": "Brand", name: shop.name },
    offers: {
      "@type": "Offer",
      priceCurrency: shop.currency,
      price: product.price == null ? undefined : String(product.price),
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: absoluteUrl(`/product/${product.slug}`),
    },
  };
}

function notFound() {
  return {
    title: fullTitle("Page not found"),
    description: "That page is not on the Home & Style Imports catalogue.",
    path: "/404",
    image: "/og.jpg",
    jsonLd: null,
  };
}

export function routeMeta(pathname) {
  const path = (pathname || "/").split("?")[0].replace(/\/$/, "") || "/";

  if (path === "/") {
    return {
      title: shop.name,
      description: shop.description,
      path: "/",
      image: "/og.jpg",
      jsonLd: localBusiness(),
    };
  }
  if (path === "/shop") {
    return {
      title: fullTitle("Shop"),
      description: shop.shopDescription,
      path: "/shop",
      image: "/og.jpg",
      jsonLd: null,
    };
  }
  if (path === "/about") {
    return {
      title: fullTitle("About"),
      description: shop.aboutDescription,
      path: "/about",
      image: "/images/about.jpg",
      jsonLd: null,
    };
  }
  if (path === "/contact" || path === "/visit") {
    return {
      title: fullTitle("Contact"),
      description: shop.contactDescription,
      path: path === "/visit" ? "/visit" : "/contact",
      image: "/og.jpg",
      jsonLd: localBusiness(),
    };
  }
  if (path.startsWith("/product/")) {
    const product = productBySlug(products, decodeURIComponent(path.slice("/product/".length)));
    if (!product) return notFound();
    return {
      title: fullTitle(product.name),
      description: product.description,
      path: `/product/${product.slug}`,
      image: product.image,
      jsonLd: productSchema(product),
    };
  }
  if (path.startsWith("/category/")) {
    const category = categoryBySlug(
      categories,
      decodeURIComponent(path.slice("/category/".length)),
    );
    if (!category) return notFound();
    const cover = products.find((item) => item.category === category.slug)?.image || "/og.jpg";
    return {
      title: fullTitle(category.name),
      description: category.blurb,
      path: `/category/${category.slug}`,
      image: cover,
      jsonLd: null,
    };
  }
  return notFound();
}

export function indexablePaths() {
  return [
    "/",
    "/shop",
    "/about",
    "/contact",
    ...categories.map((category) => `/category/${category.slug}`),
    ...products.map((product) => `/product/${product.slug}`),
  ];
}

export { formatPhone };
