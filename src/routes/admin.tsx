import { createFileRoute } from "@tanstack/react-router";
import { AdminPage } from "@/components/EventApp";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [
    { title: "Event overview — AFTR. Organizer" },
    { name: "description", content: "Review ticket sales, event inventory, booking records, and upcoming events in the AFTR organizer overview." },
    { property: "og:title", content: "Event overview — AFTR. Organizer" },
    { property: "og:description", content: "Your events, bookings, and inventory at a glance." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: AdminPage,
});
