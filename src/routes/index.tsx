import { createFileRoute } from "@tanstack/react-router";

import { GharKhataDashboard } from "@/components/gharkhata-dashboard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GharKhata — Household records and reminders" },
      {
        name: "description",
        content: "Keep Indian household warranties, insurance, bills, and renewal dates together in GharKhata.",
      },
      { property: "og:title", content: "GharKhata — Household records and reminders" },
      {
        property: "og:description",
        content: "A simple bilingual home for warranties, insurance, bills, and household reminders.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: GharKhataDashboard,
});
