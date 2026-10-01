import { Link } from "react-router-dom";
import { MessageCircle, Phone, MapPin } from "lucide-react";
import { shop } from "../data/config.js";
import { formatPhone } from "../lib/catalog.js";
import { categoryEnquiryMessage, generalEnquiryMessage, telLink, waLink } from "../lib/whatsapp.js";
import { useProducts } from "../hooks/useProducts.js";
import ProductCard from "../components/ProductCard.jsx";

export default function Home() {
  const { products, stockedCategories, enquireCategories } = useProducts();
  const arrivals = products
    .filter((product) => product.isNew)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const arrivalIds = new Set(arrivals.map((product) => product.id));
  const rest = products
    .filter((product) => !arrivalIds.has(product.id))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-6 overflow-x-clip px-4 pb-4 pt-6 sm:px-6 lg:grid-cols-12 lg:gap-0 lg:pt-10">
        <div className="lg:col-span-7">
          <div className="overflow-hidden rounded-[1.75rem] bg-soft">
            <img
              src="/images/hero.jpg"
              alt="Oak shelves in the shop, with a sage vase, folded linen and a woven basket"
              width="1254"
              height="1254"
              fetchPriority="high"
              className="aspect-[4/5] w-full object-cover object-[68%_center] sm:aspect-[5/4] lg:aspect-[4/5] lg:max-h-[680px]"
            />
          </div>
        </div>
        <div className="relative z-10 lg:col-span-5 lg:-ml-16 lg:mt-16">
          <div className="rounded-[1.75rem] bg-paper p-6 shadow-lift ring-1 ring-line/80 sm:p-8 lg:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-terracotta">Accra · imported goods</p>
            <h1 className="mt-3 text-[2.4rem] text-ink sm:text-5xl">
              Beautiful finds for your home <span className="italic text-clay">& wardrobe</span>
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted">
              Look through the selection, then enquire on WhatsApp. We confirm the price and whether it is still in stock. There is no checkout on this site.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link to="/shop" className="btn btn-primary">
                Browse the shop
              </Link>
              <a
                href={waLink(generalEnquiryMessage())}
                className="btn btn-wa"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="size-4" aria-hidden="true" />
                WhatsApp us
              </a>
            </div>
            <p className="mt-5 text-sm text-muted">{shop.hoursSummary}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6" aria-labelledby="categories-heading">
        <div className="mb-5 flex items-end justify-between gap-4">
          <h2 id="categories-heading" className="text-3xl">
            Shop by category
          </h2>
          <Link to="/shop" className="shrink-0 text-sm font-bold text-clay">
            See all
          </Link>
        </div>
        <ul className="scroller -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6">
          {stockedCategories.map((category) => (
            <li key={category.slug} className="w-28 shrink-0 snap-start">
              <Link to={`/category/${category.slug}`} className="block text-center">
                <span className="mx-auto block aspect-square overflow-hidden rounded-full bg-soft ring-1 ring-line">
                  <img
                    src={category.image}
                    alt=""
                    width="200"
                    height="200"
                    className="h-full w-full object-cover"
                  />
                </span>
                <span className="mt-2 block text-sm font-semibold">{category.short}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-4 sm:px-6" aria-labelledby="new-heading">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 id="new-heading" className="text-3xl">
              New arrivals
            </h2>
            <p className="mt-1 text-sm text-muted">Just in. Guide prices, confirmed when you enquire.</p>
          </div>
          <Link to="/shop?sort=newest" className="shrink-0 text-sm font-bold text-clay">
            See all
          </Link>
        </div>
        <ul className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-4 md:gap-x-5">
          {arrivals.map((product, index) => (
            <li key={product.id}>
              <ProductCard product={product} priority={index < 2} />
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:py-16">
        <img
          src="/images/about.jpg"
          alt="A linen shirt and a leather pouch being wrapped at the counter"
          width="1536"
          height="1024"
          loading="lazy"
          className="aspect-[4/3] w-full rounded-[1.75rem] object-cover"
        />
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-terracotta">How the shop works</p>
          <h2 className="mt-2 text-4xl">A catalogue, not a checkout</h2>
          <p className="mt-4 leading-relaxed text-muted">
            Home & Style Imports is a small shop in Accra. We would rather show you what is on the shelf, then talk, than pretend a website can close the sale.
          </p>
          <ol className="mt-6 space-y-4">
            {[
              ["Browse", "Photos, guide prices, and a clear in-stock or out-of-stock mark."],
              ["Enquire", "WhatsApp or a phone call. Name the piece — the ref is already in the message."],
              ["Confirm", "We reply with availability. You collect, or we arrange delivery offline."],
            ].map(([title, copy], index) => (
              <li key={title} className="flex gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-soft font-serif text-clay">
                  {index + 1}
                </span>
                <span>
                  <span className="block font-semibold">{title}</span>
                  <span className="text-sm text-muted">{copy}</span>
                </span>
              </li>
            ))}
          </ol>
          <Link to="/about" className="mt-6 inline-block text-sm font-bold text-clay">
            About the shop
          </Link>
        </div>
      </section>

      {rest.length > 0 ? (
        <section className="mx-auto max-w-6xl px-4 py-4 sm:px-6" aria-labelledby="rest-heading">
          <h2 id="rest-heading" className="mb-6 text-3xl">
            Also on the shelf
          </h2>
          <ul className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-4 md:gap-x-5">
            {rest.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="rounded-[1.75rem] bg-soft px-6 py-8 sm:px-10">
          <h2 className="text-3xl">Not everything is online</h2>
          <p className="mt-3 max-w-2xl text-muted">
            {enquireCategories.map((category) => category.name).join(", ")} are in the shop as well. Stock moves weekly, and not every piece is photographed yet.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {enquireCategories.map((category) => (
              <a
                key={category.slug}
                href={waLink(categoryEnquiryMessage(category.name))}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-paper px-3 py-2 text-sm font-semibold text-clay ring-1 ring-line"
              >
                Ask about {category.short}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-3 px-4 pb-14 sm:px-6 md:grid-cols-3" aria-label="Contact the shop">
        <a
          href={waLink(generalEnquiryMessage())}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-2xl bg-ink p-5 text-paper"
        >
          <MessageCircle className="size-5 text-[#8fd7a8]" aria-hidden="true" />
          <span className="mt-4 block font-serif text-2xl">WhatsApp</span>
          <span className="mt-1 block text-sm text-[#e6d9cc]">{formatPhone(shop.whatsappNumber)}</span>
        </a>


        <div className="rounded-2xl bg-paper p-5 ring-1 ring-line">
          <Phone className="size-5 text-clay" aria-hidden="true" />
          <span className="mt-4 block font-serif text-2xl">Call</span>
          <ul className="mt-2 space-y-1 text-sm">
            {shop.phoneNumbers.map((number) => (
              <li key={number}>
                <a className="text-muted hover:text-clay" href={telLink(number)}>
                  {formatPhone(number)}
                </a>
              </li>
            ))}
          </ul>
        </div>


        <Link to="/contact#visit" className="rounded-2xl bg-paper p-5 ring-1 ring-line">
          <MapPin className="size-5 text-clay" aria-hidden="true" />
          <span className="mt-4 block font-serif text-2xl">Visit</span>
          <span className="mt-1 block text-sm text-muted">
            {shop.address.line1}, {shop.address.line2}
          </span>
        </Link>
      </section>
    </>
  );
}
