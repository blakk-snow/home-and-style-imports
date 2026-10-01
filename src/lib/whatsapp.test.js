import test from "node:test";
import assert from "node:assert/strict";
import {
  waLink,
  telLink,
  productEnquiryMessage,
  listEnquiryMessage,
  categoryEnquiryMessage,
} from "./whatsapp.js";
import { shop } from "../data/config.js";

const vase = { name: "Ceramic Table Vase", ref: "HS-0142" };

test("waLink uses digits only and encodes the message", () => {
  const url = new URL(waLink("Hello & goodbye?", "+233 20 000 0000"));
  assert.equal(url.origin + url.pathname, "https://wa.me/233200000000");
  assert.equal(url.searchParams.get("text"), "Hello & goodbye?");
});

test("telLink keeps the plus", () => {
  assert.equal(telLink("233200000000"), "tel:+233200000000");
});

test("product message names the piece and ref", () => {
  const message = productEnquiryMessage(vase, { colour: "Sage" });
  assert.match(message, new RegExp(shop.name));
  assert.match(message, /Ceramic Table Vase \(Sage\) \(ref: HS-0142\)/);
  assert.match(message, /Is it available\?/);
});

test("list message includes every saved piece", () => {
  const message = listEnquiryMessage([
    { name: "Ceramic Table Vase", ref: "HS-0142", colour: "Sage" },
    { name: "Linen Napkin Set", ref: "HS-0224" },
  ]);
  assert.match(message, /• Ceramic Table Vase — Sage \(ref: HS-0142\)/);
  assert.match(message, /• Linen Napkin Set \(ref: HS-0224\)/);
  assert.match(message, /Are these available\?/);
});

test("category message names the category", () => {
  assert.match(categoryEnquiryMessage("Clothing"), /what you have in Clothing/);
});
