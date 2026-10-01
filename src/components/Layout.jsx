import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import BottomNav from "./BottomNav.jsx";
import WhatsAppFab from "./WhatsAppFab.jsx";
import EnquirySheet from "./EnquirySheet.jsx";
import Seo from "./Seo.jsx";
import { routeMeta } from "../lib/meta.js";

export default function Layout() {
  const location = useLocation();
  const meta = routeMeta(location.pathname);
  const isProduct = location.pathname.startsWith("/product/");

  useEffect(() => {
    const targetId = location.pathname === "/visit" ? "visit" : location.hash.replace("#", "");
    if (targetId) {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ block: "start" });
      }
    } else {
      window.scrollTo(0, 0);
    }
    document.getElementById("main")?.focus({ preventScroll: true });
  }, [location.pathname, location.hash]);

  return (
    <div className="flex min-h-dvh flex-col">
      <Seo {...meta} />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <p className="bg-soft px-4 py-2 text-center text-xs leading-relaxed text-ink sm:text-sm">
        Sample preview. Products, prices and the WhatsApp number are placeholders until the shop confirms them.
      </p>
      <Header />
      <main
        id="main"
        tabIndex={-1}
        className={`flex-1 outline-none ${isProduct ? "pb-28 lg:pb-16" : "pb-8"}`}
      >
        <Outlet />
      </main>
      <div className={isProduct ? "pb-24 lg:pb-0" : "pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-0"}>
        <Footer />
      </div>
      {isProduct ? null : <BottomNav />}
      {isProduct ? null : <WhatsAppFab />}
      <EnquirySheet />
    </div>
  );
}
