import Link from "next/link";
import Image from "next/image";
import { Heart, Cpu, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";



const footerLinks = {
  product: [
    { name: "All Tools", href: "/tools" },
    { name: "Features", href: "/features" },
    { name: "Pricing", href: "/pricing" },
    { name: "Developers", href: "/developers" },
    { name: "Changelog", href: "/changelog" },
  ],
  resources: [
    { name: "About SafeTools", href: "/about" },
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Contact Us", href: "/contact" },
    { name: "FAQ", href: "/faq" },
    { name: "System Status", href: "/status" },
  ],
  community: [
    { name: "Blog", href: "/blog" },
    { name: "Updates", href: "/updates" },
    { name: "Feedback", href: "/feedback" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-background mt-auto relative overflow-hidden">
      {/* Background Image Overlay */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.05] grayscale" 
        style={{ 
          backgroundImage: "url('/footer-bg.webp')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      {/* Subtle Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[300px] bg-primary/5 blur-[120px] rounded-full pointer-events-none opacity-30" />

      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <div className="relative w-10 h-10 flex items-center justify-center">
                <div className="absolute inset-0 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors" />
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10">
                  <path d="M12 4L4 8L12 12L20 8L12 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary" />
                  <path d="M4 12L12 16L20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary/70" />
                  <path d="M4 16L12 20L20 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary/40" />
                </svg>
              </div>
              <span className="font-heading font-black text-2xl tracking-tighter text-foreground uppercase italic">
                Safe<span className="text-primary">Tools</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              Privacy-First Browser Utilities. Built for the modern web with privacy, speed, and accessibility at the core.
            </p>
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:text-primary transition-colors cursor-pointer" title="Local Engine Active"><Cpu className="w-4 h-4" /></div>
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:text-primary transition-colors cursor-pointer" title="Isolated Context Verified"><Lock className="w-4 h-4" /></div>
            </div>
            
            {/* Browser Compatibility */}
            <div className="pt-4 space-y-3">
              <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">Verified Support</p>
              <div className="flex flex-wrap gap-4 opacity-30 grayscale hover:grayscale-0 transition-all">
                {["Chrome", "Firefox", "Edge", "Safari", "Android", "iPhone"].map(b => (
                   <span key={b} className="text-[10px] font-black tracking-tighter uppercase italic">{b}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Links Sections */}
          <div>
            <h4 className="font-heading text-sm font-bold text-foreground mb-6">Product</h4>
            <ul className="space-y-4">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-sm font-bold text-foreground mb-6">Resources</h4>
            <ul className="space-y-4">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-sm font-bold text-foreground mb-6">Community</h4>
            <ul className="space-y-4">
              {footerLinks.community.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>



        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
            <span>© 2026 SafeTools.space</span>
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">All Systems Local</span>
            </div>
            <div className="flex items-center gap-3">
              <Link href="https://github.com/nikhilkum1r" className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-all">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              </Link>
              <Link href="#" className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-all">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
