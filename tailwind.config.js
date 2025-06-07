/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#8FE3D9",
        bgBlue: "#EFF7F6",
        bgPink: "#FFF5F8",
        secondary: "#FDC8ED",
        secondary1: "#F2B5D4",
        secondaryGradient: "linear-gradient(90deg, #FF66C4 0%, #FFDC5B 100%)",

        title: "#1985A1",
        title2: "#FF66C4",
        // title2: "#D648A6",

        text: "#46494C",
        text2: "#4c5c68",
        text60: "#969696",
        text30: "#DCDCDD",
      },
      fontFamily: {
        heading: ["Quicksand", "sans-serif"], // For H1, text-title-desktop, H2, mob-title
        body: ["Satoshi", "sans-serif"], // For H3, H4, Main text, Text Button, Small
      },
      fontSize: {
        h1: ["56px", { lineHeight: "120%" }], // Quicksand, Semibold
        titleDesktop: ["48px", { lineHeight: "120%" }], // Quicksand, Semibold
        h2: ["36px", { lineHeight: "120%" }], // Quicksand, Regular
        mobTitle: ["28px", { lineHeight: "130%" }], // Quicksand, Medium
        h3: ["24px", { lineHeight: "130%" }], // Satoshi, Medium
        h4: ["20px", { lineHeight: "130%" }], // Satoshi, Regular
        base: ["16px", { lineHeight: "130%" }], // Satoshi, Regular
        button: ["18px", { lineHeight: "130%" }], // Satoshi, Medium
        small: ["14px", { lineHeight: "120%" }], // Satoshi, Regular
      },
      fontWeight: {
        regular: "400",
        medium: "500",
        semibold: "600",
      },
      boxShadow: {
        cookie:
          "0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.3)",
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: true, // This allows base styles to apply to raw elements like h1/p
  },
};

/*

Tailwind Class	Value (px)
gap-1	4px
gap-2	8px
gap-3	12px
gap-4	16px
gap-5	20px
gap-6	24px
gap-7	28px
gap-8	32px



Breakpoint	Suggested Size	Tailwind	Clamp (Responsive)
Mobile	36px	text-[2.25rem]	clamp(2.25rem, 5vw, 3rem)
md	48px	text-[3rem]	clamp(2.5rem, 4vw, 3rem)
lg	64px	text-[4rem]	clamp(3rem, 5vw, 4rem)
xl	80–96px	text-[5rem] or more	clamp(3.5rem, 6vw, 6rem) or text-[6rem]

<768px → text-2xl

≥768px (md) → text-4xl

≥1024px (lg) → text-6xl

≥1280px (xl) → text-7xl

Breakpoint	Prefix	Min Width	Common Devices
sm	sm:	640px	Small tablets (e.g., iPhone Plus)
md	md:	768px	Tablets
lg	lg:	1024px	Laptops
xl	xl:	1280px	Large laptops / desktops
2xl	2xl:	1536px	Large/ultrawide screens

*/
