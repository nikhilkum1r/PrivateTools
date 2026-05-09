export interface FAQItem {
  question: string;
  answer: string;
}

export const REMOVE_BG_FAQ: FAQItem[] = [
  {
    question: "How does the AI background remover work without uploading my photos?",
    answer: "Our tool uses a state-of-the-art AI model (RMBG-1.4/MODNet) that runs entirely inside your web browser using WebAssembly. When you select an image, the model is downloaded once to your browser's memory and processes the pixels locally. No data ever leaves your device."
  },
  {
    question: "Is this background remover really free?",
    answer: "Yes, it is 100% free with no usage limits, no watermarks, and no registration required. We believe high-quality privacy-first tools should be accessible to everyone."
  },
  {
    question: "What image formats are supported for background removal?",
    answer: "We support most common image formats including PNG, JPG, JPEG, WebP, and HEIC. The output is always a transparent PNG to preserve the removed background."
  },
  {
    question: "Can I remove backgrounds from high-resolution images?",
    answer: "Absolutely. Unlike many online tools that downscale your images, SafeTools processes your images at their original resolution (depending on your device's RAM) to ensure professional-grade results."
  },
  {
    question: "Is my privacy guaranteed?",
    answer: "Yes. Since the processing happens on your local machine, we never see your photos. Even if you disconnect your internet after the initial model load, the tool will still work perfectly."
  },
  {
    question: "Does it work on mobile devices?",
    answer: "Yes, it works on modern mobile browsers. However, since the AI model requires some processing power and RAM, it performs best on devices with at least 4GB of memory."
  }
];

export const IMAGE_CONVERTER_FAQ: FAQItem[] = [
  {
    question: "How many formats can I convert between?",
    answer: "You can convert between 150+ image formats, including modern ones like WebP, AVIF, and HEIC, as well as professional formats like PSD, TIFF, and RAW files."
  },
  {
    question: "Will I lose image quality during conversion?",
    answer: "We use high-quality encoding engines. You can manually adjust the quality/compression settings to ensure your output looks exactly how you want it, whether you're optimizing for web or print."
  },
  {
    question: "Can I convert HEIC photos from my iPhone to JPG?",
    answer: "Yes! Our converter is perfect for transforming HEIC files into widely compatible JPG or PNG formats directly in your browser without uploading them to a server."
  },
  {
    question: "Is there a limit to the number of files I can convert?",
    answer: "No. You can convert as many files as you want, one by one or in batches (depending on the tool module), completely for free."
  }
];

export const PDF_TOOLS_FAQ: FAQItem[] = [
  {
    question: "Is it safe to upload sensitive PDF documents?",
    answer: "With SafeTools, you never 'upload' your documents. All PDF operations — merging, splitting, compressing, or converting — happen locally on your computer. Your sensitive legal or financial documents stay private."
  },
  {
    question: "Can I merge different file types into a single PDF?",
    answer: "Yes, our PDF Merger allows you to combine multiple PDFs and various image formats (JPG, PNG, etc.) into one professional PDF document."
  },
  {
    question: "Does the PDF compressor reduce text quality?",
    answer: "Our compression engine is designed to optimize images and fonts within the PDF while keeping the text sharp and searchable. You can choose different compression levels based on your needs."
  }
];

export const WORD_TO_PDF_FAQ: FAQItem[] = [
  {
    question: "How do I convert Word to PDF online for free?",
    answer: "Upload your DOC or DOCX document, wait for the conversion process to finish, and download the generated PDF file instantly."
  },
  {
    question: "Is this Word to PDF converter secure?",
    answer: "Yes. Browser-based processing helps keep your documents private and secure during conversion."
  },
  {
    question: "Can I convert DOCX to PDF without losing formatting?",
    answer: "Yes. The converter is designed to preserve fonts, layout, spacing, headings, and document structure as accurately as possible."
  },
  {
    question: "Does the converter add watermarks?",
    answer: "No. Exported PDF files remain clean without unwanted branding or watermarks."
  },
  {
    question: "Can I use this tool on mobile devices?",
    answer: "Yes. The converter works on Android phones, iPhones, tablets, and desktop browsers."
  },
  {
    question: "Is registration required?",
    answer: "No. You can convert Word documents to PDF without creating an account."
  },
  {
    question: "What is the difference between DOC and DOCX?",
    answer: "DOC is the older Microsoft Word format, while DOCX is the newer XML-based format with improved compatibility and smaller file sizes."
  }
];

