import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({});

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "system";
    }
    return "system";
  });

  const [accent, setAccent] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("accent") || "zinc";
    }
    return "zinc";
  });

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;
    const colors = [
      "zinc",
      "slate",
      "stone",
      "gray",
      "red",
      "rose",
      "orange",
      "green",
      "blue",
      "yellow",
      "violet",
      "purple",
    ];

    colors.forEach((color) => {
      root.classList.remove(`accent-${color}`);
    });
    root.classList.add(`accent-${accent}`);
    localStorage.setItem("accent", accent);
  }, [accent]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, accent, setAccent }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
