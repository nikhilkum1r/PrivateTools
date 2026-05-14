/**
 * Phase 2 Extended: Complete FAQ migration and create missing namespace JSON files.
 */

const fs = require('fs');
const path = require('path');

const EN_DIR = path.join(__dirname, '..', 'src', 'i18n', 'messages', 'en');

// Ensure directory exists
if (!fs.existsSync(EN_DIR)) {
  fs.mkdirSync(EN_DIR, { recursive: true });
}

const FAQ_DATA = {
  REMOVE_BG_FAQ: [
    { question: "How does the AI background remover work without uploading my photos?", answer: "Our tool uses a state-of-the-art AI model (RMBG-1.4/MODNet) that runs entirely inside your web browser using WebAssembly. When you select an image, the model is downloaded once to your browser's memory and processes the pixels locally. No data ever leaves your device." },
    { question: "Is this background remover really free?", answer: "Yes, it is 100% free with no usage limits, no watermarks, and no registration required. We believe high-quality privacy-first tools should be accessible to everyone." },
    { question: "What image formats are supported for background removal?", answer: "We support most common image formats including PNG, JPG, JPEG, WebP, and HEIC. The output is always a transparent PNG to preserve the removed background." },
    { question: "Can I remove backgrounds from high-resolution images?", answer: "Absolutely. Unlike many online tools that downscale your images, SafeTools processes your images at their original resolution (depending on your device's RAM) to ensure professional-grade results." },
    { question: "Is my privacy guaranteed?", answer: "Yes. Since the processing happens on your local machine, we never see your photos. Even if you disconnect your internet after the initial model load, the tool will still work perfectly." },
    { question: "Does it work on mobile devices?", answer: "Yes, it works on modern mobile browsers. However, since the AI model requires some processing power and RAM, it performs best on devices with at least 4GB of memory." }
  ],
  IMAGE_CONVERTER_FAQ: [
    { question: "How many formats can I convert between?", answer: "You can convert between 150+ image formats, including modern ones like WebP, AVIF, and HEIC, as well as professional formats like PSD, TIFF, and RAW files." },
    { question: "Will I lose image quality during conversion?", answer: "We use high-quality encoding engines. You can manually adjust the quality/compression settings to ensure your output looks exactly how you want it, whether you're optimizing for web or print." },
    { question: "Can I convert HEIC photos from my iPhone to JPG?", answer: "Yes! Our converter is perfect for transforming HEIC files into widely compatible JPG or PNG formats directly in your browser without uploading them to a server." },
    { question: "Is there a limit to the number of files I can convert?", answer: "No. You can convert as many files as you want, one by one or in batches (depending on the tool module), completely for free." }
  ],
  PDF_TOOLS_FAQ: [
    { question: "Is it safe to upload sensitive PDF documents?", answer: "With SafeTools, you never 'upload' your documents. All PDF operations  merging, splitting, compressing, or converting  happen locally on your computer. Your sensitive legal or financial documents stay private." },
    { question: "Can I merge different file types into a single PDF?", answer: "Yes, our PDF Merger allows you to combine multiple PDFs and various image formats (JPG, PNG, etc.) into one professional PDF document." },
    { question: "Does the PDF compressor reduce text quality?", answer: "Our compression engine is designed to optimize images and fonts within the PDF while keeping the text sharp and searchable. You can choose different compression levels based on your needs." }
  ],
  WORD_TO_PDF_FAQ: [
    { question: "How do I convert Word to PDF online for free?", answer: "Upload your DOC or DOCX document, wait for the conversion process to finish, and download the generated PDF file instantly." },
    { question: "Is this Word to PDF converter secure?", answer: "Yes. Browser-based processing helps keep your documents private and secure during conversion." },
    { question: "Can I convert DOCX to PDF without losing formatting?", answer: "Yes. The converter is designed to preserve fonts, layout, spacing, headings, and document structure as accurately as possible." },
    { question: "Does the converter add watermarks?", answer: "No. Exported PDF files remain clean without unwanted branding or watermarks." },
    { question: "Can I use this tool on mobile devices?", answer: "Yes. The converter works on Android phones, iPhones, tablets, and desktop browsers." },
    { question: "Is registration required?", answer: "No. You can convert Word documents to PDF without creating an account." },
    { question: "What is the difference between DOC and DOCX?", answer: "DOC is the older Microsoft Word format, while DOCX is the newer XML-based format with improved compatibility and smaller file sizes." }
  ],
  PDF_TO_TXT_FAQ: [
    { question: "How do I convert PDF to TXT online for free?", answer: "Upload your PDF file, allow the tool to process the document, and download the extracted TXT file instantly." },
    { question: "Is this PDF to TXT converter secure?", answer: "Yes. Browser-based processing helps keep files private without requiring uploads to external servers." },
    { question: "Can I extract text from scanned PDFs?", answer: "If OCR support is enabled, scanned PDFs and image-based PDFs can also be processed for text extraction." },
    { question: "Does the converter preserve formatting?", answer: "TXT files store plain text only, so advanced formatting such as images, tables, and styles may not be preserved." },
    { question: "Can I use this converter on mobile devices?", answer: "Yes. The converter works on Android phones, iPhones, tablets, and desktop systems." },
    { question: "Is registration required?", answer: "No. You can convert PDF files to TXT without creating an account." },
    { question: "Does this tool add watermarks?", answer: "No. Downloaded TXT files remain clean and watermark-free." }
  ],
  CASE_CONVERTER_FAQ: [
    { question: "What is a case converter?", answer: "A case converter is a tool that changes text formatting into different capitalization styles such as uppercase, lowercase, title case, camelCase, or snake_case." },
    { question: "Is this case converter free?", answer: "Yes. The tool is completely free to use online without registration." },
    { question: "Does the tool work offline?", answer: "Most browser-based processing can work locally after the page loads depending on your browser capabilities." },
    { question: "Is my text secure?", answer: "Yes. Text processing happens directly in your browser for better privacy and security." },
    { question: "Can developers use this tool?", answer: "Yes. The tool supports common programming naming conventions including camelCase, PascalCase, snake_case, and kebab-case." },
    { question: "Can I use the tool on mobile devices?", answer: "Yes. The case converter works on phones, tablets, laptops, and desktop systems." },
    { question: "Does the tool support large text input?", answer: "Yes. You can convert paragraphs, articles, code snippets, or large blocks of text efficiently." }
  ],
  WORD_COUNTER_FAQ: [
    { question: "What is a word counter?", answer: "A word counter is a tool that calculates the number of words, characters, sentences, paragraphs, and other writing statistics in text." },
    { question: "Is this word counter free?", answer: "Yes. The tool is completely free to use online without registration." },
    { question: "Does the tool count characters?", answer: "Yes. It counts total characters, characters without spaces, words, sentences, and paragraphs." },
    { question: "Is my text secure?", answer: "Yes. Text processing happens directly in your browser for better privacy and security." },
    { question: "Can I use this tool for SEO writing?", answer: "Yes. The tool helps optimize blog posts, articles, metadata, and other SEO content by tracking text length and readability." },
    { question: "Does the word counter work on mobile devices?", answer: "Yes. The tool works on Android, iPhone, tablets, laptops, and desktop systems." },
    { question: "Can the tool handle large text?", answer: "Yes. You can analyze long articles, essays, scripts, reports, and documents efficiently." }
  ],
  DATA_CONVERTER_FAQ: [
    { question: "What is a data converter?", answer: "A data converter is a tool that transforms information between different structured, encoded, or programming-related formats." },
    { question: "Is this data converter free?", answer: "Yes. The tool is completely free to use online." },
    { question: "Is my data secure?", answer: "Yes. Processing happens locally in your browser for better privacy and security." },
    { question: "Can developers use this tool for APIs?", answer: "Yes. The tool is ideal for API testing, JSON formatting, XML conversion, and backend development." },
    { question: "Does the converter support Base64 encoding?", answer: "Yes. You can encode and decode Base64 instantly." },
    { question: "Can I convert CSV to JSON?", answer: "Yes. The tool supports CSV, JSON, XML, YAML, and many other formats." },
    { question: "Does the tool work on mobile devices?", answer: "Yes. The converter works on phones, tablets, laptops, and desktop browsers." }
  ],
  PASSWORD_CHECKER_FAQ: [
    { question: "Is it safe to type my real passwords into this checker?", answer: "Absolutely. SafeTools is built on a 'Zero-Server' architecture. This means the code that analyzes your password runs entirely inside your web browser on your computer. Your password never leaves your device, is never logged, and is never seen by us or anyone else." },
    { question: "How does the tool calculate password strength?", answer: "We use a combination of entropy calculation (measuring the randomness of the string) and pattern matching (checking for common words, sequences, and keyboard patterns). This provides a realistic estimate of how long a brute-force attack would take to crack your password." },
    { question: "Does this tool check if my password has been leaked in a breach?", answer: "Yes, we perform a local heuristic check for common leaked patterns. For real-time global breach checking, we use privacy-preserving k-Anonymity queries (where only a small portion of your password's hash is sent), ensuring your full password remains 100% private." },
    { question: "Why should I use a long passphrase instead of a complex short password?", answer: "Length is the most significant factor in password entropy. A long passphrase made of several random words is often much harder for computers to crack than a short password with symbols, yet it is significantly easier for humans to remember." },
    { question: "Does SafeTools store any of my data?", answer: "No. All analysis is performed in volatile browser memory. As soon as you close the tab or refresh the page, all entered data and analysis results are permanently wiped from your device's RAM." }
  ],
  METADATA_FAQ: [
    { question: "What kind of metadata can be removed from my files?", answer: "Our Metadata Scrubber can strip EXIF data (camera model, settings), GPS location coordinates, author information, and hidden document properties from images and PDFs." },
    { question: "Why should I remove metadata before sharing photos?", answer: "Photos often contain hidden GPS coordinates and time stamps that can reveal your exact location. Removing this metadata is a crucial step for protecting your privacy online." }
  ]
};

