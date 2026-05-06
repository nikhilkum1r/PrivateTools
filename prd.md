# Product Requirements Document (PRD)
## PrivateTools — Privacy-First File Toolkit
**Version:** 2.0 (FINAL)
**Status:** Approved for Development
**Author:** Solo Developer
**Last Updated:** 2026-05-05

---

## Table of Contents

1. Overview
2. Target Audience & User Personas
3. Core Principles
4. Competitive Analysis
5. Monetization Model
6. Tech Stack
7. File & Folder Structure
8. Database Schema (Supabase)
9. Backend Architecture (API Routes)
10. Frontend Architecture
11. Information Architecture
12. UX Flow (Global)
13. Export & Sharing
14. Module Specifications
15. Error Handling & Edge Cases
16. Security Checklist
17. PWA Requirements
18. Non-Functional Requirements
19. File Size Limits (Free vs Pro)
20. UX Design Guidelines
21. SEO & Marketing Strategy
22. Analytics & Observability
23. Launch Checklist
24. Phase Roadmap & Sprint Plan
25. Open Questions
26. Risks & Mitigations
27. Success Metrics & KPIs
28. Changelog

---

## 1. Overview

### 1.1 Product Vision
PrivateTools is a modular, browser-based file utility toolkit built on a **privacy-first, zero-upload principle**. All processing happens locally on the user's device for free users. Pro users unlock server-side processing for heavy files and workloads.

### 1.2 Problem Statement
Most free online file tools (Smallpdf, iLovePDF, Convertio, TinyPNG) upload user files to third-party servers, creating privacy and security risks, often with opaque data retention policies. Users have no reliable, fast, offline-capable alternative that handles images, PDFs, video, audio, documents, and file privacy all in one place — with a clear, honest business model.

### 1.3 Positioning
> "Your files stay yours. Until you need more power."

- **Free tier:** Everything runs offline in your browser. Zero upload. Zero tracking.
- **Pro tier:** Opt-in server processing for heavy tasks (large video, large PDF, bulk batch jobs).

### 1.4 Product Scope Summary

| Module | Phase |
|---|---|
| Image Tools (convert, compress, resize, crop, rotate, batch, color picker) | Phase 1 |
| PDF Tools (merge, split, PDF→images) | Phase 1 |
| Privacy Tools (8 features) | Phase 1 |
| Video Tools (compress, trim, convert) | Phase 1.1 |
| Audio Tools (convert, trim) | Phase 1.1 |
| Document Tools (Word→PDF, PDF→TXT, TXT utils) | Phase 1.1 |
| QR Code Tools (generate, scan) | Phase 1.1 |
| Auth + Pro tier + Payments + File history | Phase 2 |
| Shareable links | Phase 2 |
| i18n, OCR, AI tools | Phase 3 |

---

## 2. Target Audience & User Personas

### 2.1 Primary Personas

**Persona 1 — The Privacy-Conscious Professional**
- Age: 28–45
- Job: Journalist, lawyer, healthcare worker, researcher
- Pain: Tools like Smallpdf store uploaded files on their servers for days
- Need: Strip metadata from files, encrypt documents, process sensitive PDFs locally
- Value prop: "I know nothing leaves my device"

**Persona 2 — The Student / Creator**
- Age: 18–28
- Job: Student, freelancer, content creator, YouTuber
- Pain: File too large for free online tools; no budget for Adobe Acrobat or Premiere Pro
- Need: Compress video, convert images in bulk, merge PDFs
- Value prop: Free up to reasonable limits; affordable Pro for heavy work

**Persona 3 — The Developer / Power User**
- Age: 22–40
- Job: Developer, designer, product manager
- Pain: Switching between 6 different tools for file tasks
- Need: One toolkit that does everything, fast, with keyboard shortcuts
- Value prop: All-in-one, offline-capable, no account required

**Persona 4 — The Small Business Owner**
- Age: 30–55
- Job: Freelancer, agency owner, accountant, HR manager
- Pain: Paying for multiple SaaS tools (Adobe, Smallpdf Pro, iLovePDF)
- Need: Merge/split invoices and contracts, batch compress product photos
- Value prop: One affordable Pro subscription replaces multiple tools

### 2.2 Anti-Personas (who this is NOT for)
- Enterprise teams needing collaboration, version control, and audit trails → use SharePoint / Google Drive
- Users needing real-time cloud sync → use Dropbox / iCloud
- Users needing AI-powered document understanding → Phase 3 scope

---

## 3. Core Principles

| Principle | Description |
|---|---|
| **Zero Upload (Free)** | Free tier: no file ever leaves the device. All processing is in-browser. |
| **Opt-in Server (Pro)** | Pro tier: user explicitly chooses server processing. Clear consent before upload. |
| **No Login Required (Phase 1)** | All Phase 1 features work without an account. |
| **Offline First** | App works fully as a PWA after first load. No internet needed after install. |
| **Progressive Disclosure** | Show only what's relevant to the current task. Never overwhelm. |
| **No Ads Ever** | Ads conflict with the privacy-first brand. Revenue via Pro tier only. |
| **Accessible by Default** | WCAG AA compliance. Keyboard navigable. Screen reader friendly. |
| **English Only (Phase 1)** | i18n deferred to Phase 2. Code uses string constants for future i18n. |

---

## 4. Competitive Analysis

| Tool | Privacy | Offline | All-in-one | Free limits | Price |
|---|---|---|---|---|---|
| **PrivateTools** | ✅ Zero upload (free) | ✅ PWA | ✅ 8 modules | Generous | ~$8/mo Pro |
| Smallpdf | ❌ Uploads to server | ❌ | Partial | 2 tasks/day | $12/mo |
| iLovePDF | ❌ Uploads to server | ❌ | PDF only | Limited | $8/mo |
| Convertio | ❌ Uploads to server | ❌ | Partial | 100 MB/file | $9.99/mo |
| TinyPNG | ❌ Uploads to server | ❌ | Image only | 20 images/month | $25/mo |
| Adobe Acrobat | ❌ Cloud | ❌ | PDF only | Trial | $19.99/mo |
| Squoosh (Google) | ✅ Local | ✅ | Image only | Unlimited | Free only |

**Key differentiators:**
1. Only tool with **zero-upload free tier AND server Pro tier** — covers both audiences
2. **Privacy Tools module** (metadata, encryption, steganography) — no competitor has this
3. **PWA + offline** — works on airplane mode, no account, installable
4. **All 8 modules in one app** — reduces tool-switching friction

---

## 5. Monetization Model

### 5.1 Core Logic

```
FREE  =  In-browser processing  (Canvas API, FFmpeg.wasm, pdf-lib, Web Crypto)
          → No server. No upload. No account needed. PWA works offline.

PRO   =  Server-side processing  (Next.js API routes → Supabase Edge Functions)
          → Triggered only for heavy files or bulk jobs exceeding browser limits.
          → User explicitly opts in — clear consent dialog before any upload.
```

### 5.2 Free vs Pro Feature Matrix

