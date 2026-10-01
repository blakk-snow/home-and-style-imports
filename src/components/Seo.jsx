import { useEffect } from "react";
import { absoluteUrl } from "../lib/url.js";

function upsertMeta(attr, key, content) {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export default function Seo({ title, description, path = "/", image = "/og.jpg", jsonLd }) {
  useEffect(() => {
    document.title = title;
    upsertMeta("name", "description", description);
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:image", absoluteUrl(image));
    upsertMeta("property", "og:url", absoluteUrl(path));
    upsertMeta("property", "og:type", jsonLd?.["@type"] === "Product" ? "product" : "website");
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", absoluteUrl(image));
    upsertLink("canonical", absoluteUrl(path));

    let script = document.getElementById("ld-json");
    if (!jsonLd) {
      script?.remove();
      return;
    }
    if (!script) {
      script = document.createElement("script");
      script.id = "ld-json";
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(jsonLd).replace(/</g, "\\u003c");
  }, [title, description, path, image, jsonLd]);

  return null;
}
