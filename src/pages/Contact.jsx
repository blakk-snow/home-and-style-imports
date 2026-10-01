import { Clock, MapPin, MessageCircle, Phone } from "lucide-react";
import { mapsUrl, shop } from "../data/config.js";
import { formatPhone } from "../lib/catalog.js";
import { generalEnquiryMessage, telLink, waLink } from "../lib/whatsapp.js";

function SampleTag() {
  return (
    <span className="rounded-full bg-soft px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-clay">
      Sample
    </span>
  );
}

export default function Contact() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-terracotta">Contact</p>
      <h1 className="mt-2 text-4xl sm:text-5xl">We would rather talk than make you guess</h1>
      <p className="mt-4 text-muted">
        Message, call, or come by during opening hours. This page does not take a form, and the site does not store what you tell us.
      </p>

      <div className="mt-8 space-y-3">
        <div className="flex items-center gap-4 rounded-2xl bg-paper p-4 ring-1 ring-line">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-moss text-whatsapp">
            <MessageCircle className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-2 font-semibold">
              WhatsApp
            </p>
            <p className="text-sm text-muted">{formatPhone(shop.whatsappNumber)}</p>
          </div>
          <a className="btn btn-wa shrink-0 px-4 py-2.5" href={waLink(generalEnquiryMessage())} target="_blank" rel="noopener noreferrer">
            Chat
          </a>
        </div>

      <div className="rounded-2xl bg-paper p-4 ring-1 ring-line">
          <div className="flex items-center gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-soft text-clay">
              <Phone className="size-5" aria-hidden="true" />
            </span>
            <p className="font-semibold">Call the shop</p>
          </div>
          <ul className="mt-3 space-y-2">
            {shop.phoneNumbers.map((number) => (
              <li key={number} className="flex items-center justify-between gap-3">
                <span className="text-sm text-muted">{formatPhone(number)}</span>
                <a className="btn btn-line shrink-0 px-4 py-2.5" href={telLink(number)}>
                  Call
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-start gap-4 rounded-2xl bg-paper p-4 ring-1 ring-line">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-soft text-clay">
            <Clock className="size-5" aria-hidden="true" />
          </span>
          <div>
            <p className="font-semibold">Opening hours</p>
            <ul className="mt-1 text-sm text-muted">
              {shop.openingHours.map((row) => (
                <li key={row.label}>
                  {row.label}: {row.value}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <section id="visit" className="mt-8">
        <h2 className="text-3xl">Visit</h2>
        <p className="mt-2 flex items-center gap-2 text-muted">
          {shop.address.line1}, {shop.address.line2}, {shop.address.region}
        </p>
        <p className="mt-1 text-sm text-muted">{shop.address.note}</p>
        <a
          href={mapsUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="relative mt-4 block overflow-hidden rounded-2xl ring-1 ring-line"
        >
          <span
            className="absolute inset-0"
            style={{
              background:
                "repeating-linear-gradient(45deg, #e7dccd, #e7dccd 12px, #efe6d8 12px, #efe6d8 24px)",
            }}
            aria-hidden="true"
          />
          <span className="relative flex items-center gap-3 p-5">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-paper text-clay shadow">
              <MapPin className="size-5" aria-hidden="true" />
            </span>
            <span>
              <span className="block font-semibold">Open in Maps</span>
              <span className="text-sm text-muted">{shop.mapsQuery}</span>
            </span>
          </span>
        </a>
      </section>

      <section className="mt-10 rounded-2xl bg-soft px-5 py-5 text-sm leading-relaxed text-ink">
        <h2 className="font-sans text-base font-semibold tracking-normal">Privacy</h2>
        <p className="mt-2">
          This website does not take accounts, payments or enquiry forms. If you message or call, that conversation stays in WhatsApp or on the phone. We do not store your details here.
        </p>
      </section>
    </div>
  );
}