| Feature | Free | Pro |
|---|---|---|
| Image processing | ✅ Up to 20 MB, single file | ✅ Up to 200 MB, unlimited batch |
| PDF operations | ✅ Up to 50 MB | ✅ Up to 500 MB |
| Video compress/convert | ✅ Up to 200 MB (browser) | ✅ Up to 5 GB (server) |
| Audio processing | ✅ Up to 100 MB | ✅ Up to 1 GB |
| File Locker | ✅ Up to 100 MB | ✅ Up to 2 GB |
| Document tools | ✅ Up to 10 MB | ✅ Up to 100 MB |
| Batch jobs | ❌ Single file | ✅ Unlimited batch |
| Shareable links | ❌ | ✅ Up to 2 GB, 72h expiry |
| File history | ❌ | ✅ Last 50 jobs, 30 days |
| Processing priority | ❌ | ✅ Priority queue |
| Account required | ❌ | ✅ Yes |

### 5.3 Payment Provider
**Recommendation: Lemon Squeezy**
- Merchant of record — handles VAT/GST globally (critical for solo dev)
- Simple webhook integration with Next.js
- No need for Stripe Tax setup
- Alternative: Stripe (more control, more complex tax compliance)

### 5.4 Pricing (Suggested — confirm after Phase 1 feedback)
- Monthly: **$8/month**
- Annual: **$64/year** (save 33%)
- No lifetime deal at launch — evaluate after 6 months

### 5.5 Upgrade Prompt UX
- Non-blocking modal: never interrupts mid-task
- Context-specific: "This video is 800 MB. Pro processes files up to 5 GB on our secure server."
- Always shows what Pro unlocks for that specific task — not a generic upsell

---

## 6. Tech Stack

### 6.1 Frontend

| Layer | Choice | Reason |
|---|---|---|
| Framework | **Next.js 14+ (App Router)** | SSG, file-based routing, `next/dynamic` for lazy WASM, static export for PWA, Vercel-native |
| Language | **TypeScript (strict mode)** | Type safety, self-documenting, safe refactoring for solo dev |
| Styling | **Tailwind CSS v3** | Zero runtime, purged unused styles, consistent design tokens |
| Components | **shadcn/ui** | Copy-paste Radix UI primitives, accessible, no npm lock-in, fully customizable |
| Icons | **Lucide React** | Tree-shakeable, consistent icon set, matches shadcn style |
| Dark mode | **next-themes** | System preference + manual toggle, zero flash on load |
| State | **Zustand** | ~1 KB, one store per module, no boilerplate, middleware for persistence |
| Forms | **React Hook Form + Zod** | Type-safe validation, integrates with shadcn form components |
| Animations | **Framer Motion** | Smooth tool transitions, drag-and-drop feedback, progress animations |
| PWA | **next-pwa (Workbox)** | Service Worker generation, CacheFirst strategy, update prompts |

### 6.2 Backend

| Layer | Choice | Reason |
|---|---|---|
| API | **Next.js API Routes** (`app/api/`) | Co-located, same deploy, TypeScript throughout |
| Runtime | **Node.js (Vercel Serverless)** | Default for Next.js, auto-scales |
| Heavy jobs | **Supabase Edge Functions** | Long-running video/PDF processing (avoid Vercel 10s timeout) |
| Job queue | **Supabase Edge Functions + pg_cron** | Trigger + poll pattern for async server jobs |
| File storage | **Supabase Storage** | Integrated with auth + RLS, S3-compatible, signed URLs |
| Database | **Supabase (PostgreSQL)** | Auth, RLS, real-time, storage — fully integrated |
| Auth | **Supabase Auth** (Phase 2) | Email + OAuth (Google, GitHub), RLS-integrated |
| Payments | **Lemon Squeezy** (recommended) | Webhook → update `users.is_pro` in Supabase |
| Email | **Supabase + Resend** (Phase 2) | Transactional emails (welcome, billing alerts) |

### 6.3 Processing Libraries

| Module | Library | Notes |
|---|---|---|
| Image convert/compress/resize/rotate | Canvas API (native) | Zero bundle cost, fast |
| Color palette extraction | `colorthief` | Canvas-based, lightweight |
| PDF merge / split | `pdf-lib` | Pure JS, no server for free tier |
| PDF render / preview | `pdfjs-dist` | Via Web Worker |
| Video + Audio (free, browser) | `@ffmpeg/ffmpeg` + `@ffmpeg/util` | FFmpeg.wasm v0.12+, lazy, multi-threaded |
| Video + Audio (Pro, server) | `fluent-ffmpeg` | Runs in Supabase Edge Function |
| Word → PDF | LibreOffice.wasm (spike first) | Fallback: `docx-preview` + print-to-PDF |
| PDF → TXT | `pdfjs-dist` text API | Reuses existing instance |
| QR generate | `qrcode` | Canvas/SVG/PNG |
| QR scan (image) | `jsQR` | Pure JS |
| QR scan (camera) | `@zxing/browser` | Better format support, mobile |
| Metadata read | `exifr` | Async, tree-shakeable, GPS |
| Metadata strip/write | `piexifjs` | JPEG/PNG EXIF |
| Encryption | Web Crypto API (native) | AES-GCM 256-bit, no third-party |
| Steganography | Custom Canvas LSB (~50 lines) | No library needed |
| Password strength | `zxcvbn` | Offline wordlist, crack time estimates |
| Map preview | `leaflet` + `react-leaflet` | Bundled locally, no API key |
| ZIP bundling | `jszip` | Batch download packaging |
| Drag-and-drop reorder | `@dnd-kit/core` | PDF page reorder, batch file reorder |

### 6.4 Dev Tooling

| Tool | Choice |
|---|---|
| Package manager | `pnpm` |
| Linting | ESLint + `eslint-config-next` + `eslint-plugin-tailwindcss` |
| Formatting | Prettier + `prettier-plugin-tailwindcss` |
| Git hooks | `husky` + `lint-staged` (lint + format + type-check on commit) |
| Testing (unit) | Vitest |
| Testing (component) | React Testing Library |
| Testing (E2E) | Playwright |
| CI/CD | GitHub Actions → Vercel (preview per PR, prod on main) |
| Error tracking | Sentry (free tier) |
| Env management | `.env.local` (dev), Vercel env vars (prod) |
| Supabase local dev | Supabase CLI (`supabase start`) |

### 6.5 Hosting & Services

| Service | Usage | Cost |
|---|---|---|
| **Vercel** | Frontend + API routes | Free (Hobby) → Pro at scale |
| **Supabase** | DB + Auth + Storage + Edge Functions | Free → Pro $25/mo at scale |
| **GitHub** | Source control + CI trigger | Free |
| **Lemon Squeezy** | Payments | 5% + $0.50 per transaction |
| **Resend** | Transactional email (Phase 2) | Free up to 3k/mo |
| **Sentry** | Error tracking | Free up to 5k errors/mo |

---

## 7. File & Folder Structure

