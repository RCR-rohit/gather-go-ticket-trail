import { createFileRoute } from "@tanstack/react-router";
import { EventPage } from "@/components/EventApp";

export const Route = createFileRoute("/events/$eventId")({
  head: () => ({ meta: [
    { title: "Event details & tickets — AFTR." },
    { name: "description", content: "Explore event details and reserve tickets for your next night out with AFTR." },
    { property: "og:title", content: "Event details & tickets — AFTR." },
    { property: "og:description", content: "Explore the details and reserve a spot at your next event." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: EventRoute,
});
function EventRoute() {
  const { eventId } = Route.useParams();
  return <EventPage eventId={eventId} />;
}
