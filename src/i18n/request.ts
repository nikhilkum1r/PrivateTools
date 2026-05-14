import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';

export default getRequestConfig(async ({requestLocale}) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  const messages: Record<string, any> = {};

  const namespaces = [
    'common', 'navbar', 'footer', 'home', 'about', 'pricing', 'faq', 'blog',
    'changelog', 'contact', 'cookies', 'developers', 'legal', 'steganography',
    'passwordGenerator', 'fileShredder', 'metadataCleaner', 'vault',
    'videoStudio', 'imageEditor', 'imageConverter', 'tools', 'imageHub',
    'compressor', 'audio', 'qrGenerator', 'backgroundRemover', 'pdfCompress',
    'pdfHub', 'documentHub', 'colorLab', 'secureNotes', 'privacy',
    'security', 'devtools', 'ocr', 'imageToPptx', 'pdfMerge', 'iconStudio',
    'splitPdf', 'dataConverter', 'wordToPdf', 'pdfToTxt', 'caseConverter',
    'wordCounter', 'passwordChecker', 'privacyScanner', 'site', 'textTools', 'toolsHub',
    'pdfUnlock', 'pdfProtect', 'base64', 'commandPalette', 'docsMaster',
    'marketing', 'studio', 'philosophy', 'ads'
  ];

  // Sort namespaces to ensure deterministic loading order
  const sortedNamespaces = [...new Set(namespaces)].sort();

  for (const ns_raw of sortedNamespaces) {
    const ns_file = ns_raw.replace(/([A-Z])/g, "_$1").toLowerCase();

    // Try loading the locale-specific file first, then fall back to English
    let content: any = null;
    for (const tryLocale of locale === 'en' ? [locale] : [locale, 'en']) {
      try {
        content = (await import(`./messages/${tryLocale}/${ns_file}.json`)).default;
        break;
      } catch {
        try {
          content = (await import(`./messages/${tryLocale}/${ns_raw}.json`)).default;
          break;
        } catch {
          // continue to next locale fallback
        }
      }
    }

    if (content) {
      const data = content[ns_raw] || content;
      messages[ns_raw] = data;

      if (ns_raw === 'common' && content.trust) {
        messages.trust = content.trust;
      }
    } else if (process.env.NODE_ENV === 'development') {
      console.warn(`[i18n] Missing namespace file: ${ns_raw} (tried ${ns_file}.json and ${ns_raw}.json)`);
    }
  }

  // ─── Extract sub-namespaces from compound files ──────────────────────────
  // legal.json contains { privacy, terms } - extract both
  if (messages.legal) {
    if (!messages.terms && messages.legal.terms) messages.terms = messages.legal.terms;
    if (!messages.privacy && messages.legal.privacy) messages.privacy = messages.legal.privacy;
  }

  // Alias homePage to home for backward compatibility
  if (messages.home) {
    messages.homePage = messages.home;
    if (process.env.NODE_ENV === 'development') {
      console.log('[i18n] Aliased "homePage" to "home"');
    }
  }

  if (process.env.NODE_ENV === 'development') {
    console.log(`[i18n] Loaded ${Object.keys(messages).length} namespaces for locale: ${locale}`);
    if (!messages.home) console.error('[i18n] CRITICAL: "home" is MISSING');
  }

  return {
    locale,
    messages
  };
});