```
privatetools/
│
├── app/                                        # Next.js App Router
│   ├── layout.tsx                              # Root layout: theme, nav, PWA meta
│   ├── page.tsx                                # Home / module picker
│   ├── globals.css                             # Tailwind base + CSS custom properties
│   │
│   ├── (tools)/                                # Route group (no URL effect)
│   │   ├── image/page.tsx                      # /image
│   │   ├── video/page.tsx                      # /video
│   │   ├── audio/page.tsx                      # /audio
│   │   ├── pdf/page.tsx                        # /pdf
│   │   ├── document/page.tsx                   # /document
│   │   ├── qr/page.tsx                         # /qr
│   │   └── privacy/page.tsx                    # /privacy
│   │
│   ├── (auth)/                                 # Auth pages (Phase 2)
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── callback/page.tsx                   # Supabase OAuth callback
│   │
│   ├── dashboard/                              # Pro user area (Phase 2)
│   │   ├── page.tsx                            # File history, usage stats
│   │   └── settings/page.tsx                   # Account, billing, subscription
│   │
│   ├── share/[token]/page.tsx                  # Shareable link download page (Phase 2)
│   │
│   └── api/                                    # Backend API Routes
│       ├── health/route.ts                     # GET — uptime check
│       ├── auth/
│       │   └── callback/route.ts               # Supabase OAuth handler
│       ├── user/
│       │   ├── profile/route.ts                # GET, PATCH
│       │   └── subscription/route.ts           # GET pro status + usage
│       ├── jobs/
│       │   ├── route.ts                        # POST — create processing job
│       │   └── [jobId]/route.ts                # GET — poll job status
│       ├── files/
│       │   ├── upload/route.ts                 # POST — signed upload URL
│       │   ├── share/route.ts                  # POST — create shareable link
│       │   └── [fileId]/route.ts               # GET, DELETE
│       └── webhooks/
│           └── payments/route.ts               # POST — Lemon Squeezy webhook
│
├── components/
│   ├── ui/                                     # shadcn/ui (auto-generated)
│   │   ├── button.tsx
│   │   ├── slider.tsx
│   │   ├── input.tsx
│   │   ├── progress.tsx
│   │   ├── dialog.tsx
│   │   ├── tabs.tsx
│   │   ├── badge.tsx
│   │   ├── toast.tsx
│   │   ├── tooltip.tsx
│   │   ├── select.tsx
│   │   └── ...
│   │
│   ├── shared/                                 # Reused across all modules
│   │   ├── DropZone.tsx                        # Drag-and-drop file upload
│   │   ├── ProgressBar.tsx                     # Processing progress
│   │   ├── ExportPanel.tsx                     # Download/Copy/Share buttons
│   │   ├── PrivacyBadge.tsx                    # "No data leaves your device"
│   │   ├── ProBadge.tsx                        # "Processing on secure server"
│   │   ├── FileSizeWarning.tsx                 # Pre-upload size warning
│   │   ├── ProUpgradeModal.tsx                 # Contextual upgrade prompt
│   │   ├── DisclaimerModal.tsx                 # Legal disclaimers (injector, steg)
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── ThemeToggle.tsx
│   │
│   └── modules/                                # Per-module components
│       ├── image/
│       │   ├── ImageToolPanel.tsx
│       │   ├── ColorPalette.tsx
│       │   └── BatchUploader.tsx
│       ├── video/
│       │   ├── VideoToolPanel.tsx
│       │   └── VideoTrimmer.tsx
│       ├── audio/
│       │   ├── AudioToolPanel.tsx
│       │   └── WaveformPreview.tsx
│       ├── pdf/
│       │   ├── PDFToolPanel.tsx
│       │   ├── PDFPageReorder.tsx              # @dnd-kit drag-to-reorder
│       │   └── PDFPreview.tsx
│       ├── document/
│       │   └── DocumentToolPanel.tsx
│       ├── qr/
│       │   ├── QRGenerator.tsx
│       │   └── QRScanner.tsx
│       └── privacy/
│           ├── MetadataViewer.tsx
│           ├── MetadataRemover.tsx
│           ├── MetadataInjector.tsx
│           ├── FileLocker.tsx
│           ├── SecureNote.tsx
│           ├── Steganography.tsx
│           ├── PasswordChecker.tsx
│           └── FileShredder.tsx
│
├── lib/                                        # Pure TypeScript business logic
│   ├── image/
│   │   ├── convert.ts
│   │   ├── compress.ts
│   │   ├── resize.ts
│   │   ├── crop.ts
│   │   ├── rotate.ts
│   │   └── palette.ts
│   ├── video/
│   │   └── ffmpeg.ts                           # FFmpeg.wasm loader + ops
│   ├── audio/
│   │   └── ffmpeg.ts                           # Shared FFmpeg instance
│   ├── pdf/
│   │   ├── merge.ts
│   │   ├── split.ts
│   │   ├── toImages.ts
│   │   └── extractText.ts
│   ├── document/
│   │   ├── wordToPdf.ts
│   │   └── txtUtils.ts
│   ├── qr/
│   │   ├── generate.ts
│   │   └── scan.ts
│   ├── privacy/
│   │   ├── metadata.ts
│   │   ├── crypto.ts                           # AES-GCM helpers
│   │   ├── steganography.ts                    # LSB encode/decode
│   │   ├── shredder.ts
│   │   └── passwordStrength.ts
│   ├── supabase/
│   │   ├── client.ts                           # Browser singleton
│   │   ├── server.ts                           # Server client (API routes)
│   │   └── admin.ts                            # Service role — server only
│   ├── api/
│   │   ├── jobs.ts                             # Job polling client
│   │   └── files.ts                            # File operations client
│   └── utils/
│       ├── fileSize.ts                         # Format bytes → "2.4 MB"
│       ├── mimeDetect.ts                       # Magic bytes file type detection
│       ├── download.ts                         # createObjectURL + revoke
│       ├── zip.ts                              # JSZip batch download
│       ├── limits.ts                           # Free/Pro limit constants
│       └── strings.ts                          # All UI strings (i18n-ready)
│
├── store/                                      # Zustand stores
│   ├── imageStore.ts
│   ├── videoStore.ts
│   ├── audioStore.ts
│   ├── pdfStore.ts
│   ├── documentStore.ts
│   ├── qrStore.ts
│   ├── privacyStore.ts
│   └── userStore.ts                            # Auth state, pro status
│
├── workers/                                    # Web Worker scripts
│   ├── ffmpeg.worker.ts                        # FFmpeg.wasm (video + audio)
│   ├── pdf.worker.ts                           # PDF.js render
│   └── image.worker.ts                         # Batch image processing
│
├── hooks/
│   ├── useDropZone.ts
│   ├── useWorker.ts                            # Generic Web Worker hook
│   ├── useProStatus.ts
│   ├── useFileLimit.ts                         # Check file vs free/pro limits
│   └── useExport.ts                            # Download/copy/share logic
│
├── types/
│   ├── modules.ts                              # ImageOptions, VideoOptions etc.
│   ├── api.ts                                  # API request/response types
│   ├── database.ts                             # Supabase row types (generated)
│   └── supabase.ts
│
├── middleware.ts                               # Auth guard: /dashboard, /api/jobs, /api/files
│
├── public/
│   ├── manifest.json                           # PWA manifest
│   ├── sw.js                                   # Service Worker (next-pwa generated)
│   ├── icons/
│   │   ├── icon-192.png
│   │   ├── icon-512.png
│   │   └── icon-512-maskable.png
│   ├── ffmpeg/                                 # Static WASM binaries
│   │   ├── ffmpeg-core.js
│   │   ├── ffmpeg-core.wasm
│   │   └── ffmpeg-core.worker.js
│   ├── wordlists/
│   │   └── common-passwords.json              # Top 10k passwords (zxcvbn)
│   └── og/
│       └── og-image.png                       # Open Graph image (1200×630)
│
├── supabase/
│   ├── config.toml                            # Supabase CLI config
│   ├── migrations/
│   │   ├── 0001_create_users.sql
│   │   ├── 0002_create_file_history.sql
│   │   ├── 0003_create_processing_jobs.sql
│   │   ├── 0004_create_shared_files.sql
│   │   └── 0005_rls_policies.sql
│   ├── seed.sql                               # Dev seed data
│   └── functions/
│       ├── process-video/index.ts             # Server FFmpeg (Pro)
│       ├── process-pdf/index.ts               # Server PDF ops (Pro)
│       └── cleanup-expired-files/index.ts     # pg_cron daily cleanup
│
├── .env.local                                 # Never committed
├── .env.example                               # Template — committed
├── .gitignore
├── next.config.js                             # COOP/COEP headers, PWA, static export
├── vercel.json                                # COOP/COEP headers for Vercel
├── tailwind.config.ts
├── tsconfig.json                              # strict: true
├── vitest.config.ts
├── playwright.config.ts
└── package.json
```

