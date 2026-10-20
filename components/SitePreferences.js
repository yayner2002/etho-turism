"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const PreferencesContext = createContext(null);

const LANGUAGE_KEY = "ethio-language";
const THEME_KEY = "ethio-theme";

const SUPPORTED_LANGUAGES = ["en", "am"];
const SUPPORTED_THEMES = ["light", "dark"];

export function SitePreferencesProvider({ children }) {
  const [language, setLanguageState] = useState("en");
  const [theme, setThemeState] = useState("light");
  const [ready, setReady] = useState(false);

  // Restore saved preferences after mounting.
  useEffect(() => {
    try {
      const savedLanguage = localStorage.getItem(LANGUAGE_KEY);
      const savedTheme = localStorage.getItem(THEME_KEY);

      if (SUPPORTED_LANGUAGES.includes(savedLanguage)) {
        setLanguageState(savedLanguage);
      }

      if (SUPPORTED_THEMES.includes(savedTheme)) {
        setThemeState(savedTheme);
      }
    } catch {
      // Local storage might be unavailable.
    } finally {
      setReady(true);
    }
  }, []);

  // Apply preferences and save them when they change.
  useEffect(() => {
    if (!ready) return;

    document.documentElement.lang = language;
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.dataset.theme = theme;

    try {
      localStorage.setItem(LANGUAGE_KEY, language);
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // Keep the current preferences in React state.
    }
  }, [language, theme, ready]);

  const setLanguage = useCallback((value) => {
    if (SUPPORTED_LANGUAGES.includes(value)) {
      setLanguageState(value);
    }
  }, []);

  const setTheme = useCallback((value) => {
    if (SUPPORTED_THEMES.includes(value)) {
      setThemeState(value);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((current) => (current === "light" ? "dark" : "light"));
  }, []);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      theme,
      setTheme,
      toggleTheme,
      ready,
    }),
    [language, setLanguage, theme, setTheme, toggleTheme, ready],
  );

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function useSitePreferences() {
  const context = useContext(PreferencesContext);

  if (context === null) {
    throw new Error(
      "useSitePreferences must be used inside SitePreferencesProvider.",
    );
  }

  return context;
}

export default function SitePreferences() {
  const { language, setLanguage, theme, toggleTheme, ready } =
    useSitePreferences();

  return (
    <div
      className="site-preferences"
      role="group"
      aria-label="Website preferences"
    >
      {/* Language selector: icon only, with an accessible name. */}
      <div className="language-control">
        <span className="preference-icon" aria-hidden="true">
          文
        </span>

        <label htmlFor="site-language" className="sr-only">
          Choose language
        </label>

        <select
          id="site-language"
          value={language}
          onChange={(event) => setLanguage(event.target.value)}
          disabled={!ready}
          aria-label="Choose language"
        >
          <option value="en">English</option>
          <option value="am">አማርኛ</option>
        </select>
      </div>

      {/* Light/dark theme toggle. */}
      <button
        type="button"
        className="theme-toggle"
        onClick={toggleTheme}
        disabled={!ready}
        aria-pressed={theme === "dark"}
        aria-label={
          theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
        }
        title={
          theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
        }
      >
        <span aria-hidden="true">{theme === "dark" ? "☀️" : "🌙"}</span>
        <span>{theme === "dark" ? "Light" : "Dark"}</span>
      </button>
    </div>
  );
}
