import { createFileRoute } from "@tanstack/react-router";
import { ConfirmationPage } from "@/components/EventApp";

export const Route = createFileRoute("/confirmation/$bookingId")({
  head: () => ({ meta: [
    { title: "Booking confirmed — AFTR." },
    { name: "description", content: "Your event booking is confirmed. Get ready for a very good plan." },
    { property: "og:title", content: "Booking confirmed — AFTR." },
    { property: "og:description", content: "Your event tickets are ready." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: ConfirmationRoute,
});
function ConfirmationRoute() {
  const { bookingId } = Route.useParams();
  return <ConfirmationPage bookingId={bookingId} />;
}