---

## 8. Database Schema (Supabase / PostgreSQL)

> Phase 1 ships with NO database. Schema below activates in Phase 2.

### 8.1 `users`

```sql
CREATE TABLE public.users (
  id                      UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email                   TEXT NOT NULL,
  display_name            TEXT,
  avatar_url              TEXT,
  is_pro                  BOOLEAN NOT NULL DEFAULT FALSE,
  pro_expires_at          TIMESTAMPTZ,
  payment_provider        TEXT,                    -- 'lemon_squeezy' | 'stripe'
  payment_customer_id     TEXT,
  payment_subscription_id TEXT,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users: select own"  ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users: update own"  ON public.users FOR UPDATE USING (auth.uid() = id);

CREATE INDEX idx_users_is_pro ON public.users(is_pro);
```

### 8.2 `file_history`

```sql
CREATE TABLE public.file_history (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  module            TEXT NOT NULL,   -- 'image'|'video'|'audio'|'pdf'|'document'|'qr'|'privacy'
  tool              TEXT NOT NULL,   -- 'compress'|'convert'|'merge'|'encrypt' etc.
  input_filename    TEXT NOT NULL,
  output_filename   TEXT,
  input_size_bytes  BIGINT,
  output_size_bytes BIGINT,
  processing_mode   TEXT NOT NULL DEFAULT 'local',  -- 'local' | 'server'
  status            TEXT NOT NULL DEFAULT 'completed',
  error_message     TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.file_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "file_history: select own" ON public.file_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "file_history: insert own" ON public.file_history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "file_history: delete own" ON public.file_history FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_file_history_user_created ON public.file_history(user_id, created_at DESC);

-- Auto-delete after 30 days
-- SELECT cron.schedule('cleanup-history', '0 0 * * *',
--   $$DELETE FROM public.file_history WHERE created_at < NOW() - INTERVAL '30 days'$$);
```

### 8.3 `processing_jobs`

```sql
CREATE TABLE public.processing_jobs (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  module              TEXT NOT NULL,
  tool                TEXT NOT NULL,
  status              TEXT NOT NULL DEFAULT 'pending',
                      -- 'pending'|'processing'|'completed'|'failed'|'expired'
  input_storage_path  TEXT,
  output_storage_path TEXT,
  options             JSONB,
  error_message       TEXT,
  progress_pct        INTEGER DEFAULT 0,
  expires_at          TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '24 hours'),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.processing_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "jobs: select own" ON public.processing_jobs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "jobs: insert own" ON public.processing_jobs FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_jobs_user_status ON public.processing_jobs(user_id, status, created_at DESC);
```

### 8.4 `shared_files`

```sql
CREATE TABLE public.shared_files (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  share_token       TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  storage_path      TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_size_bytes   BIGINT NOT NULL,
  mime_type         TEXT,
  download_count    INTEGER NOT NULL DEFAULT 0,
  max_downloads     INTEGER,             -- NULL = unlimited
  password_hash     TEXT,               -- NULL = no password
  expires_at        TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '72 hours'),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.shared_files ENABLE ROW LEVEL SECURITY;
CREATE POLICY "shared_files: public read"  ON public.shared_files FOR SELECT USING (TRUE);
CREATE POLICY "shared_files: insert own"   ON public.shared_files FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "shared_files: delete own"   ON public.shared_files FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_shared_files_token   ON public.shared_files(share_token);
CREATE INDEX idx_shared_files_expires ON public.shared_files(expires_at);
```

### 8.5 Supabase Storage Buckets

```
privatetools-jobs/            Private. Signed URLs via admin client.
  └── {user_id}/{job_id}/
      ├── input.{ext}
      └── output.{ext}

privatetools-shared/          Public read via signed URL. Owner write/delete.
  └── {user_id}/{share_token}/
      └── {filename}
```

---

## 9. Backend Architecture (API Routes)

### 9.1 API Route Map

```
GET   /api/health                   → Uptime check
GET   /api/auth/callback            → OAuth handler
GET   /api/user/profile             → User profile + pro status
PATCH /api/user/profile             → Update name/avatar
GET   /api/user/subscription        → Plan, expiry, usage stats
POST  /api/jobs                     → Create server-side job (Pro)
GET   /api/jobs/:jobId              → Poll job status + progress
POST  /api/files/upload             → Get signed Supabase Storage upload URL
POST  /api/files/share              → Create shareable link
GET   /api/files/:fileId            → File metadata
DELETE /api/files/:fileId           → Delete shared file
POST  /api/webhooks/payments        → Payment provider webhook
```

### 9.2 Server Job Flow (Pro)

```
1.  User submits large file
2.  Frontend calls POST /api/jobs
3.  API validates: user is Pro, file type, file size within Pro limits
4.  API generates signed upload URL from Supabase Storage
5.  Returns { jobId, uploadUrl } to frontend
6.  Frontend uploads file DIRECTLY to Supabase Storage (never through API server)
7.  Frontend calls POST /api/jobs/confirm
8.  API inserts processing_jobs row (status: 'pending')
9.  API invokes Supabase Edge Function (process-video / process-pdf)
10. Edge Function updates progress_pct periodically
11. Edge Function sets status: 'completed', output_storage_path
12. Frontend polls GET /api/jobs/:jobId every 2 seconds
13. On completed: frontend fetches signed download URL
14. File downloaded directly from Supabase Storage to user's device
15. Input file deleted from Storage immediately after processing
16. Output file deleted after 24 hours (pg_cron)
```

### 9.3 Payment Webhook Flow