export const VIDEO_TOOLS_FAQ: FAQItem[] = [
  {
    question: "Can I compress large video files in my browser?",
    answer: "Yes! Our Video Studio uses a high-performance FFmpeg WASM engine that runs locally. You can compress MP4, MOV, and WebM files directly in your browser without uploading them to a server, ensuring 100% privacy for your personal videos."
  },
  {
    question: "Is there a file size limit for video conversion?",
    answer: "Since the processing happens locally, the limit depends on your device's RAM and browser capabilities. Most modern browsers can handle files up to 500MB-1GB smoothly."
  },
  {
    question: "What video formats can I convert between?",
    answer: "We support major formats like MP4, WebM, MOV, and GIF. You can also extract audio from videos and convert it to MP3 or WAV formats."
  }
];

export const AUDIO_TOOLS_FAQ: FAQItem[] = [
  {
    question: "How do I trim an audio file locally?",
    answer: "Simply upload your MP3 or WAV file to our Audio Studio. You can use the visual waveform editor to select the start and end points, and our tool will trim the file instantly using local processing—no server upload required."
  },
  {
    question: "Can I convert audio formats for free?",
    answer: "Yes, SafeTools offers free conversion between MP3, WAV, OGG, and AAC. All conversions are processed in your browser to maintain your privacy."
  }
];

export const METADATA_FAQ: FAQItem[] = [
  {
    question: "What kind of metadata can be removed from my files?",
    answer: "Our Metadata Scrubber can strip EXIF data (camera model, settings), GPS location coordinates, author information, and hidden document properties from images and PDFs."
  },
  {
    question: "Why should I remove metadata before sharing photos?",
    answer: "Photos often contain hidden GPS coordinates and time stamps that can reveal your exact location. Removing this metadata is a crucial step for protecting your privacy online."
  }
];

export const DEV_TOOLS_FAQ: FAQItem[] = [
  {
    question: "Is it safe to format JSON containing sensitive data?",
    answer: "Absolutely. Unlike other online JSON formatters, SafeTools processes your data 100% locally. Your sensitive JSON, Base64, or Hash data never touches our servers."
  },
  {
    question: "Can I convert JSON to CSV for Excel?",
    answer: "Yes, our Data Converter allows you to transform JSON structures into CSV tables instantly, which you can then open in Excel or Google Sheets."
  }
];

export const SECURITY_FAQ: FAQItem[] = [
  {
    question: "How secure is the client-side encryption?",
    answer: "We use military-grade AES-256 GCM encryption. Since the encryption keys and processing happen entirely in your browser's memory, even we cannot access your encrypted files. Only someone with your password can decrypt them."
  },
  {
    question: "What is steganography?",
    answer: "Steganography is the art of hiding secret messages inside seemingly innocent files. Our tool allows you to hide text inside images invisibly using Least Significant Bit (LSB) encoding."
  }
];

export const QR_FAQ: FAQItem[] = [
  {
    question: "Are the QR codes I generate permanent?",
    answer: "Yes! Since we generate 'Static' QR codes, they will never expire. They don't rely on any external redirect servers, so they work forever once printed or shared."
  },
  {
    question: "Can I customize the look of my QR code?",
    answer: "Yes, you can adjust colors, add logos, and change the dot patterns to match your brand, all while keeping the processing private and local."
  }
];

