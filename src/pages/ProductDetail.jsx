import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronLeft, Heart, MessageCircle, Phone, Share2 } from "lucide-react";
import { shop } from "../data/config.js";
import {
  categoryBySlug,
  enquiryKey,
  formatPrice,
  productBySlug,
  relatedProducts,
} from "../lib/catalog.js";
import { absoluteUrl } from "../lib/url.js";
import { productEnquiryMessage, telLink, waLink } from "../lib/whatsapp.js";
import { useProducts } from "../hooks/useProducts.js";
import { useEnquiry } from "../components/EnquiryProvider.jsx";
import ProductCard from "../components/ProductCard.jsx";
import NotFound from "./NotFound.jsx";

export default function ProductDetail() {
  const { slug } = useParams();
  const { products, categories } = useProducts();
  const product = productBySlug(products, slug);
  const enquiry = useEnquiry();
  const [colour, setColour] = useState("");
  const [size, setSize] = useState("");
  const [shareNote, setShareNote] = useState("");

  useEffect(() => {
    setColour("");
    setSize("");
    setShareNote("");
  }, [slug]);

  if (!product) return <NotFound />;

  const category = categoryBySlug(categories, product.category);
  const key = enquiryKey(product, colour, size);
  const saved = enquiry.has(key);
  const related = relatedProducts(products, product, 3);
  const message = productEnquiryMessage(product, { colour, size });

  async function share() {
    const url = absoluteUrl(`/product/${product.slug}`);
    const payload = { title: product.name, text: `${product.name} from ${shop.name}`, url };
    try {
      if (navigator.share) {
        await navigator.share(payload);
        return;
      }
      await navigator.clipboard.writeText(url);
      setShareNote("Link copied");
      window.setTimeout(() => setShareNote(""), 2000);
    } catch (error) {
      if (error?.name === "AbortError") return;
      setShareNote("Could not share");
    }
  }

  function toggleSave() {
    if (saved) {
      enquiry.remove(key);
      return;
    }
    enquiry.add({
      key,
      productId: product.id,
      slug: product.slug,
      name: product.name,
      ref: product.ref,
      price: product.price,
      image: product.image,
      colour: colour || "",
      size: size || "",
    });
  }

  const actions = (
    <>
      <a className="btn btn-wa flex-[1.5]" href={waLink(message)} target="_blank" rel="noopener noreferrer">
        <MessageCircle className="size-4" aria-hidden="true" />
        Enquire on WhatsApp
      </a>
      <a className="btn btn-line flex-1" href={telLink()}>
        <Phone className="size-4" aria-hidden="true" />
        Call
      </a>
    </>
  );

  return (
    <article>
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-6 sm:px-6 lg:grid-cols-2 lg:py-10">
        <div className="relative">
          <img
            src={product.image}
            alt={product.alt || product.name}
            width="1254"
            height="1254"
            fetchPriority="high"
            className="aspect-[4/5] w-full rounded-[1.75rem] object-cover"
          />
          <Link
            to={category ? `/category/${category.slug}` : "/shop"}
            className="absolute left-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-paper/95 text-ink shadow"
            aria-label={category ? `Back to ${category.name}` : "Back to shop"}
          >
            <ChevronLeft className="size-5" aria-hidden="true" />
          </Link>
          <button
            type="button"
            className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-paper/95 text-ink shadow"
            aria-pressed={saved}
            aria-label={saved ? `Remove ${product.name} from enquiry list` : `Save ${product.name} to enquiry list`}
            onClick={toggleSave}
          >
            <Heart className={`size-5 ${saved ? "fill-clay text-clay" : ""}`} aria-hidden="true" />
          </button>
        </div>

        <div className="lg:py-4">
          <nav className="text-sm text-muted" aria-label="Breadcrumb">
            <Link to="/shop" className="hover:text-clay">
              Shop
            </Link>
            {category ? (
              <>
                <span aria-hidden="true"> / </span>
                <Link to={`/category/${category.slug}`} className="hover:text-clay">
                  {category.name}
                </Link>
              </>
            ) : null}
          </nav>
          <h1 className="mt-3 text-4xl sm:text-5xl">{product.name}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <p className="text-2xl font-bold text-clay">{formatPrice(product.price)}</p>
            {product.inStock ? (
              <span className="inline-flex items-center rounded-full bg-moss px-2.5 py-1 text-xs font-bold text-whatsapp">
                In stock
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-ink px-2.5 py-1 text-xs font-bold text-paper">
                Out of stock
              </span>
            )}
          </div>
          <p className="mt-2 text-sm text-muted">Guide price. Confirmed when you enquire.</p>
          {!product.inStock ? (
            <p className="mt-2 text-sm text-muted">
              Out of stock right now. Message us to ask when the next one arrives.
            </p>
          ) : null}

          <p className="mt-5 leading-relaxed text-ink/90">{product.description}</p>

          {product.details?.length ? (
            <dl className="mt-6 divide-y divide-line border-y border-line">
              {product.details.map((detail) => (
                <div key={detail.label} className="grid grid-cols-3 gap-3 py-3 text-sm">
                  <dt className="font-semibold text-muted">{detail.label}</dt>
                  <dd className="col-span-2">{detail.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}

          {product.selectableColours && product.colours?.length > 1 ? (
            <fieldset className="mt-6">
              <legend className="text-sm font-semibold">Colour</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.colours.map((item) => {
                  const selected = colour === item.name;
                  return (
                    <button
                      key={item.name}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setColour(selected ? "" : item.name)}
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold ring-1 ${
                        selected ? "bg-clay text-white ring-clay" : "bg-card ring-line"
                      }`}
                    >
                      <span
                        className="h-3.5 w-3.5 rounded-full ring-1 ring-black/10"
                        style={{ background: item.hex }}
                        aria-hidden="true"
                      />
                      {item.name}
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-xs text-muted">Optional. If you pick one, it goes in the WhatsApp message.</p>
            </fieldset>
          ) : null}

          {product.sizes?.length > 1 ? (
            <fieldset className="mt-5">
              <legend className="text-sm font-semibold">Size</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.sizes.map((item) => {
                  const selected = size === item;
                  return (
                    <button
                      key={item}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setSize(selected ? "" : item)}
                      className={`rounded-full px-3 py-1.5 text-sm font-semibold ring-1 ${
                        selected ? "bg-clay text-white ring-clay" : "bg-card ring-line"
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          ) : product.sizes?.length === 1 ? (
            <p className="mt-5 text-sm">
              <span className="font-semibold">Size. </span>
              {product.sizes[0]}
            </p>
          ) : null}

          <p className="mt-5 text-sm text-muted">Ref {product.ref}</p>

          <div className="mt-6 hidden gap-3 lg:flex">{actions}</div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" className="btn btn-line" aria-pressed={saved} onClick={toggleSave}>
              <Heart className={`size-4 ${saved ? "fill-clay" : ""}`} aria-hidden="true" />
              {saved ? "Saved" : "Save to enquiry list"}
            </button>
            <button type="button" className="btn btn-line" onClick={share}>
              <Share2 className="size-4" aria-hidden="true" />
              Share
            </button>
            {shareNote ? (
              <span role="status" className="self-center text-sm text-muted">
                {shareNote}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {related.length > 0 ? (
        <section className="mx-auto max-w-6xl px-4 pb-8 sm:px-6" aria-labelledby="related-heading">
          <h2 id="related-heading" className="mb-6 text-3xl">
            Also in the selection
          </h2>
          <ul className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-x-5">
            {related.map((item) => (
              <li key={item.id}>
                <ProductCard product={item} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div
        className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-line bg-paper/95 p-3 backdrop-blur lg:hidden"
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        <a className="btn btn-wa min-w-0 flex-[1.6] px-3 text-sm" href={waLink(message)} target="_blank" rel="noopener noreferrer">
          <MessageCircle className="size-4 shrink-0" aria-hidden="true" />
          <span className="truncate">Enquire on WhatsApp</span>
        </a>
        <a className="btn btn-line shrink-0 px-4" href={telLink()}>
          <Phone className="size-4" aria-hidden="true" />
          Call
        </a>
      </div>
    </article>
  );
}