```
1.  Payment provider sends webhook to POST /api/webhooks/payments
2.  API verifies webhook signature (HMAC — reject if invalid)
3.  Check timestamp within 5 minutes (replay attack prevention)
4.  Parse event type:
    - subscription_created  → is_pro = true, set pro_expires_at
    - subscription_renewed  → update pro_expires_at
    - subscription_cancelled → schedule is_pro = false for expiry date
    - payment_failed        → send email via Resend, keep Pro active for grace period
5.  Use idempotency key (event ID) to prevent double-processing
6.  Update public.users row using admin client
7.  Return HTTP 200
```

### 9.4 Environment Variables

```bash
# .env.example

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key       # Server only

# App
NEXT_PUBLIC_APP_URL=https://privatetools.app
NEXT_PUBLIC_APP_NAME=PrivateTools

# Payments
PAYMENT_WEBHOOK_SECRET=your-webhook-signing-secret
NEXT_PUBLIC_PAYMENT_LINK_PRO_MONTHLY=https://...
NEXT_PUBLIC_PAYMENT_LINK_PRO_ANNUAL=https://...

# Email (Phase 2)
RESEND_API_KEY=your-resend-key

# Monitoring
NEXT_PUBLIC_SENTRY_DSN=https://...
SENTRY_AUTH_TOKEN=your-sentry-auth-token
```

---

## 10. Frontend Architecture

### 10.1 Processing Decision Tree

```
User submits file + options
         ↓
  Check vs FREE limit (lib/utils/limits.ts)
         ↓
  Within limit?
  ├── YES → Run in Web Worker (Canvas / FFmpeg.wasm / pdf-lib)
  │          Show progress bar
  │          Export result (download / copy / share)
  │
  └── NO  → Is user logged in + Pro?
            ├── YES → Consent dialog: "This file will be uploaded to our
            │         secure server for processing. It will be deleted
            │         within 24 hours."
            │         → POST /api/jobs → poll → download
            │
            └── NO  → ProUpgradeModal (contextual message)
                       "This 800 MB video exceeds the 200 MB free limit.
                        Pro processes files up to 5 GB."
                       [Upgrade to Pro] [Process smaller file]
```

### 10.2 Web Worker Pattern

```
Main Thread (UI)                     Web Worker
────────────────                     ───────────
useWorker hook
  postMessage({ file, options })  →  receive message
                                     run FFmpeg / pdf-lib / Canvas
                                     postMessage({ type: 'progress', pct: 45 })
  ← setProgress(45)              ←
                                     postMessage({ type: 'result', blob: Blob })
  ← setResult(blob)              ←
  ← trigger download
```

### 10.3 Zustand Store Shape (example)

```typescript
// store/imageStore.ts
interface ImageStore {
  file: File | null
  options: ImageOptions
  status: 'idle' | 'processing' | 'done' | 'error'
  progress: number
  resultBlob: Blob | null
  errorMessage: string | null
  setFile: (file: File) => void
  setOptions: (opts: Partial<ImageOptions>) => void
  setProgress: (pct: number) => void
  setResult: (blob: Blob) => void
  setError: (msg: string) => void
  reset: () => void
}
```

### 10.4 Key Next.js Config

```javascript
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    { urlPattern: /\/ffmpeg\//, handler: 'CacheFirst',
      options: { cacheName: 'ffmpeg-wasm', expiration: { maxAgeSeconds: 60 * 60 * 24 * 30 } } }
  ]
});

module.exports = withPWA({
  output: 'export',
  experimental: { turbo: {} },
  async headers() {
    return [{
      source: '/(.*)',
      headers: [
        { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
        { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
      ],
    }];
  },
});
```

---

## 11. Information Architecture

```
PrivateTools
├── Home / Module Picker                  /
├── 🖼️  Image Tools                       /image
├── 🎬  Video Tools                        /video
├── 🎵  Audio Tools                        /audio
├── 📄  PDF Tools                          /pdf
├── 📝  Document Tools                     /document
├── 🔗  QR Code Tools                      /qr
├── 🔐  Privacy Tools                      /privacy
├── 📦  Share Download Page               /share/[token]     (Phase 2)
├── 📊  Pro Dashboard                      /dashboard         (Phase 2)
│   └── ⚙️  Settings                       /dashboard/settings
└── 🔐  Auth                              /login, /signup    (Phase 2)
```

---

## 12. UX Flow (Global)

```
Step 1 → Upload       Drag-and-drop or file picker. Multi-file supported.
Step 2 → Detect       Auto-detect MIME type. Highlight relevant module.
Step 3 → Configure    Options shown contextually after upload only.
Step 4 → Size check   Free limit → in-browser. Over limit → Pro prompt.
Step 5 → Process      Web Worker (free) or Server job (Pro). Progress bar shown.
Step 6 → Export       Download / Copy to clipboard / Share / Generate link (Pro).
Step 7 → Reset        Clear button resets state without page reload.
```

---

## 13. Export & Sharing

| Option | Free | Pro | Implementation |
|---|---|---|---|
| Download | ✅ | ✅ | `createObjectURL` + anchor click + `revokeObjectURL` |
| Copy to clipboard | ✅ images | ✅ | `navigator.clipboard.write()` |
| Share (Web Share API) | ✅ mobile | ✅ | `navigator.share()` — shown only if supported |
| Shareable link (72h) | ❌ | ✅ | Supabase Storage + `shared_files` table |

---

## 14. Module Specifications

### 14.1 Image Tools
- Convert: JPG ↔ PNG ↔ WebP
- Compress: quality slider 1–100, estimated output size shown before download
- Resize: px or %, lock aspect ratio, preview dimensions
- Crop: numeric input (Phase 1.2: interactive canvas handles)
- Rotate: 90° / 180° / 270°; Flip: H / V
- Batch: multiple files, same op, ZIP download (jszip)
- Color Picker: 5–10 dominant colors, hex/RGB/HSL, one-click copy
- Free: 20 MB/file | Pro: 200 MB/file, unlimited batch

### 14.2 Video Tools
- Compress: Low/Medium/High/Custom CRF; estimated output size
- Trim: start/end scrubber (HH:MM:SS); clip duration preview
- Convert: MP4 ↔ WebM ↔ MOV ↔ AVI
- FFmpeg.wasm: lazy-loaded, Web Worker, SharedArrayBuffer multi-threading
- Free: 200 MB (browser) | Pro: 5 GB (server FFmpeg)

### 14.3 Audio Tools
- Convert: MP3 ↔ WAV ↔ OGG ↔ AAC ↔ FLAC; bitrate selector for MP3
- Trim: start/end time; Canvas waveform preview
- Free: 100 MB | Pro: 1 GB

### 14.4 PDF Tools
- PDF → Images: JPG/PNG, 72/150/300 DPI, ZIP for multi-page
- Merge: 2+ PDFs, @dnd-kit drag-to-reorder, single output
- Split: page range input (e.g., "1-3, 5, 7-9")
- Free: 50 MB | Pro: 500 MB
- Out of scope Phase 1: text editing, annotations, form fill

### 14.5 Document Tools
- Word → PDF: .docx → PDF (LibreOffice.wasm; fallback: print-to-PDF)
- PDF → TXT: pdfjs-dist text extraction, paragraph structure
- TXT: word/char/line count; remove duplicates/blanks; trim; case; Base64/URL encode/decode
- Free: 10 MB (docx), 1 MB (txt)

