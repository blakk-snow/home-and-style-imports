import { Component } from "react";
import { Route, Routes } from "react-router-dom";
import { EnquiryProvider } from "./components/EnquiryProvider.jsx";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import Shop from "./pages/Shop.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import NotFound from "./pages/NotFound.jsx";
import { generalEnquiryMessage, waLink } from "./lib/whatsapp.js";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <main className="mx-auto max-w-lg px-6 py-24 text-center">
          <h1 className="text-4xl">Something went wrong</h1>
          <p className="mt-3 text-muted">Refresh the page. If it keeps happening, message the shop.</p>
          <a className="btn btn-wa mt-6" href={waLink(generalEnquiryMessage())}>
            WhatsApp the shop
          </a>
        </main>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <EnquiryProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="shop" element={<Shop />} />
            <Route path="category/:slug" element={<Shop />} />
            <Route path="product/:slug" element={<ProductDetail />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="visit" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </EnquiryProvider>
    </ErrorBoundary>
  );
}
