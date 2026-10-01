import { Link } from "react-router-dom";
import { shop } from "../data/config.js";
import { generalEnquiryMessage, waLink } from "../lib/whatsapp.js";

export default function About() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-terracotta">The shop</p>
      <h1 className="mt-2 max-w-3xl text-4xl sm:text-5xl">A small Accra shop, with the catalogue online</h1>
      <div className="mt-8 grid items-start gap-8 lg:grid-cols-2">
        <img
          src="/images/about.jpg"
          alt="Shop counter with tissue paper, a linen shirt and a leather pouch"
          width="1536"
          height="1024"
          className="aspect-[4/3] w-full rounded-[1.75rem] object-cover"
        />
        <div className="space-y-4 text-base leading-relaxed">
          <p>
            {shop.name} sells imported goods for the house, and a few things to wear with them: décor, kitchen pieces, textiles, clothing, bags and jewellery.
          </p>
          <p>
            Customers used to hear about stock by word of mouth, or from a photo in a chat. This site is the single place to look. It is not a till. There is no account, no basket that charges a card, and no mobile-money checkout.
          </p>
          <p>
            If a piece is right, send a WhatsApp or call. We confirm the price, the colour, and whether it is still on the shelf. Then you collect, or we arrange delivery with you directly.
          </p>
        </div>
      </div>

      <section className="mt-12 grid gap-4 md:grid-cols-3" aria-labelledby="notes-heading">
        <h2 id="notes-heading" className="sr-only">
          What to expect
        </h2>
        {[
          ["Guide prices", "The number on a piece is a guide. The price you pay is the one we confirm in the chat."],
          ["Small numbers", "Pieces come in small lots. When one sells, it may not come back in the same colour."],
          ["A person replies", "The WhatsApp button opens a chat with the shop. It is not an automated order form."],
        ].map(([title, copy]) => (
          <div key={title} className="rounded-2xl bg-paper p-5 ring-1 ring-line">
            <h3 className="font-sans text-lg font-semibold tracking-normal">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{copy}</p>
          </div>
        ))}
      </section>

      <section className="mt-12 max-w-3xl">
        <h2 className="text-3xl">What you will not find here</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-muted">
          <li>Online payment, checkout, or order tracking</li>
          <li>Customer accounts</li>
          <li>A delivery tracker — if something needs to travel, we arrange that in the conversation</li>
        </ul>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/shop" className="btn btn-primary">
            Browse the shop
          </Link>
          <a className="btn btn-wa" href={waLink(generalEnquiryMessage())} target="_blank" rel="noopener noreferrer">
            WhatsApp the shop
          </a>
        </div>
      </section>
    </div>
  );
}
