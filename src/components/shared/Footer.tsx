import Link from "next/link";
import { Shield, Heart, ExternalLink, Globe, Zap, Cpu, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const GithubIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

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
                <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-blue-600 p-[1px] group-hover:scale-110 transition-transform">
                  <div className="w-full h-full rounded-[calc(1.1rem)] bg-[#050505] flex items-center justify-center">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <span className="font-black text-2xl tracking-tighter text-white italic uppercase">
                  Private<span className="text-primary">Tools</span>
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

            <div className="flex items-center gap-4">
              {[
                { icon: GithubIcon, href: "https://github.com" },
                { icon: TwitterIcon, href: "https://twitter.com" },
                { icon: Globe, href: "#" }
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/[0.03] border border-white/10 text-white/40 hover:text-white hover:bg-primary/20 hover:border-primary/40 transition-all active:scale-90 shadow-xl"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
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
              © {new Date().getFullYear()} PrivateTools System. Sovereign &amp; Decentralized.
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
