import { NavLink, useLocation } from "react-router-dom";
import { House, MapPin, Phone, ShoppingBag } from "lucide-react";

function Item({ to, label, icon: Icon, active }) {
  const className = `flex flex-col items-center gap-1 px-2 py-2 text-[10px] font-semibold ${
    active ? "text-clay" : "text-muted"
  }`;
  return (
    <NavLink to={to} className={className} aria-current={active ? "page" : undefined}>
      <Icon className="size-5" aria-hidden="true" />
      {label}
    </NavLink>
  );
}

export default function BottomNav() {
  const { pathname, hash } = useLocation();
  const shopActive =
    pathname === "/shop" || pathname.startsWith("/category") || pathname.startsWith("/product");
  const visitActive = pathname === "/visit" || (pathname === "/contact" && hash === "#visit");
  const contactActive = pathname === "/contact" && hash !== "#visit";

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 backdrop-blur md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Sections"
    >
      <div className="grid grid-cols-4">
        <Item to="/" label="Home" icon={House} active={pathname === "/"} />
        <Item to="/shop" label="Shop" icon={ShoppingBag} active={shopActive} />
        <Item to="/contact#visit" label="Visit" icon={MapPin} active={visitActive} />
        <Item to="/contact" label="Contact" icon={Phone} active={contactActive} />
      </div>
    </nav>
  );
}