export const COMPRESSOR_FAQ: FAQItem[] = [
  {
    question: "Is SafeTools image compression private?",
    answer: "Yes. All compression happens locally in your browser. Your files are never uploaded to servers."
  },
  {
    question: "Which image formats are supported?",
    answer: "SafeTools supports JPG, JPEG, PNG, WEBP, AVIF, GIF, SVG, HEIC, TIFF, BMP, ICO and more."
  },
  {
    question: "Can I compress multiple images?",
    answer: "Yes. Batch compression is supported for faster processing."
  },
  {
    question: "Does compression reduce image quality?",
    answer: "You can choose between high-quality compression and maximum file reduction using quality controls."
  },
  {
    question: "Is this tool free?",
    answer: "Yes. The image compressor is completely free to use."
  }
];

export const PASSWORD_CHECKER_FAQ: FAQItem[] = [
  {
    question: "Is it safe to type my real passwords into this checker?",
    answer: "Absolutely. SafeTools is built on a 'Zero-Server' architecture. This means the code that analyzes your password runs entirely inside your web browser on your computer. Your password never leaves your device, is never logged, and is never seen by us or anyone else."
  },
  {
    question: "How does the tool calculate password strength?",
    answer: "We use a combination of entropy calculation (measuring the randomness of the string) and pattern matching (checking for common words, sequences, and keyboard patterns). This provides a realistic estimate of how long a brute-force attack would take to crack your password."
  },
  {
    question: "Does this tool check if my password has been leaked in a breach?",
    answer: "Yes, we perform a local heuristic check for common leaked patterns. For real-time global breach checking, we use privacy-preserving k-Anonymity queries (where only a small portion of your password's hash is sent), ensuring your full password remains 100% private."
  },
  {
    question: "Why should I use a long passphrase instead of a complex short password?",
    answer: "Length is the most significant factor in password entropy. A long passphrase made of several random words is often much harder for computers to crack than a short password with symbols, yet it is significantly easier for humans to remember."
  },
  {
    question: "Does SafeTools store any of my data?",
    answer: "No. All analysis is performed in volatile browser memory. As soon as you close the tab or refresh the page, all entered data and analysis results are permanently wiped from your device's RAM."
  }
];

export const PASSWORD_GENERATOR_FAQ: FAQItem[] = [
  {
    question: "How does the password generator create 'truly random' passwords?",
    answer: "SafeTools uses the Web Crypto API, which provides a Cryptographically Secure Pseudo-Random Number Generator (CSPRNG). Unlike standard random functions, this extracts high-quality randomness (entropy) from your operating system's underlying security layer, making the generated passwords mathematically impossible to predict."
  },
  {
    question: "Is it safer to generate a password offline?",
    answer: "Yes. By generating your password locally in your browser with SafeTools, you eliminate the risk of 'man-in-the-middle' attacks where a server-side generator could be intercepted or logged. Your generated secrets exist only in your browser's memory."
  },
  {
    question: "Can I generate passwords for all types of accounts?",
    answer: "Absolutely. You can customize the length and include uppercase letters, lowercase letters, numbers, and symbols to meet the specific requirements of any website or application while maintaining maximum security."
  },
  {
    question: "Why does SafeTools not store my generated passwords?",
    answer: "Our core philosophy is 'Zero-Server' privacy. Storing passwords on a server creates a centralized target for hackers. By not storing anything, we ensure that you are the only person who ever sees your generated secret."
  },
  {
    question: "What is the recommended password length for 2026?",
    answer: "For critical accounts like email or banking, we recommend a minimum of 16 to 24 characters. Our tool defaults to 24 characters to provide high-entropy protection that is resistant to modern brute-force and dictionary attacks."
  }
];

