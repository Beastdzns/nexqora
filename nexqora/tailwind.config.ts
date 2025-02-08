import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/views/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"], // Add the Poppins font
      },
      colors: {
        primary: "#805AD5", // Vibrant purple
        secondary: "#ED64A6", // Vibrant pink
        accent: "#4299E1", // Vibrant blue
        dark: "#1A202C", // Dark gray for backgrounds
        muted: "#718096", // Muted gray for text
      },
      backgroundImage: {
        gradient: "linear-gradient(to right, #805AD5, #ED64A6, #4299E1)", // Custom gradient
      },
    },
  },
  plugins: [],
};

export default config;
