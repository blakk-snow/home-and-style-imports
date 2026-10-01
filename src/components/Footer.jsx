import { Link } from "react-router-dom";
import { shop } from "../data/config.js";
import { useProducts } from "../hooks/useProducts.js";

export default function Footer() {
  const { stockedCategories } = useProducts();

  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-serif text-2xl text-[#f3ece2]">{shop.shortName}</p>
          <p className="mt-1 text-[11px] font-semibold tracking-[0.18em] text-[#d9c7ba]">IMPORTS</p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#e6d9cc]">
            A small Accra catalogue for imported décor and textiles. Message us to buy — there is no checkout here.
          </p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#d9c7ba]">Browse</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link className="hover:text-white" to="/shop">
                All products
              </Link>
            </li>
            {stockedCategories.map((category) => (
              <li key={category.slug}>
                <Link className="hover:text-white" to={`/category/${category.slug}`}>
                  {category.name}
                </Link>
              </li>
            ))}
            <li>
              <Link className="hover:text-white" to="/about">
                About
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#d9c7ba]">Visit</p>
          <p className="mt-3 text-sm leading-relaxed text-[#e6d9cc]">
            {shop.address.line1}, {shop.address.line2}
            <br />
            {shop.address.region}
          </p>
          <p className="mt-3 text-sm text-[#e6d9cc]">{shop.hoursSummary}</p>
          <Link className="mt-3 inline-block text-sm font-semibold text-white" to="/contact">
            Contact the shop
          </Link>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs text-[#d9c7ba] sm:px-6">
          © {new Date().getFullYear()} {shop.name}. 
        </p>
      </div>
    </footer>
  );
}
