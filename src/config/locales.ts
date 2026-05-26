export const locales = [
  "en",
  "hi",
  "es",
  "ar",
  "fr"
] as const;

export type Locale = typeof locales[number];

export const defaultLocale = "en";

export const rtlLocales = [
  "ar"
];

export const languageNames: Record<Locale, string> = {
  en: "English",
  hi: "हिन्दी",
  es: "Español",
  ar: "العربية",
  fr: "Français"
};
