import { useEffect, useMemo, useRef } from "react";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { categoryBySlug } from "../lib/catalog.js";
import { categoryEnquiryMessage, waLink } from "../lib/whatsapp.js";
import { useFilteredProducts, useProducts } from "../hooks/useProducts.js";
import ProductCard from "../components/ProductCard.jsx";
import NotFound from "./NotFound.jsx";

const sorts = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name", label: "Name" },
];

export default function Shop() {
  const { slug } = useParams();
  const { categories, stockedCategories, products } = useProducts();
  const category = slug ? categoryBySlug(categories, slug) : null;
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);

  const query = searchParams.get("q") || "";
  const sort = searchParams.get("sort") || "newest";
  const inStockOnly = searchParams.get("stock") === "1";

  const results = useFilteredProducts({
    query,
    category: category?.slug || "",
    inStockOnly,
    sort,
  });

  useEffect(() => {
    if (location.state?.focusSearch) searchRef.current?.focus();
  }, [location.state]);

  const countLabel = useMemo(() => {
    const noun = results.length === 1 ? "piece" : "pieces";
    return `${results.length} ${noun}`;
  }, [results.length]);

  if (slug && !category) return <NotFound />;

  function updateParams(next) {
    const params = new URLSearchParams(searchParams);
    Object.entries(next).forEach(([key, value]) => {
      if (!value) params.delete(key);
      else params.set(key, value);
    });
    setSearchParams(params, { replace: true });
  }

  function goToCategory(nextSlug) {
    const params = new URLSearchParams(searchParams);
    const search = params.toString();
    navigate(`${nextSlug ? `/category/${nextSlug}` : "/shop"}${search ? `?${search}` : ""}`);
  }

  const inThisCategory = category
    ? products.filter((product) => product.category === category.slug).length
    : products.length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-terracotta">Catalogue</p>
      <h1 className="mt-2 text-4xl sm:text-5xl">{category ? category.name : "All products"}</h1>
      <p className="mt-3 max-w-xl text-muted">
        {category ? category.blurb : "Guide prices in cedis. Availability is confirmed when you enquire."}{" "}
        <span className="text-ink">{countLabel}</span>
        {query || inStockOnly ? " in this view." : "."}
      </p>

      <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center">
        <form
          role="search"
          className="relative flex-1"
          onSubmit={(event) => event.preventDefault()}
        >
          <label htmlFor="shop-search" className="sr-only">
            Search products
          </label>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input
            ref={searchRef}
            id="shop-search"
            className="field"
            type="search"
            placeholder="Search by name, material or ref"
            value={query}
            onChange={(event) => updateParams({ q: event.target.value })}
          />
        </form>
        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor="sort" className="sr-only">
            Sort
          </label>
          <select
            id="sort"
            className="select"
            value={sort}
            onChange={(event) => updateParams({ sort: event.target.value === "newest" ? "" : event.target.value })}
          >
            {sorts.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            role="switch"
            aria-checked={inStockOnly}
            onClick={() => updateParams({ stock: inStockOnly ? "" : "1" })}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-card py-1.5 pl-1.5 pr-3 text-sm font-semibold"
          >
            <span
              className={`grid h-6 w-10 place-items-start rounded-full p-0.5 ${inStockOnly ? "bg-whatsapp" : "bg-line"}`}
            >
              <span
                className={`h-5 w-5 rounded-full bg-white shadow ${inStockOnly ? "translate-x-4" : "translate-x-0"}`}
              />
            </span>
            In stock only
          </button>
        </div>
      </div>

      <nav className="scroller -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0" aria-label="Categories">
        <button
          type="button"
          aria-current={!category ? "true" : undefined}
          onClick={() => goToCategory("")}
          className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold ${
            !category ? "bg-clay text-white" : "bg-card text-ink ring-1 ring-line"
          }`}
        >
          All
        </button>
        {stockedCategories.map((item) => (
          <button
            key={item.slug}
            type="button"
            aria-current={category?.slug === item.slug ? "true" : undefined}
            onClick={() => goToCategory(item.slug)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold ${
              category?.slug === item.slug ? "bg-clay text-white" : "bg-card text-ink ring-1 ring-line"
            }`}
          >
            {item.short}
          </button>
        ))}
      </nav>

      {inThisCategory === 0 ? (
        <div className="mt-10 rounded-[1.75rem] bg-paper px-6 py-10 text-center ring-1 ring-line">
          <h2 className="text-3xl">{category.name} is not in the online selection yet</h2>
          <p className="mx-auto mt-3 max-w-md text-muted">
            Message us and we will tell you what is in the shop this week. Nothing is held until we reply.
          </p>
          <a
            className="btn btn-wa mt-6"
            href={waLink(categoryEnquiryMessage(category.name))}
            target="_blank"
            rel="noopener noreferrer"
          >
            Ask about {category.short}
          </a>
        </div>
      ) : results.length === 0 ? (
        <div className="mt-10 rounded-[1.75rem] bg-paper px-6 py-10 text-center ring-1 ring-line">
          <h2 className="text-3xl">Nothing matches</h2>
          <p className="mt-3 text-muted">
            {query ? `No pieces for “${query}”.` : "Nothing in stock with these filters."} Try another word, or ask us directly.
          </p>
          <button
            type="button"
            className="btn btn-line mt-6"
            onClick={() => {
              const params = new URLSearchParams();
              setSearchParams(params, { replace: true });
            }}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <ul className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-x-5 lg:grid-cols-4">
          {results.map((product, index) => (
            <li key={product.id}>
              <ProductCard product={product} priority={index < 2} />
            </li>
          ))}
        </ul>
      )}

      <p className="mt-10 text-sm text-muted">
        Looking for clothing, bags or jewellery?{" "}
        <Link to="/" className="font-semibold text-clay">
          Ask from the home page
        </Link>
        , or message us with the piece you have in mind.
      </p>
    </div>
  );
}