export const COLOR_PICKER_FAQ: FAQItem[] = [
  {
    question: "Is the image color picker free?",
    answer: "Yes, the tool is completely free to use with no hidden costs or limits."
  },
  {
    question: "Are my images uploaded to servers?",
    answer: "No. All processing happens locally inside your browser using the Canvas API. Your images never leave your device."
  },
  {
    question: "Which image formats are supported?",
    answer: "We support PNG, JPG, JPEG, WEBP, GIF, SVG, AVIF, BMP, ICO, and more."
  },
  {
    question: "Can I export Tailwind CSS colors?",
    answer: "Yes. Our tool allows you to instantly export generated palettes into Tailwind-ready configuration objects or CSS variables."
  },
  {
    question: "Does the tool work on mobile devices?",
    answer: "Yes. The tool is fully responsive and optimized for mobile browsers, allowing you to extract colors from your gallery or camera capture."
  },
  {
    question: "Can I use the extracted palettes commercially?",
    answer: "Absolutely. Any color palette generated with SafeTools can be used in personal or commercial projects without attribution."
  }
];

export const IMAGE_EDITOR_FAQ = [
  {
    question: "Is the online image editor free to use?",
    answer: "Yes, our image editor is 100% free with no hidden fees, watermarks, or subscription requirements. All premium editing tools are available at no cost."
  },
  {
    question: "Are my photos uploaded to your servers?",
    answer: "No. SafeTools uses advanced browser technology to process all image edits locally on your device. Your photos never leave your computer or smartphone."
  },
  {
    question: "Does this editor work on mobile devices?",
    answer: "Yes, the editor is fully responsive and optimized for both iOS and Android browsers. You can crop, resize, and edit photos directly on your phone."
  },
  {
    question: "What image formats are supported?",
    answer: "We support a wide range of formats including PNG, JPG, JPEG, WEBP, SVG, GIF, BMP, AVIF, TIFF, and even professional formats like HEIC and PSD for basic viewing."
  },
  {
    question: "Can I remove backgrounds with this tool?",
    answer: "Yes, we offer an AI-powered background removal tool within the editor that allows you to isolate subjects and create transparent backgrounds instantly."
  },
  {
    question: "Is registration or signup required?",
    answer: "No. You can start editing immediately without creating an account or providing any personal information."
  }
];

export const OCR_FAQ: FAQItem[] = [
  {
    question: "Is the OCR tool free?",
    answer: "Yes. The OCR tool is completely free to use without any hidden costs, watermarks, or subscription requirements."
  },
  {
    question: "Are my files uploaded to servers?",
    answer: "No. All OCR processing happens locally in your browser using WebAssembly. Your images never leave your device, ensuring maximum privacy and security."
  },
  {
    question: "Which languages are supported?",
    answer: "Our tool supports multiple global languages including English, Hindi, Spanish, French, German, Arabic, Chinese, Japanese, Korean, and many more."
  },
  {
    question: "Can I extract text from handwritten notes?",
    answer: "Yes. Our AI-powered OCR engine supports handwriting recognition for notes, assignments, journals, and whiteboard content."
  },
  {
    question: "Does OCR work on PDFs?",
    answer: "Yes. You can extract text from scanned PDFs and image-based documents by converting them into digital, editable text."
  },
  {
    question: "Can I use OCR on mobile devices?",
    answer: "Yes. The tool is fully responsive and works on modern smartphones and tablets directly through your web browser."
  },
  {
    question: "Is registration required?",
    answer: "No. You can start extracting text immediately without creating an account or providing any personal information."
  }
];

