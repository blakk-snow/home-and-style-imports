import test from "node:test";
import assert from "node:assert/strict";
import {
  formatPrice,
  formatPhone,
  searchProducts,
  relatedProducts,
  enquiryKey,
} from "./catalog.js";

const categories = [
  { slug: "home-decor", name: "Home Décor" },
  { slug: "kitchen-dining", name: "Kitchen & Dining" },
];

const products = [
  {
    id: "a",
    ref: "HS-1",
    slug: "vase",
    name: "Ceramic Vase",
    description: "Sage glaze",
    category: "home-decor",
    price: 180,
    inStock: true,
    colours: [{ name: "Sage" }],
    sizes: [],
    details: [],
    createdAt: "2026-09-01",
  },
  {
    id: "b",
    ref: "HS-2",
    slug: "board",
    name: "Olive Board",
    description: "Serving board",
    category: "kitchen-dining",
    price: 90,
    inStock: true,
    colours: [],
    sizes: [],
    details: [],
    createdAt: "2026-09-20",
  },
  {
    id: "c",
    ref: "HS-3",
    slug: "throw",
    name: "Wool Throw",
    description: "Out of stock blanket",
    category: "home-decor",
    price: null,
    inStock: false,
    colours: [],
    sizes: [],
    details: [],
    createdAt: "2026-07-01",
  },
];

test("formatPrice uses cedis and skips empty prices", () => {
  assert.equal(formatPrice(180), "GH₵ 180");
  assert.equal(formatPrice(1500), "GH₵ 1,500");
  assert.equal(formatPrice(null), "Ask for price");
  assert.equal(formatPrice(""), "Ask for price");
});

test("formatPhone groups a Ghana number", () => {
  assert.equal(formatPhone("233200000000"), "+233 20 000 0000");
  assert.equal(formatPhone("+233200000000"), "+233 20 000 0000");
});

test("search matches name, category and ref, and can hide out-of-stock", () => {
  const byName = searchProducts(products, categories, { query: "olive" });
  assert.deepEqual(byName.map((item) => item.id), ["b"]);

  const byCategory = searchProducts(products, categories, { query: "décor" });
  assert.deepEqual(
    byCategory.map((item) => item.id),
    ["a", "c"],
  );

  const inStock = searchProducts(products, categories, {
    category: "home-decor",
    inStockOnly: true,
  });
  assert.deepEqual(inStock.map((item) => item.id), ["a"]);
});

test("sort orders price with missing prices last on low-to-high", () => {
  const sorted = searchProducts(products, categories, { sort: "price-asc" });
  assert.deepEqual(sorted.map((item) => item.id), ["b", "a", "c"]);

  const newest = searchProducts(products, categories, { sort: "newest" });
  assert.equal(newest[0].id, "b");
});

test("related products prefer the same category", () => {
  const related = relatedProducts(products, products[0], 2);
  assert.equal(related[0].id, "c");
  assert.equal(related.length, 2);
});

test("enquiry key includes colour and size", () => {
  assert.equal(enquiryKey(products[0], "Sage", ""), "a|Sage|");
  assert.notEqual(enquiryKey(products[0], "Sage"), enquiryKey(products[0], "Sand"));
});
