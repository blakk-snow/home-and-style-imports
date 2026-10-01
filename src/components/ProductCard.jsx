import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { categoryBySlug, formatPrice } from "../lib/catalog.js";
import { productEnquiryMessage, waLink } from "../lib/whatsapp.js";
import { useProducts } from "../hooks/useProducts.js";

export default function ProductCard({ product, priority = false }) {
  const { categories } = useProducts();
  const category = categoryBySlug(categories, product.category);

  return (
    <article className="group relative">
      <Link to={`/product/${product.slug}`} className="block">
        <div className="relative overflow-hidden rounded-2xl bg-soft ring-1 ring-line">
          <img
            src={product.image}
            alt={product.alt || product.name}
            width="1254"
            height="1254"
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
          {product.isNew && product.inStock ? (
            <span className="absolute left-2.5 top-2.5 rounded-full bg-paper px-2.5 py-1 text-[11px] font-bold text-clay">
              New
            </span>
          ) : null}
          {!product.inStock ? (
            <span className="absolute left-2.5 top-2.5 rounded-full bg-ink px-2.5 py-1 text-[11px] font-bold text-paper">
              Out of stock
            </span>
          ) : null}
        </div>
        <div className="px-0.5 pt-3 pr-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
            {category?.short || "Shop"}
          </p>
          <h3 className="mt-1 font-sans text-[0.98rem] font-semibold leading-snug tracking-normal text-ink">
            {product.name}
          </h3>
          <p className="mt-1 text-sm font-bold text-clay">{formatPrice(product.price)}</p>
        </div>
      </Link>
      <a
        href={waLink(productEnquiryMessage(product))}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Enquire about ${product.name} on WhatsApp`}
        className="absolute bottom-0 right-0 grid h-9 w-9 place-items-center rounded-full bg-whatsapp text-white shadow-sm"
      >
        <MessageCircle className="size-4" aria-hidden="true" />
      </a>
    </article>
  );
}
