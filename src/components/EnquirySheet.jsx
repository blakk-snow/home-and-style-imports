import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { useEnquiry } from "./EnquiryProvider.jsx";
import { formatPrice } from "../lib/catalog.js";
import { listEnquiryMessage, waLink } from "../lib/whatsapp.js";

export default function EnquirySheet() {
  const { items, open, setOpen, remove, clear } = useEnquiry();
  const closeRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    closeRef.current?.focus();
    const onKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-ink/40"
        aria-label="Close enquiry list"
        onClick={() => setOpen(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="enquiry-title"
        className="relative flex max-h-[85dvh] w-full max-w-md flex-col rounded-t-3xl bg-paper shadow-lift sm:rounded-3xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div>
            <h2 id="enquiry-title" className="font-serif text-2xl">
              Enquiry list
            </h2>
            <p className="mt-1 text-sm text-muted">Saved on this phone. Nothing is reserved until we reply.</p>
          </div>
          <button ref={closeRef} type="button" className="icon-btn" aria-label="Close" onClick={() => setOpen(false)}>
            <X className="size-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <p className="text-muted">Nothing saved yet. Add a piece, then send them together.</p>
            <Link to="/shop" className="btn btn-primary mt-5" onClick={() => setOpen(false)}>
              Browse the shop
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
              {items.map((item) => (
                <li key={item.key} className="flex gap-3 rounded-2xl border border-line bg-card p-2.5">
                  <img src={item.image} alt="" width="64" height="80" className="h-20 w-16 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold leading-snug">{item.name}</p>
                    <p className="text-sm text-muted">
                      {item.ref}
                      {item.colour ? ` · ${item.colour}` : ""}
                      {item.size ? ` · ${item.size}` : ""}
                    </p>
                    <p className="text-sm font-bold text-clay">{formatPrice(item.price)}</p>
                  </div>
                  <button
                    type="button"
                    className="self-start text-sm font-semibold text-muted"
                    onClick={() => remove(item.key)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-2 border-t border-line px-5 py-4">
              <a
                className="btn btn-wa w-full"
                href={waLink(listEnquiryMessage(items))}
                target="_blank"
                rel="noopener noreferrer"
              >
                Send {items.length} on WhatsApp
              </a>
              <button type="button" className="py-2 text-sm font-semibold text-muted" onClick={clear}>
                Clear list
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
