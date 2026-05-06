import { create } from "zustand";

interface VideoState {
  videoFile: File | null;
  setVideoFile: (file: File | null) => void;
  clearVideo: () => void;
}

export const useVideoStore = create<VideoState>((set) => ({
  videoFile: null,
  setVideoFile: (file) => set({ videoFile: file }),
  clearVideo: () => set({ videoFile: null }),
}));
