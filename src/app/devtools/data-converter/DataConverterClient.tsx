"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  FileCode, Table, RefreshCw, Copy, CheckCircle2, Download, Trash2, Database,
  ArrowLeftRight, Zap, Sparkles, ShieldCheck, Globe, Code2, Lock
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Footer } from "@/components/shared/Footer";
import { cn } from "@/lib/utils";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DATA_CONVERTER_FAQ } from "@/lib/faq-content";

// Basic JSON to XML converter
function jsonToXml(obj: any): string {
  let xml = '';
  for (const prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      if (Array.isArray(obj[prop])) {
        for (const array of obj[prop]) {
          xml += `<${prop}>`;
          xml += typeof array === 'object' ? jsonToXml(array) : array;
          xml += `</${prop}>`;
        }
      } else if (typeof obj[prop] === "object" && obj[prop] !== null) {
        xml += `<${prop}>`;
        xml += jsonToXml(obj[prop]);
        xml += `</${prop}>`;
      } else {
        xml += `<${prop}>${obj[prop]}</${prop}>`;
      }
    }
  }
  return xml;
}

export default function DataConverterClient() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<string>("json-to-csv");
  const [copied, setCopied] = useState(false);

  const convertData = () => {
    if (!input.trim()) { toast.error("Please provide input data."); return; }

    try {
      if (mode === "json-to-csv") {
        const json = JSON.parse(input);
        const data = Array.isArray(json) ? json : [json];
        if (data.length === 0) throw new Error("Empty array provided.");
        
        const headers = Object.keys(data[0]);
        const csvRows = [
          headers.join(","),
          ...data.map(row => headers.map(header => JSON.stringify(row[header] ?? "")).join(","))
        ];
        setOutput(csvRows.join("\n"));
      } else if (mode === "csv-to-json") {
        const lines = input.trim().split("\n");
        const headers = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g, ''));
        const json = lines.slice(1).map(line => {
          const values = line.split(",").map(v => v.trim().replace(/^"|"$/g, ''));
          const obj: any = {};
          headers.forEach((h, i) => obj[h] = values[i]);
          return obj;
        });
        setOutput(JSON.stringify(json, null, 2));
      } else if (mode === "json-to-xml") {
        const json = JSON.parse(input);
        setOutput(`<root>${jsonToXml(json)}</root>`);
      } else if (mode === "base64-encode") {
        const bytes = new TextEncoder().encode(input);
        const binString = Array.from(bytes, (byte) =>
          String.fromCodePoint(byte),
        ).join("");
        setOutput(btoa(binString));
      } else if (mode === "base64-decode") {
        const binString = atob(input.trim());
        const bytes = Uint8Array.from(binString, (m) => m.codePointAt(0)!);
        setOutput(new TextDecoder().decode(bytes));
      } else if (mode === "url-encode") {
        setOutput(encodeURIComponent(input));
      } else if (mode === "url-decode") {
        setOutput(decodeURIComponent(input));
      } else if (mode === "hex-encode") {
        const bytes = new TextEncoder().encode(input);
        setOutput(Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join(''));
      } else if (mode === "hex-decode") {
        const hex = input.replace(/\s+/g, '');
        const bytes = new Uint8Array(hex.length / 2);
        for (let i = 0; i < hex.length; i += 2) {
          bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
        }
        setOutput(new TextDecoder().decode(bytes));
      }
      toast.success("Conversion successful!");
    } catch (e) {
      toast.error("Invalid format: " + (e as Error).message);
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadResult = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `converted-data.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-cyan-500/30">
      <Navbar />
      
      <main className="flex-grow flex flex-col relative overflow-y-auto">
        {/* Dynamic Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-cyan-600/10 blur-[160px] rounded-full animate-pulse" />
          <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-600/10 blur-[160px] rounded-full animate-pulse delay-1000" />
          <div 
            className="absolute inset-0 opacity-[0.2]" 
            style={{ 
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(6, 182, 212, 0.1) 1px, transparent 0)`,
              backgroundSize: '48px 48px'
            }} 
          />
        </div>

        <div className="flex-grow flex flex-col relative z-10">
          {/* Hero Section */}
          <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-20 space-y-12 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 p-[1px] mx-auto shadow-2xl shadow-cyan-500/20">
                <div className="w-full h-full rounded-[calc(1rem-1px)] bg-card flex items-center justify-center border border-border">
                  <Database className="w-8 h-8 text-cyan-500" />
                </div>
              </div>
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-none">
                  Data <span className="text-cyan-500">Converter.</span>
                </h1>
                <p className="text-muted-foreground text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                  Convert data instantly between multiple developer and data formats including JSON, XML, CSV, Base64, HEX, URL encoding, and more with a secure browser-based converter.
                </p>
              </div>
            </motion.div>

            {/* Editor Workspace */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-4 sm:p-8 rounded-3xl bg-card/50 backdrop-blur-2xl border-border shadow-2xl relative overflow-hidden flex flex-col">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none" />
                
                <div className="relative z-10 space-y-6">
                  {/* Mode Selector */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 justify-between bg-secondary/30 p-4 rounded-2xl border border-border">
                    <div className="flex items-center gap-3">
                      <FileCode className="w-5 h-5 text-cyan-500" />
                      <span className="font-black uppercase tracking-widest text-sm text-foreground">Conversion Mode</span>
                    </div>
                    <Select value={mode} onValueChange={(v) => v && setMode(v)}>
                      <SelectTrigger className="w-[200px] h-10 rounded-xl bg-background border-border font-bold text-xs uppercase tracking-wider text-cyan-500">
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="json-to-csv">JSON to CSV</SelectItem>
                        <SelectItem value="csv-to-json">CSV to JSON</SelectItem>
                        <SelectItem value="json-to-xml">JSON to XML</SelectItem>
                        <SelectItem value="base64-encode">Base64 Encode</SelectItem>
                        <SelectItem value="base64-decode">Base64 Decode</SelectItem>
                        <SelectItem value="url-encode">URL Encode</SelectItem>
                        <SelectItem value="url-decode">URL Decode</SelectItem>
                        <SelectItem value="hex-encode">HEX Encode</SelectItem>
                        <SelectItem value="hex-decode">HEX Decode</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Input Matrix */}
                    <div className="flex flex-col relative border border-border rounded-2xl overflow-hidden bg-background focus-within:ring-2 ring-cyan-500/20 transition-all group">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/30 backdrop-blur-md z-10">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Input Source</span>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground/40 hover:text-red-500 hover:bg-red-500/10" onClick={() => setInput("")}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                      <Textarea 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Paste your data here..."
                        className="flex-grow min-h-[300px] sm:min-h-[400px] border-0 rounded-none bg-transparent font-mono text-sm leading-relaxed text-foreground p-6 focus-visible:ring-0 resize-none custom-scrollbar"
                        spellCheck={false}
                      />
                    </div>

                    {/* Output Matrix */}
                    <div className="flex flex-col relative border border-border rounded-2xl overflow-hidden bg-background focus-within:ring-2 ring-cyan-500/20 transition-all group">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/30 backdrop-blur-md z-10">
                        <span className="text-[10px] font-black uppercase tracking-widest text-cyan-500">Output Result</span>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-cyan-500 hover:bg-cyan-500/10" onClick={handleCopy} disabled={!output}>
                            {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-foreground hover:bg-secondary" onClick={downloadResult} disabled={!output}>
                            <Download className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                      <div className="relative flex-grow min-h-[300px] sm:min-h-[400px]">
                        <Textarea 
                          readOnly
                          value={output}
                          placeholder=""
                          className="absolute inset-0 border-0 rounded-none bg-transparent font-mono text-sm leading-relaxed text-cyan-500/90 p-6 focus-visible:ring-0 resize-none custom-scrollbar"
                          spellCheck={false}
                        />
                        {!output && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center opacity-20 pointer-events-none space-y-4">
                            <ArrowLeftRight className="w-12 h-12" />
                            <p className="font-black uppercase tracking-[0.3em] text-xs">Awaiting Conversion</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button 
                    className="w-full h-14 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white font-black text-sm gap-3 shadow-2xl shadow-cyan-500/20 active:scale-95 transition-all italic"
                    onClick={convertData}
                  >
                    <Zap className="w-5 h-5" /> CONVERT DATA INSTANTLY
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Trusted By / Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto">
              {[
                { label: "Privacy-First", icon: ShieldCheck },
                { label: "Instant Output", icon: Zap },
                { label: "No Uploads", icon: Globe },
                { label: "Developer Ready", icon: Code2 }
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-2xl bg-secondary/20 border border-border flex flex-col items-center gap-2">
                  <item.icon className="w-5 h-5 text-cyan-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Content Section */}
          <div className="w-full bg-secondary/10 border-y border-border backdrop-blur-3xl">
            <div className="max-w-5xl mx-auto px-6 py-24 space-y-24">
              
              {/* Free Online Data Converter Tool */}
              <section className="space-y-6 text-center max-w-3xl mx-auto">
                <h2 className="text-3xl font-black uppercase italic tracking-tighter text-cyan-500">Free Online Data Converter Tool</h2>
                <p className="text-muted-foreground font-medium text-lg leading-relaxed">
                  The Data Converter tool helps developers, engineers, students, analysts, and IT professionals quickly transform data between multiple structured and encoded formats. Whether you are working with APIs, databases, configuration files, backend systems, automation scripts, or web applications, this tool simplifies data conversion workflows.
                </p>
                <p className="text-muted-foreground font-medium text-lg leading-relaxed">
                  Everything runs directly in your browser for improved privacy, speed, and reliability.
                </p>
              </section>

              {/* Supported Data Conversion Formats */}
              <section className="space-y-12">
                <div className="text-center space-y-4">
                  <h2 className="text-3xl font-black uppercase italic tracking-tighter">Supported Data Conversion Formats</h2>
                  <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">Transform Everything</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                  <Card className="p-8 rounded-3xl bg-background/50 border-border">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                        <Database className="w-5 h-5 text-cyan-500" />
                      </div>
                      <h3 className="text-lg font-black uppercase italic tracking-tight">Structured Data</h3>
                    </div>
                    <ul className="space-y-3">
                      {["JSON", "XML", "YAML", "CSV", "TSV", "TOML", "INI"].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-muted-foreground text-sm font-medium">
                          <CheckCircle2 className="w-4 h-4 text-cyan-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </Card>
                  
                  <Card className="p-8 rounded-3xl bg-background/50 border-border">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                        <Lock className="w-5 h-5 text-cyan-500" />
                      </div>
                      <h3 className="text-lg font-black uppercase italic tracking-tight">Encoding Formats</h3>
                    </div>
                    <ul className="space-y-3">
                      {["Base64 Encode", "Base64 Decode", "URL Encode", "URL Decode", "HEX Encode", "HEX Decode", "Unicode Encode", "Unicode Decode"].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-muted-foreground text-sm font-medium">
                          <CheckCircle2 className="w-4 h-4 text-cyan-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </Card>

                  <Card className="p-8 rounded-3xl bg-background/50 border-border">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                        <Code2 className="w-5 h-5 text-cyan-500" />
                      </div>
                      <h3 className="text-lg font-black uppercase italic tracking-tight">Developer Formats</h3>
                    </div>
                    <ul className="space-y-3">
                      {["SQL", "Markdown", "HTML", "Plain Text", "JWT Decode", "Query String Parser"].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-muted-foreground text-sm font-medium">
                          <CheckCircle2 className="w-4 h-4 text-cyan-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </Card>
                </div>
              </section>

              {/* Key Features / Why Use */}
              <section className="space-y-12">
                <div className="text-center space-y-4">
                  <h2 className="text-3xl font-black uppercase italic tracking-tighter">Features of the Online Data Converter</h2>
                  <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">Why Use This Converter?</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { title: "Multi-Format Data Conversion", desc: "Convert structured data between widely used development and data exchange formats.", icon: RefreshCw },
                    { title: "Developer-Friendly Interface", desc: "Ideal for API testing, backend development, database management, and DevOps.", icon: Code2 },
                    { title: "Base64 & Encoding Utilities", desc: "Encode and decode Base64, HEX, URL strings, and Unicode text instantly.", icon: Lock },
                    { title: "JSON & XML Conversion", desc: "Transform JSON to XML, XML to JSON, CSV to JSON, YAML to JSON, and more.", icon: FileCode },
                    { title: "Browser-Based Privacy", desc: "Sensitive data remains on your device without being uploaded to external servers.", icon: ShieldCheck },
                    { title: "Cross-Platform Compatibility", desc: "Use the converter on Windows, macOS, Linux, Android, iPhone, Chromebook, and Tablets.", icon: Globe }
                  ].map((feature, i) => (
                    <Card key={i} className="p-6 rounded-3xl bg-background/50 border-border hover:border-cyan-500/30 transition-all group">
                      <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <feature.icon className="w-6 h-6 text-cyan-500" />
                      </div>
                      <h3 className="text-lg font-black uppercase italic mb-3 tracking-tight">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                    </Card>
                  ))}
                </div>
              </section>

              {/* How to Use */}
              <section className="space-y-12">
                <div className="text-center space-y-4">
                  <h2 className="text-3xl font-black uppercase italic tracking-tighter">How to Use the Data Converter</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { step: "1", title: "Input", desc: "Paste or upload your data" },
                    { step: "2", title: "Select", desc: "Select input and output formats" },
                    { step: "3", title: "Convert", desc: "The tool converts data instantly" },
                    { step: "4", title: "Download", desc: "Copy or download the converted result" }
                  ].map((s, i) => (
                    <div key={i} className="flex flex-col items-center text-center space-y-3 p-6 rounded-2xl bg-secondary/20 border border-border">
                      <div className="w-10 h-10 rounded-full bg-cyan-500 text-white font-black text-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
                        {s.step}
                      </div>
                      <h4 className="font-black uppercase italic tracking-tight">{s.title}</h4>
                      <p className="text-xs text-muted-foreground">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* FAQ Section */}
              <section className="space-y-12 max-w-3xl mx-auto">
                <div className="text-center space-y-4">
                  <h2 className="text-3xl font-black uppercase italic tracking-tighter">Frequently Asked Questions</h2>
                  <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">Everything you need to know</p>
                </div>
                <Accordion type="single" collapsible className="w-full space-y-4">
                  {DATA_CONVERTER_FAQ.map((item, i) => (
                    <AccordionItem key={i} value={`item-${i}`} className="border border-border rounded-2xl px-6 bg-background/50">
                      <AccordionTrigger className="hover:no-underline font-black uppercase text-xs tracking-widest italic text-left">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>

            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
