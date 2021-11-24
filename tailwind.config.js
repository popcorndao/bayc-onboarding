module.exports = {
  purge: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./container/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    screens: {
      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'base': '1080px',
      // => @media (min-width: 768px) { ... }

      'lg': '1480px',
      // => @media (min-width: 1380px) { ... }

      'xl': '1840px',
      // => @media (min-width: 1840px) { ... }

      '2xl': '2560px',
      // => @media (min-width: 1536px) { ... }
    },
    extend: {
      spacing: {
        18: "4.5rem",
        72: "18rem",
        84: "21rem",
        96: "24rem",
        100: "25.5rem",
        104: "27rem",
        112: "30rem",
        128: "34rem",
        156: "41rem",
      },
      lineHeight: {
        button: "32px",
      },
      scale: {
        101: "1.01",
        102: "1.02",
      },
      colors: {
        primary: "#FDEAA7",
        primaryLight: "#FFF5D1",
        primaryDark: "#BF4904",

        secondary: "#B72E73",
        secondaryLight: "#D5264E",
        secondaryDark: "#8739B0",

        ctaYellow: "#F6CB22",
        ctaYellowLight: "#FFD324",
      },
      backgroundImage: (theme) => ({
        "hero-pattern": "url('/images/landingBG.svg')",
        "beneficiary-pattern":"url('/images/beneficiaryBg.svg')",
        "mobile-pattern":"url('/images/mobileBg.svg')"
      }),
      fontFamily: {
        landing: ["Avenir Next LT Pro", "sans-serif"],
      },
    },
  },
  variants: {
    extend: {
      opacity: ["disabled"],
      backgroundColor: ["disabled"],
      cursor: ["disabled"],
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
