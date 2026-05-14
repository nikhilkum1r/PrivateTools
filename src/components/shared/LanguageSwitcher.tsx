"use client";

import React from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { locales, languageNames } from "@/config/locales";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Globe, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations("common");
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full hover:bg-primary/10 transition-all group"
          aria-label={t("aria.changeLanguage")}
        >
          <Globe className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </Button>
      } />
      <DropdownMenuContent align="end" className="rounded-2xl p-1 shadow-2xl bg-background/80 backdrop-blur-xl border-border/50">
        <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50 border-b border-border/20 mb-1">
          {t("languages.select")}
        </div>
        {locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => handleLanguageChange(loc)}
            className={cn(
              "rounded-xl focus:bg-primary/10 text-xs font-bold py-2.5 px-4 cursor-pointer flex items-center justify-between gap-8",
              locale === loc && "bg-primary/5 text-primary"
            )}
          >
            <span className={cn(loc === 'hi' || loc === 'ar' || loc === 'zh' || loc === 'ja' ? 'font-sans' : 'font-heading')}>
              {languageNames[loc as keyof typeof languageNames]}
            </span>
            {locale === loc && <Check className="w-3.5 h-3.5" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
