import { create } from "zustand";

interface AudioState {
  file: File | null;
  duration: number;
  status: "idle" | "processing" | "done" | "error";
  progress: number;
  resultBlob: Blob | null;
  errorMessage: string | null;
  setFile: (file: File, duration: number) => void;
  setStatus: (status: AudioState["status"]) => void;
  setProgress: (pct: number) => void;
  setResult: (blob: Blob) => void;
  setError: (msg: string) => void;
  reset: () => void;
}

export const useAudioStore = create<AudioState>((set) => ({
  file: null,
  duration: 0,
  status: "idle",
  progress: 0,
  resultBlob: null,
  errorMessage: null,
  setFile: (file, duration) => set({ file, duration, status: "idle", progress: 0, resultBlob: null, errorMessage: null }),
  setStatus: (status) => set({ status }),
  setProgress: (progress) => set({ progress }),
  setResult: (resultBlob) => set({ resultBlob, status: "done", progress: 100 }),
  setError: (errorMessage) => set({ errorMessage, status: "error" }),
  reset: () => set({ file: null, duration: 0, status: "idle", progress: 0, resultBlob: null, errorMessage: null }),
}));
