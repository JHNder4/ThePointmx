import { createContext, useContext, useState, useEffect } from "react";

type Theme = "dark" | "light";

interface ThemeCtx {
  theme: Theme;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeCtx>({ theme: "dark", toggle: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() =>
    (localStorage.getItem("tp_theme") as Theme) || "dark"
  );

  useEffect(() => {
    // Aplica correctamente la clase dark/light al <html>
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.classList.toggle("light", theme === "light");
    localStorage.setItem("tp_theme", theme);
  }, [theme]);

  // Aplica el tema inicial antes del primer render (evita flash)
  useEffect(() => {
    const saved = (localStorage.getItem("tp_theme") as Theme) || "dark";
    document.documentElement.classList.add(saved);
  }, []);

  const toggle = () => setTheme(t => (t === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
