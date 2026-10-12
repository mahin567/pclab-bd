const c = (n) => `hsl(var(--${n}))`;
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: { extend: { colors: Object.fromEntries(
    ["border","input","ring","background","foreground","primary","primary-foreground","secondary","secondary-foreground","destructive","destructive-foreground","muted","muted-foreground","accent","accent-foreground","card","card-foreground"].map((n) => [n, c(n)])
  ) } },
  plugins: [],
};
