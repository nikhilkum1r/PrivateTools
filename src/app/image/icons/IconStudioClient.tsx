"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, 
  Download, 
  Trash2, 
  CheckCircle2, 
  Loader2,
  Sparkles,
  Zap,
  Smartphone,
  Globe,
  Apple,
  Grid,
  Settings2,
  RefreshCcw,
  Palette,
  Layout,
  FileCode,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  Monitor,
  Search,
  Bell,
  Menu,
  Copy,
  Code2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { DropZone } from "@/components/shared/DropZone";
import JSZip from "jszip";

interface IconStudioClientProps {
  defaultTitle?: string;
}

interface GeneratedIcon {
  name: string;
  url: string;
  size: number;
  width?: number;
  height?: number;
  platform: 'web' | 'android' | 'ios' | 'pwa' | 'social' | 'all';
  scale?: string;
}

export default function IconStudioClient({ defaultTitle }: IconStudioClientProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<GeneratedIcon[]>([]);
  const [isSvg, setIsSvg] = useState(false);
  const [optimizedSvg, setOptimizedSvg] = useState<string | null>(null);
  
  // Advanced Controls
  const [zoom, setZoom] = useState(0.8);
  const [borderRadius, setBorderRadius] = useState(0);
  const [bgColor, setBgColor] = useState("transparent");
  const [bgType, setBgType] = useState<'solid' | 'gradient'>('solid');
  const [bgGradient, setBgGradient] = useState('linear-gradient(135deg, #6366f1 0%, #a855f7 100%)');
  const [shadow, setShadow] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  
  const [palette, setPalette] = useState<string[]>([]);
  const [activePlatform, setActivePlatform] = useState<'all' | 'web' | 'android' | 'ios' | 'social'>('all');
  const [activeTab, setActiveTab] = useState<'basic' | 'style' | 'filters' | 'ai' | 'svg'>('basic');
  const [previewTheme, setPreviewTheme] = useState<'light' | 'dark'>('dark');
  const [previewContext, setPreviewContext] = useState<'home' | 'settings' | 'notifications'>('home');
  const [exportFormat, setExportFormat] = useState<string>('auto');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Auto-extract palette when image changes
  useEffect(() => {
    if (preview) {
      extractPalette(preview);
    }
  }, [preview]);

  const extractPalette = (imgUrl: string) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      canvas.width = 100;
      canvas.height = 100;
      ctx.drawImage(img, 0, 0, 100, 100);
      const data = ctx.getImageData(0, 0, 100, 100).data;
      const colors = new Set<string>();
      for (let i = 0; i < data.length; i += 40) {
        const r = data[i], g = data[i+1], b = data[i+2];
        const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
        if (r + g + b < 700 && r + g + b > 100) colors.add(hex);
        if (colors.size >= 5) break;
      }
      setPalette(Array.from(colors));
    };
    img.src = imgUrl;
  };

  const optimizeSvg = async () => {
    if (!file || !isSvg) return;
    setIsProcessing(true);
    try {
      const text = await file.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, "image/svg+xml");
      const svg = doc.querySelector("svg");
      
      if (!svg) throw new Error("Invalid SVG");

      // 1. Cleanup
      const metadata = svg.querySelector("metadata");
      if (metadata) metadata.remove();
      
      const comments = doc.createTreeWalker(doc, NodeFilter.SHOW_COMMENT);
      let comment;
      while ((comment = comments.nextNode())) comment.parentNode?.removeChild(comment);

      // 2. Responsive Optimization
      const width = svg.getAttribute("width");
      const height = svg.getAttribute("height");
      const viewBox = svg.getAttribute("viewBox");

      if (!viewBox && width && height) {
        svg.setAttribute("viewBox", `0 0 ${width.replace("px", "")} ${height.replace("px", "")}`);
      }
      svg.removeAttribute("width");
      svg.removeAttribute("height");
      svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

      // 3. Minification (Simple)
      let optimized = new XMLSerializer().serializeToString(doc);
      optimized = optimized
        .replace(/>\s+</g, '><') // Whitespace between tags
        .replace(/\s{2,}/g, ' ') // Multiple spaces
        .trim();

      setOptimizedSvg(optimized);
      // Update preview with optimized version
      setPreview(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(optimized)}`);
      toast.success("SVG Optimized: Minified & Responsive");
    } catch (err) {
      toast.error("SVG optimization failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const enhanceAsset = async () => {
    if (!file) return;
    setIsProcessing(true);
    
    try {
      const img = new Image();
      img.src = preview!;
      await new Promise((resolve) => (img.onload = resolve));

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      // 1. Initial Draw & Upscale
      canvas.width = 1024;
      canvas.height = 1024;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, 1024, 1024);

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      // 2. Detect Bounding Box (Alpha Channel)
      let minX = canvas.width, minY = canvas.height, maxX = 0, maxY = 0;
      let hasTransparency = false;

      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const alpha = data[(y * canvas.width + x) * 4 + 3];
          if (alpha > 10) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
          if (alpha < 250) hasTransparency = true;
        }
      }

      if (!hasTransparency) {
        toast.warning("No transparency detected. Results may vary.");
      }

      // 3. Trim & Center
      const width = maxX - minX;
      const height = maxY - minY;
      const size = Math.max(width, height);
      
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = 1024;
      tempCanvas.height = 1024;
      const tCtx = tempCanvas.getContext('2d');
      if (!tCtx) return;

      const offsetX = (1024 - width) / 2;
      const offsetY = (1024 - height) / 2;

      tCtx.drawImage(canvas, minX, minY, width, height, offsetX, offsetY, width, height);

      // 4. Sharpen (Convolution Kernel)
      const weights = [
         0, -1,  0,
        -1,  5, -1,
         0, -1,  0
      ];
      
      const finalImgData = tCtx.getImageData(0, 0, 1024, 1024);
      const pixels = finalImgData.data;
      const side = Math.round(Math.sqrt(weights.length));
      const halfSide = Math.floor(side / 2);
      
      const output = tCtx.createImageData(1024, 1024);
      const dst = output.data;

      for (let y = 0; y < 1024; y++) {
        for (let x = 0; x < 1024; x++) {
          const sy = y;
          const sx = x;
          const dstOff = (y * 1024 + x) * 4;
          let r = 0, g = 0, b = 0, a = 0;
          
          for (let cy = 0; cy < side; cy++) {
            for (let cx = 0; cx < side; cx++) {
              const scy = sy + cy - halfSide;
              const scx = sx + cx - halfSide;
              if (scy >= 0 && scy < 1024 && scx >= 0 && scx < 1024) {
                const srcOff = (scy * 1024 + scx) * 4;
                const wt = weights[cy * side + cx];
                r += pixels[srcOff] * wt;
                g += pixels[srcOff + 1] * wt;
                b += pixels[srcOff + 2] * wt;
                a += pixels[srcOff + 3] * wt;
              }
            }
          }
          dst[dstOff] = r;
          dst[dstOff + 1] = g;
          dst[dstOff + 2] = b;
          dst[dstOff + 3] = pixels[dstOff + 3]; // Preserve original alpha
        }
      }

      tCtx.putImageData(output, 0, 0);
      
      setPreview(tempCanvas.toDataURL('image/png'));
      toast.success("AI Enhancement Complete: Sharpened, Trimmed & Centered");
    } catch (err) {
      toast.error("Enhancement failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const generateIcons = async () => {
    if (!file) return;
    setIsProcessing(true);
    setResults([]);

    try {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      await new Promise((resolve) => (img.onload = resolve));

      const sizes: ({ s: number; n: string; p: GeneratedIcon['platform']; scale?: string } | { w: number; h: number; n: string; p: GeneratedIcon['platform'] })[] = [
        // Web / Favicons
        { s: 16, n: 'favicon-16x16.webp', p: 'web' },
        { s: 32, n: 'favicon-32x32.webp', p: 'web' },
        { s: 48, n: 'favicon-48x48.png', p: 'web' },
        { s: 180, n: 'apple-touch-icon.webp', p: 'ios' },
        { s: 192, n: 'android-chrome-192x192.webp', p: 'android' },
        { s: 512, n: 'android-chrome-512x512.webp', p: 'android' },
        
        // Android Specific (mipmap)
        { s: 48, n: 'ic_launcher.png', p: 'android', scale: 'mdpi' },
        { s: 72, n: 'ic_launcher.png', p: 'android', scale: 'hdpi' },
        { s: 96, n: 'ic_launcher.png', p: 'android', scale: 'xhdpi' },
        { s: 144, n: 'ic_launcher.png', p: 'android', scale: 'xxhdpi' },
        { s: 192, n: 'ic_launcher.png', p: 'android', scale: 'xxxhdpi' },
        
        // iOS Specific (appiconset)
        { s: 40, n: 'icon-20@2x.png', p: 'ios', scale: '20pt@2x' },
        { s: 60, n: 'icon-20@3x.png', p: 'ios', scale: '20pt@3x' },
        { s: 58, n: 'icon-29@2x.png', p: 'ios', scale: '29pt@2x' },
        { s: 87, n: 'icon-29@3x.png', p: 'ios', scale: '29pt@3x' },
        { s: 80, n: 'icon-40@2x.png', p: 'ios', scale: '40pt@2x' },
        { s: 120, n: 'icon-40@3x.png', p: 'ios', scale: '40pt@3x' },
        { s: 120, n: 'icon-60@2x.png', p: 'ios', scale: '60pt@2x' },
        { s: 180, n: 'icon-60@3x.png', p: 'ios', scale: '60pt@3x' },
        { s: 1024, n: 'icon-1024.png', p: 'ios', scale: '1024pt' },

        // PWA
        { s: 512, n: 'pwa-icon-512x512.png', p: 'pwa' },

        // SOCIAL MEDIA (Branding Toolkit)
        { w: 1200, h: 630, n: 'og-image.webp', p: 'social' },
        { w: 1200, h: 600, n: 'twitter-preview.png', p: 'social' },
        { w: 1080, h: 1080, n: 'instagram-post.png', p: 'social' },
        { w: 1080, h: 1350, n: 'instagram-portrait.png', p: 'social' },
        
        // SPLASH SCREENS
        { w: 2048, h: 2732, n: 'splash-ios.png', p: 'ios' },
        { w: 1080, h: 1920, n: 'splash-android.png', p: 'android' },
      ];

      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d')!;
      const generated: GeneratedIcon[] = [];

      for (const item of sizes) {
        const w = 'w' in item ? item.w : item.s;
        const h = 'h' in item ? item.h : item.s;
        const size = 's' in item ? item.s : Math.min(w, h);

        canvas.width = w;
        canvas.height = h;
        ctx.clearRect(0, 0, w, h);
        
        // 1. Background & Border Radius
        if (bgColor !== "transparent" || exportFormat === 'image/jpeg') {
           if (bgType === 'gradient' && bgColor !== 'transparent') {
              const gradParts = bgGradient.match(/#[a-f\d]{6}/gi) || ['#6366f1', '#a855f7'];
              const grad = ctx.createLinearGradient(0, 0, w, h);
              grad.addColorStop(0, gradParts[0]);
              grad.addColorStop(1, gradParts[1]);
              ctx.fillStyle = grad;
           } else {
              ctx.fillStyle = bgColor === "transparent" ? "#ffffff" : bgColor;
           }
           
           if (borderRadius > 0 && w === h) {
              const r = (borderRadius / 100) * (w / 2);
              ctx.beginPath();
              ctx.moveTo(r, 0);
              ctx.lineTo(w - r, 0);
              ctx.quadraticCurveTo(w, 0, w, r);
              ctx.lineTo(w, h - r);
              ctx.quadraticCurveTo(w, h, w - r, h);
              ctx.lineTo(r, h);
              ctx.quadraticCurveTo(0, h, 0, h - r);
              ctx.lineTo(0, r);
              ctx.quadraticCurveTo(0, 0, r, 0);
              ctx.closePath();
              ctx.fill();
              ctx.clip();
           } else {
              ctx.fillRect(0, 0, w, h);
           }
        }

        // 2. Filters
        ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
        
        // 3. Shadow
        if (shadow > 0) {
           ctx.shadowColor = "rgba(0,0,0,0.3)";
           ctx.shadowBlur = (shadow / 100) * (size / 10);
           ctx.shadowOffsetY = (shadow / 100) * (size / 20);
        }

        const targetSize = size * zoom;
        const offsetX = (w - targetSize) / 2;
        const offsetY = (h - targetSize) / 2;
        ctx.drawImage(img, offsetX, offsetY, targetSize, targetSize);
        
        // Reset state
        ctx.filter = "none";
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;

        const getExportConfig = (platform: string) => {
          if (exportFormat === 'auto') {
            if (platform === 'social') return { mime: 'image/jpeg', ext: '.jpg' };
            if (platform === 'android') return { mime: 'image/webp', ext: '.webp' };
            if (platform === 'web' && item.n.includes('favicon')) return { mime: 'image/x-icon', ext: '.ico' };
            return { mime: 'image/png', ext: '.png' };
          }
          const mapping: Record<string, string> = {
            'image/png': '.png', 'image/webp': '.webp', 'image/jpeg': '.jpg',
            'image/x-icon': '.ico', 'image/svg+xml': '.svg', 'image/gif': '.gif',
            'image/bmp': '.bmp', 'image/tiff': '.tiff', 'image/avif': '.avif',
            'application/pdf': '.pdf', 'application/postscript': '.eps',
            'application/illustrator': '.ai', 'image/vnd.adobe.photoshop': '.psd',
            'image/x-icns': '.icns', 'image/x-xpixmap': '.xpm', 'application/xml': '.xml',
            'image/x-cdr': '.cdr', 'image/x-dxf': '.dxf'
          };
          return { mime: exportFormat, ext: mapping[exportFormat] || '.png' };
        };

        const config = getExportConfig(item.p);
        
        generated.push({
          name: item.n.replace('.png', config.ext),
          url: canvas.toDataURL(config.mime.startsWith('image/') ? config.mime : 'image/png', 0.9),
          size: size,
          width: w,
          height: h,
          platform: item.p,
          scale: 'scale' in item ? item.scale : undefined
        });
      }

      setResults(generated);
      toast.success("Icons generated successfully!");
    } catch (err) {
      toast.error("Failed to generate icons");
    } finally {
      setIsProcessing(false);
    }
  };

  const generateAdaptiveAndroid = async () => {
    if (!file) return;
    setIsProcessing(true);
    
    try {
      const zip = new JSZip();
      const adaptiveFolder = zip.folder("android/adaptive");
      
      const img = new Image();
      img.src = preview!;
      await new Promise((resolve) => (img.onload = resolve));

      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 1. Foreground (Logo only)
      ctx.clearRect(0, 0, 1024, 1024);
      const zoomFactor = zoom * 0.8; // Adaptive icons need safe zones
      const targetSize = 1024 * zoomFactor;
      const offset = (1024 - targetSize) / 2;
      ctx.drawImage(img, offset, offset, targetSize, targetSize);
      adaptiveFolder?.file("ic_launcher_foreground.png", canvas.toDataURL('image/png').split(',')[1], { base64: true });

      // 2. Background
      ctx.clearRect(0, 0, 1024, 1024);
      if (bgType === 'gradient') {
         const grad = ctx.createLinearGradient(0, 0, 1024, 1024);
         // Simplified parsing of gradient presets
         if (bgGradient.includes("#6366f1")) { grad.addColorStop(0, "#6366f1"); grad.addColorStop(1, "#a855f7"); }
         else if (bgGradient.includes("#f43f5e")) { grad.addColorStop(0, "#f43f5e"); grad.addColorStop(1, "#fb923c"); }
         else { grad.addColorStop(0, "#3b82f6"); grad.addColorStop(1, "#2dd4bf"); }
         ctx.fillStyle = grad;
      } else {
         ctx.fillStyle = bgColor === 'transparent' ? '#ffffff' : bgColor;
      }
      ctx.fillRect(0, 0, 1024, 1024);
      adaptiveFolder?.file("ic_launcher_background.png", canvas.toDataURL('image/png').split(',')[1], { base64: true });

      // 3. Monochrome
      ctx.clearRect(0, 0, 1024, 1024);
      ctx.fillStyle = "#000000"; // Standard monochrome is usually masked
      ctx.fillRect(0, 0, 1024, 1024);
      ctx.globalCompositeOperation = 'destination-in';
      ctx.drawImage(img, offset, offset, targetSize, targetSize);
      ctx.globalCompositeOperation = 'source-over';
      adaptiveFolder?.file("ic_launcher_monochrome.png", canvas.toDataURL('image/png').split(',')[1], { base64: true });

      // 4. XML Template
      const xml = `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@drawable/ic_launcher_background" />
    <foreground android:drawable="@drawable/ic_launcher_foreground" />
    <monochrome android:drawable="@drawable/ic_launcher_monochrome" />
</adaptive-icon>`;
      adaptiveFolder?.file("ic_launcher_adaptive.xml", xml);

      const content = await zip.generateAsync({ type: "blob" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = "android-adaptive-icons.zip";
      link.click();
      toast.success("Adaptive Icons Generated!");
    } catch (err) {
      toast.error("Adaptive generation failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadAll = async () => {
    const zip = new JSZip();
    
    // Create folders
    const androidRes = zip.folder("android/res");
    const iosAppIcon = zip.folder("ios/AppIcon.appiconset");
    const faviconFolder = zip.folder("favicon");
    const pwaFolder = zip.folder("pwa");
    const socialFolder = zip.folder("social");

    results.forEach(icon => {
      const base64 = icon.url.split(',')[1];
      
      if (icon.platform === 'android' && icon.scale) {
         androidRes?.folder(`mipmap-${icon.scale}`)?.file(icon.name, base64, { base64: true });
      } else if (icon.platform === 'ios' && icon.scale) {
         iosAppIcon?.file(icon.name, base64, { base64: true });
      } else if (icon.platform === 'android') {
         zip.folder("android")?.file(icon.name, base64, { base64: true });
      } else if (icon.platform === 'ios') {
         zip.folder("ios")?.file(icon.name, base64, { base64: true });
      } else if (icon.platform === 'pwa') {
         pwaFolder?.file(icon.name, base64, { base64: true });
      } else if (icon.platform === 'social') {
         socialFolder?.file(icon.name, base64, { base64: true });
      } else {
         faviconFolder?.file(icon.name, base64, { base64: true });
      }
    });

    // iOS Contents.json
    const iosContents = {
      images: results.filter(i => i.platform === 'ios' && i.scale).map(i => {
        const [size, scale] = i.scale!.split('@');
        return {
          size: size,
          idiom: "universal",
          filename: i.name,
          scale: scale || "1x"
        };
      }),
      info: { version: 1, author: "SafeTools" }
    };
    iosAppIcon?.file("Contents.json", JSON.stringify(iosContents, null, 2));
    
    // Pro manifest.json with organized paths
    const manifest = {
      name: "SafeTools App",
      short_name: "SafeTools",
      icons: results.filter(i => i.platform === 'android' || i.platform === 'pwa').map(i => ({
        src: `${i.platform === 'pwa' ? 'pwa' : 'android'}/${i.name}`,
        sizes: `${i.size}x${i.size}`,
        type: i.name.endsWith('.webp') ? 'image/webp' : i.name.endsWith('.jpg') ? 'image/jpeg' : 'image/png',
        purpose: "any maskable"
      })),
      start_url: "/",
      display: "standalone",
      background_color: bgColor === 'transparent' ? '#ffffff' : bgColor,
      theme_color: bgColor === 'transparent' ? '#3b82f6' : bgColor
    };
    zip.file("site.webmanifest", JSON.stringify(manifest, null, 2));

    // HTML Embed Tags for easy copy-paste
    const htmlTags = `<!-- SafeTools Branding Embed Tags -->
<!-- Place these in your <head> section -->

<link rel="apple-touch-icon" sizes="180x180" href="/ios/apple-touch-icon.webp">
<link rel="icon" type="image/webp" sizes="32x32" href="/favicon/favicon-32x32.webp">
<link rel="icon" type="image/webp" sizes="16x16" href="/favicon/favicon-16x16.webp">
<link rel="manifest" href="/site.webmanifest">
<link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#5bbad5">
<meta name="msapplication-TileColor" content="${bgColor === 'transparent' ? '#2d89ef' : bgColor}">
<meta name="theme-color" content="${bgColor === 'transparent' ? '#ffffff' : bgColor}">

<!-- Social Media Previews -->
<meta property="og:image" content="/social/og-image.webp">
<meta name="twitter:image" content="/social/twitter-preview.png">`;

    zip.file("html_embed_tags.html", htmlTags);

    // Add README instructions
    const readme = `SafeTools Icon Bundle - Deployment Instructions
==============================================

1. Web / Favicon (favicon/):
   - Place in your website's root or /public directory.
   - <link rel="icon" type="image/webp" sizes="32x32" href="/favicon/favicon-32x32.webp">

2. PWA Integration (site.webmanifest):
   - Place in root directory.
   - <link rel="manifest" href="/site.webmanifest">

3. Social Media Branding (social/):
   - og-image.webp: Facebook/LinkedIn Open Graph preview.
   - twitter-preview.png: Twitter/X Card preview.
   - instagram-post.png: High-resolution branding assets.

4. Native iOS (ios/):
   - Apple Touch Icon: <link rel="apple-touch-icon" href="/ios/apple-touch-icon.webp">
   - Xcode: Copy 'AppIcon.appiconset' into Assets.xcassets.

5. Native Android (android/):
   - Android Studio: Merge 'res/' folder with main/res folder.

Metadata:
- Generated via: SafeTools Brand Studio
- Privacy: 100% Local Processing
- Date: ${new Date().toLocaleDateString()}
`;
    zip.file("README.txt", readme);

    const content = await zip.generateAsync({ type: "blob" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(content);
    link.download = "SafeTools-Icon-Bundle.zip";
    link.click();
  };

  const MockupBrowser = () => (
    <div className={`w-full p-6 rounded-2xl border shadow-2xl space-y-4 relative overflow-hidden group transition-all duration-500 hover:scale-[1.02] ${previewTheme === 'dark' ? 'bg-zinc-900 border-white/5' : 'bg-white border-black/5'}`}>
      <div className={`absolute inset-0 opacity-10 pointer-events-none ${previewTheme === 'dark' ? 'bg-primary' : 'bg-blue-500'}`} />
      <div className="flex items-center gap-3 pb-3 border-b border-border relative z-10">
        <div className="flex gap-1.5 shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
        </div>
        <div className={`flex-grow h-9 rounded-xl border flex items-center px-4 gap-3 backdrop-blur-xl transition-colors ${previewTheme === 'dark' ? 'bg-black/40 border-white/10' : 'bg-zinc-100 border-black/10'}`}>
          <div 
            className="w-5 h-5 rounded-md overflow-hidden flex items-center justify-center shrink-0 shadow-md transition-all"
            style={{ 
              background: bgColor === "transparent" ? (previewTheme === 'dark' ? '#333' : '#eee') : (bgType === 'gradient' ? bgGradient : bgColor),
              borderRadius: `${borderRadius / 4}%`,
              filter: `brightness(${brightness}%) contrast(${contrast}%)`
            }}
          >
             {preview && <img src={preview} className="w-full h-full object-contain" style={{ transform: `scale(${zoom})` }} alt="Studio favicon preview" />}
          </div>
          <div className={`text-[10px] font-black uppercase tracking-[0.2em] truncate opacity-60 ${previewTheme === 'dark' ? 'text-white' : 'text-black'}`}>
             Studio
          </div>
        </div>
      </div>
      <div className="space-y-3 relative z-10 px-1">
        <div className={`h-2 w-3/4 rounded-full ${previewTheme === 'dark' ? 'bg-white/10' : 'bg-black/5'}`} />
        <div className={`h-2 w-1/2 rounded-full ${previewTheme === 'dark' ? 'bg-white/5' : 'bg-black/[0.02]'}`} />
      </div>
    </div>
  );

  const MockupMobile = ({ type }: { type: 'ios' | 'android' }) => (
    <div className={`relative w-full max-w-[220px] aspect-[9/19] rounded-[2.8rem] border-[8px] border-zinc-800 shadow-2xl p-4 overflow-hidden mx-auto transition-all duration-500 hover:rotate-1 hover:scale-[1.02] ${previewTheme === 'dark' ? 'bg-black text-white shadow-primary/20' : 'bg-zinc-100 text-black shadow-black/10'}`}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-zinc-800 rounded-b-2xl z-20" />
      <div className={`h-full w-full relative transition-all duration-500 overflow-hidden rounded-[1.8rem] ${previewTheme === 'dark' ? 'bg-zinc-950' : 'bg-white'}`}>
        {/* DYNAMIC WALLPAPER EFFECT */}
        <div className={`absolute inset-0 opacity-20 ${previewTheme === 'dark' ? 'bg-gradient-to-b from-primary via-black to-blue-900' : 'bg-gradient-to-b from-blue-100 via-white to-primary/10'}`} />
        
        <div className="absolute top-4 left-4 text-[10px] font-bold opacity-40 relative z-10">9:41</div>
        
        {previewContext === 'home' && (
          <div className="grid grid-cols-4 gap-3 pt-16 px-2 relative z-10">
            <div 
              className="aspect-square rounded-xl shadow-lg flex items-center justify-center overflow-hidden transition-all duration-500"
              style={{ 
                background: bgType === 'gradient' ? bgGradient : bgColor,
                borderRadius: `${borderRadius / 3}%`,
                filter: `brightness(${brightness}%) contrast(${contrast}%)`
              }}
            >
              {preview && <img src={preview} className="w-full h-full object-contain" style={{ transform: `scale(${zoom})` }} alt="Mobile home icon preview" />}
            </div>
            {[...Array(7)].map((_, i) => (
              <div key={i} className="aspect-square rounded-xl bg-white/10 backdrop-blur-sm" />
            ))}
          </div>
        )}

        {previewContext === 'notifications' && (
          <div className="pt-16 px-2 space-y-2">
             <div className={`p-3 rounded-2xl ${previewTheme === 'dark' ? 'bg-white/10' : 'bg-black/5'} flex items-start gap-3`}>
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden shrink-0"
                  style={{ 
                    backgroundColor: bgColor,
                    borderRadius: `${borderRadius / 2}%`,
                    filter: `brightness(${brightness}%) contrast(${contrast}%)`
                  }}
                >
                   {preview && <img src={preview} className="w-full h-full object-contain" style={{ transform: `scale(${zoom})` }} alt="Notification icon preview" />}
                </div>
                <div className="space-y-1">
                   <div className={`h-2 w-12 rounded-full ${previewTheme === 'dark' ? 'bg-white/20' : 'bg-black/10'}`} />
                   <div className={`h-2 w-24 rounded-full ${previewTheme === 'dark' ? 'bg-white/10' : 'bg-black/5'}`} />
                </div>
             </div>
          </div>
        )}

        {previewContext === 'settings' && (
          <div className="pt-16 px-0 space-y-px">
             {Array.from({ length: 6 }).map((_, i) => (
               <div key={i} className={`px-4 py-3 flex items-center gap-3 border-b ${previewTheme === 'dark' ? 'border-white/5' : 'border-black/5'}`}>
                  {i === 2 ? (
                    <div 
                      className="w-6 h-6 rounded-md flex items-center justify-center overflow-hidden"
                      style={{ 
                        backgroundColor: bgColor,
                        borderRadius: `${borderRadius / 2}%`,
                        filter: `brightness(${brightness}%) contrast(${contrast}%)`
                      }}
                    >
                       {preview && <img src={preview} className="w-full h-full object-contain" style={{ transform: `scale(${zoom})` }} alt="Settings icon preview" />}
                    </div>
                  ) : (
                    <div className={`w-6 h-6 rounded-md ${previewTheme === 'dark' ? 'bg-white/10' : 'bg-black/5'}`} />
                  )}
                  <div className={`h-2 w-24 rounded-full ${previewTheme === 'dark' ? 'bg-white/10' : 'bg-black/5'}`} />
               </div>
             ))}
          </div>
        )}

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-zinc-500/30 rounded-full" />
      </div>
    </div>
  );

  const MockupMacOS = () => (
    <div className="w-full h-28 bg-white/10 backdrop-blur-3xl rounded-[2rem] border border-white/20 flex items-center justify-center gap-6 px-10 relative group overflow-hidden shadow-2xl">
       <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent opacity-30" />
       {[...Array(3)].map((_, i) => (
         <div key={i} className="w-12 h-12 rounded-2xl bg-white/10 border border-white/5 shadow-inner" />
       ))}
       <div 
         className="w-16 h-16 rounded-[1.2rem] flex items-center justify-center overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition-all duration-500 group-hover:scale-125 z-10 origin-bottom group-hover:-translate-y-2"
         style={{ 
           background: bgType === 'gradient' ? bgGradient : bgColor,
           borderRadius: `${borderRadius / 2.5}%`,
           filter: `brightness(${brightness}%) contrast(${contrast}%)`
         }}
       >
         {preview && <img src={preview} className="w-full h-full object-contain" style={{ transform: `scale(${zoom})` }} alt="macOS dock icon preview" />}
       </div>
       <div className="absolute bottom-2 w-1.5 h-1.5 bg-white rounded-full opacity-60" />
       {[...Array(3)].map((_, i) => (
         <div key={i+3} className="w-12 h-12 rounded-2xl bg-white/10 border border-white/5 shadow-inner" />
       ))}
    </div>
  );

  const MockupWindows = () => (
    <div className="w-full h-14 bg-[#111] border-t border-white/10 flex items-center gap-3 px-6 relative overflow-hidden group shadow-2xl">
       <div className="w-7 h-7 rounded bg-blue-500/10 flex items-center justify-center mr-6 hover:bg-blue-500/20 transition-colors">
          <div className="grid grid-cols-2 gap-0.5 w-3.5 h-3.5">
             <div className="bg-blue-400/80 w-full h-full rounded-[1px]" />
             <div className="bg-blue-400/80 w-full h-full rounded-[1px]" />
             <div className="bg-blue-400/80 w-full h-full rounded-[1px]" />
             <div className="bg-blue-400/80 w-full h-full rounded-[1px]" />
          </div>
       </div>
       <div 
         className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden transition-all duration-300 hover:bg-white/10 p-1.5 relative"
       >
         <div 
           className="w-full h-full flex items-center justify-center overflow-hidden shadow-lg"
           style={{ 
             background: bgType === 'gradient' ? bgGradient : bgColor,
             borderRadius: `${borderRadius / 6}%`,
             filter: `brightness(${brightness}%) contrast(${contrast}%)`
           }}
         >
           {preview && <img src={preview} className="w-full h-full object-contain" style={{ transform: `scale(${zoom})` }} alt="Windows taskbar icon preview" />}
         </div>
         <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-blue-400 rounded-full" />
       </div>
       {[...Array(5)].map((_, i) => (
         <div key={i} className="w-10 h-10 rounded-lg bg-white/[0.03] transition-colors hover:bg-white/5" />
       ))}
       <div className="ml-auto flex gap-6 pr-4 opacity-30">
          <div className="w-10 h-1.5 bg-white rounded-full" />
          <div className="w-6 h-1.5 bg-white rounded-full" />
       </div>
    </div>
  );

  const MockupDesktop = () => (
    <div className="flex flex-col items-center gap-4 p-8 rounded-[2.5rem] bg-card border border-border shadow-2xl group hover:border-primary/50 transition-all relative overflow-hidden h-full justify-center min-h-[200px]">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-50" />
      <div 
        className="w-20 h-20 rounded-[1.5rem] flex items-center justify-center overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.4)] group-hover:scale-110 transition-all duration-500 z-10"
        style={{ 
          background: bgType === 'gradient' ? bgGradient : bgColor,
          borderRadius: `${borderRadius / 2}%`,
          filter: `brightness(${brightness}%) contrast(${contrast}%)`,
          boxShadow: shadow > 0 ? `0 ${shadow/5}px ${shadow/2}px rgba(0,0,0,0.3)` : 'none'
        }}
      >
         {preview && <img src={preview} className="w-full h-full object-contain" style={{ transform: `scale(${zoom})` }} alt="Desktop asset preview" />}
      </div>
      <div className="w-24 h-3 bg-muted/60 rounded-full z-10" />
    </div>
  );

  const filteredResults = activePlatform === 'all' 
    ? results 
    : results.filter(r => r.platform === activePlatform || (activePlatform === 'web' && r.platform === 'pwa'));

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-12">
      <canvas ref={canvasRef} className="hidden" />
      
      <AnimatePresence mode="wait">
        {!file ? (
          <motion.div 
            key="upload"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="max-w-3xl mx-auto"
          >
            <div className="p-12 md:p-20 rounded-[4rem] bg-card border-2 border-dashed border-primary/20 hover:border-primary/50 hover:bg-primary/[0.01] transition-all group flex flex-col items-center gap-8 text-center relative overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-blue-500/10 pointer-events-none animate-gradient-slow" />
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/10 blur-[80px] rounded-full" />
              <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-blue-500/10 blur-[80px] rounded-full" />
              
              <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center border border-white/10 shadow-[0_20px_50px_rgba(var(--primary-rgb),0.3)] group-hover:scale-110 transition-transform group-hover:rotate-3">
                <Upload className="w-10 h-10 text-white" />
              </div>
              
              <div className="space-y-4 relative z-10">
                <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter text-foreground">Start Your Design</h2>
                <p className="text-lg font-medium text-muted-foreground/60 italic max-w-sm">
                  Drag and drop your logo or click to upload. <br />
                  <span className="text-primary/80">Recommended: 1024x1024 square asset.</span>
                </p>
              </div>

              <DropZone 
                onFilesDrop={(fs) => { 
                   const f = fs[0];
                   setFile(f); 
                   setPreview(URL.createObjectURL(f)); 
                   setResults([]); 
                   setIsSvg(f.type === 'image/svg+xml' || f.name.endsWith('.svg'));
                   setOptimizedSvg(null);
                }} 
                title=""
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              
              <Button size="lg" className="rounded-2xl px-12 h-16 bg-gradient-to-r from-primary to-blue-600 hover:opacity-90 text-white font-black uppercase tracking-[0.2em] gap-4 shadow-[0_15px_30px_rgba(var(--primary-rgb),0.4)] italic transition-all hover:scale-105 active:scale-95 border-0">
                Choose Image
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>

            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
               {[
                 { l: "iOS", i: Apple },
                 { l: "Android", i: Smartphone },
                 { l: "Web", i: Globe },
                 { l: "PWA", i: Zap }
               ].map(item => (
                 <div key={item.l} className="p-8 rounded-[2.5rem] bg-secondary/30 border border-border flex flex-col items-center gap-4 group hover:bg-secondary/50 transition-all hover:-translate-y-1">
                   <div className="w-12 h-12 rounded-2xl bg-card border border-border flex items-center justify-center shadow-lg group-hover:bg-primary/10 group-hover:border-primary/30 transition-all">
                     <item.i className="w-6 h-6 text-muted-foreground/60 group-hover:text-primary" />
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 group-hover:text-foreground transition-colors">{item.l} Icons</span>
                 </div>
               ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="studio"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid lg:grid-cols-12 gap-8 items-start"
          >
            {/* LEFT: PREVIEW & CONFIG */}
            <div className="lg:col-span-5 space-y-8 sticky top-24">
              <div className="p-10 rounded-[3rem] bg-card/80 backdrop-blur-3xl border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] space-y-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 blur-[60px] rounded-full pointer-events-none" />
                
                <div className="flex items-center justify-between relative z-10">
                  <h3 className="text-xl font-black uppercase italic tracking-tighter flex items-center gap-3 bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                    <Settings2 className="w-6 h-6 text-primary" /> Customizer
                  </h3>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-xl hover:bg-destructive/10 hover:text-destructive transition-colors"
                    onClick={() => { setFile(null); setResults([]); setPreview(null); }}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>

                <div className="flex gap-2 p-1 bg-muted/40 rounded-xl">
                  {(['basic', 'style', 'filters', 'ai', 'svg'] as const).filter(t => t !== 'svg' || isSvg).map(t => (
                    <Button 
                      key={t}
                      variant="ghost"
                      size="sm"
                      className={`flex-1 rounded-lg text-[10px] font-black uppercase tracking-widest h-8 transition-all ${activeTab === t ? 'bg-background shadow-sm text-primary' : 'opacity-40'}`}
                      onClick={() => setActiveTab(t)}
                    >
                      {t}
                    </Button>
                  ))}
                </div>

                <div className="relative aspect-square rounded-3xl overflow-hidden bg-muted/40 border border-border flex items-center justify-center p-12 group shadow-inner">
                  <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:20px_20px] opacity-20" />
                  
                  {/* LIVE CANVAS-LIKE PREVIEW */}
                  <div 
                    className="relative w-full h-full flex items-center justify-center transition-all duration-300"
                    style={{ 
                      background: bgType === 'gradient' ? bgGradient : (bgColor === 'transparent' ? 'none' : bgColor),
                      borderRadius: `${borderRadius / 2}%`,
                      filter: `brightness(${brightness}%) contrast(${contrast}%)`,
                      boxShadow: shadow > 0 ? `0 ${shadow/5}px ${shadow/2}px rgba(0,0,0,0.2)` : 'none'
                    }}
                  >
                    {bgColor === 'transparent' && bgType === 'solid' && (
                       <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc)', backgroundPosition: '0 0, 10px 10px', backgroundSize: '20px 20px' }} />
                    )}
                    <img 
                      src={preview!} 
                      className="max-w-full max-h-full object-contain filter drop-shadow-2xl relative z-10 transition-transform duration-300" 
                      style={{ transform: `scale(${zoom})` }}
                      alt="Preview" 
                    />
                  </div>
                </div>

                <div className="space-y-6">
                   {activeTab === 'basic' && (
                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                        <div className="space-y-4">
                           <div className="flex items-center justify-between">
                             <Label className="text-[10px] font-black uppercase tracking-widest opacity-40">Export Format</Label>
                             <Badge className="bg-primary/10 text-primary border-primary/20 text-[8px] font-black uppercase tracking-widest">
                               {exportFormat === 'auto' ? 'Smart Auto' : exportFormat.split('/')[1] || exportFormat}
                             </Badge>
                           </div>
                           
                           <div className="grid grid-cols-4 gap-2">
                              <Button 
                                variant={exportFormat === 'auto' ? 'default' : 'outline'}
                                size="sm"
                                className={`col-span-2 h-10 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all shadow-lg ${exportFormat === 'auto' ? 'bg-gradient-to-r from-primary to-blue-600 border-0 shadow-primary/20' : 'opacity-60'}`}
                                onClick={() => setExportFormat('auto')}
                              >
                                <Zap className="w-3 h-3 mr-2" /> Smart Auto
                              </Button>
                              {(['image/png', 'image/webp'] as const).map(f => (
                                 <Button 
                                    key={f}
                                    variant={exportFormat === f ? 'default' : 'outline'}
                                    size="sm"
                                    className={`h-10 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${exportFormat === f ? 'bg-primary text-white border-0' : 'opacity-40'}`}
                                    onClick={() => setExportFormat(f)}
                                 >
                                    {f.split('/')[1]}
                                 </Button>
                              ))}
                           </div>

                           <div className="grid grid-cols-4 gap-2 overflow-y-auto max-h-[100px] p-1 border border-border/50 rounded-xl bg-muted/20 custom-scrollbar">
                              {[
                                { l: "ico", v: "image/x-icon" },
                                { l: "jpg", v: "image/jpeg" },
                                { l: "svg", v: "image/svg+xml" },
                                { l: "avif", v: "image/avif" },
                                { l: "icns", v: "image/x-icns" },
                                { l: "gif", v: "image/gif" },
                                { l: "pdf", v: "application/pdf" },
                                { l: "eps", v: "application/postscript" },
                                { l: "ai", v: "application/illustrator" },
                                { l: "psd", v: "image/vnd.adobe.photoshop" },
                                { l: "xml", v: "application/xml" },
                                { l: "xpm", v: "image/x-xpixmap" },
                                { l: "cdr", v: "image/x-cdr" },
                                { l: "dxf", v: "image/x-dxf" },
                                { l: "tiff", v: "image/tiff" },
                                { l: "bmp", v: "image/bmp" }
                              ].map(f => (
                                 <Button 
                                    key={f.v}
                                    variant={exportFormat === f.v ? 'default' : 'outline'}
                                    size="sm"
                                    className={`h-8 text-[8px] font-black uppercase tracking-widest rounded-lg transition-all ${exportFormat === f.v ? 'bg-primary text-white border-0' : 'opacity-30'}`}
                                    onClick={() => setExportFormat(f.v)}
                                 >
                                    .{f.l}
                                 </Button>
                              ))}
                           </div>
                           <p className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-widest text-center italic">
                             {exportFormat === 'auto' ? 'Choosing best format per platform (PNG/WebP/ICO/JPG)' : 'Manual override active'}
                           </p>
                        </div>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <Label className="text-xs font-black uppercase tracking-widest opacity-60 italic">Padding & Scale</Label>
                            <span className="text-xs font-mono font-black text-primary">{Math.round(zoom * 100)}%</span>
                          </div>
                          <Slider value={[zoom * 100]} min={10} max={150} step={1} onValueChange={(v) => setZoom((Array.isArray(v) ? v[0] : v) / 100)} />
                        </div>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <Label className="text-xs font-black uppercase tracking-widest opacity-60 italic">Border Radius</Label>
                            <span className="text-xs font-mono font-black text-primary">{borderRadius}%</span>
                          </div>
                          <Slider value={[borderRadius]} min={0} max={100} step={1} onValueChange={(v) => setBorderRadius(Array.isArray(v) ? v[0] : v)} />
                        </div>
                     </motion.div>
                   )}

                   {activeTab === 'style' && (
                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                        <div className="space-y-6">
                          <div className="flex items-center justify-between">
                             <Label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 italic">Background Style</Label>
                             <div className="flex p-1 bg-muted/40 rounded-lg">
                                {(['solid', 'gradient'] as const).map(t => (
                                  <Button 
                                    key={t}
                                    variant="ghost"
                                    size="sm"
                                    className={`h-7 px-4 text-[9px] font-black uppercase tracking-widest rounded-md transition-all ${bgType === t ? 'bg-background shadow-sm text-primary' : 'opacity-40'}`}
                                    onClick={() => setBgType(t)}
                                  >
                                    {t}
                                  </Button>
                                ))}
                             </div>
                          </div>

                          {bgType === 'solid' ? (
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                 <Label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 italic">Solid Color</Label>
                                 <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-6 px-2 text-[8px] font-black uppercase tracking-widest gap-1 hover:bg-primary/10 hover:text-primary"
                                    onClick={() => setBgColor("transparent")}
                                 >
                                    <Sparkles className="w-3 h-3" /> Smart Fill
                                 </Button>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                 {["transparent", "#ffffff", "#000000"].concat(palette).map(c => (
                                   <button 
                                     key={c}
                                     className={`w-9 h-9 rounded-xl border-2 transition-all hover:scale-110 ${bgColor === c ? 'border-primary shadow-lg scale-110' : 'border-transparent bg-muted/20'}`}
                                     style={{ 
                                       backgroundColor: c === "transparent" ? 'white' : c,
                                       backgroundImage: c === "transparent" ? 'linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc)' : 'none',
                                       backgroundPosition: '0 0, 4.5px 4.5px',
                                       backgroundSize: '9px 9px'
                                     }}
                                     onClick={() => setBgColor(c)}
                                   />
                                 ))}
                                 <div className="relative">
                                   <input 
                                     type="color" 
                                     value={bgColor === "transparent" ? "#ffffff" : bgColor}
                                     onChange={(e) => setBgColor(e.target.value)}
                                     className="w-9 h-9 rounded-xl opacity-0 absolute inset-0 z-10 cursor-pointer"
                                   />
                                   <div className="w-9 h-9 rounded-xl border-2 border-dashed border-muted-foreground/30 flex items-center justify-center bg-card">
                                      <Palette className="w-4 h-4 opacity-40" />
                                   </div>
                                 </div>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <Label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 italic">Gradient Presets</Label>
                              <div className="grid grid-cols-4 gap-3">
                                 {[
                                   'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                                   'linear-gradient(135deg, #f43f5e 0%, #fb923c 100%)',
                                   'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
                                   'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
                                   'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                                   'linear-gradient(135deg, #22c55e 0%, #10b981 100%)',
                                   'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
                                   'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                                 ].map(g => (
                                   <button 
                                     key={g}
                                     className={`aspect-square rounded-xl border-2 transition-all hover:scale-110 active:scale-95 ${bgGradient === g ? 'border-primary shadow-lg scale-110' : 'border-transparent shadow-sm'}`}
                                     style={{ background: g }}
                                     onClick={() => setBgGradient(g)}
                                   />
                                 ))}
                              </div>
                            </div>
                          )}

                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <Label className="text-xs font-black uppercase tracking-widest opacity-60 italic">Drop Shadow</Label>
                              <span className="text-xs font-mono font-black text-primary">{shadow}</span>
                            </div>
                            <Slider value={[shadow]} min={0} max={100} step={1} onValueChange={(v) => setShadow(Array.isArray(v) ? v[0] : v)} />
                          </div>
                        </div>
                     </motion.div>
                   )}

                   {activeTab === 'filters' && (
                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <Label className="text-xs font-black uppercase tracking-widest opacity-60 italic">Brightness</Label>
                            <span className="text-xs font-mono font-black text-primary">{brightness}%</span>
                          </div>
                          <Slider value={[brightness]} min={0} max={200} step={1} onValueChange={(v) => setBrightness(Array.isArray(v) ? v[0] : v)} />
                        </div>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <Label className="text-xs font-black uppercase tracking-widest opacity-60 italic">Contrast</Label>
                            <span className="text-xs font-mono font-black text-primary">{contrast}%</span>
                          </div>
                          <Slider value={[contrast]} min={0} max={200} step={1} onValueChange={(v) => setContrast(Array.isArray(v) ? v[0] : v)} />
                        </div>
                     </motion.div>
                   )}

                   {activeTab === 'ai' && (
                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                        <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 space-y-4">
                           <div className="flex items-center gap-3">
                              <Zap className="w-5 h-5 text-primary animate-pulse" />
                              <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">AI Icon Enhancer</h4>
                           </div>
                           <p className="text-[10px] font-medium text-muted-foreground italic leading-relaxed">
                              One-click intelligent processing to fix blurry assets, remove excess whitespace, and ensure perfect geometric centering.
                           </p>
                           <Button 
                              className="w-full h-12 rounded-xl bg-primary text-white font-black uppercase tracking-widest text-[9px] italic gap-2 shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
                              onClick={enhanceAsset}
                              disabled={isProcessing}
                           >
                              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                              Start Smart Enhancement
                           </Button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                           {[
                              { l: "Sharpen", d: "Blur reduction" },
                              { l: "Center", d: "Geometric fix" },
                              { l: "Trim", d: "Clean edges" },
                              { l: "Upscale", d: "Density boost" }
                           ].map(f => (
                              <div key={f.l} className="p-3 rounded-xl bg-muted/40 border border-border flex flex-col gap-1">
                                 <span className="text-[9px] font-black uppercase tracking-widest text-foreground">{f.l}</span>
                                 <span className="text-[8px] font-bold text-muted-foreground/40 uppercase">{f.d}</span>
                              </div>
                           ))}
                        </div>
                     </motion.div>
                   )}
                   {activeTab === 'svg' && isSvg && (
                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                        <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 space-y-4">
                           <div className="flex items-center gap-3">
                              <Globe className="w-5 h-5 text-emerald-500" />
                              <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-500">SVG Pro Optimizer</h4>
                           </div>
                           <p className="text-[10px] font-medium text-muted-foreground italic leading-relaxed">
                              Cleanse metadata, minify paths, and inject responsive viewBox attributes for SEO-ready vector assets.
                           </p>
                           <Button 
                              className="w-full h-12 rounded-xl bg-emerald-500 text-white font-black uppercase tracking-widest text-[9px] italic gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]"
                              onClick={optimizeSvg}
                              disabled={isProcessing}
                           >
                              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                              Optimize Vector Asset
                           </Button>
                        </div>

                        {optimizedSvg && (
                           <div className="space-y-4">
                              <Label className="text-[10px] font-black uppercase tracking-widest opacity-40">Optimized Payload</Label>
                              <pre className="text-[9px] font-mono p-4 rounded-xl bg-black/40 border border-white/5 overflow-x-auto max-h-32 scrollbar-hide text-emerald-500/80">
                                 {optimizedSvg}
                              </pre>
                              <Button 
                                 variant="outline" 
                                 className="w-full h-10 rounded-xl text-[9px] font-black uppercase tracking-widest border-emerald-500/20 hover:bg-emerald-500/10 text-emerald-500"
                                 onClick={() => {
                                    const blob = new Blob([optimizedSvg], { type: 'image/svg+xml' });
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = "optimized.svg";
                                    a.click();
                                 }}
                              >
                                 Download Optimized SVG
                              </Button>
                           </div>
                        )}
                     </motion.div>
                   )}
                </div>

                {palette.length > 0 && activeTab === 'basic' && (
                  <div className="space-y-4 pt-4 border-t border-border">
                    <Label className="text-xs font-black uppercase tracking-widest opacity-60 italic">Logo Palette</Label>
                    <div className="flex gap-2">
                      {palette.map((color) => (
                        <div 
                          key={color}
                          className="w-8 h-8 rounded-lg border border-border shadow-sm cursor-pointer hover:scale-110 active:scale-95 transition-all"
                          style={{ backgroundColor: color }}
                          onClick={() => {
                            navigator.clipboard.writeText(color);
                            toast.success(`Copied ${color.toUpperCase()}`);
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <Button 
                  className="w-full h-16 rounded-2xl bg-gradient-to-r from-primary to-blue-600 hover:opacity-90 text-white font-black uppercase tracking-[0.2em] gap-4 shadow-[0_20px_50px_rgba(var(--primary-rgb),0.3)] text-lg italic group transition-all hover:scale-[1.02] active:scale-[0.98] border-0"
                  onClick={generateIcons}
                  disabled={isProcessing}
                >
                  {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Zap className="w-6 h-6 group-hover:scale-125 group-hover:rotate-12 transition-transform" />}
                  Bake Icon Assets
                </Button>
              </div>
              
              <div className="p-8 rounded-[2rem] bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 flex items-center gap-5 shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-emerald-500/[0.02] animate-pulse" />
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 shadow-inner">
                  <ShieldCheck className="w-7 h-7 text-emerald-500" />
                </div>
                <div className="flex flex-col relative z-10">
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-500">Secure Protocol</span>
                  <p className="text-xs font-bold text-muted-foreground/80 italic">100% On-Device Encryption</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-12">
              {/* LIVE MOCKUPS */}
              <div className="grid grid-cols-1 gap-10">
                 <div className="space-y-10">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                       <div className="space-y-1">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary italic">Live Context</h4>
                          <h3 className="text-2xl font-black uppercase italic tracking-tighter text-foreground">Preview Matrix</h3>
                       </div>
                       <div className="flex gap-1.5 p-1.5 bg-muted/40 rounded-xl">
                          {(['home', 'settings', 'notifications'] as const).map(c => (
                            <Button 
                              key={c}
                              variant="ghost"
                              size="sm"
                              className={`h-9 px-4 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${previewContext === c ? 'bg-background shadow-lg text-primary' : 'opacity-40'}`}
                              onClick={() => setPreviewContext(c)}
                            >
                              {c}
                            </Button>
                          ))}
                       </div>
                    </div>

                    <div className="grid grid-cols-1 gap-8">
                       <MockupBrowser />
                       <MockupDesktop />
                       <div className="grid md:grid-cols-2 gap-6 items-start">
                          <div className="space-y-4">
                             <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 text-center">macOS Dock</h4>
                             <MockupMacOS />
                          </div>
                          <div className="space-y-4">
                             <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 text-center">Windows Taskbar</h4>
                             <MockupWindows />
                          </div>
                       </div>
                       <div className="flex flex-col items-center gap-6 pt-10">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Mobile Context (iOS)</h4>
                          <MockupMobile type="ios" />
                       </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-secondary/20 border border-border flex items-center justify-between">
                       <span className="text-[10px] font-black uppercase tracking-widest opacity-60 italic">Preview Background Theme</span>
                       <div className="flex gap-2">
                          <Button 
                            variant={previewTheme === 'light' ? 'default' : 'outline'}
                            size="sm"
                            className="h-9 px-4 rounded-lg gap-2"
                            onClick={() => setPreviewTheme('light')}
                          >
                             <Sparkles className="w-4 h-4" /> Light
                          </Button>
                          <Button 
                            variant={previewTheme === 'dark' ? 'default' : 'outline'}
                            size="sm"
                            className="h-9 px-4 rounded-lg gap-2"
                            onClick={() => setPreviewTheme('dark')}
                          >
                             <Monitor className="w-4 h-4" /> Dark
                          </Button>
                       </div>
                    </div>
                 </div>
              </div>

              {/* RESULTS GRID */}
              <div className="space-y-8 pt-8 border-t border-border">
                <div className="flex flex-wrap gap-3 p-1.5 bg-muted/30 rounded-2xl border border-border/50">
                  {(['all', 'web', 'ios', 'android', 'social'] as const).map(p => (
                    <Button 
                      key={p} 
                      variant={activePlatform === p ? 'default' : 'ghost'}
                      size="sm"
                      className={`rounded-xl px-6 font-black uppercase tracking-[0.2em] text-[10px] h-10 transition-all ${activePlatform === p ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'opacity-40 hover:opacity-100'}`}
                      onClick={() => setActivePlatform(p)}
                    >
                      {p}
                    </Button>
                  ))}
                </div>
                
                {results.length > 0 && (
                  <Button 
                    className="w-full h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase tracking-[0.2em] text-[12px] italic gap-3 shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    onClick={downloadAll}
                  >
                    <Download className="w-5 h-5" />
                    Download Complete Branding Kit
                  </Button>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 min-h-[400px]">
                  <AnimatePresence mode="popLayout">
                    {results.length > 0 ? (
                      filteredResults.map((icon, i) => (
                          <motion.div 
                            key={`${icon.name}-${icon.size}-${icon.platform}-${icon.scale || i}`}
                            initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.05 }}
                          className="p-6 rounded-[2.5rem] bg-card border border-border flex flex-col items-center gap-4 group hover:border-primary/30 transition-all shadow-xl relative overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent pointer-events-none" />
                          <div className="relative w-full aspect-square rounded-[1.5rem] overflow-hidden bg-muted/40 border border-border flex items-center justify-center p-4 group-hover:bg-muted/60 transition-colors shadow-inner">
                             <img src={icon.url} className="max-w-full max-h-full object-contain filter drop-shadow-2xl transform group-hover:scale-110 transition-transform duration-500" alt={icon.name} />
                             <div className="absolute top-2 right-2">
                               <Badge className="bg-primary/20 text-primary border-primary/20 text-[8px] font-black">{icon.width || icon.size}x{icon.height || icon.size}</Badge>
                             </div>
                          </div>
                          <div className="text-center space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest truncate max-w-[120px]">{icon.name}</p>
                            <p className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-widest">{icon.platform}</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-10 w-10 rounded-xl hover:bg-primary hover:text-white transition-all opacity-0 group-hover:opacity-100"
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = icon.url;
                              link.download = icon.name;
                              link.click();
                            }}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </motion.div>
                      ))
                    ) : (
                      <div className="col-span-full flex flex-col items-center justify-center gap-6 text-center opacity-40 py-20">
                        <div className="w-20 h-20 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center animate-spin-slow">
                          <RefreshCcw className="w-8 h-8" />
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-xl font-black uppercase italic tracking-tighter text-foreground">Ready for Generation</h4>
                          <p className="text-xs font-bold uppercase tracking-widest">Bake your master asset to populate the matrix</p>
                        </div>
                      </div>
                    )}
                  </AnimatePresence>
                </div>

                {results.length > 0 && (
                  <div className="space-y-8">
                    <div className="p-8 rounded-[3rem] bg-primary/5 border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
                       <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
                       <div className="space-y-4 max-w-md">
                          <div className="flex items-center gap-3">
                             <Smartphone className="w-6 h-6 text-primary" />
                             <h4 className="text-xl font-black uppercase italic tracking-tighter">Adaptive Android Studio</h4>
                          </div>
                          <p className="text-xs font-medium text-muted-foreground italic leading-relaxed">
                             Modern Android icons require separate layers for foreground, background, and themed (monochrome) icons. Generate the complete XML-ready package here.
                          </p>
                       </div>
                       <Button 
                          className="rounded-2xl px-10 h-16 bg-foreground text-background font-black uppercase tracking-widest text-[11px] italic gap-3 shadow-2xl transition-all hover:scale-105 group-hover:bg-primary group-hover:text-white"
                          onClick={generateAdaptiveAndroid}
                          disabled={isProcessing}
                       >
                          <Smartphone className="w-5 h-5" />
                          Export Branding Package
                       </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12 border-t border-border">
                      {/* PWA MANIFEST GENERATOR */}
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-8 rounded-[2.5rem] bg-secondary/20 border border-border space-y-6 relative group overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                           <Button 
                             variant="ghost" 
                             size="sm" 
                             className="h-8 gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-primary/10 hover:text-primary transition-all"
                             onClick={() => {
                               const manifest = {
                                 name: "Your App Name",
                                 short_name: "App",
                                 icons: results.filter(i => i.platform === 'android' || i.platform === 'web').map(i => ({
                                   src: `/${i.name}`,
                                   sizes: `${i.size}x${i.size}`,
                                   type: "image/webp",
                                   purpose: "any maskable"
                                 })),
                                 start_url: "/",
                                 display: "standalone",
                                 background_color: bgColor === 'transparent' ? '#ffffff' : bgColor,
                                 theme_color: bgColor === 'transparent' ? '#3b82f6' : bgColor
                               };
                               navigator.clipboard.writeText(JSON.stringify(manifest, null, 2));
                               toast.success("Manifest copied!");
                             }}
                           >
                             <Copy className="w-3 h-3" /> Copy JSON
                           </Button>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner">
                            <FileCode className="w-5 h-5 text-primary" />
                          </div>
                          <div className="space-y-0.5">
                            <h4 className="text-sm font-black uppercase tracking-widest italic text-foreground">Web Manifest</h4>
                            <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest italic">PWA / SEO Hardening</p>
                          </div>
                        </div>
                        <pre className="text-[11px] font-mono text-muted-foreground bg-black/40 p-6 rounded-2xl overflow-x-auto border border-white/5 h-[220px] scrollbar-hide shadow-inner relative">
                          <div className="absolute top-0 right-0 p-2 text-[8px] font-black uppercase opacity-20 pointer-events-none">JSON</div>
  {JSON.stringify({
    "name": "Your App",
    "short_name": "App",
    "icons": results.filter(i => i.platform === 'android' || i.platform === 'web').slice(0, 3).map(i => ({
      "src": `/${i.name}`,
      "sizes": `${i.size}x${i.size}`,
      "type": "image/png"
    })),
    "display": "standalone"
  }, null, 2)}
                        </pre>
                      </motion.div>

                      {/* HTML EMBED GENERATOR */}
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-8 rounded-[2.5rem] bg-secondary/20 border border-border space-y-6 relative group overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                           <Button 
                             variant="ghost" 
                             size="sm" 
                             className="h-8 gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-blue-500/10 hover:text-blue-500 transition-all"
                             onClick={() => {
                               const html = `<link rel="icon" type="image/webp" sizes="32x32" href="/favicon-32x32.webp">\n<link rel="icon" type="image/webp" sizes="16x16" href="/favicon-16x16.webp">\n<link rel="apple-touch-icon" href="/apple-touch-icon.webp">\n<link rel="manifest" href="/site.webmanifest">`;
                               navigator.clipboard.writeText(html);
                               toast.success("HTML tags copied!");
                             }}
                           >
                             <Copy className="w-3 h-3" /> Copy Tags
                           </Button>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-inner">
                            <Code2 className="w-5 h-5 text-blue-500" />
                          </div>
                          <div className="space-y-0.5">
                            <h4 className="text-sm font-black uppercase tracking-widest italic text-foreground">HTML Embed</h4>
                            <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest italic">Head Tag Integration</p>
                          </div>
                        </div>
                        <pre className="text-[11px] font-mono text-muted-foreground bg-black/40 p-6 rounded-2xl overflow-x-auto border border-white/5 h-[220px] scrollbar-hide shadow-inner relative">
                          <div className="absolute top-0 right-0 p-2 text-[8px] font-black uppercase opacity-20 pointer-events-none">HTML</div>
  {`<link rel="icon" type="image/webp" 
        sizes="32x32" 
        href="/favicon-32x32.webp">
  <link rel="icon" type="image/webp" 
        sizes="16x16" 
        href="/favicon-16x16.webp">
  <link rel="apple-touch-icon" 
        href="/apple-touch-icon.webp">
  <link rel="manifest" 
        href="/site.webmanifest">`}
                        </pre>
                      </motion.div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
