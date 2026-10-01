import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center sm:px-6">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-terracotta">404</p>
      <h1 className="mt-2 text-4xl">We can’t find that page</h1>
      <p className="mt-3 text-muted">It may have moved, or the link was typed wrong. The shop is still here.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link to="/" className="btn btn-primary">
          Home
        </Link>
        <Link to="/shop" className="btn btn-line">
          Browse the shop
        </Link>
      </div>
    </div>
  );
}
