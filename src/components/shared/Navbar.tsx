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
import { motion, AnimatePresence } from "framer-motion";
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
    title: "Image Studio",
    icon: ImageIcon,
    items: [
      { name: "Ultimate Editor", href: "/image/editor", desc: "Pro editor with filters & OCR." },
      { name: "Background Remover", href: "/image/remove-background", desc: "AI-powered segmenting." },
      { name: "Image Compressor", href: "/image/compress", desc: "Reduce size with KB/MB target." },
      { name: "Format Converter", href: "/image/convert", desc: "Convert HEIC, WebP, AVIF." },
      { name: "Color Lab", href: "/image/colors", desc: "Extract palettes & HEX." },
    ]
  },
  {
    title: "PDF & Documents",
    icon: FileText,
    items: [
      { name: "PDF Merger", href: "/pdf/merge-pdf", desc: "Combine multiple documents." },
      { name: "PDF Splitter", href: "/pdf/split-pdf", desc: "Extract specific pages." },
      { name: "PDF Compressor", href: "/pdf/compress-pdf", desc: "Shrink file size locally." },
      { name: "Protect PDF", href: "/pdf/protect-pdf", desc: "Add password security." },
    ]
  },
  {
    title: "Privacy & Security",
    icon: Lock,
    items: [
      { name: "Secure Vault", href: "/security/vault", desc: "AES-256 GCM encryption." },
      { name: "Metadata Cleaner", href: "/security/metadata-cleaner", desc: "Strip EXIF & tracking." },
      { name: "Password Suite", href: "/privacy/password-generator", desc: "Gen & Check Strength." },
      { name: "Secure Notes", href: "/privacy/secure-notes", desc: "Self-destructing notes." },
      { name: "File Shredder", href: "/security/file-shredder", desc: "Permanently wipe files." },
    ]
  },
];

export function Navbar() {
  const { setTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <motion.div
              animate={{ rotate: [0, 90, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary to-blue-500 opacity-20 group-hover:opacity-40 transition-opacity"
            />
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10">
              <path d="M12 4L4 8L12 12L20 8L12 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary" />
              <path d="M4 12L12 16L20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary/70" />
              <path d="M4 16L12 20L20 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary/40" />
            </svg>
          </div>
          <span className="font-heading font-black text-xl tracking-tight leading-none uppercase italic">
            Safe<span className="text-primary">Tools</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden xl:flex items-center gap-1">
          <Link href="/" className="px-4 py-2 text-sm font-bold hover:text-primary transition-colors">Home</Link>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent font-bold text-sm">Tools</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="w-[850px] p-6 grid grid-cols-3 gap-6">
                    {toolCategories.map((category) => (
                      <div key={category.title} className="space-y-3">
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
            </NavigationMenuList>
          </NavigationMenu>
          <Link href="/tools" className="px-4 py-2 text-sm font-bold hover:text-primary transition-colors text-primary">Tools</Link>
          <Link href="/features" className="px-4 py-2 text-sm font-bold hover:text-primary transition-colors">Features</Link>
          <Link href="/privacy" className="px-4 py-2 text-sm font-bold hover:text-primary transition-colors">Privacy</Link>
          <Link href="/developers" className="px-4 py-2 text-sm font-bold hover:text-primary transition-colors">Developers</Link>
          <Link href="/pricing" className="px-4 py-2 text-sm font-bold hover:text-primary transition-colors">Pricing</Link>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mr-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Systems Local</span>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <Button variant="ghost" className="font-bold text-sm hidden md:flex items-center gap-2">
              Open Tools
              <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>
            <Button className="font-bold text-sm rounded-full px-6">Start Free</Button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger aria-label="Toggle color theme" className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "rounded-full transition-all")}>
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-primary" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-primary" />
              <span className="sr-only">Toggle theme</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-2xl p-1 shadow-2xl">
              <DropdownMenuItem onClick={() => setTheme("light")} className="rounded-xl focus:bg-primary/20 text-[10px] font-black uppercase tracking-widest py-2 cursor-pointer">Light</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")} className="rounded-xl focus:bg-primary/20 text-[10px] font-black uppercase tracking-widest py-2 cursor-pointer">Dark</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")} className="rounded-xl focus:bg-primary/20 text-[10px] font-black uppercase tracking-widest py-2 cursor-pointer">System</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Toggle */}
          <div className="xl:hidden flex">
            <Sheet>
              <SheetTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}>
                <Menu className="w-6 h-6" />
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] overflow-y-auto">
                <SheetHeader className="mb-4 text-left">
                  <SheetTitle className="flex items-center gap-2">
                    <Image src="/android-chrome-192x192.png" alt="SafeTools" width={24} height={24} className="rounded-md" />
                    SafeTools
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 py-8">
                  <Link href="/" className="text-sm font-bold p-2 hover:bg-accent rounded-lg">Home</Link>
                  <Link href="/tools" className="text-sm font-bold p-2 hover:bg-accent rounded-lg text-primary">All Tools</Link>
                  <Link href="/features" className="text-sm font-bold p-2 hover:bg-accent rounded-lg">Features</Link>
                  <Link href="/privacy" className="text-sm font-bold p-2 hover:bg-accent rounded-lg">Privacy</Link>
                  <Link href="/developers" className="text-sm font-bold p-2 hover:bg-accent rounded-lg">Developers</Link>
                  <Link href="/pricing" className="text-sm font-bold p-2 hover:bg-accent rounded-lg">Pricing</Link>
                  <Link href="/changelog" className="text-sm font-bold p-2 hover:bg-accent rounded-lg">Changelog</Link>
                  <Link href="/faq" className="text-sm font-bold p-2 hover:bg-accent rounded-lg">FAQ</Link>
                  <Link href="/contact" className="text-sm font-bold p-2 hover:bg-accent rounded-lg">Contact</Link>
                  <div className="grid grid-cols-1 gap-2 mt-4">
                    <Button variant="outline" className="w-full font-bold">Open Tools</Button>
                    <Button className="w-full font-bold">Start Free</Button>
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