const MIGRATION_MAP = {
  'background_remover': { file: 'background_remover.json', data: FAQ_DATA.REMOVE_BG_FAQ, replace: true },
  'image_converter': { file: 'image_converter.json', data: FAQ_DATA.IMAGE_CONVERTER_FAQ, replace: true },
  'word_to_pdf': { file: 'word_to_pdf.json', data: FAQ_DATA.WORD_TO_PDF_FAQ, create: true },
  'pdf_to_txt': { file: 'pdf_to_txt.json', data: FAQ_DATA.PDF_TO_TXT_FAQ, create: true },
  'case_converter': { file: 'case_converter.json', data: FAQ_DATA.CASE_CONVERTER_FAQ, create: true },
  'word_counter': { file: 'word_counter.json', data: FAQ_DATA.WORD_COUNTER_FAQ, create: true },
  'data_converter': { file: 'data_converter.json', data: FAQ_DATA.DATA_CONVERTER_FAQ, replace: true },
  'password_checker': { file: 'password_checker.json', data: FAQ_DATA.PASSWORD_CHECKER_FAQ, create: true },
  'metadata_cleaner': { file: 'metadata_cleaner.json', data: FAQ_DATA.METADATA_FAQ, replace: true },
  'pdf_merge': { file: 'pdf_merge.json', data: FAQ_DATA.PDF_TOOLS_FAQ, replace: true },
  'split_pdf': { file: 'split_pdf.json', data: FAQ_DATA.PDF_TOOLS_FAQ, replace: true },
  'pdf_compress': { file: 'pdf_compress.json', data: FAQ_DATA.PDF_TOOLS_FAQ, replace: true }
};

