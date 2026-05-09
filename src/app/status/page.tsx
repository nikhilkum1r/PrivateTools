import StatusClient from "./StatusClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "System Status | Engine Integrity Audit",
  description: "Verify the status of the SafeTools local-first engine. Check browser compatibility for WebAssembly, Web Workers, and hardware acceleration.",
  keywords: "system status, wasm support check, browser compatibility, safetools uptime, local engine audit",
};

export default function StatusPage() {
  return <StatusClient />;
}
