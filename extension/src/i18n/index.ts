import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "@ui/i18n/locales/en.json";
import zh from "@ui/i18n/locales/zh.json";
import es from "@ui/i18n/locales/es.json";
import hi from "@ui/i18n/locales/hi.json";
import ar from "@ui/i18n/locales/ar.json";
import pt from "@ui/i18n/locales/pt.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      zh: { translation: zh },
      es: { translation: es },
      hi: { translation: hi },
      ar: { translation: ar },
      pt: { translation: pt },
    },
    fallbackLng: "en",
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "i18nextLng",
      convertDetectedLanguage: (lng: string) => lng.split("-")[0],
    },
  });

export default i18n;
