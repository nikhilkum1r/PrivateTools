"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { FAQ } from "@/components/shared/FAQ";
import { RelatedTools } from "@/components/shared/RelatedTools";
import { 
  Sparkles,
  ShieldCheck,
  Zap,
  Globe,
  Smartphone,
  Layout,
  Layers,
  ArrowRight,
  CheckCircle2,
  Rocket,
  Shield,
  MonitorSmartphone,
  Cpu,
  Monitor
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const IconStudioClient = dynamic(() => import("./IconStudioClient"), {
  ssr: false,
});

interface IconsLandingClientProps {
  pageSchema: any;
}

export default function IconsLandingClient({ pageSchema }: IconsLandingClientProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/30">
      <Navbar />
      
      <main className="flex-grow">
        {/* PREMIUM VIBRANT BACKGROUND BLOBS */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[20%] right-[-5%] w-[30%] h-[30%] bg-blue-500/20 blur-[100px] rounded-full animate-bounce-slow" />
          <div className="absolute top-[40%] right-[10%] w-[20%] h-[20%] bg-purple-500/10 blur-[80px] rounded-full" />
        </div>

        {/* PREMIUM MINIMAL HERO */}
        <section className="pt-32 pb-16 px-4 container mx-auto text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--primary-muted)_0%,_transparent_70%)] opacity-20 pointer-events-none" />
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 relative z-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] italic">
              <Sparkles className="w-3.5 h-3.5" />
              Ultimate Branding Engine
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-[0.85]">
              Free Icon Generator & <br />
              <span className="text-primary">Favicon Creator</span> Online
            </h1>
            
            <p className="text-xl font-bold text-muted-foreground/60 max-w-2xl mx-auto italic leading-relaxed">
              Create professional favicons, app icons, PWA icons, and website branding assets instantly using our privacy-first browser-based icon generator.
            </p>
          </motion.div>
        </section>

        {/* THE TOOL - CENTERED & PROMINENT */}
        <section id="studio" className="pb-32">
          <div className="container mx-auto">
             <IconStudioClient />
          </div>
        </section>

        {/* INTRODUCTION SECTION */}
        <section className="py-24 px-4 border-y border-border bg-card/30">
          <div className="container mx-auto max-w-4xl space-y-12 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter">Create Professional Icons Instantly</h2>
              <p className="text-lg font-medium text-muted-foreground/80 italic leading-relaxed">
                Icons are one of the most important branding elements for websites, mobile apps, SaaS platforms, and startups. A clean and optimized icon improves brand recognition, trust, and user experience across devices and platforms.
              </p>
              <p className="text-sm font-bold text-primary/60 uppercase tracking-widest italic">
                All image processing happens locally on your device for maximum speed and security.
              </p>
            </motion.div>
          </div>
        </section>

        {/* DETAILED FEATURES GRID */}
        <section className="py-24 px-4 container mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {[
              {
                title: "Generate Favicons for Websites",
                icon: Globe,
                content: "Favicons are small icons displayed in browser tabs, bookmarks, and search results. Our favicon creator automatically generates favicon.ico, PNG/SVG favicons, and Apple touch icons for blogs, portfolios, and SaaS dashboards.",
                list: ["Browser Tabs", "Bookmarks", "Mobile Shortcuts", "Search Results"]
              },
              {
                title: "Create Android & iOS App Icons",
                icon: Smartphone,
                content: "Generate mobile app icons optimized for Android apps, iPhone apps, Flutter projects, and React Native. Automatically create adaptive Android icons and high-resolution iOS assets compatible with the App Store.",
                list: ["Android Adaptive Icons", "iOS 17 Compatible", "Splash Screens", "Launcher Assets"]
              },
              {
                title: "PWA Icon Generator",
                icon: Rocket,
                content: "Modern SaaS platforms use Progressive Web Apps for installable experiences. Our generator creates maskable icons, manifest-ready assets, and install screen graphics compatible with Next.js, React, and Vue.",
                list: ["Maskable Icons", "manifest.json ready", "Install Screens", "Nuxt/Next Support"]
              },
              {
                title: "Privacy-First Processing",
                icon: Shield,
                content: "Unlike many online tools, your files are never uploaded to servers. Everything runs locally inside your browser using Canvas API and WebAssembly for maximum privacy and zero tracking.",
                list: ["Client-Side Rendering", "GPU Acceleration", "Zero Server Uploads", "Offline Friendly"]
              }
            ].map((feature, i) => (
              <motion.div 
                key={feature.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="p-10 rounded-[3rem] bg-card border border-border space-y-6 group hover:border-primary/30 transition-all shadow-xl"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-black uppercase italic tracking-tighter">{feature.title}</h3>
                <p className="text-muted-foreground/70 font-medium italic leading-relaxed">
                  {feature.content}
                </p>
                <ul className="grid grid-cols-2 gap-3 pt-4">
                  {feature.list.map(item => (
                    <li key={item} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500/50" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        {/* TECHNICAL SPECIFICATIONS */}
        <section className="py-24 bg-card/50 border-y border-border">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-20 items-center">
              <div className="space-y-8">
                 <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter">Supported Formats & Sizes</h2>
                 <p className="text-lg font-medium text-muted-foreground/70 italic leading-relaxed">
                    Different platforms require different icon sizes. Our tool automatically generates all major icon resolutions instantly to ensure compatibility across Chrome, Safari, Firefox, Android, and iOS.
                 </p>
                 <div className="flex flex-wrap gap-2">
                    {[16, 32, 48, 64, 96, 128, 192, 256, 512].map(s => (
                      <Badge key={s} variant="outline" className="px-4 py-1.5 rounded-xl border-border bg-background text-xs font-mono font-black italic">{s}x{s}</Badge>
                    ))}
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="p-8 rounded-3xl bg-background border border-border space-y-4 shadow-xl">
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary italic">Input Formats</h4>
                  <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-[9px] font-black uppercase tracking-widest opacity-60">
                    <li>.PNG / .JPG</li>
                    <li>.WEBP / .SVG</li>
                    <li>.AVIF / .GIF</li>
                    <li>.BMP / .TIFF</li>
                    <li>.ICO / .EPS</li>
                    <li>.AI / .PDF</li>
                  </ul>
                </div>
                <div className="p-8 rounded-3xl bg-background border border-border space-y-4 shadow-xl">
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-blue-500 italic">Output Assets</h4>
                  <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-[9px] font-black uppercase tracking-widest opacity-60">
                    <li>.ICO / .PNG</li>
                    <li>.SVG / .WEBP</li>
                    <li>.JPG / .JPEG</li>
                    <li>.GIF / .BMP</li>
                    <li>.TIFF / .TIF</li>
                    <li>.AVIF / .ICNS</li>
                    <li>.XPM / .EPS</li>
                    <li>.AI / .PDF</li>
                    <li>.CDR / .DXF</li>
                    <li>.XML / .PSD</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BRANDING VALUE SECTION */}
        <section className="py-24 px-4 container mx-auto text-center max-w-4xl space-y-12">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter">Why Icons Matter for SEO</h2>
            <div className="w-24 h-1.5 bg-primary mx-auto rounded-full" />
          </div>
          <p className="text-xl font-bold text-muted-foreground/60 italic leading-relaxed">
            Professional icons improve click-through rates, brand recognition, user trust, and visual identity. Search engines and browsers increasingly favor websites with complete branding assets and optimized metadata.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
            {[
              { l: "Trust", i: ShieldCheck },
              { l: "Authority", i: Layers },
              { l: "Retention", i: Zap },
              { l: "SEO Visibility", i: Globe }
            ].map(item => (
              <div key={item.l} className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-secondary/50 flex items-center justify-center border border-border mx-auto">
                   <item.i className="w-6 h-6 text-primary/60" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{item.l}</span>
              </div>
            ))}
          </div>
        </section>

        {/* COMPREHENSIVE ICON FORMATS GUIDE (SEO POWERHOUSE) */}
        <section className="py-32 px-4 container mx-auto">
          <div className="max-w-5xl mx-auto space-y-20">
            <div className="text-center space-y-6">
              <Badge variant="outline" className="px-6 py-2 rounded-full border-primary/20 text-primary font-black uppercase tracking-[0.3em] italic bg-primary/5">Technical Guide</Badge>
              <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-tight">Complete Icons Formats <br />& Extensions Guide</h2>
              <p className="text-xl font-bold text-muted-foreground/60 max-w-2xl mx-auto italic">
                Our online icon generator supports all major favicon, app icon, PWA icon, and branding image formats. Generate optimized icons for websites, Android, iOS, and social media instantly.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
              {/* BROWSER FAVICONS */}
              <div className="p-10 rounded-[3rem] bg-card/50 border border-border space-y-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Globe className="w-24 h-24 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter">Browser Favicon Suite</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary italic">Web Standards Compatibility</p>
                </div>
                <div className="space-y-4 overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border/50 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
                        <th className="pb-4">Format</th>
                        <th className="pb-4">Extension</th>
                        <th className="pb-4">Usage</th>
                      </tr>
                    </thead>
                    <tbody className="text-[11px] font-bold italic">
                      {[
                        { f: "Microsoft Icon", e: ".ico", u: "Traditional Favicon" },
                        { f: "PNG", e: ".png", u: "Modern Support" },
                        { f: "SVG", e: ".svg", u: "High Quality" },
                        { f: "WebP", e: ".webp", u: "Lightweight" },
                        { f: "AVIF", e: ".avif", u: "Ultra Compressed" }
                      ].map((row, i) => (
                        <tr key={i} className="border-b border-border/20 last:border-0">
                          <td className="py-4 text-foreground">{row.f}</td>
                          <td className="py-4 text-primary/80 font-mono">{row.e}</td>
                          <td className="py-4 text-muted-foreground/60">{row.u}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* MOBILE APP ICONS */}
              <div className="p-10 rounded-[3rem] bg-card/50 border border-border space-y-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Smartphone className="w-24 h-24 text-blue-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter">Mobile App Ecosystem</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 italic">iOS & Android Specifications</p>
                </div>
                <div className="space-y-4 overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border/50 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
                        <th className="pb-4">Type</th>
                        <th className="pb-4">Dimensions</th>
                        <th className="pb-4">Platform</th>
                      </tr>
                    </thead>
                    <tbody className="text-[11px] font-bold italic">
                      {[
                        { t: "Notification", d: "20x20 - 48x48", p: "iOS / Android" },
                        { t: "Settings", d: "29x29 - 87x87", p: "iOS" },
                        { t: "Launcher Icon", d: "60x60 - 512x512", p: "All Mobile" },
                        { t: "Splash Screen", d: "2732x2732", p: "iOS / Android" },
                        { t: "App Store icon", d: "1024x1024", p: "iOS / Play Store" }
                      ].map((row, i) => (
                        <tr key={i} className="border-b border-border/20 last:border-0">
                          <td className="py-4 text-foreground">{row.t}</td>
                          <td className="py-4 text-blue-500/80 font-mono">{row.d}</td>
                          <td className="py-4 text-muted-foreground/60">{row.p}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* BEST FORMAT RECOMMENDATIONS */}
            <div className="p-12 rounded-[4rem] bg-gradient-to-br from-primary/5 to-transparent border border-primary/10 shadow-3xl">
              <div className="grid md:grid-cols-3 gap-12">
                <div className="space-y-4">
                   <h4 className="text-lg font-black uppercase italic tracking-tighter">Best Practice Recommendations</h4>
                   <p className="text-sm font-medium text-muted-foreground/60 leading-relaxed italic">
                      Our experts recommend a hybrid approach for maximum compatibility across browsers and operating systems.
                   </p>
                </div>
                <div className="md:col-span-2 grid sm:grid-cols-2 gap-8">
                   {[
                     { u: "Website Favicon", f: "ICO + PNG", d: "Universal browser compatibility" },
                     { u: "Modern Web Apps", f: "SVG", d: "Retina-ready vector scalability" },
                     { u: "Mobile Native", f: "PNG (24-bit)", d: "Apple and Google standards" },
                     { u: "Performance SEO", f: "WebP / AVIF", d: "Smallest possible file payload" }
                   ].map(rec => (
                     <div key={rec.u} className="flex gap-4">
                        <div className="w-10 h-10 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                           <CheckCircle2 className="w-5 h-5 text-primary" />
                        </div>
                        <div className="space-y-1">
                           <p className="text-[10px] font-black uppercase tracking-widest text-primary">{rec.u}</p>
                           <p className="text-sm font-black italic">{rec.f}</p>
                           <p className="text-[10px] font-bold text-muted-foreground/40 italic">{rec.d}</p>
                        </div>
                     </div>
                   ))}
                </div>
              </div>
            </div>

            {/* SEO KEYWORD HUB */}
            <div className="text-center space-y-8 pt-20 border-t border-border">
              <h3 className="text-xs font-black uppercase tracking-[0.4em] text-muted-foreground/40">Technical Index & Keywords</h3>
              <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-[10px] font-black uppercase tracking-widest opacity-20 italic">
                <span>Favicon Formats</span>
                <span>Icon Extensions</span>
                <span>App Icon Sizes</span>
                <span>ICO Generator</span>
                <span>SVG Favicon</span>
                <span>PNG Icon Creator</span>
                <span>Android Adaptive Icons</span>
                <span>Apple Touch Icons</span>
                <span>PWA Icon Formats</span>
                <span>Browser Favicon Sizes</span>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <FAQ 
          items={[
            { question: "What is the best format for a website favicon?", answer: "For maximum compatibility, we recommend providing both a 32x32 .ico file and a 192x192 .png file. Modern browsers also support .svg for high-quality scalable icons." },
            { question: "Is the icon generator free?", answer: "Yes. All core icon generation tools are completely free to use with no hidden fees." },
            { question: "Are my images uploaded to servers?", answer: "No. Files are processed locally inside your browser using the GPU. Your privacy is our priority." },
            { question: "Can I create Android and iOS app icons?", answer: "Yes. Our generator creates full multi-platform bundles including iPhone settings icons, Android launcher icons, and splash screens." },
            { question: "Does the tool support SVG icons?", answer: "Yes. SVG input and optimization are fully supported for resolution-independent branding." }
          ]}
          title="Icon Studio FAQ"
          className="py-32 border-t border-border"
        />

        {/* RELATED TOOLS */}
        <RelatedTools 
          tools={[
            { name: "Image Editor", href: "/image/editor" },
            { name: "Image Compressor", href: "/image/compress" },
            { name: "Format Converter", href: "/image/convert" },
            { name: "Background Remover", href: "/image/remove-bg" },
            { name: "Color Lab", href: "/image/colors" }
          ]}
        />

        {/* FINAL CTA */}
        <section className="py-40 px-4 text-center bg-gradient-to-b from-transparent to-primary/5">
           <div className="max-w-3xl mx-auto space-y-10">
              <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter">Perfect for Developers & Startups</h2>
              <p className="text-xl font-bold text-muted-foreground/60 italic leading-relaxed">
                Generate professional assets without Photoshop. Save time while maintaining visual consistency across all platforms.
              </p>
              <Button size="lg" className="h-16 px-12 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest gap-4 italic group">
                Create Your Icons
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </Button>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
