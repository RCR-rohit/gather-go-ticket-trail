import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/EventApp";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "AFTR. — Find your kind of night" },
    { name: "description", content: "Discover thoughtfully picked live music, art, food, and city events. Find your next good night out with AFTR." },
    { property: "og:title", content: "AFTR. — Find your kind of night" },
    { property: "og:description", content: "Good things, coming up. Find a reason to leave the group chat." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: HomePage,
});
