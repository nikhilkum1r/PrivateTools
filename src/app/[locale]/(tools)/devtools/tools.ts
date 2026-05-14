// Pure data  no React/Lucide imports so this is safe for server-side use
// (generateStaticParams, generateMetadata, etc.)

export type ToolType = "json" | "base64" | "hash" | "jwt" | "url" | "uuid" | "timestamp" | "lorem";

export interface Tool {
  id: ToolType;
  name: string;
  desc: string;
  iconName: string;
}

export const TOOLS: Tool[] = [
  { id: "json", name: "JSON Processor", iconName: "Braces", desc: "Beautify or Minify JSON" },
  { id: "base64", name: "Base64 Engine", iconName: "ArrowRightLeft", desc: "Encode/Decode Strings" },
  { id: "hash", name: "Hash Generator", iconName: "Hash", desc: "SHA-256, SHA-512, MD5" },
  { id: "jwt", name: "JWT Debugger", iconName: "Database", desc: "Decode JWT Payloads" },
  { id: "url", name: "URL Encoder", iconName: "Link", desc: "Percent-encoding for URIs" },
  { id: "uuid", name: "UUID Factory", iconName: "Fingerprint", desc: "Generate Version 4 UUIDs" },
  { id: "timestamp", name: "Epoch Converter", iconName: "Clock", desc: "Unix Time to Human" },
  { id: "lorem", name: "Lorem Ipsum", iconName: "TextCursorInput", desc: "Placeholder Text Gen" },
];
