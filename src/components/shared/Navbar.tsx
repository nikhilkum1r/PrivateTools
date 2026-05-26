"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import {
  ImageIcon,
  FileText,
  Lock,
  Menu,
  Moon,
  Sun,
  QrCode,
  Terminal,
  Sparkles,
  ArrowRight,
  Shield,
  Video,
  Music,
  Cpu,
  Search,
  ChevronRight,
  Unlock,
  Palette,
  Minimize,
  Repeat,
  Scissors,
  Wand2,
  Brush,
  FileImage,
  Fingerprint,
  FileKey,
  Hash,
  Database,
  Link as LinkIcon,
  Clock,
  Type,
  Code,
  CaseSensitive,
  AlignLeft,
  Layout,
  Edit3
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "@/components/shared/ThemeProvider";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function Navbar() {
  const t = useTranslations("navbar");
  const common = useTranslations("common");
  const t_footer = useTranslations("footer");
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [isOnline, setIsOnline] = React.useState(true);

  React.useEffect(() => {
    setMounted(true);
    setIsOnline(navigator.onLine);
    const handleScroll = () => setScrolled(window.scrollY > 8);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!mounted) {
    return (
      <header 
        className="fixed top-0 left-0 right-0 z-[100] w-full border-b border-border/40 bg-background/60 backdrop-blur-3xl"
        suppressHydrationWarning
      >
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
               <Shield className="w-5 h-5 text-primary" />
            </div>
            <span className="font-heading font-extrabold text-lg tracking-tight leading-none">
              Safe<span className="text-primary">Tools</span>
            </span>
          </div>
          <div className="hidden xl:flex items-center gap-8">
             <div className="h-4 w-16 bg-muted/20 animate-pulse rounded-full" />
             <div className="h-4 w-24 bg-muted/20 animate-pulse rounded-full" />
             <div className="h-4 w-24 bg-muted/20 animate-pulse rounded-full" />
          </div>
          <div className="flex items-center gap-4">
             <div className="h-8 w-8 bg-muted/20 animate-pulse rounded-full" />
             <div className="h-9 w-24 bg-primary/20 animate-pulse rounded-xl" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <nav
      data-google-ads-ignore="true"
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-border/50 bg-background/70 backdrop-blur-3xl shadow-sm supports-[backdrop-filter]:bg-background/60"
          : "bg-transparent"
      )}
      suppressHydrationWarning
    >
      <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group" aria-label={`${common("brand.name")} – ${common("aria.goHome")}`}>
          <div className="relative w-9 h-9 flex items-center justify-center">
            <div
              className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/20 to-blue-500/10 group-hover:from-primary/30 group-hover:to-blue-500/20 transition-all duration-300"
            />
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10">
              <path d="M12 4L4 8L12 12L20 8L12 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary" />
              <path d="M4 12L12 16L20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary/70" />
              <path d="M4 16L12 20L20 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary/40" />
            </svg>
          </div>
          <span className="font-heading font-extrabold text-lg tracking-tight leading-none">
            {common("brand.name").slice(0, 4)}<span className="text-primary">{common("brand.name").slice(4)}</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden xl:flex items-center gap-0.5">
          <NavigationMenu>
            <NavigationMenuList>
              {/* PDF Tools */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent font-medium text-sm text-muted-foreground hover:text-foreground transition-colors px-3.5">
                  {t("categories.pdf")}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[420px] gap-1.5 p-3 md:w-[520px] md:grid-cols-2 bg-transparent">
                    <NavListItem href="/pdf/compress-pdf" icon={Minimize} title={t("items.compressPdf")}>
                      {t("items.compressPdfDesc")}
                    </NavListItem>
                    <NavListItem href="/pdf/merge-pdf" icon={FileText} title={t("items.mergePdf")}>
                      {t("items.mergePdfDesc")}
                    </NavListItem>
                    <NavListItem href="/pdf/split-pdf" icon={Scissors} title={t("items.splitPdf")}>
                      {t("items.splitPdfDesc")}
                    </NavListItem>
                    <NavListItem href="/pdf/protect-pdf" icon={Lock} title={t("items.protectPdf")}>
                      {t("items.protectPdfDesc")}
                    </NavListItem>
                    <NavListItem href="/pdf/unlock-pdf" icon={Unlock} title={t("items.unlockPdf")}>
                      {t("items.unlockPdfDesc")}
                    </NavListItem>
                    <NavListItem href="/pdf/edit-pdf" icon={Edit3} title={t("items.editPdf")}>
                      {t("items.editPdfDesc")}
                    </NavListItem>
                    <NavListItem href="/document/pdf-to-txt" icon={Type} title={t("items.pdfToText")}>
                      {t("items.pdfToTextDesc")}
                    </NavListItem>
                    <NavListItem href="/document/word-to-pdf" icon={FileText} title={t("items.wordToPdf")}>
                      {t("items.wordToPdfDesc")}
                    </NavListItem>
                    <NavListItem href="/document/master" icon={Layout} title={t("items.docsMaster")}>
                      {t("items.docsMasterDesc")}
                    </NavListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Image Tools */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent font-medium text-sm text-muted-foreground hover:text-foreground transition-colors px-3.5">
                  {t("categories.image")}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[420px] gap-1.5 p-3 md:w-[760px] md:grid-cols-3 bg-transparent max-h-[70vh] overflow-y-auto">
                    <NavListItem href="/image/colors" icon={Palette} title={t("items.colors")}>
                      {t("items.colorsDesc")}
                    </NavListItem>
                    <NavListItem href="/image/compress" icon={Minimize} title={t("items.compressImage")}>
                      {t("items.compressImageDesc")}
                    </NavListItem>
                    <NavListItem href="/image/convert" icon={Repeat} title={t("items.convertImage")}>
                      {t("items.convertImageDesc")}
                    </NavListItem>
                    {/* <NavListItem href="/image/editor" icon={ImageIcon} title={t("items.imageEditor")}>
                      {t("items.imageEditorDesc")}
                    </NavListItem> */}

                    <NavListItem href="/image/ocr" icon={Search} title={t("items.ocrStudio")}>
                      {t("items.ocrStudioDesc")}
                    </NavListItem>
                    <NavListItem href="/image/remove-background" icon={Wand2} title={t("items.backgroundRemover")}>
                      {t("items.backgroundRemoverDesc")}
                    </NavListItem>
                    <NavListItem href="/image/to-pptx" icon={FileText} title={t("items.imageToPptx")}>
                      {t("items.imageToPptxDesc")}
                    </NavListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Media Tools */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent font-medium text-sm text-muted-foreground hover:text-foreground transition-colors px-3.5">
                  {t("categories.media")}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[420px] gap-1.5 p-3 md:w-[520px] md:grid-cols-2 bg-transparent">
                    <NavListItem href="/audio" icon={Music} title={t("items.audioStudio")}>
                      {t("items.audioStudioDesc")}
                    </NavListItem>
                    <NavListItem href="/video" icon={Video} title={t("items.videoStudio")}>
                      {t("items.videoStudioDesc")}
                    </NavListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Privacy Tools */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent font-medium text-sm text-muted-foreground hover:text-foreground transition-colors px-3.5">
                  {t("categories.privacy")}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[420px] gap-1.5 p-3 md:w-[520px] md:grid-cols-2 bg-transparent">
                    <NavListItem href="/security/metadata-cleaner" icon={FileImage} title={t("items.metadataCleaner")}>
                      {t("items.metadataCleanerDesc")}
                    </NavListItem>
                    <NavListItem href="/privacy/password-generator" icon={FileKey} title={t("items.passwordGenerator")}>
                      {t("items.passwordGeneratorDesc")}
                    </NavListItem>
                    <NavListItem href="/privacy/password-checker" icon={Shield} title={t("items.passwordChecker")}>
                      {t("items.passwordCheckerDesc")}
                    </NavListItem>
                    <NavListItem href="/privacy/privacy-scanner" icon={Fingerprint} title={t("items.dataLeakChecker")}>
                      {t("items.dataLeakCheckerDesc")}
                    </NavListItem>
                    <NavListItem href="/privacy/secure-notes" icon={Lock} title={t("items.secureNotes")}>
                      {t("items.secureNotesDesc")}
                    </NavListItem>
                    <NavListItem href="/security/file-shredder" icon={Scissors} title={t("items.fileShredder")}>
                      {t("items.fileShredderDesc")}
                    </NavListItem>
                    <NavListItem href="/security/steganography" icon={ImageIcon} title={t("items.steganography")}>
                      {t("items.steganographyDesc")}
                    </NavListItem>
                    <NavListItem href="/security/vault" icon={Database} title={t("items.vault")}>
                      {t("items.vaultDesc")}
                    </NavListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Developer Tools */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent font-medium text-sm text-muted-foreground hover:text-foreground transition-colors px-3.5">
                  {t("categories.developer")}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[420px] gap-1.5 p-3 md:w-[520px] md:grid-cols-2 bg-transparent max-h-[70vh] overflow-y-auto">
                    <NavListItem href="/devtools/json" icon={Code} title={t("items.jsonProcessor")}>
                      {t("items.jsonProcessorDesc")}
                    </NavListItem>
                    <NavListItem href="/devtools/base64" icon={Repeat} title={t("items.base64Engine")}>
                      {t("items.base64EngineDesc")}
                    </NavListItem>
                    <NavListItem href="/devtools/hash" icon={Hash} title={t("items.hashGenerator")}>
                      {t("items.hashGeneratorDesc")}
                    </NavListItem>
                    <NavListItem href="/devtools/jwt" icon={Database} title={t("items.jwtDebugger")}>
                      {t("items.jwtDebuggerDesc")}
                    </NavListItem>
                    <NavListItem href="/devtools/url" icon={LinkIcon} title={t("items.urlEncoder")}>
                      {t("items.urlEncoderDesc")}
                    </NavListItem>
                    <NavListItem href="/devtools/uuid" icon={Fingerprint} title={t("items.uuidFactory")}>
                      {t("items.uuidFactoryDesc")}
                    </NavListItem>
                    <NavListItem href="/devtools/timestamp" icon={Clock} title={t("items.epochConverter")}>
                      {t("items.epochConverterDesc")}
                    </NavListItem>
                    <NavListItem href="/devtools/lorem" icon={Type} title={t("items.loremIpsum")}>
                      {t("items.loremIpsumDesc")}
                    </NavListItem>
                    <NavListItem href="/image/colors" icon={Palette} title={t("items.colorConverter")}>
                      {t("items.colorConverterDesc")}
                    </NavListItem>
                    <NavListItem href="/devtools/icons" icon={FileImage} title={t("items.icons")}>
                      {t("items.iconsDesc")}
                    </NavListItem>
                    <NavListItem href="/tools/qr-generator" icon={QrCode} title={t("items.qrGenerator")}>
                      {t("items.qrGeneratorDesc")}
                    </NavListItem>
                    <NavListItem href="/document/text-tools/case-converter" icon={CaseSensitive} title={t("items.caseConverter")}>
                      {t("items.caseConverterDesc")}
                    </NavListItem>
                    <NavListItem href="/document/text-tools/word-counter" icon={AlignLeft} title={t("items.wordCounter")}>
                      {t("items.wordCounterDesc")}
                    </NavListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

            </NavigationMenuList>
          </NavigationMenu>

          <NavigationMenu align="end">
            <NavigationMenuList>
              {/* All Tools */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent font-medium text-sm text-muted-foreground hover:text-foreground transition-colors px-3.5">
                  {t("categories.all")}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[420px] gap-1.5 p-3 md:w-[520px] md:grid-cols-2 bg-transparent max-h-[70vh] overflow-y-auto">
                    {/* PDF Tools */}
                    <NavListItem href="/pdf/compress-pdf" icon={Minimize} title={t("items.compressPdf")}>{t("items.compressPdfDesc")}</NavListItem>
                    <NavListItem href="/pdf/merge-pdf" icon={FileText} title={t("items.mergePdf")}>{t("items.mergePdfDesc")}</NavListItem>
                    <NavListItem href="/pdf/split-pdf" icon={Scissors} title={t("items.splitPdf")}>{t("items.splitPdfDesc")}</NavListItem>
                    <NavListItem href="/pdf/protect-pdf" icon={Lock} title={t("items.protectPdf")}>{t("items.protectPdfDesc")}</NavListItem>
                    <NavListItem href="/pdf/unlock-pdf" icon={Unlock} title={t("items.unlockPdf")}>{t("items.unlockPdfDesc")}</NavListItem>
                    <NavListItem href="/pdf/edit-pdf" icon={Edit3} title={t("items.editPdf")}>{t("items.editPdfDesc")}</NavListItem>
                    <NavListItem href="/document/pdf-to-txt" icon={Type} title={t("items.pdfToText")}>{t("items.pdfToTextDesc")}</NavListItem>
                    <NavListItem href="/document/word-to-pdf" icon={FileText} title={t("items.wordToPdf")}>{t("items.wordToPdfDesc")}</NavListItem>
                    <NavListItem href="/document/master" icon={Layout} title={t("items.docsMaster")}>{t("items.docsMasterDesc")}</NavListItem>
                    <NavListItem href="/document/text-tools/case-converter" icon={CaseSensitive} title={t("items.caseConverter")}>{t("items.caseConverterDesc")}</NavListItem>
                    <NavListItem href="/document/text-tools/word-counter" icon={AlignLeft} title={t("items.wordCounter")}>{t("items.wordCounterDesc")}</NavListItem>
                    
                    {/* Image Tools */}
                    <NavListItem href="/image/colors" icon={Palette} title={t("items.colors")}>{t("items.colorsDesc")}</NavListItem>
                    <NavListItem href="/image/compress" icon={Minimize} title={t("items.compressImage")}>{t("items.compressImageDesc")}</NavListItem>
                    <NavListItem href="/image/convert" icon={Repeat} title={t("items.convertImage")}>{t("items.convertImageDesc")}</NavListItem>
                    {/* <NavListItem href="/image/editor" icon={ImageIcon} title={t("items.imageEditor")}>{t("items.imageEditorDesc")}</NavListItem> */}
                    <NavListItem href="/image/ocr" icon={Search} title={t("items.ocrStudio")}>{t("items.ocrStudioDesc")}</NavListItem>
                    <NavListItem href="/image/remove-background" icon={Wand2} title={t("items.backgroundRemover")}>{t("items.backgroundRemoverDesc")}</NavListItem>
                    <NavListItem href="/image/to-pptx" icon={FileText} title={t("items.imageToPptx")}>{t("items.imageToPptxDesc")}</NavListItem>

                    {/* Media Tools */}
                    <NavListItem href="/audio" icon={Music} title={t("items.audioStudio")}>{t("items.audioStudioDesc")}</NavListItem>
                    <NavListItem href="/video" icon={Video} title={t("items.videoStudio")}>{t("items.videoStudioDesc")}</NavListItem>

                    {/* Privacy Tools */}
                    <NavListItem href="/security/metadata-cleaner" icon={FileImage} title={t("items.metadataCleaner")}>{t("items.metadataCleanerDesc")}</NavListItem>
                    <NavListItem href="/privacy/password-generator" icon={FileKey} title={t("items.passwordGenerator")}>{t("items.passwordGeneratorDesc")}</NavListItem>
                    <NavListItem href="/privacy/password-checker" icon={Shield} title={t("items.passwordChecker")}>{t("items.passwordCheckerDesc")}</NavListItem>
                    <NavListItem href="/privacy/privacy-scanner" icon={Fingerprint} title={t("items.dataLeakChecker")}>{t("items.dataLeakCheckerDesc")}</NavListItem>
                    <NavListItem href="/privacy/secure-notes" icon={Lock} title={t("items.secureNotes")}>{t("items.secureNotesDesc")}</NavListItem>
                    <NavListItem href="/security/file-shredder" icon={Scissors} title={t("items.fileShredder")}>{t("items.fileShredderDesc")}</NavListItem>
                    <NavListItem href="/security/steganography" icon={ImageIcon} title={t("items.steganography")}>{t("items.steganographyDesc")}</NavListItem>
                    <NavListItem href="/security/vault" icon={Database} title={t("items.vault")}>{t("items.vaultDesc")}</NavListItem>

                    {/* Developer Tools */}
                    <NavListItem href="/devtools/json" icon={Code} title={t("items.jsonProcessor")}>{t("items.jsonProcessorDesc")}</NavListItem>
                    <NavListItem href="/devtools/base64" icon={Repeat} title={t("items.base64Engine")}>{t("items.base64EngineDesc")}</NavListItem>
                    <NavListItem href="/devtools/hash" icon={Hash} title={t("items.hashGenerator")}>{t("items.hashGeneratorDesc")}</NavListItem>
                    <NavListItem href="/devtools/jwt" icon={Database} title={t("items.jwtDebugger")}>{t("items.jwtDebuggerDesc")}</NavListItem>
                    <NavListItem href="/devtools/url" icon={LinkIcon} title={t("items.urlEncoder")}>{t("items.urlEncoderDesc")}</NavListItem>
                    <NavListItem href="/devtools/uuid" icon={Fingerprint} title={t("items.uuidFactory")}>{t("items.uuidFactoryDesc")}</NavListItem>
                    <NavListItem href="/devtools/timestamp" icon={Clock} title={t("items.epochConverter")}>{t("items.epochConverterDesc")}</NavListItem>
                    <NavListItem href="/devtools/lorem" icon={Type} title={t("items.loremIpsum")}>{t("items.loremIpsumDesc")}</NavListItem>
                    <NavListItem href="/devtools/data-converter" icon={Repeat} title={t("items.dataConverter")}>{t("items.dataConverterDesc")}</NavListItem>
                    <NavListItem href="/image/colors" icon={Palette} title={t("items.colorConverter")}>{t("items.colorConverterDesc")}</NavListItem>
                    <NavListItem href="/devtools/icons" icon={FileImage} title={t("items.icons")}>{t("items.iconsDesc")}</NavListItem>
                    <NavListItem href="/tools/qr-generator" icon={QrCode} title={t("items.qrGenerator")}>{t("items.qrGeneratorDesc")}</NavListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {/* Status indicator */}
          <div className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border mr-1 ${!isOnline ? 'bg-amber-500/10 border-amber-500/20' : 'bg-emerald-500/8 border-emerald-500/15'}`}>
            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${!isOnline ? 'bg-amber-500' : 'bg-emerald-500'}`} />
            <span className={`text-[10px] font-semibold uppercase tracking-wider ${!isOnline ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
              {!isOnline ? 'Offline Mode Active' : t_footer("systemsLocal")}
            </span>
          </div>

          {/* Desktop CTAs */}

          {/* Theme Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label={common("aria.toggleTheme")}
              className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "rounded-full h-9 w-9 transition-all")}
            >
              {mounted ? (
                <>
                  <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-muted-foreground" />
                  <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-muted-foreground" />
                </>
              ) : (
                <div className="h-4 w-4 rounded-full bg-muted animate-pulse" />
              )}
              <span className="sr-only">{common("aria.toggleTheme")}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl p-1 min-w-[120px]">
              <DropdownMenuItem onClick={() => setTheme("light")} className="rounded-lg text-xs font-medium py-2 cursor-pointer gap-2">
                <Sun className="h-3.5 w-3.5" /> {common("light")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")} className="rounded-lg text-xs font-medium py-2 cursor-pointer gap-2">
                <Moon className="h-3.5 w-3.5" /> {common("dark")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")} className="rounded-lg text-xs font-medium py-2 cursor-pointer gap-2">
                <Cpu className="h-3.5 w-3.5" /> {common("system")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <LanguageSwitcher />

          {/* Mobile Menu Toggle */}
          <div className="xl:hidden flex">
            <Sheet>
              <SheetTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-9 w-9")} aria-label="Open menu">
                <Menu className="w-5 h-5" />
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] overflow-y-auto p-0">
                <SheetHeader className="p-6 pb-4 border-b border-border">
                  <SheetTitle className="flex items-center gap-2.5">
                    <Image src="/android-chrome-192x192.webp" alt={common("brand.name")} width={24} height={24} className="rounded-md" />
                    <span className="font-heading font-extrabold tracking-tight">
                      {common("brand.name").slice(0, 4)}<span className="text-primary">{common("brand.name").slice(4)}</span>
                    </span>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col p-4 gap-1">

                  
                  <div className="py-2">
                    <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 mb-2">
                      {t("categories.pdf")}
                    </p>
                    <MobileLink href="/pdf/compress-pdf" sub>{t("items.compressPdf")}</MobileLink>
                    <MobileLink href="/pdf/merge-pdf" sub>{t("items.mergePdf")}</MobileLink>
                    <MobileLink href="/pdf/split-pdf" sub>{t("items.splitPdf")}</MobileLink>
                    <MobileLink href="/pdf/protect-pdf" sub>{t("items.protectPdf")}</MobileLink>
                    <MobileLink href="/pdf/unlock-pdf" sub>{t("items.unlockPdf")}</MobileLink>
                    <MobileLink href="/pdf/edit-pdf" sub>{t("items.editPdf")}</MobileLink>
                    <MobileLink href="/document/pdf-to-txt" sub>{t("items.pdfToText")}</MobileLink>
                    <MobileLink href="/document/word-to-pdf" sub>{t("items.wordToPdf")}</MobileLink>
                    <MobileLink href="/document/master" sub>{t("items.docsMaster")}</MobileLink>
                    <MobileLink href="/document/text-tools/case-converter" sub>{t("items.caseConverter")}</MobileLink>
                    <MobileLink href="/document/text-tools/word-counter" sub>{t("items.wordCounter")}</MobileLink>
                  </div>

                  <div className="py-2">
                    <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 mb-2">
                      {t("categories.image")}
                    </p>
                    <MobileLink href="/image/colors" sub>{t("items.colors")}</MobileLink>
                    <MobileLink href="/image/compress" sub>{t("items.compressImage")}</MobileLink>
                    <MobileLink href="/image/convert" sub>{t("items.convertImage")}</MobileLink>
                    {/* <MobileLink href="/image/editor" sub>{t("items.imageEditor")}</MobileLink> */}
                    <MobileLink href="/image/ocr" sub>{t("items.ocrStudio")}</MobileLink>
                    <MobileLink href="/image/remove-background" sub>{t("items.backgroundRemover")}</MobileLink>
                    <MobileLink href="/image/to-pptx" sub>{t("items.imageToPptx")}</MobileLink>
                  </div>

                  <div className="py-2">
                    <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 mb-2">
                      {t("categories.media")}
                    </p>
                    <MobileLink href="/audio" sub>{t("items.audioStudio")}</MobileLink>
                    <MobileLink href="/video" sub>{t("items.videoStudio")}</MobileLink>
                  </div>

                  <div className="py-2">
                    <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 mb-2">
                      {t("categories.privacy")}
                    </p>
                    <MobileLink href="/security/metadata-cleaner" sub>{t("items.metadataCleaner")}</MobileLink>
                    <MobileLink href="/privacy/password-generator" sub>{t("items.passwordGenerator")}</MobileLink>
                    <MobileLink href="/privacy/password-checker" sub>{t("items.passwordChecker")}</MobileLink>
                    <MobileLink href="/privacy/privacy-scanner" sub>{t("items.dataLeakChecker")}</MobileLink>
                    <MobileLink href="/privacy/secure-notes" sub>{t("items.secureNotes")}</MobileLink>
                    <MobileLink href="/security/file-shredder" sub>{t("items.fileShredder")}</MobileLink>
                    <MobileLink href="/security/steganography" sub>{t("items.steganography")}</MobileLink>
                    <MobileLink href="/security/vault" sub>{t("items.vault")}</MobileLink>
                  </div>

                  <div className="py-2">
                    <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 mb-2">
                      {t("categories.developer")}
                    </p>
                    <MobileLink href="/devtools/json" sub>{t("items.jsonProcessor")}</MobileLink>
                    <MobileLink href="/devtools/base64" sub>{t("items.base64Engine")}</MobileLink>
                    <MobileLink href="/devtools/hash" sub>{t("items.hashGenerator")}</MobileLink>
                    <MobileLink href="/devtools/jwt" sub>{t("items.jwtDebugger")}</MobileLink>
                    <MobileLink href="/devtools/url" sub>{t("items.urlEncoder")}</MobileLink>
                    <MobileLink href="/devtools/uuid" sub>{t("items.uuidFactory")}</MobileLink>
                    <MobileLink href="/devtools/timestamp" sub>{t("items.epochConverter")}</MobileLink>
                    <MobileLink href="/devtools/lorem" sub>{t("items.loremIpsum")}</MobileLink>
                    <MobileLink href="/devtools/data-converter" sub>{t("items.dataConverter")}</MobileLink>
                    <MobileLink href="/devtools/icons" sub>{t("items.icons")}</MobileLink>
                    <MobileLink href="/tools/qr-generator" sub>{t("items.qrGenerator")}</MobileLink>
                  </div>

                  <div className="h-px bg-border my-2" />

                  <MobileLink href="/blog">{common("blog")}</MobileLink>
                  <MobileLink href="/changelog">{common("changelog")}</MobileLink>
                  <MobileLink href="/faq">{common("faqLabel")}</MobileLink>
                  <MobileLink href="/about">{common("about")}</MobileLink>
                  <MobileLink href="/contact">{common("contact")}</MobileLink>


                  {/* Status indicator in mobile */}
                  <div className={`flex items-center justify-center gap-1.5 mt-4 px-3 py-2 rounded-lg border ${!isOnline ? 'bg-amber-500/10 border-amber-500/20' : 'bg-emerald-500/8 border-emerald-500/15'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${!isOnline ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                    <span className={`text-[10px] font-semibold uppercase tracking-wider ${!isOnline ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                      {!isOnline ? 'Offline Mode Active' : t_footer("systemsLocal")}
                    </span>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}

/* ─── NavListItem (Desktop mega-menu item) ─────────────────────────────── */
const NavListItem = React.memo(function NavListItem({
  href,
  icon: Icon,
  title,
  children,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="flex items-start gap-3 rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground group"
      >
        <div className="mt-0.5 w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center text-primary group-hover:bg-primary/15 transition-colors shrink-0">
          <Icon className="w-4 h-4" />
        </div>
        <div className="space-y-1">
          <div className="text-sm font-semibold leading-none">{title}</div>
          <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
            {children}
          </p>
        </div>
      </Link>
    </li>
  );
});

/* ─── MobileLink (Mobile nav link) ────────────────────────────────────── */
const MobileLink = React.memo(function MobileLink({
  href,
  children,
  highlight,
  sub,
}: {
  href: string;
  children: React.ReactNode;
  highlight?: boolean;
  sub?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors",
        highlight
          ? "font-semibold text-primary bg-primary/5"
          : sub
            ? "font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 pl-6"
            : "font-medium hover:bg-secondary/50"
      )}
    >
      {children}
      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40" />
    </Link>
  );
});
