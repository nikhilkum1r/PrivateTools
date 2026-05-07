"use client";

import { useState } from "react";
import { Share2, Link as LinkIcon, Send, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function ShareTool({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success("Link copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this private, zero-upload tool for ${title}:`)}&url=${encodeURIComponent(window.location.href)}`;
    window.open(url, "_blank");
  };

  const shareTelegram = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(`Secure file processing with SafeTools: ${title}`)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="flex flex-col gap-4 p-8 rounded-[2rem] bg-secondary/30 border border-border relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12 scale-150 group-hover:rotate-0 transition-transform duration-700">
        <Share2 className="w-32 h-32" />
      </div>

      <div className="space-y-1 relative z-10">
        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary italic">Spread the Privacy</h4>
        <p className="text-sm font-black uppercase tracking-tight">Support local-first computing</p>
      </div>

      <div className="flex flex-wrap gap-3 relative z-10">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleCopy}
          className="h-10 rounded-xl border-border bg-secondary/50 hover:bg-secondary hover:border-primary/50 gap-2 transition-all"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <LinkIcon className="w-3.5 h-3.5" />}
          <span className="text-[10px] font-black uppercase tracking-widest">{copied ? "COPIED" : "COPY LINK"}</span>
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={shareTwitter}
          className="h-10 w-10 rounded-xl border-border bg-secondary/50 hover:bg-blue-400/20 hover:border-blue-400/50 transition-all p-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-blue-400"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
        </Button>

        <Button 
          variant="outline" 
          size="sm" 
          onClick={shareTelegram}
          className="h-10 w-10 rounded-xl border-border bg-secondary/50 hover:bg-sky-400/20 hover:border-sky-400/50 transition-all p-0"
        >
          <Send className="w-4 h-4 text-sky-400" />
        </Button>
      </div>
    </div>
  );
}
