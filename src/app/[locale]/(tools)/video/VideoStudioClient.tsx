"use client";

import React, { useState, useRef, useEffect } from "react";
import { fetchFile } from "@/lib/ffmpeg-loader";
import { useTranslations } from "next-intl";
import { Navbar } from "@/components/shared/Navbar";
import { motion } from "framer-motion";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import SEOStructuredData from "@/components/shared/SEOStructuredData";
import { loadFFmpegInstance } from "@/lib/ffmpeg-loader";
import { usePersistedState } from "@/hooks/usePersistedState";

// Modular Components
import { VideoHero } from "./components/VideoHero";
import { VideoEditor } from "./components/VideoEditor";

const FAQ = dynamic(() => import("@/components/shared/FAQ").then(mod => mod.FAQ), {
  ssr: false,
  loading: () => <div className="h-64 animate-pulse bg-secondary/10 rounded-3xl mx-6" />
});

const Footer = dynamic(() => import("@/components/shared/Footer").then(mod => mod.Footer), {
  ssr: false,
  loading: () => <div className="h-24 animate-pulse bg-secondary/10 rounded-t-3xl" />
});

interface VideoStudioPageProps {
  isEmbed?: boolean;
}

export default function VideoStudioPage({ isEmbed }: VideoStudioPageProps = {}) {
  const t = useTranslations("videoStudio");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);

  // Studio Settings
  const [crf, setCrf] = usePersistedState("video:crf", 28);
  const [preset, setPreset] = usePersistedState("video:preset", "ultrafast");
  const [outputFormat, setOutputFormat] = usePersistedState("video:outputFormat", "mp4");
  const [mute, setMute] = useState(false);
  const [resolution, setResolution] = usePersistedState("video:resolution", "original");
  const [rotation, setRotation] = usePersistedState("video:rotation", "0");
  const [speed, setSpeed] = usePersistedState("video:speed", "1.0");
  const [privacyBlur, setPrivacyBlur] = useState(false);
  const [blurRegions, setBlurRegions] = useState<{ x: number; y: number; w: number; h: number }[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(0);
  const [duration, setDuration] = useState(0);

  const [snapshots, setSnapshots] = useState<{ url: string; time: number }[]>([]);
  const [currentTime, setCurrentTime] = useState(0);

  const ffmpegRef = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    initEngine();
  }, []);

  const initEngine = async () => {
    try {
      const ffmpeg = await loadFFmpegInstance(
        (p) => setProgress(Math.round(p * 100)),
        (msg) => setLogs((prev) => [...prev.slice(-15), msg])
      );
      ffmpegRef.current = ffmpeg;
      setIsLoaded(true);
    } catch (e) {
      console.error("Engine Initialization Failed", e);
      toast.error(t("messages.engineLoadFailed"));
    }
  };

  const handleFileDrop = (files: File[]) => {
    if (files[0]) {
      const file = files[0];
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setOutputUrl(null);
      setSnapshots([]);
      setLogs([t("messages.engineMounted", { name: file.name })]);

      const tempVideo = document.createElement("video");
      tempVideo.src = url;
      tempVideo.onloadedmetadata = () => {
        setDuration(tempVideo.duration);
        setTrimEnd(tempVideo.duration);
      };
    }
  };

  const processVideo = async () => {
    if (!videoFile || !isLoaded) return;
    setIsProcessing(true);
    setProgress(0);
    const ffmpeg = ffmpegRef.current;
    const inputExt = videoFile.name.substring(videoFile.name.lastIndexOf("."));
    const inputName = "input" + inputExt;
    const outputName = "out.mp4";

    try {
      await ffmpeg.writeFile(inputName, await fetchFile(videoFile));
      const args: string[] = ["-y"];
      if ((trimStart ?? 0) > 0) args.push("-ss", (trimStart ?? 0).toFixed(3));
      args.push("-i", inputName);
      if ((trimEnd ?? duration) < duration) {
        const dur = (trimEnd ?? duration) - (trimStart ?? 0);
        if (dur > 0) args.push("-t", dur.toFixed(3));
      }

      const vFilters: string[] = [];
      if (resolution === "1080p") vFilters.push("scale=-2:1080");
      else if (resolution === "720p") vFilters.push("scale=-2:720");
      else if (resolution === "480p") vFilters.push("scale=-2:480");
      else if (resolution === "360p") vFilters.push("scale=-2:360");
      if (privacyBlur) vFilters.push("boxblur=60:30");
      if (rotation === "90") vFilters.push("transpose=1");
      else if (rotation === "180") vFilters.push("vflip,hflip");
      else if (rotation === "270") vFilters.push("transpose=2");
      if (speed !== "1.0") vFilters.push(`setpts=${(1 / parseFloat(speed)).toFixed(6)}*PTS`);

      const baseVf = vFilters.join(",");

      if (blurRegions.length > 0) {
        let complex = "";
        let currentIn = "0:v";
        if (baseVf) {
          complex += `[0:v]${baseVf}[v_base];`;
          currentIn = "v_base";
        }
        blurRegions.forEach((reg, i) => {
          const rx = `round(iw*${(reg.x / 100).toFixed(6)})`;
          const ry = `round(ih*${(reg.y / 100).toFixed(6)})`;
          const rw = `round(iw*${(reg.w / 100).toFixed(6)})`;
          const rh = `round(ih*${(reg.h / 100).toFixed(6)})`;
          const isLast = i === blurRegions.length - 1;
          const out = isLast ? "v_final" : `v_out_${i}`;
          complex += `[${currentIn}]split[orig_${i}][forblur_${i}];`;
          complex += `[forblur_${i}]crop=${rw}:${rh}:${rx}:${ry},boxblur=60:30,scale=${rw}:${rh}[blurred_${i}];`;
          complex += `[orig_${i}][blurred_${i}]overlay=${rx}:${ry}[${out}]${isLast ? "" : ";"}`;
          currentIn = out;
        });
        args.push("-filter_complex", complex);
        args.push("-map", "[v_final]", "-map", "0:a:0");
      } else if (baseVf) {
        args.push("-vf", baseVf);
      }

      args.push("-threads", "0", "-c:v", "libx264", "-crf", (crf ?? 23).toString(), "-preset", preset || "ultrafast", "-pix_fmt", "yuv420p", "-movflags", "+faststart");

      if (mute) {
        args.push("-an");
      } else {
        const s = parseFloat(speed);
        if (s !== 1.0) {
          const af = s <= 0.5 ? `atempo=0.5,atempo=${(s / 0.5).toFixed(4)}` : s >= 2.0 ? `atempo=2.0,atempo=${(s / 2.0).toFixed(4)}` : `atempo=${s}`;
          args.push("-af", af);
          args.push("-c:a", "aac", "-b:a", "128k");
        } else {
          args.push("-c:a", "copy");
        }
      }

      args.push(outputName);
      setLogs(prev => [...prev, `⚙ ffmpeg ${args.join(" ")}`]);
      await ffmpeg.exec(args);

      const data = await ffmpeg.readFile(outputName);
      const raw = data as Uint8Array;

      if (!raw || raw.length === 0) {
        throw new Error("Output is empty (0 bytes). Check the Engine Feed for FFmpeg errors.");
      }

      const safeBuffer = raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.byteLength) as ArrayBuffer;
      const url = URL.createObjectURL(new Blob([safeBuffer], { type: "video/mp4" }));
      setOutputUrl(url);
      setLogs(prev => [...prev, `✓ SUCCESS: ${(raw.length / 1024 / 1024).toFixed(2)} MB`]);
      toast.success(t("messages.renderingComplete"));

      try { await ffmpeg.deleteFile(inputName); } catch {}
      try { await ffmpeg.deleteFile(outputName); } catch {}
    } catch (e: any) {
      console.error("[Video Studio] Pipeline Error:", e);
      setLogs(prev => [...prev, `✗ ${e?.message || t("messages.pipelineFailed")}`]);
      toast.error(t("messages.renderingFailed", { error: e?.message || t("messages.checkLogs") }));
    } finally {
      setIsProcessing(false);
    }
  };

  const takeSnapshot = async () => {
    if (!videoFile || !isLoaded) return;
    const ffmpeg = ffmpegRef.current;
    const inputName = "snap_" + videoFile.name;
    const outputName = `snap_${Date.now()}.jpg`;

    try {
      await ffmpeg.writeFile(inputName, await fetchFile(videoFile));
      const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toFixed(3).padStart(6, '0');
        return `${h}:${m}:${s}`;
      };

      await ffmpeg.exec(["-y", "-ss", formatTime(currentTime), "-i", inputName, "-vframes", "1", "-q:v", "2", outputName]);
      const snapData = await ffmpeg.readFile(outputName);
      const rawSnap = snapData as Uint8Array;
      const snapBuffer = rawSnap.buffer.slice(rawSnap.byteOffset, rawSnap.byteOffset + rawSnap.byteLength) as ArrayBuffer;
      const url = URL.createObjectURL(new Blob([snapBuffer], { type: "image/jpeg" }));
      setSnapshots(prev => [{ url, time: currentTime }, ...prev]);
      toast.success(t("messages.snapshotSuccess"));
    } catch (e) {
      toast.error(t("messages.snapshotFailed"));
    }
  };

  const resetTool = () => {
    setVideoFile(null);
    setPreviewUrl(null);
    setOutputUrl(null);
    setSnapshots([]);
  };

  return (
    <div className={`flex flex-col ${isEmbed ? 'h-full bg-transparent' : 'min-h-screen lg:h-screen bg-background'} text-foreground overflow-y-auto lg:overflow-hidden selection:bg-primary/30 custom-scrollbar`}>
      {!isEmbed && <Navbar />}
      <main id="main-content" className="flex-grow flex flex-col lg:flex-row overflow-visible lg:overflow-hidden relative scrollbar-hide">
        {!isEmbed && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-[20%] left-[10%] w-[50%] h-[50%] bg-primary/5 blur-[140px] rounded-full animate-pulse" />
            <div className="absolute bottom-[20%] right-[10%] w-[50%] h-[50%] bg-blue-500/5 blur-[140px] rounded-full animate-pulse" />
          </div>
        )}

        {!videoFile ? (
          <VideoHero t={t} handleFileDrop={handleFileDrop} />
        ) : (
          <VideoEditor 
            t={t}
            videoFile={videoFile}
            previewUrl={previewUrl}
            outputUrl={outputUrl}
            isLoaded={isLoaded}
            isProcessing={isProcessing}
            progress={progress}
            logs={logs}
            crf={crf}
            setCrf={setCrf}
            preset={preset}
            setPreset={setPreset}
            outputFormat={outputFormat}
            setOutputFormat={setOutputFormat}
            mute={mute}
            setMute={setMute}
            resolution={resolution}
            setResolution={setResolution}
            rotation={rotation}
            setRotation={setRotation}
            speed={speed}
            setSpeed={setSpeed}
            privacyBlur={privacyBlur}
            setPrivacyBlur={setPrivacyBlur}
            blurRegions={blurRegions}
            setBlurRegions={setBlurRegions}
            trimStart={trimStart}
            setTrimStart={setTrimStart}
            trimEnd={trimEnd}
            setTrimEnd={setTrimEnd}
            duration={duration}
            currentTime={currentTime}
            setCurrentTime={setCurrentTime}
            snapshots={snapshots}
            processVideo={processVideo}
            takeSnapshot={takeSnapshot}
            resetTool={resetTool}
            isDrawing={isDrawing}
            setIsDrawing={setIsDrawing}
            startPos={startPos}
            setStartPos={setStartPos}
            currentPos={currentPos}
            setCurrentPos={setCurrentPos}
            videoRef={videoRef}
          />
        )}
      </main>

      {!isEmbed && (
        <>
          <SEOStructuredData
            name={t("seo.title")}
            description={t("seo.description")}
            url="https://safetools.space/video"
            faqItems={(Array.isArray(t.raw("landing.faq.items")) ? (t.raw("landing.faq.items") as any[]) : []).map(f => ({ q: f.q, a: f.a }))}
          />
          <FAQ
            items={t.raw("landing.faq.items") as any}
            title={t("landing.faq.title")}
            description={t("landing.faq.description")}
          />
          <Footer />
        </>
      )}
    </div>
  );
}
