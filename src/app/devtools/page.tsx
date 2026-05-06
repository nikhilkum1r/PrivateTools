import { Metadata } from "next";
import DevToolsStudioClient from "./DevToolsStudioClient";

export const metadata: Metadata = {
  title: "Developer Utility Suite - JSON, JWT, Base64 & More | PrivateTools",
  description: "A comprehensive suite of developer utilities including JSON formatting, JWT debugging, Base64 encoding, and more. All processing is 100% local and private.",
  keywords: ["developer tools", "json formatter", "jwt debugger", "base64 encoder", "uuid generator", "private devtools"],
};

export default function DevToolsPage() {
  return <DevToolsStudioClient initialTool="json" />;
}
