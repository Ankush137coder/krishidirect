// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
    content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
    theme: {
        extend: {
            colors: {
                // KrishiDirect design tokens — see README for rationale.
                krishi: {
                    emerald: "#1B4332",
                    "emerald-mid": "#2D6A4F",
                    amber: "#E8A33D",
                    terracotta: "#C4622D",
                    cream: "#FBF7EF",
                    slate: "#3D4A42",
                    alert: "#D64545",
                },
            },
            fontFamily: {
                // Display face: warm, organic serif reserved for headlines & big numbers.
                serif: ["Fraunces", "Georgia", "serif"],
                // Body/UI face: high-legibility sans for anything a farmer or vendor reads at speed.
                sans: ["Inter", "system-ui", "sans-serif"],
            },
        },
    },
    plugins: [],
};

export default config;