export const PDF_TO_TXT_FAQ: FAQItem[] = [
  {
    question: "How do I convert PDF to TXT online for free?",
    answer: "Upload your PDF file, allow the tool to process the document, and download the extracted TXT file instantly."
  },
  {
    question: "Is this PDF to TXT converter secure?",
    answer: "Yes. Browser-based processing helps keep files private without requiring uploads to external servers."
  },
  {
    question: "Can I extract text from scanned PDFs?",
    answer: "If OCR support is enabled, scanned PDFs and image-based PDFs can also be processed for text extraction."
  },
  {
    question: "Does the converter preserve formatting?",
    answer: "TXT files store plain text only, so advanced formatting such as images, tables, and styles may not be preserved."
  },
  {
    question: "Can I use this converter on mobile devices?",
    answer: "Yes. The converter works on Android phones, iPhones, tablets, and desktop systems."
  },
  {
    question: "Is registration required?",
    answer: "No. You can convert PDF files to TXT without creating an account."
  },
  {
    question: "Does this tool add watermarks?",
    answer: "No. Downloaded TXT files remain clean and watermark-free."
  }
];

export const CASE_CONVERTER_FAQ: FAQItem[] = [
  {
    question: "What is a case converter?",
    answer: "A case converter is a tool that changes text formatting into different capitalization styles such as uppercase, lowercase, title case, camelCase, or snake_case."
  },
  {
    question: "Is this case converter free?",
    answer: "Yes. The tool is completely free to use online without registration."
  },
  {
    question: "Does the tool work offline?",
    answer: "Most browser-based processing can work locally after the page loads depending on your browser capabilities."
  },
  {
    question: "Is my text secure?",
    answer: "Yes. Text processing happens directly in your browser for better privacy and security."
  },
  {
    question: "Can developers use this tool?",
    answer: "Yes. The tool supports common programming naming conventions including camelCase, PascalCase, snake_case, and kebab-case."
  },
  {
    question: "Can I use the tool on mobile devices?",
    answer: "Yes. The case converter works on phones, tablets, laptops, and desktop systems."
  },
  {
    question: "Does the tool support large text input?",
    answer: "Yes. You can convert paragraphs, articles, code snippets, or large blocks of text efficiently."
  }
];

export const WORD_COUNTER_FAQ: FAQItem[] = [
  {
    question: "What is a word counter?",
    answer: "A word counter is a tool that calculates the number of words, characters, sentences, paragraphs, and other writing statistics in text."
  },
  {
    question: "Is this word counter free?",
    answer: "Yes. The tool is completely free to use online without registration."
  },
  {
    question: "Does the tool count characters?",
    answer: "Yes. It counts total characters, characters without spaces, words, sentences, and paragraphs."
  },
  {
    question: "Is my text secure?",
    answer: "Yes. Text processing happens directly in your browser for better privacy and security."
  },
  {
    question: "Can I use this tool for SEO writing?",
    answer: "Yes. The tool helps optimize blog posts, articles, metadata, and other SEO content by tracking text length and readability."
  },
  {
    question: "Does the word counter work on mobile devices?",
    answer: "Yes. The tool works on Android, iPhone, tablets, laptops, and desktop systems."
  },
  {
    question: "Can the tool handle large text?",
    answer: "Yes. You can analyze long articles, essays, scripts, reports, and documents efficiently."
  }
];

export const DATA_CONVERTER_FAQ: FAQItem[] = [
  {
    question: "What is a data converter?",
    answer: "A data converter is a tool that transforms information between different structured, encoded, or programming-related formats."
  },
  {
    question: "Is this data converter free?",
    answer: "Yes. The tool is completely free to use online."
  },
  {
    question: "Is my data secure?",
    answer: "Yes. Processing happens locally in your browser for better privacy and security."
  },
  {
    question: "Can developers use this tool for APIs?",
    answer: "Yes. The tool is ideal for API testing, JSON formatting, XML conversion, and backend development."
  },
  {
    question: "Does the converter support Base64 encoding?",
    answer: "Yes. You can encode and decode Base64 instantly."
  },
  {
    question: "Can I convert CSV to JSON?",
    answer: "Yes. The tool supports CSV, JSON, XML, YAML, and many other formats."
  },
  {
    question: "Does the tool work on mobile devices?",
    answer: "Yes. The converter works on phones, tablets, laptops, and desktop browsers."
  }
];
