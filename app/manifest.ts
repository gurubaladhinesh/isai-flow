import type { MetadataRoute } from "next";
import { SITE_NAME, SITE_URL } from "@/src/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} – Tamil Internet Radio`,
    short_name: SITE_NAME,
    description:
      "Listen to live Tamil FM stations, Carnatic music, and film hits online.",
    start_url: "/",
    display: "standalone",
    background_color: "#121a17",
    theme_color: "#3ecfb4",
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/favicon.ico",
        sizes: "48x48",
        type: "image/x-icon",
      },
    ],
    lang: "ta",
    scope: SITE_URL,
  };
}
