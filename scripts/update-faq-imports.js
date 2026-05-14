/**
 * Phase 2b: Update client components to use t.raw("faq.items") instead of faq-content.ts imports
 * 
 * For each component:
 * 1. Remove the import { CONSTANT_FAQ } from "@/lib/faq-content"
 * 2. Replace CONSTANT_FAQ usage with t.raw("faq.items")
 */

const fs = require('fs');

const REPLACEMENTS = [
  {
    file: 'src/app/[locale]/image/compress/CompressorStudioClient.tsx',
    importLine: 'import { COMPRESSOR_FAQ } from "@/lib/faq-content";',
    replacements: [
      { from: 'items={COMPRESSOR_FAQ}', to: 'items={t.raw("faq.items") as any}' },
      { from: 'faqItems={COMPRESSOR_FAQ}', to: 'faqItems={t.raw("faq.items") as any}' },
    ]
  },
  {
    file: 'src/app/[locale]/image/colors/ColorLabClient.tsx',
    importLine: 'import { COLOR_PICKER_FAQ } from "@/lib/faq-content";',
    replacements: []  // Already uses t.raw("faq.items") per grep!
  },
  {
    file: 'src/app/[locale]/image/editor/EditorStudioClient.tsx',
    importLine: 'import { IMAGE_EDITOR_FAQ } from "@/lib/faq-content";',
    replacements: [
      { from: 'items={IMAGE_EDITOR_FAQ}', to: 'items={t.raw("faq.items") as any}' },
    ]
  },
  {
    file: 'src/app/[locale]/image/convert/ConversionStudioClient.tsx',
    importLine: 'import { IMAGE_CONVERTER_FAQ } from "@/lib/faq-content";',
    replacements: [
      { from: 'faqItems={IMAGE_CONVERTER_FAQ}', to: 'faqItems={t.raw("faq.items") as any}' },
    ]
  },
  {
    file: 'src/app/[locale]/image/ocr/OCRClient.tsx',
    importLine: 'import { OCR_FAQ } from "@/lib/faq-content";',
    replacements: [
      { from: 'items={OCR_FAQ} title="OCR Frequently Asked Questions"', to: 'items={t.raw("faq.items") as any} title={t("faq.title")}' },
    ]
  },
  {
    file: 'src/app/[locale]/audio/AudioStudioClient.tsx',
    importLine: 'import { AUDIO_TOOLS_FAQ } from "@/lib/faq-content";',
    replacements: [
      { from: 'faqItems={AUDIO_TOOLS_FAQ}', to: 'faqItems={t.raw("faq.items") as any}' },
      { from: 'items={AUDIO_TOOLS_FAQ}', to: 'items={t.raw("faq.items") as any}' },
    ]
  },
  {
    file: 'src/app/[locale]/video/VideoStudioClient.tsx',
    importLine: 'import { VIDEO_TOOLS_FAQ } from "@/lib/faq-content";',
    replacements: [
      { from: 'faqItems={VIDEO_TOOLS_FAQ}', to: 'faqItems={t.raw("faq.items") as any}' },
      { from: 'items={VIDEO_TOOLS_FAQ}', to: 'items={t.raw("faq.items") as any}' },
    ]
  },
  {
    file: 'src/app/[locale]/security/steganography/SteganographyClient.tsx',
    importLine: 'import { SECURITY_FAQ } from "@/lib/faq-content";',
    replacements: [] // Need to check exact usage pattern
  },
  {
    file: 'src/app/[locale]/document/word-to-pdf/WordToPdfClient.tsx',
    importLine: 'import { WORD_TO_PDF_FAQ } from "@/lib/faq-content";',
    replacements: [
      { from: 'WORD_TO_PDF_FAQ.map(', to: '(t.raw("faq.items") as any[]).map(' },
    ]
  },
  {
    file: 'src/app/[locale]/document/text-tools/case-converter/CaseConverterClient.tsx',
    importLine: 'import { CASE_CONVERTER_FAQ } from "@/lib/faq-content";',
    replacements: [
      { from: 'CASE_CONVERTER_FAQ.map(', to: '(t.raw("faq.items") as any[]).map(' },
    ]
  },
  {
    file: 'src/app/[locale]/document/text-tools/word-counter/WordCounterClient.tsx',
    importLine: 'import { WORD_COUNTER_FAQ } from "@/lib/faq-content";',
    replacements: [
      { from: 'WORD_COUNTER_FAQ.map(', to: '(t.raw("faq.items") as any[]).map(' },
    ]
  },
  {
    file: 'src/app/[locale]/document/pdf-to-txt/PdfToTxtClient.tsx',
    importLine: 'import { PDF_TO_TXT_FAQ } from "@/lib/faq-content";',
    replacements: [
      { from: 'PDF_TO_TXT_FAQ.map(', to: '(t.raw("faq.items") as any[]).map(' },
    ]
  },
];

const BASE = '/home/nikhil/Startup/SafeTools';
let totalFiles = 0;
let totalReplacements = 0;

for (const entry of REPLACEMENTS) {
  const filePath = `${BASE}/${entry.file}`;
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ${entry.file} not found`);
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  const shortName = entry.file.split('/').pop();

  // Remove the import line
  if (content.includes(entry.importLine)) {
    content = content.replace(entry.importLine + '\n', '');
    modified = true;
    totalReplacements++;
    console.log(`  [import] ${shortName}: Removed faq-content import`);
  } else {
    // Try with single quotes
    const singleQuoteImport = entry.importLine.replace(/"/g, "'");
    if (content.includes(singleQuoteImport)) {
      content = content.replace(singleQuoteImport + '\n', '');
      modified = true;
      totalReplacements++;
      console.log(`  [import] ${shortName}: Removed faq-content import (single quotes)`);
    }
  }

  // Apply replacements
  for (const r of entry.replacements) {
    if (content.includes(r.from)) {
      content = content.replace(r.from, r.to);
      modified = true;
      totalReplacements++;
      console.log(`  [usage] ${shortName}: ${r.from.substring(0, 40)}... → ${r.to.substring(0, 40)}...`);
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content);
    totalFiles++;
  }
}

console.log(`\n✅ Updated ${totalFiles} files with ${totalReplacements} replacements`);
