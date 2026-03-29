import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import en from "./locales/en.json";
import id from "./locales/id.json";

type Locale = "id" | "en";

const translations: Record<Locale, any> = { en, id };

interface I18nContextType {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
  /** For DB content: returns field_en when locale is "en", falls back to base field */
  lf: (item: any, field: string) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const saved = localStorage.getItem("locale");
    return saved === "en" || saved === "id" ? saved : "id";
  });

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("locale", l);
  }, []);

  const t = useCallback(
    (key: string): string => {
      const keys = key.split(".");
      let result: any = translations[locale];
      for (const k of keys) {
        result = result?.[k];
      }
      return typeof result === "string" ? result : key;
    },
    [locale]
  );

  const lf = useCallback(
    (item: any, field: string): string => {
      if (!item) return "";
      if (locale === "en") {
        const enVal = item[`${field}_en`];
        if (enVal && String(enVal).trim()) return enVal;
      }
      return item[field] || "";
    },
    [locale]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, lf }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