### 14.6 QR Code Tools
- Generate: URL/text/email/phone/WiFi/vCard; size/colors/error correction (L/M/Q/H); PNG or SVG
- Scan (image): jsQR; decoded text + copy; auto "Open Link" if URL
- Scan (camera): @zxing/browser; HTTPS required; graceful fallback to image upload

### 14.7 Privacy Tools

| Tool | Key Behaviour | Disclaimer |
|---|---|---|
| Metadata Viewer | Show GPS/device/timestamps; Leaflet map pin if GPS found | None |
| Metadata Remover | Strip all or selected EXIF; before/after comparison | None |
| Metadata Injector | Set fake GPS/date/device; inject into JPEG/PNG | ⚠️ Required before use |
| File Locker | AES-GCM 256-bit encrypt/decrypt; `.locked` file | "Lost password = unrecoverable" |
| Secure Note | Encrypt/decrypt typed text; stateless; AES-GCM | None |
| Steganography | LSB hide/reveal in PNG; optional password | ⚠️ Required before use |
| Password Checker | zxcvbn offline; strength/entropy/crack time; top 10k check | None |
| File Shredder | 1/3/7 pass random byte overwrite | ⚠️ Mandatory before download |

---

## 15. Error Handling & Edge Cases

### 15.1 File Upload Errors
| Scenario | Behaviour |
|---|---|
| File exceeds free limit | Show FileSizeWarning before processing; offer Pro upgrade |
| Unsupported file type | Show clear error: "This tool supports JPG, PNG, WebP" |
| File is corrupted / unreadable | Catch parse error; show: "This file appears to be corrupted." |
| User uploads JPEG for steganography | Show warning: "Steganography requires PNG. JPEG compression destroys hidden data." |
| Zero-byte file | Detect and reject before processing |
| User uploads wrong `.locked` format | Detect magic bytes; show: "This doesn't appear to be a PrivateTools locked file." |

### 15.2 Processing Errors
| Scenario | Behaviour |
|---|---|
| FFmpeg.wasm crashes mid-job | Catch worker error; show toast: "Processing failed. Try a smaller file or reload." |
| PDF.js fails to render page | Show placeholder page with error indicator; allow other pages to render |
| Web Crypto API unavailable | Detect on load; show: "Encryption requires HTTPS. Please access this app over HTTPS." |
| SharedArrayBuffer blocked (no COOP/COEP) | FFmpeg falls back to single-threaded mode; show performance warning |
| Server job times out (Pro) | Set job status to 'failed'; show retry option; auto-refund if recurring issue |

### 15.3 Network / PWA Errors
| Scenario | Behaviour |
|---|---|
| App opened offline (first load) | Show: "No internet connection. Please connect to install PrivateTools." |
| App opened offline (after PWA install) | Works fully — all free features available offline |
| FFmpeg.wasm not yet cached + offline | Show: "Video tools require an internet connection on first use. Once loaded, they work offline." |
| Server job attempted offline (Pro) | Detect offline; show: "Server processing requires internet. Your file was not uploaded." |
| Supabase unreachable (Phase 2) | Auth/Pro features degrade gracefully; free features still work |

### 15.4 Edge Cases
- Batch upload with mixed file types → process only compatible files, show skipped files list
- PDF with 0 pages → detect and reject with clear message
- PDF with password protection → detect and show: "This PDF is password protected. Remove the password first."
- QR code image too blurry to scan → show: "QR code not detected. Try a clearer image."
- Camera permission denied → auto-switch to image upload mode with explanation
- User closes tab mid-processing → no data leak (all in memory); no recovery needed (stateless)

---

## 16. Security Checklist

### Client-side
- [ ] Web Crypto API used for all encryption — no third-party crypto libraries
- [ ] Passwords never stored in state or localStorage — only held in memory during operation
- [ ] AES-GCM IV (initialization vector) generated fresh per encrypt operation
- [ ] File object URLs revoked immediately after download trigger
- [ ] No file data written to IndexedDB or localStorage in Phase 1
- [ ] HTTPS enforced — detect HTTP and show warning for crypto + camera features
- [ ] MIME type validated from file buffer magic bytes (not just file extension)

### Server-side (Phase 2)
- [ ] All API routes validate Supabase session before processing
- [ ] Pro status checked server-side — never trust client claims
- [ ] Service role key only used in server API routes — never in client bundle
- [ ] Payment webhook signature verified (HMAC) before processing
- [ ] Webhook timestamp checked (< 5 min) to prevent replay attacks
- [ ] Idempotency key stored per webhook event to prevent double-processing
- [ ] Supabase RLS enabled and tested on all tables
- [ ] Uploaded files deleted from Storage immediately after server processing completes
- [ ] Shared files auto-deleted after 72 hours via pg_cron
- [ ] Input sanitisation on all API route parameters (Zod schema validation)
- [ ] Rate limiting on API routes (Vercel or Supabase rate limiter)
- [ ] COOP + COEP headers on all routes (required for SharedArrayBuffer)
- [ ] Content Security Policy (CSP) header configured

### Legal / Ethical
- [ ] Metadata Injector: disclaimer displayed before tool loads
- [ ] Steganography: disclaimer displayed before tool loads
- [ ] File Shredder: mandatory disclaimer must be acknowledged before download
- [ ] Privacy policy clearly states: free tier = zero upload, Pro = opt-in upload with 24h deletion
- [ ] Terms of service: prohibits illegal use of Metadata Injector and Steganography

---

## 17. PWA Requirements

| Requirement | Implementation |
|---|---|
| Installable | Web App Manifest: name, short_name, icons (192 + 512 + maskable), theme_color, display: standalone |
| Offline (app shell) | Workbox CacheFirst for all JS/CSS/HTML |
| Offline (WASM) | FFmpeg.wasm cached after first Video/Audio module open |
| Offline (maps) | Leaflet tiles cached NetworkFirst with fallback |
| Update detection | SW checks on launch; "Update available — refresh" banner shown |
| HTTPS | Enforced — required for SW, Web Crypto, camera, SharedArrayBuffer |
| COOP/COEP | Configured in next.config.js + vercel.json |
| Install prompt | Custom install button in Navbar (shown when `beforeinstallprompt` fires) |

---

## 18. Non-Functional Requirements

### Performance
| Metric | Target |
|---|---|
| LCP (4G) | < 3 seconds |
| Image processing (< 5 MB) | < 5 seconds |
| FFmpeg.wasm initial load | Lazy — only on first Video/Audio open |
| API response (health) | < 200ms |
| Server job (Pro) polling | Every 2 seconds; complete status within 30s for most ops |
| Bundle size (initial JS) | < 200 KB gzipped (excluding WASM) |

### Browser Support
- Chrome 90+, Edge 90+, Firefox 90+, Safari 15+
- No browser extensions required
- Camera: HTTPS required
- SharedArrayBuffer: COOP/COEP required (Chrome 92+, Firefox 79+, Safari 15.2+)

### Reliability
- Vercel SLA: 99.99% uptime for frontend
- Supabase SLA: 99.9% uptime for DB/Auth
- Graceful degradation: free features work even if Supabase is down