for (const [ns, config] of Object.entries(MIGRATION_MAP)) {
  const filePath = path.join(EN_DIR, config.file);
  let content = {};

  if (fs.existsSync(filePath)) {
    content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } else if (!config.create) {
    console.log(`⚠️  ${config.file} missing and not marked for creation. Skipping.`);
    continue;
  }

  if (!content[ns]) content[ns] = {};
  if (!content[ns].faq) content[ns].faq = {};

  // Map q/a to question/answer for consistency if needed, but the FAQ component expects {question, answer}
  // Actually, some use {q, a} and some use {question, answer}. Let's standardize to {question, answer} in JSON, 
  // and components can map it if needed. Actually, the components I saw use f.q and f.a or f.question and f.answer.
  // Standardizing to {q, a} to match background_remover.json style.
  const formattedItems = config.data.map(item => ({ q: item.question, a: item.answer }));

  if (content[ns].faq.items && !config.replace) {
    console.log(`ℹ️  ${config.file} already has FAQ items. Skipping.`);
    continue;
  }

  content[ns].faq.items = formattedItems;

  if (!content[ns].faq.title) {
    content[ns].faq.title = "Frequently Asked Questions";
  }
  if (!content[ns].faq.description) {
    content[ns].faq.description = "Everything you need to know about our privacy-first tool.";
  }

  fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n');
  console.log(`✅ ${config.file}: Migrated ${formattedItems.length} items to namespace "${ns}"`);
}
