import { useMemo } from "react";
import { products } from "../data/products.js";
import { categories } from "../data/categories.js";
import { productsInCategory, searchProducts } from "../lib/catalog.js";

export function useProducts() {
  return useMemo(
    () => ({
      products,
      categories,
      stockedCategories: categories.filter(
        (category) => productsInCategory(products, category.slug).length > 0,
      ),
      enquireCategories: categories.filter(
        (category) => productsInCategory(products, category.slug).length === 0,
      ),
    }),
    [],
  );
}

export function useFilteredProducts({ query, category, inStockOnly, sort }) {
  const { products, categories } = useProducts();
  return useMemo(
    () => searchProducts(products, categories, { query, category, inStockOnly, sort }),
    [products, categories, query, category, inStockOnly, sort],
  );
}
