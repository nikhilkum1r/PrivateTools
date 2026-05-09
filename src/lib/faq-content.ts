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
    question: "How accurate is the Word to PDF conversion?",
    answer: "We use a high-fidelity rendering engine that preserves layouts, fonts, and images from your DOCX files, ensuring your PDF looks exactly like your Word document."
  },
  {
    question: "Do I need Microsoft Word installed?",
    answer: "No. Our tool works independently in your browser. You don't need Word or any other office software installed on your machine."
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
    question: "How much can I reduce my image size?",
    answer: "Our engine can often reduce image sizes by 70-90% while maintaining excellent visual quality. You can set a target file size (e.g., 50KB) and our tool will optimize the quality to meet that limit."
  },
  {
    question: "Is there a limit to the number of images I can compress?",
    answer: "No. You can compress hundreds of images in batches directly in your browser. Since there are no server uploads, the process is incredibly fast and respects your privacy."
  },
  {
    question: "Does it support WebP and AVIF compression?",
    answer: "Yes, we support compressing modern formats like WebP and AVIF, as well as standard JPEG and PNG files. You can also convert to these more efficient formats during compression."
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
