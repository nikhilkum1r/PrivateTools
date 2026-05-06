# 🛡️ PrivateTools Suite

**PrivateTools** is a professional-grade, 100% local-first document and media processing studio. Designed for high-stakes privacy, every byte of your data stays on your machine.

---

## 💎 Pro Studios

### 📄 Docs Master Studio
A dual-core document engine for DOCX, PPTX, and PDF.
- **WASM High-Fidelity Rendering**: Pixel-perfect visual preview of Word and PowerPoint files.
- **Semantic Fallback**: Automatic Mammoth.js integration for handling corrupted or complex structural files.
- **Interactive Edit Mode**: Modify DOCX content directly in the browser with `contentEditable` support.
- **Local Export**: Print to PDF or save as TXT without any server-side calls.

### 🎬 Video & Audio Lab
Advanced media manipulation using local FFmpeg WASM.
- **Batch Compression**: Reduce file size with quality-aware iterative encoding.
- **Format Conversion**: Transcode between MP4, WebM, MP3, WAV, and more.
- **Privacy First**: No video data is ever uploaded; all heavy lifting is done in your browser's memory threads.

### 🖼️ Image Powerhouse
High-precision image processing and metadata management.
- **Visual Editor**: Crop, rotate, and filter images with real-time feedback.
- **Metadata Shredder**: Strip EXIF and sensitive GPS data from your photos before sharing.
- **Favicon Master**: Generate multi-platform icon sets for developers.

### 🛠️ Developer Utility Matrix
A suite of tools for the modern engineer.
- **JSON/Base64/Hash**: Instant local parsing and transformation.
- **Bulk Renamer**: Pattern-based sequencing and asset management.
- **Secure Vault**: Military-grade AES-256 GCM encryption for local file storage.

---

## ⚡ Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Engines**: 
  - `ffmpeg.wasm` (Media)
  - `pptx2html-turbo` (PowerPoint WASM)
  - `docx-preview` (Word WASM)
  - `pdf-lib` (PDF Logic)
- **Styling**: Tailwind CSS + Framer Motion (Glassmorphism UI)
- **Deployment**: Optimized for Netlify with COOP/COEP isolation.

---

## 🔒 Privacy Manifesto

1. **Zero Server Reliance**: All parsing happens in your browser.
2. **No Tracking**: We don't use cookies or analytics that phone home.
3. **Data Sovereignty**: Your files never leave your `.next` client-side runtime.

---

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to enter the studio.

---

*Built with ❤️ for privacy enthusiasts.*
