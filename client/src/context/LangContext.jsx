import { createContext, useContext, useEffect, useMemo, useState } from "react";

// Minimal EN/AR language context. Drives the <html lang/dir> attributes for
// RTL and exposes the current language + toggle. UI strings are centralized
// in src/data/content.js so both languages stay in sync.
const LangContext = createContext(null);

const STORAGE_KEY = "athr.lang";

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || "en";
  });

  useEffect(() => {
    const dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("dir", dir);
    localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  const value = useMemo(
    () => ({
      lang,
      isRTL: lang === "ar",
      setLang,
      toggle: () => setLang((l) => (l === "en" ? "ar" : "en")),
    }),
    [lang],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}
