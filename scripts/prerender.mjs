import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { indexablePaths, routeMeta } from "../src/lib/meta.js";
import { absoluteUrl } from "../src/lib/url.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const templatePath = path.join(dist, "index.html");

if (!fs.existsSync(templatePath)) {
  console.error("dist/index.html is missing. Run vite build first.");
  process.exit(1);
}

const template = fs.readFileSync(templatePath, "utf8");

function escapeAttr(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

function upsert(html, attr, key, content) {
  const tag = `<meta ${attr}="${key}" content="${escapeAttr(content)}" />`;
  const re = new RegExp(`<meta\\s+${attr}="${key}"\\s+content="[^"]*"\\s*/?>`, "i");
  if (re.test(html)) return html.replace(re, tag);
  return html.replace("</head>", `    ${tag}\n  </head>`);
}

for (const routePath of indexablePaths()) {
  const meta = routeMeta(routePath);
  let html = template.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeAttr(meta.title)}</title>`);
  html = upsert(html, "name", "description", meta.description);
  html = upsert(html, "property", "og:title", meta.title);
  html = upsert(html, "property", "og:description", meta.description);
  html = upsert(html, "property", "og:image", absoluteUrl(meta.image));
  html = upsert(html, "property", "og:url", absoluteUrl(meta.path));
  html = upsert(html, "property", "og:type", meta.jsonLd?.["@type"] === "Product" ? "product" : "website");
  html = upsert(html, "name", "twitter:card", "summary_large_image");
  html = upsert(html, "name", "twitter:title", meta.title);
  html = upsert(html, "name", "twitter:description", meta.description);
  html = upsert(html, "name", "twitter:image", absoluteUrl(meta.image));

  const canonical = `<link rel="canonical" href="${escapeAttr(absoluteUrl(meta.path))}" />`;
  if (/<link\s+rel="canonical"[^>]*>/i.test(html)) {
    html = html.replace(/<link\s+rel="canonical"[^>]*>/i, canonical);
  } else {
    html = html.replace("</head>", `    ${canonical}\n  </head>`);
  }

  if (meta.jsonLd) {
    const json = JSON.stringify(meta.jsonLd).replace(/</g, "\\u003c");
    const script = `<script id="ld-json" type="application/ld+json">${json}</script>`;
    if (html.includes('id="ld-json"')) {
      html = html.replace(/<script id="ld-json" type="application\/ld\+json">[\s\S]*?<\/script>/, script);
    } else {
      html = html.replace("</head>", `    ${script}\n  </head>`);
    }
  }

  const dir = routePath === "/" ? dist : path.join(dist, routePath.slice(1));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(routePath === "/" ? path.join(dist, "index.html") : path.join(dir, "index.html"), html);
}

const urls = indexablePaths()
  .map((routePath) => `  <url><loc>${escapeAttr(absoluteUrl(routePath))}</loc></url>`)
  .join("\n");
fs.writeFileSync(
  path.join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
);
fs.writeFileSync(
  path.join(dist, "robots.txt"),
  `User-agent: *\nAllow: /\n\nSitemap: ${absoluteUrl("/sitemap.xml")}\n`,
);

console.log(`Prerendered ${indexablePaths().length} routes`);
