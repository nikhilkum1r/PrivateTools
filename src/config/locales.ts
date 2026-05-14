export const locales = [
  "en",
  "hi",
  "es",
  "ar",
  "fr",
  "zh",
  "ru",
  "pt",
  "de",
  "ja",
  "id",
  "tr",
  "it",
  "pl",
  "vi",
  "ko",
  "th",
  "nl",
  "fa",
  "uk",
  "ms",
  "cs",
  "da",
  "el",
  "fi",
  "ro",
  "sv"
] as const;

export type Locale = typeof locales[number];

export const defaultLocale = "en";

export const rtlLocales = [
  "ar",
  "ur",
  "fa",
  "he"
];

export const languageNames: Record<Locale, string> = {
  en: "English",
  hi: "हिन्दी",
  es: "Español",
  ar: "العربية",
  fr: "Français",
  zh: "中文",
  ru: "Русский",
  pt: "Português",
  de: "Deutsch",
  ja: "日本語",
  id: "Bahasa Indonesia",
  tr: "Türkçe",
  it: "Italiano",
  pl: "Polski",
  vi: "Tiếng Việt",
  ko: "한국어",
  th: "ไทย",
  nl: "Nederlands",
  fa: "فارسی",
  uk: "Українська",
  ms: "Bahasa Melayu",
  cs: "Čeština",
  da: "Dansk",
  el: "Ελληνικά",
  fi: "Suomi",
  ro: "Română",
  sv: "Svenska"
};
