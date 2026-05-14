/**
 * Phase 2: Migrate FAQ content from faq-content.ts into namespace JSON files
 * 
 * This script reads the hardcoded FAQ arrays from faq-content.ts and injects
 * them into the corresponding namespace JSON files under a "faq.items" key.
 */

const fs = require('fs');
const path = require('path');

const EN_DIR = path.join(__dirname, '..', 'src', 'i18n', 'messages', 'en');

// Map: faq-content.ts constant → { jsonFile, namespace, path to inject }
const FAQ_MIGRATIONS = {
  compressor: {
    file: 'compressor.json',
    ns: 'compressor',
    items: [
      { question: "Is SafeTools image compression private?", answer: "Yes. All compression happens locally in your browser. Your files are never uploaded to servers." },
      { question: "Which image formats are supported?", answer: "SafeTools supports JPG, JPEG, PNG, WEBP, AVIF, GIF, SVG, HEIC, TIFF, BMP, ICO and more." },
      { question: "Can I compress multiple images?", answer: "Yes. Batch compression is supported for faster processing." },
      { question: "Does compression reduce image quality?", answer: "You can choose between high-quality compression and maximum file reduction using quality controls." },
      { question: "Is this tool free?", answer: "Yes. The image compressor is completely free to use." }
    ]
  },
  audio: {
    file: 'audio.json',
    ns: 'audio',
    items: [
      { question: "How do I trim an audio file locally?", answer: "Simply upload your MP3 or WAV file to our Audio Studio. You can use the visual waveform editor to select the start and end points, and our tool will trim the file instantly using local processingno server upload required." },
      { question: "Can I convert audio formats for free?", answer: "Yes, SafeTools offers free conversion between MP3, WAV, OGG, and AAC. All conversions are processed in your browser to maintain your privacy." }
    ]
  },
  video_studio: {
    file: 'video_studio.json',
    ns: 'video_studio',
    items: [
      { question: "Can I compress large video files in my browser?", answer: "Yes! Our Video Studio uses a high-performance FFmpeg WASM engine that runs locally. You can compress MP4, MOV, and WebM files directly in your browser without uploading them to a server, ensuring 100% privacy for your personal videos." },
      { question: "Is there a file size limit for video conversion?", answer: "Since the processing happens locally, the limit depends on your device's RAM and browser capabilities. Most modern browsers can handle files up to 500MB-1GB smoothly." },
      { question: "What video formats can I convert between?", answer: "We support major formats like MP4, WebM, MOV, and GIF. You can also extract audio from videos and convert it to MP3 or WAV formats." }
    ]
  },
  image_editor: {
    file: 'image_editor.json',
    ns: 'image_editor',
    items: [
      { question: "Is the online image editor free to use?", answer: "Yes, our image editor is 100% free with no hidden fees, watermarks, or subscription requirements. All premium editing tools are available at no cost." },
      { question: "Are my photos uploaded to your servers?", answer: "No. SafeTools uses advanced browser technology to process all image edits locally on your device. Your photos never leave your computer or smartphone." },
      { question: "Does this editor work on mobile devices?", answer: "Yes, the editor is fully responsive and optimized for both iOS and Android browsers. You can crop, resize, and edit photos directly on your phone." },
      { question: "What image formats are supported?", answer: "We support a wide range of formats including PNG, JPG, JPEG, WEBP, SVG, GIF, BMP, AVIF, TIFF, and even professional formats like HEIC and PSD for basic viewing." },
      { question: "Can I remove backgrounds with this tool?", answer: "Yes, we offer an AI-powered background removal tool within the editor that allows you to isolate subjects and create transparent backgrounds instantly." },
      { question: "Is registration or signup required?", answer: "No. You can start editing immediately without creating an account or providing any personal information." }
    ]
  },
  ocr: {
    file: 'ocr.json',
    ns: 'ocr',
    items: [
      { question: "Is the OCR tool free?", answer: "Yes. The OCR tool is completely free to use without any hidden costs, watermarks, or subscription requirements." },
      { question: "Are my files uploaded to servers?", answer: "No. All OCR processing happens locally in your browser using WebAssembly. Your images never leave your device, ensuring maximum privacy and security." },
      { question: "Which languages are supported?", answer: "Our tool supports multiple global languages including English, Hindi, Spanish, French, German, Arabic, Chinese, Japanese, Korean, and many more." },
      { question: "Can I extract text from handwritten notes?", answer: "Yes. Our AI-powered OCR engine supports handwriting recognition for notes, assignments, journals, and whiteboard content." },
      { question: "Does OCR work on PDFs?", answer: "Yes. You can extract text from scanned PDFs and image-based documents by converting them into digital, editable text." },
      { question: "Can I use OCR on mobile devices?", answer: "Yes. The tool is fully responsive and works on modern smartphones and tablets directly through your web browser." },
      { question: "Is registration required?", answer: "No. You can start extracting text immediately without creating an account or providing any personal information." }
    ]
  },
  color_lab: {
    file: 'color_lab.json',
    ns: 'color_lab',
    // Replace the existing 2-item FAQ with the full 6-item one
    replaceItems: true,
    items: [
      { question: "Is the image color picker free?", answer: "Yes, the tool is completely free to use with no hidden costs or limits." },
      { question: "Are my images uploaded to servers?", answer: "No. All processing happens locally inside your browser using the Canvas API. Your images never leave your device." },
      { question: "Which image formats are supported?", answer: "We support PNG, JPG, JPEG, WEBP, GIF, SVG, AVIF, BMP, ICO, and more." },
      { question: "Can I export Tailwind CSS colors?", answer: "Yes. Our tool allows you to instantly export generated palettes into Tailwind-ready configuration objects or CSS variables." },
      { question: "Does the tool work on mobile devices?", answer: "Yes. The tool is fully responsive and optimized for mobile browsers, allowing you to extract colors from your gallery or camera capture." },
      { question: "Can I use the extracted palettes commercially?", answer: "Absolutely. Any color palette generated with SafeTools can be used in personal or commercial projects without attribution." }
    ]
  },
  password_generator: {
    file: 'password_generator.json',
    ns: 'password_generator',
    replaceItems: true,
    items: [
      { question: "How does the password generator create 'truly random' passwords?", answer: "SafeTools uses the Web Crypto API, which provides a Cryptographically Secure Pseudo-Random Number Generator (CSPRNG). Unlike standard random functions, this extracts high-quality randomness (entropy) from your operating system's underlying security layer, making the generated passwords mathematically impossible to predict." },
      { question: "Is it safer to generate a password offline?", answer: "Yes. By generating your password locally in your browser with SafeTools, you eliminate the risk of 'man-in-the-middle' attacks where a server-side generator could be intercepted or logged. Your generated secrets exist only in your browser's memory." },
      { question: "Can I generate passwords for all types of accounts?", answer: "Absolutely. You can customize the length and include uppercase letters, lowercase letters, numbers, and symbols to meet the specific requirements of any website or application while maintaining maximum security." },
      { question: "Why does SafeTools not store my generated passwords?", answer: "Our core philosophy is 'Zero-Server' privacy. Storing passwords on a server creates a centralized target for hackers. By not storing anything, we ensure that you are the only person who ever sees your generated secret." },
      { question: "What is the recommended password length for 2026?", answer: "For critical accounts like email or banking, we recommend a minimum of 16 to 24 characters. Our tool defaults to 24 characters to provide high-entropy protection that is resistant to modern brute-force and dictionary attacks." }
    ]
  }
};

let totalModified = 0;

for (const [key, config] of Object.entries(FAQ_MIGRATIONS)) {
  const filePath = path.join(EN_DIR, config.file);

  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ${config.file} not found, skipping`);
    continue;
  }

  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const ns = data[config.ns];

  if (!ns) {
    console.log(`⚠️  Namespace "${config.ns}" not found in ${config.file}, skipping`);
    continue;
  }

  // Check if faq section exists
  if (ns.faq && ns.faq.items && !config.replaceItems) {
    console.log(`ℹ️  ${config.file} already has faq.items (${ns.faq.items.length} items), skipping`);
    continue;
  }

  // Add or replace faq items
  if (!ns.faq) {
    ns.faq = {};
  }

  // Preserve existing title/description if present
  const existingTitle = ns.faq.title;
  const existingDesc = ns.faq.description;

  ns.faq.items = config.items;

  // Ensure title and description exist
  if (!existingTitle) {
    const prettyName = config.ns.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    ns.faq.title = `${prettyName} FAQ`;
    ns.faq.description = `Frequently asked questions about ${prettyName}.`;
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
  totalModified++;
  console.log(`✅ ${config.file}: Added ${config.items.length} FAQ items`);
}

console.log(`\n🎯 Modified ${totalModified} JSON files`);
