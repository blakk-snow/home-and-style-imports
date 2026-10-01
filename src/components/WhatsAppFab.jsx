import { MessageCircle } from "lucide-react";
import { generalEnquiryMessage, waLink } from "../lib/whatsapp.js";

export default function WhatsAppFab() {
  return (
    <a
      href={waLink(generalEnquiryMessage())}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with the shop on WhatsApp"
      className="wa-fab fixed right-4 z-30 grid h-14 w-14 place-items-center rounded-full bg-whatsapp text-white shadow-lift"
    >
      <MessageCircle className="size-6" aria-hidden="true" />
    </a>
  );
}