### Accessibility (WCAG AA)
- Keyboard fully navigable (Tab, Enter, Space, Arrow keys)
- ARIA labels on all interactive elements
- Focus indicators visible on all focusable elements
- Colour contrast ratio ≥ 4.5:1 (text), ≥ 3:1 (large text, UI components)
- Screen reader tested with VoiceOver (macOS) and NVDA (Windows)
- No motion for users with `prefers-reduced-motion`

### Code Quality
- TypeScript strict mode throughout
- ESLint + Prettier enforced on every commit (husky + lint-staged)
- Unit tests: Vitest — all crypto helpers, processing logic, utility functions
- E2E tests: Playwright — upload → process → download for each module's happy path
- CI: GitHub Actions → lint + type-check + test → Vercel preview deploy per PR

---

## 19. File Size Limits (Free vs Pro)

| File Type | Free | Pro |
|---|---|---|
| Images | 20 MB | 200 MB |
| PDFs | 50 MB | 500 MB |
| Video | 200 MB (browser) | 5 GB (server) |
| Audio | 100 MB | 1 GB |
| Documents (.docx) | 10 MB | 100 MB |
| TXT | 1 MB | 10 MB |
| File Locker | 100 MB | 2 GB |
| Shareable files | ❌ | 2 GB, 72h expiry |

---

## 20. UX Design Guidelines

