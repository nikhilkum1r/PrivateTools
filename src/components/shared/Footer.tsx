import Link from "next/link";
import Image from "next/image";
import { Heart, Cpu, Lock } from "lucide-react";



const footerLinks = {
  tools: [
    { name: "Image Studio", href: "/image/editor" },
    { name: "Format Converter", href: "/image/convert" },
    { name: "Image Compressor", href: "/image/compress" },
    { name: "PDF Merger", href: "/pdf/merge" },
    { name: "PDF Splitter", href: "/pdf/split" },
    { name: "Color Lab", href: "/image/colors" },
  ],
  media: [
    { name: "Video Lab", href: "/video" },
    { name: "Audio Toolkit", href: "/audio" },
    { name: "QR Studio", href: "/qr" },
    { name: "Dev Toolkit", href: "/devtools" },
    { name: "Bulk Renamer", href: "/bulk-rename" },
  ],
  security: [
    { name: "Privacy Scrubber", href: "/privacy/metadata" },
    { name: "Secure Vault", href: "/privacy/vault" },
    { name: "Steganography", href: "/steganography" },
    { name: "Password Gen", href: "/security" },
  ],
  ecosystem: [
    { name: "Privacy Manifesto", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "About Studio", href: "/about" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#050505] mt-auto relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[300px] bg-primary/5 blur-[120px] rounded-full pointer-events-none opacity-30" />
      
      <div className="container mx-auto px-6 py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-16 lg:gap-12">
          {/* Brand & Mission */}
          <div className="lg:col-span-3 space-y-10">
            <div className="space-y-6">
              <Link href="/" className="flex items-center gap-3 group w-fit">
                <div className="w-12 h-12 flex items-center justify-center rounded-2xl overflow-hidden group-hover:scale-110 transition-transform">
                  <Image src="/android-chrome-192x192.png" alt="SafeTools Logo" width={48} height={48} className="rounded-2xl" />
                </div>
                <span className="font-black text-2xl tracking-tighter text-white italic uppercase">
                  Safe<span className="text-primary">Tools</span>
                </span>
              </Link>
              <p className="text-base text-white/40 max-w-md leading-relaxed font-medium">
                The absolute standard in client-side media engineering. 
                All processing happens in your browser's RAM — zero latency, 
                zero tracking, absolute data sovereignty.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/5">
                <Cpu className="w-3.5 h-3.5" /> Zero-Server Architecture
              </div>
              <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/5">
                <Lock className="w-3.5 h-3.5" /> Native Hardware Encryption
              </div>
            </div>


          </div>

          {/* Links Sections */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:col-span-3 gap-12 lg:gap-8">
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-8 italic">
                Creative
              </h4>
              <ul className="space-y-4">
                {footerLinks.tools.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-white/30 hover:text-white transition-all font-bold uppercase tracking-tight hover:translate-x-1 inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-8 italic">
                Media & Dev
              </h4>
              <ul className="space-y-4">
                {footerLinks.media.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-white/30 hover:text-white transition-all font-bold uppercase tracking-tight hover:translate-x-1 inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-8 italic">
                Security
              </h4>
              <ul className="space-y-4">
                {footerLinks.security.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-white/30 hover:text-white transition-all font-bold uppercase tracking-tight hover:translate-x-1 inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 md:col-span-1">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-8 italic">
                Manifesto
              </h4>
              <ul className="space-y-4">
                {footerLinks.ecosystem.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-white/30 hover:text-white transition-all font-bold uppercase tracking-tight hover:translate-x-1 inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 mt-24 pt-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/20 italic">
              © {new Date().getFullYear()} SafeTools System. Sovereign &amp; Decentralized.
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-widest text-white/20">Zero-Server</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.5s' }} />
              <span className="text-[9px] font-black uppercase tracking-widest text-white/20">WASM Engine</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" style={{ animationDelay: '1s' }} />
              <span className="text-[9px] font-black uppercase tracking-widest text-white/20">150+ Tools</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 p-4 rounded-2xl bg-white/[0.02] border border-white/5 shadow-2xl">
            <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40">
              Forged in <Heart className="w-3.5 h-3.5 text-primary fill-primary animate-pulse" /> for the Open Web
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
