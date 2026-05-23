import { Link } from "@/i18n/routing";
import { Cpu, Lock, Rss } from "lucide-react";
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");
  const common = useTranslations("common");

  const footerLinks = {
    product: [
      { name: common("toolsLabel"), href: "/tools" },
      { name: common("features"), href: "/features" },
      { name: common("pricing"), href: "/pricing" },
      { name: common("developers"), href: "/developers" },
      { name: common("changelog"), href: "/changelog" },
    ],
    resources: [
      { name: common("about"), href: "/about" },
      { name: common("whyAds"), href: "/ads" },
      { name: "Philosophy", href: "/philosophy" },
      { name: common("privacyPolicy"), href: "/privacy-policy" },
      { name: common("termsOfService"), href: "/terms" },
      { name: common("contact"), href: "/contact" },
      { name: common("faqLabel"), href: "/faq" },
      { name: common("systemStatus"), href: "/status" },
    ],
    community: [
      { name: common("blog"), href: "/blog" },
      { name: common("updates"), href: "/updates" },
      { name: common("feedback"), href: "/feedback" },
    ],
  };

  return (
    <footer data-google-ads-ignore="true" className="border-t border-border bg-background mt-auto relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[200px] bg-primary/3 blur-[100px] rounded-full pointer-events-none" aria-hidden="true" />

      <div className="container mx-auto px-6 py-16 lg:py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <div className="relative w-9 h-9 flex items-center justify-center">
                <div className="absolute inset-0 rounded-xl bg-primary/8 group-hover:bg-primary/15 transition-colors" />
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10">
                  <path d="M12 4L4 8L12 12L20 8L12 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary" />
                  <path d="M4 12L12 16L20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary/70" />
                  <path d="M4 16L12 20L20 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary/40" />
                </svg>
              </div>
              <span className="font-heading font-extrabold text-xl tracking-tight text-foreground">
                {common("brand.name").slice(0, 4)}<span className="text-primary">{common("brand.name").slice(4)}</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              {t("brand")}
            </p>
            <p className="text-sm font-semibold text-primary max-w-sm">
              {t("tagline")}
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center hover:text-primary transition-colors cursor-pointer" title={t("localEngineActive")}>
                <Cpu className="w-4 h-4" />
              </div>
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center hover:text-primary transition-colors cursor-pointer" title={t("isolatedContextVerified")}>
                <Lock className="w-4 h-4" />
              </div>
              <a href="/rss.xml" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center hover:text-primary transition-colors" title="RSS Feed" aria-label="RSS Feed">
                <Rss className="w-4 h-4" />
              </a>
            </div>
            
            {/* Browser Compatibility */}
            <div className="pt-3 space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40">{t("verifiedSupport")}</p>
              <div className="flex flex-wrap gap-3 text-muted-foreground hover:text-muted-foreground/80 transition-colors">
                {["chrome", "firefox", "edge", "safari", "android", "iphone"].map(b => (
                   <span key={b} className="text-[10px] font-semibold tracking-wide uppercase">{t(`browsers.${b}`)}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Links Sections */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-5">{t("product")}</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-5">{t("resources")}</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-5">{t("community")}</h3>
            <ul className="space-y-3">
              {footerLinks.community.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>{t("copyright")}</span>
            <span className="hidden md:inline">·</span>
            <Link href="/privacy-policy" className="hover:text-foreground transition-colors">{common("privacyPolicy")}</Link>
            <span className="hidden md:inline">·</span>
            <Link href="/terms" className="hover:text-foreground transition-colors">{common("termsOfService")}</Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">{t("systemsLocal")}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Link href="https://github.com/nikhilkum1r" className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-all" aria-label="GitHub">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              </Link>
              <Link href="#" className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-all" aria-label="Twitter">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
