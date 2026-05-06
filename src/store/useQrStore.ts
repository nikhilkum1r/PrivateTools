import { create } from "zustand";

export type QrType = "url" | "text" | "email" | "phone" | "wifi" | "vcard";
export type QrErrorLevel = "L" | "M" | "Q" | "H";
export type QrFormat = "png" | "svg";

interface QrOptions {
  type: QrType;
  value: string;
  size: number;
  fgColor: string;
  bgColor: string;
  errorLevel: QrErrorLevel;
  format: QrFormat;
  // WiFi extras
  wifiSsid?: string;
  wifiPassword?: string;
  wifiEncryption?: "WPA" | "WEP" | "nopass";
}

interface QrState {
  options: QrOptions;
  scannedResult: string | null;
  updateOptions: (opts: Partial<QrOptions>) => void;
  setScannedResult: (result: string | null) => void;
  reset: () => void;
}

const DEFAULT_OPTIONS: QrOptions = {
  type: "url",
  value: "",
  size: 256,
  fgColor: "#000000",
  bgColor: "#ffffff",
  errorLevel: "M",
  format: "png",
};

export const useQrStore = create<QrState>((set) => ({
  options: DEFAULT_OPTIONS,
  scannedResult: null,
  updateOptions: (opts) => set((s) => ({ options: { ...s.options, ...opts } })),
  setScannedResult: (scannedResult) => set({ scannedResult }),
  reset: () => set({ options: DEFAULT_OPTIONS, scannedResult: null }),
}));
