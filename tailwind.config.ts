import type { Config } from "tailwindcss";

// Tokens ported 1:1 from the UX Pilot draft (Autora - Car Listings.html).
export default {
  theme: {
    extend: {
      fontFamily: { sans: ["var(--font-inter)", "system-ui", "sans-serif"] },
      colors: {
        ink: "#1D1D1F",
        mute: "#6E6E73",
        soft: "#86868B",
        line: "#E8E8ED",
        panel: "#F5F5F7",
        fill: "#E8E8ED",
        apple: "#0071E3",
        applehover: "#0077ED",
        link: "#0066CC",
        flame: "#B64400",
        hair: "#D2D2D7",
      },
    },
  },
} satisfies Config;
