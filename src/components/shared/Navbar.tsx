"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {

  ImageIcon,
  FileText,
  Lock,
  Fingerprint,
  Menu,
  Moon,
  Sun,
  Video,
  Music,
  QrCode,
  Terminal
} from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useImageStore } from "@/store/useImageStore";
import { usePdfStore } from "@/store/usePdfStore";
import { useVideoStore } from "@/store/useVideoStore";
import { DropZone } from "./DropZone";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";



const toolCategories = [
  {
    title: "Image Tools",
    icon: ImageIcon,
    items: [
      { name: "Image Compressor", href: "/image/compress", desc: "Batch reduce file size." },
      { name: "Format Converter", href: "/image/convert", desc: "Convert HEIC, WebP, AVIF." },
      { name: "Ultimate Editor", href: "/image/editor", desc: "Crop, rotate and OCR." },
      { name: "Image to PPTX", href: "/image/to-pptx", desc: "Create Presentations." },
      { name: "Color Lab", href: "/image/colors", desc: "Extract palettes." },
    ]
  },
  {
    title: "Document Tools",
    icon: FileText,
    items: [
      { name: "PDF Merger", href: "/pdf/merge", desc: "Combine multiple PDFs and images." },
      { name: "PDF Splitter", href: "/pdf/split", desc: "Extract pages or split ranges." },
      { name: "PDF to PPTX/DOCX", href: "/pdf/convert", desc: "Secure local layout conversion." },
      { name: "Format Converter", href: "/image/convert", desc: "Convert PDF, HEIC, WebP." },
      { name: "Bulk Renamer", href: "/bulk-rename", desc: "Batch rename files instantly." },
    ]
  },
  {
    title: "Media Lab",
    icon: Video,
    items: [
      { name: "Video Compressor", href: "/video", desc: "Local WASM-based encoding." },
      { name: "Audio Toolkit", href: "/audio", desc: "Convert and trim audio files." },
      { name: "AI Creative Lab", href: "/ai", desc: "Experimental AI features." },
    ]
  },
  {
    title: "Privacy & Security",
    icon: Lock,
    items: [
      { name: "Universal Scrubber", href: "/privacy/metadata", desc: "Strip metadata from any file." },
      { name: "Secure Vault", href: "/privacy/vault", desc: "Military-grade file encryption." },
      { name: "Steganography", href: "/steganography", desc: "Hide messages inside images." },
      { name: "Password Generator", href: "/security", desc: "Secure, offline randomness." },
    ]
  },
  {
    title: "Developer Tools",
    icon: Terminal,
    items: [
      { name: "Dev Hub", href: "/devtools", desc: "JSON, Base64 and Hashing suite." },
      { name: "QR Studio", href: "/qr", desc: "Professional QR generation." },
      { name: "Icon Generator", href: "/image/favicon", desc: "Complete icon packs." },
    ]
  }
];

export function Navbar() {
  const { setTheme } = useTheme();
  const router = useRouter();
  const setVideoFile = useVideoStore((state) => state.setVideoFile);



  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors overflow-hidden">
            <Image src="/android-chrome-192x192.png" alt="SafeTools" width={36} height={36} className="rounded-xl" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xl tracking-tight hidden sm:inline-block leading-none">
              Safe<span className="text-primary">Tools</span>
            </span>
            <div className="flex items-center gap-1.5 mt-0.5 hidden md:flex">
              <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500/70">WASM Engine Armed</span>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-2">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent font-bold">Tools</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="w-[90vw] sm:w-[600px] lg:w-[850px] p-6 md:columns-2 lg:columns-3 gap-6">
                    {toolCategories.map((category) => (
                      <div key={category.title} className="space-y-3 break-inside-avoid mb-6">
                        <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                          <category.icon className="w-3 h-3" />
                          {category.title}
                        </h4>
                        {category.items.map((item) => (
                          <ListItem
                            key={item.name}
                            title={item.name}
                            href={item.href}
                          >
                            {item.desc}
                          </ListItem>
                        ))}
                      </div>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link
                  href="/privacy"
                  className={cn(navigationMenuTriggerStyle(), "bg-transparent font-bold")}
                >
                  Manifesto
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">


          <DropdownMenu>
            <DropdownMenuTrigger aria-label="Toggle color theme" className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "rounded-full hover:bg-white/5 transition-all")}>
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-primary" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-primary" />
              <span className="sr-only">Toggle theme</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#0a0a0a] border-white/10 rounded-2xl p-1 shadow-2xl">
              <DropdownMenuItem onClick={() => setTheme("light")} className="rounded-xl focus:bg-primary/20 text-[10px] font-black uppercase tracking-widest py-2">Light</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")} className="rounded-xl focus:bg-primary/20 text-[10px] font-black uppercase tracking-widest py-2">Dark</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")} className="rounded-xl focus:bg-primary/20 text-[10px] font-black uppercase tracking-widest py-2">System</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>



          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex">
            <Sheet>
              <SheetTrigger
                render={
                  <Button variant="ghost" size="icon" className="lg:hidden" />
                }
              >
                <Menu className="w-6 h-6" />
              </SheetTrigger>
              <SheetContent side="left" className="w-[85vw] sm:w-[400px] overflow-y-auto">
                <SheetHeader className="mb-8 text-left">
                  <SheetTitle className="flex items-center gap-2">
                    <Image src="/android-chrome-192x192.png" alt="SafeTools" width={20} height={20} className="rounded-md" />
                    SafeTools
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-8 pb-20">
                  {toolCategories.map((category) => (
                    <div key={category.title} className="space-y-4">
                      <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <category.icon className="w-4 h-4" />
                        {category.title}
                      </h4>
                      <div className="flex flex-col gap-1 pl-2 border-l border-primary/10">
                        {category.items.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            className="text-sm font-bold p-2 hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors"
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div className="space-y-3 mt-4 pt-4 border-t border-primary/10">
                    <Link
                      href="/privacy"
                      className="text-sm font-black uppercase tracking-widest p-2 hover:text-primary transition-colors block"
                    >
                      Manifesto
                    </Link>
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

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, href, ...props }, ref) => {
  return (
    <li>
      <Link
        href={href || "#"}
        className={cn(
          "block select-none space-y-1 rounded-xl p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
          className
        )}
        {...props}
      >
        <div className="text-sm font-bold leading-none">{title}</div>
        <p className="line-clamp-2 text-xs leading-snug text-muted-foreground mt-1">
          {children}
        </p>
      </Link>
    </li>
  );
});
ListItem.displayName = "ListItem";