### Branding
| Element | Value |
|---|---|
| Recommended name | PrivateTools |
| Alternatives | ZeroLeak, SafeFiles, LocalConvert |
| Tagline | "Your files stay yours." |
| Trust badge (free) | "No data leaves your device" |
| Pro badge | "Processing on our secure server" |
| Font | Inter (system stack fallback) |
| Background (dark) | `slate-900` (#0f172a) |
| Background (light) | `slate-50` (#f8fafc) |
| Accent | `violet-500` (#8b5cf6) — privacy/security associations |

### Theme System
- Dark mode default — builds trust for a privacy product
- Light mode via `next-themes` toggle in Navbar
- Respects `prefers-color-scheme` on first visit
- No flash of unstyled content (next-themes handles this)

### Component Patterns
- **Upload zone:** Large, dashed border, file type hint, thumbnail/page count preview after drop
- **Action panel:** Hidden until file is uploaded — reduces cognitive load
- **Progress bar:** Shown for all operations > 1 second; never block UI
- **Pro upgrade modal:** Non-blocking, contextual, explains exact benefit for the current task
- **Disclaimer modal:** Blocking for Injector/Steganography/Shredder — user must acknowledge before proceeding
- **Export panel:** Download (primary), Copy (images only), Share (mobile), Reset (always)
- **Keyboard shortcuts:** `Cmd/Ctrl + U` = upload, `Cmd/Ctrl + D` = download, `Esc` = reset

---

## 21. SEO & Marketing Strategy

### 21.1 SEO
- Static pages for each tool (SSG via Next.js) — fully crawlable
- Page titles: "Free Online [Tool] — No Upload Required | PrivateTools"
- Meta descriptions focused on privacy angle for each tool
- Open Graph image per module (1200×630)
- Canonical URLs, sitemap.xml, robots.txt
- Core Web Vitals optimised (LCP < 2.5s, CLS < 0.1, INP < 200ms)
- Target keywords per module:
  - Image: "compress image without uploading", "convert jpg to png offline"
  - PDF: "merge pdf without uploading", "split pdf browser"
  - Privacy: "remove exif data online", "encrypt file in browser"

### 21.2 Marketing Angles
- "The only file tool that never sees your files" — primary hook
- Privacy angle for HackerNews, Reddit r/privacy, r/netsec, r/selfhosted
- Tool comparison posts: "PrivateTools vs Smallpdf — What Happens to Your Files?"
- Product Hunt launch after Phase 1 stabilises (~4 weeks post-launch)
- Twitter/X thread: "I built a file toolkit where the code processes everything in your browser. Here's how."

### 21.3 Referral / Growth (Phase 2)
- "Powered by PrivateTools" watermark on shared file download page (removable with Pro)
- Free users can remove watermark by sharing on social

---

## 22. Analytics & Observability

### 22.1 Analytics
**Tool:** Plausible Analytics (privacy-respecting, no cookies, GDPR-compliant)

**Events to track (no PII):**
- `module_opened` (module name)
- `file_uploaded` (module, file type, size bucket: <1MB / 1-10MB / 10-50MB / 50MB+)
- `processing_started` (module, tool, mode: local/server)
- `processing_completed` (module, tool, duration_ms)
- `processing_failed` (module, tool, error_type)
- `export_triggered` (module, export_type: download/copy/share/link)
- `upgrade_modal_shown` (module, tool, file_size_bucket)
- `upgrade_clicked` (module, plan: monthly/annual)
- `pwa_install_triggered`

### 22.2 Error Tracking
**Tool:** Sentry (free tier — 5k errors/month)

- Capture all unhandled errors + Web Worker errors
- Tag errors with: module, tool, browser, OS
- Alert on error rate spike > 5% within 10 minutes
- Never capture file content — only error type and stack trace

### 22.3 Performance Monitoring
- Vercel Analytics: Core Web Vitals per page
- Custom timing: `performance.mark()` around processing start/end
- Log to Sentry as breadcrumbs for debugging slow jobs

### 22.4 Uptime Monitoring
- **Tool:** Better Uptime or UptimeRobot (free tier)
- Monitor: `/api/health`, Supabase project URL
- Alert via email + Slack on downtime

---

## 23. Launch Checklist

### Pre-Launch (Phase 1)
- [ ] All Phase 1 modules tested: Image, PDF, Privacy (all 8 tools)
- [ ] PWA installable and works fully offline
- [ ] COOP/COEP headers verified on Vercel (test SharedArrayBuffer)
- [ ] HTTPS enforced
- [ ] Privacy badge visible on every tool screen
- [ ] Disclaimers working on Metadata Injector, Steganography, Shredder
- [ ] File size limits enforced with clear user-facing messages
- [ ] All error scenarios handled (see Section 15)
- [ ] Lighthouse score: Performance ≥ 90, Accessibility ≥ 90, SEO ≥ 90
- [ ] Core Web Vitals: LCP < 2.5s, CLS < 0.1, INP < 200ms
- [ ] Cross-browser tested: Chrome, Firefox, Safari, Edge
- [ ] Mobile tested: iOS Safari, Android Chrome
- [ ] Dark mode and light mode verified
- [ ] Keyboard navigation verified
- [ ] Privacy policy page published
- [ ] Terms of service page published
- [ ] OG image set for all pages
- [ ] Sitemap.xml + robots.txt generated
- [ ] Plausible Analytics installed (no cookies)
- [ ] Sentry error tracking active
- [ ] Uptime monitor configured
- [ ] Brand name decided + domain purchased
- [ ] Vercel production domain configured

### Post-Launch (Week 1)
- [ ] Monitor Sentry for unexpected errors
- [ ] Check Plausible for most-used modules (prioritise Phase 1.1)
- [ ] Submit to Product Hunt
- [ ] Post to relevant Reddit communities (r/privacy, r/selfhosted, r/webdev)

---

## 24. Phase Roadmap & Sprint Plan

### Phase Overview

| Phase | Scope | Est. Duration |
|---|---|---|
| **Phase 1** | Image, PDF, Privacy (8 tools), PWA | 4–6 weeks |
| **Phase 1.1** | Video, Audio, Document, QR, Color Picker | 4–6 weeks |
| **Phase 1.2** | Interactive crop, batch ZIP, metadata map, waveform trim | 2–3 weeks |
| **Phase 2** | Supabase auth, Pro tier, payments, shareable links, file history | 6–8 weeks |
| **Phase 3** | i18n, OCR, AI tools, mobile native app | TBD |

### Phase 1 Sprint Plan (Solo Dev)

**Week 1 — Foundation**
- Next.js project setup (TypeScript, Tailwind, shadcn, next-pwa)
- Folder structure scaffolded
- COOP/COEP headers configured and verified
- DropZone, ProgressBar, ExportPanel, PrivacyBadge components
- Zustand store pattern established (imageStore as template)
- `lib/utils/` complete (fileSize, mimeDetect, download, limits)

**Week 2 — Image Tools**
- Canvas API: convert, compress, resize, rotate/flip
- Batch processing + JSZip download
- Color Thief palette extractor
- Image Web Worker
- Image module E2E tests (Playwright)

**Week 3 — PDF Tools**
- pdf-lib: merge, split
- PDF.js: render to images, text extraction
- PDF page reorder (@dnd-kit)
- PDF Web Worker
- PDF module E2E tests

**Week 4 — Privacy Tools (Part 1)**
- Metadata Viewer (exifr + Leaflet)
- Metadata Remover (piexifjs)
- Metadata Injector + disclaimer
- File Locker (Web Crypto AES-GCM)

**Week 5 — Privacy Tools (Part 2) + PWA**
- Secure Note
- Steganography (Canvas LSB) + disclaimer
- Password Strength Checker (zxcvbn)
- File Shredder + mandatory disclaimer
- PWA: manifest, Service Worker, offline testing
- Privacy + all modules E2E tests

**Week 6 — Polish + Launch**
- Cross-browser testing (Chrome, Firefox, Safari, Edge)
- Mobile testing (iOS Safari, Android Chrome)
- Lighthouse audits + Core Web Vitals fixes
- SEO: page titles, meta descriptions, OG images, sitemap
- Privacy policy + Terms of service pages
- Sentry + Plausible setup
- Uptime monitor
- Production deploy + domain config
- Product Hunt submission prep

---

## 25. Open Questions

| # | Question | Priority | Deadline |
|---|---|---|---|
| 1 | Brand name final decision | 🔴 Critical | Before Week 1 |
| 2 | Payment provider: Lemon Squeezy vs Stripe? | 🔴 Critical | Before Phase 2 |
| 3 | LibreOffice.wasm bundle size — spike needed | 🟡 High | Week 1 of Phase 1.1 |
| 4 | Pro pricing: $8/mo or $9/mo? Annual % discount? | 🟡 High | Before Phase 2 |
| 5 | Steganography + Metadata Injector — legal review? | 🟠 Medium | Before Phase 1 launch |
| 6 | Shared file max downloads — unlimited or capped at N? | 🟠 Medium | Before Phase 2 |
| 7 | Rate limiting strategy — Vercel middleware or Supabase? | 🟠 Medium | Before Phase 2 |

---

## 26. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| FFmpeg.wasm ~30 MB hurts first load | High | High | Lazy load on module open; CacheFirst after first load; show loading indicator |
| Large video crashes browser tab | Medium | High | Web Workers; file size pre-check; Pro server option |
| LibreOffice.wasm too large for Word→PDF | Medium | Medium | Spike in Week 1 of Phase 1.1; print-to-PDF fallback ready |
| SharedArrayBuffer blocked (missing COOP/COEP) | Low | High | Test on Vercel preview before launch; single-thread fallback |
| Supabase RLS misconfiguration leaks user data | Low | Critical | Test all policies with Supabase Policy Tester; pen test before Phase 2 launch |
| Service role key exposed in client bundle | Low | Critical | Strict server-only usage; Vercel env var; code review checklist |
| Webhook replay attacks | Low | High | Signature verification + timestamp check + idempotency key |
| Metadata Injector / Steganography misuse | Medium | Medium | Clear disclaimers; PNG-only for steg; no server-side processing for these tools |
| File Shredder user misunderstanding (OS vs browser) | High | Medium | Mandatory disclaimer; prominent language about browser memory limitation |
| Competitor copies privacy angle | Medium | Low | Focus on execution quality; PWA + offline is hard to match quickly |
| Solo dev burnout / scope creep | High | High | Strict phase discipline; Phase 1 = Image + PDF + Privacy ONLY |
| pg_cron fails to clean expired files | Low | Medium | Storage lifecycle policy as secondary cleanup; monitor Storage size |
| Payment webhook fails silently | Low | High | Webhook retry logic + dead letter queue; manual reconciliation script |

---

## 27. Success Metrics & KPIs

### Phase 1 (0–3 months post-launch)

| Metric | Target | Measurement |
|---|---|---|
| PWA install rate | > 10% of returning users | Plausible custom event |
| Task completion rate | > 85% (upload → download) | processing_started vs export_triggered |
| Processing error rate | < 2% | Sentry error rate |
| Bounce rate (tool pages) | < 40% | Plausible |
| LCP (4G) | < 3s | Vercel Analytics |
| Privacy Tools session share | > 30% | Plausible module_opened events |
| Weekly active users (Month 3) | > 1,000 | Plausible |

### Phase 2 (3–9 months post-launch)

| Metric | Target | Measurement |
|---|---|---|
| Free → Pro conversion | > 3% | Payment provider dashboard |
| Monthly recurring revenue | > $1,000 MRR | Lemon Squeezy / Stripe |
| Pro churn rate | < 5%/month | Payment provider |
| Pro user NPS | > 40 | In-app survey (Phase 2) |
| Server job success rate | > 98% | processing_jobs table status |
| Shared link usage (Pro) | > 20% of Pro users | shared_files table |

---

## 28. Changelog

| Version | Date | Changes |
|---|---|---|
| 1.0 | 2026-05-05 | Initial PRD — core 3 modules (Image, PDF, Privacy) |
| 1.1 | 2026-05-05 | Added Video, Audio, Document, QR, Color Picker; expanded Privacy to 8 tools |
| 1.2 | 2026-05-05 | Added full tech stack with justifications (Next.js, shadcn, Zustand etc.) |
| 1.3 | 2026-05-05 | Added file/folder structure, Supabase schema, backend API routes |
| **2.0** | **2026-05-05** | **Final: added competitive analysis, personas, error handling, security checklist, SEO strategy, analytics plan, launch checklist, sprint plan, risks with likelihood/impact, full KPI table, changelog** |

---

*PRD v2.0 — FINAL. Ready for development.*
*Phase 1 ships with zero auth, zero DB, zero server. Pure browser-based PWA.*
*Resolve open question #1 (brand name) before Week 1 begins.*
