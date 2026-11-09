import { createFileRoute } from "@tanstack/react-router";
import { BookingsPage } from "@/components/EventApp";

export const Route = createFileRoute("/bookings")({
  head: () => ({ meta: [
    { title: "My tickets — AFTR." },
    { name: "description", content: "See your upcoming event plans and confirmed tickets with AFTR." },
    { property: "og:title", content: "My tickets — AFTR." },
    { property: "og:description", content: "All your good plans, gathered in one place." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: BookingsPage,
});
