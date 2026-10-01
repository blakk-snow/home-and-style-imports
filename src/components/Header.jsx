import { useEffect, useId, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Heart, Menu, Search, X } from "lucide-react";
import { shop } from "../data/config.js";
import { useEnquiry } from "./EnquiryProvider.jsx";
import { useProducts } from "../hooks/useProducts.js";

const desktopLink =
  "text-sm font-semibold text-ink hover:text-clay aria-[current=page]:text-clay";

export default function Header() {
  const { items, setOpen } = useEnquiry();
  const { stockedCategories } = useProducts();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-cream/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-2 px-4 sm:px-6">
        <Link to="/" className="min-w-0 leading-none text-clay">
          <span className="block truncate font-serif text-[1.05rem] font-semibold tracking-tight sm:text-lg">
            {shop.shortName}
          </span>
          <span className="mt-1 block font-sans text-[9px] font-semibold tracking-[0.18em] text-muted">
            IMPORTS
          </span>
        </Link>

        <nav className="ml-8 hidden items-center gap-6 md:flex" aria-label="Primary">
          <NavLink to="/shop" className={desktopLink}>
            Shop
          </NavLink>
          <NavLink to="/about" className={desktopLink}>
            About
          </NavLink>
          <NavLink to="/contact" className={desktopLink}>
            Contact
          </NavLink>
        </nav>

        <div className="ml-auto flex items-center">
          <Link
            to="/shop"
            state={{ focusSearch: true }}
            className="icon-btn"
            aria-label="Search products"
          >
            <Search className="size-5" aria-hidden="true" />
          </Link>
          <button
            type="button"
            className="icon-btn relative"
            aria-label={`Enquiry list, ${items.length} saved`}
            onClick={() => setOpen(true)}
          >
            <Heart
              className={`size-5 ${items.length ? "fill-clay text-clay" : ""}`}
              aria-hidden="true"
            />
            {items.length > 0 ? (
              <span className="absolute right-0.5 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-clay px-1 text-[10px] font-bold text-white">
                {items.length}
              </span>
            ) : null}
          </button>
          <button
            type="button"
            className="icon-btn md:hidden"
            aria-expanded={menuOpen}
            aria-controls={menuId}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div className="border-t border-line bg-paper md:hidden" id={menuId}>
          <nav className="mx-auto flex max-w-6xl flex-col px-4 py-3" aria-label="Mobile">
            <Link to="/shop" className="border-b border-line py-3 font-semibold" onClick={() => setMenuOpen(false)}>
              Shop
            </Link>
            {stockedCategories.map((category) => (
              <Link
                key={category.slug}
                to={`/category/${category.slug}`}
                className="border-b border-line py-3 text-muted"
                onClick={() => setMenuOpen(false)}
              >
                {category.name}
              </Link>
            ))}
            <Link to="/about" className="border-b border-line py-3 font-semibold" onClick={() => setMenuOpen(false)}>
              About
            </Link>
            <Link to="/contact" className="py-3 font-semibold" onClick={() => setMenuOpen(false)}>
              Contact
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
