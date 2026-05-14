"use client";

import React, { useState, useRef, useEffect } from "react";
import { fetchFile } from "@/lib/ffmpeg-loader";
import { Navbar } from "@/components/shared/Navbar";
import { toast } from "sonner";
import { ExportManager } from "@/lib/export-manager";
import { FAQ } from "@/components/shared/FAQ";
import { Footer } from "@/components/shared/Footer";
import SEOStructuredData from "@/components/shared/SEOStructuredData";
import { loadFFmpegInstance } from "@/lib/ffmpeg-loader";
import { useTranslations } from "next-intl";

// Modular Components
import { AudioStudioEditor } from "./components/AudioStudioEditor";

interface AudioStudioPageProps {
  isEmbed?: boolean;
}

export default function AudioStudioPage({ isEmbed }: AudioStudioPageProps = {}) {
  const t = useTranslations("audio");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Settings
  const [bitrate, setBitrate] = useState("192k");
  const [outputFormat, setOutputFormat] = useState("mp3");
  const [sampleRate, setSampleRate] = useState("44100");
  const [metadata, setMetadata] = useState({
    title: "",
    artist: "",
    album: ""
  });
  const [waveform, setWaveform] = useState<number[]>([]);

  const ffmpegRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const initEngine = async () => {
    try {
      const ffmpeg = await loadFFmpegInstance(
        (p) => setProgress(Math.round(p * 100)),
        (msg) => setLogs((prev) => [...prev.slice(-10), msg])
      );
      ffmpegRef.current = ffmpeg;
      setIsLoaded(true);
    } catch (e) {
      console.error("Audio Engine Load Failed", e);
      toast.error(t("messages.engineLoadFailed"));
    }
  };

  useEffect(() => {
    initEngine();
  }, []);

  const handleFileDrop = (files: File[]) => {
    if (files[0]) {
      const file = files[0];
      setAudioFile(file);
      setOutputUrl(null);
      setWaveform(Array.from({ length: 48 }).map(() => Math.random()));
      setLogs([t("messages.engineReady", { name: file.name })]);
    }
  };

  const processAudio = async () => {
    if (!audioFile || !isLoaded) return;
    setIsProcessing(true);
    setProgress(0);
    const ffmpeg = ffmpegRef.current;
    const inputExt = audioFile.name.substring(audioFile.name.lastIndexOf("."));
    const inputName = "input" + inputExt;
    const outputName = `master_export_${Date.now()}.${outputFormat}`;

    try {
      await ffmpeg.writeFile(inputName, await fetchFile(audioFile));
      
      const args = ["-i", inputName];
      args.push("-b:a", bitrate, "-ar", sampleRate);
      
      if (metadata.title) args.push("-metadata", `title=${metadata.title}`);
      if (metadata.artist) args.push("-metadata", `artist=${metadata.artist}`);
      if (metadata.album) args.push("-metadata", `album=${metadata.album}`);
      
      args.push(outputName);

      await ffmpeg.exec(args);
      const data = await ffmpeg.readFile(outputName);
      const url = URL.createObjectURL(new Blob([(data as any).buffer], { type: `audio/${outputFormat}` }));
      setOutputUrl(url);
      setLogs((prev) => [...prev, t("messages.successExport")]);
      toast.success(t("messages.masteringComplete"));
    } catch (e) {
      console.error(e);
      setLogs((prev) => [...prev, t("messages.errorExport")]);
      toast.error(t("messages.masteringFailed"));
    } finally {
      setIsProcessing(false);
    }
  };

  const faqItems = Array.isArray(t.raw("faq.items")) ? (t.raw("faq.items") as any[]) : [];

  return (
    <div className={`flex flex-col ${isEmbed ? 'h-full bg-transparent' : 'min-h-screen lg:h-screen bg-background'} text-foreground overflow-y-auto lg:overflow-hidden selection:bg-primary/30 custom-scrollbar`}>
      {!isEmbed && <Navbar />}
      
      <main id="main-content" className="flex-grow flex flex-col lg:flex-row overflow-visible lg:overflow-hidden relative scrollbar-hide">
        <AudioStudioEditor 
          t={t}
          audioFile={audioFile}
          outputUrl={outputUrl}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          audioRef={audioRef}
          isProcessing={isProcessing}
          progress={progress}
          waveform={waveform}
          handleFileDrop={handleFileDrop}
          processAudio={processAudio}
          outputFormat={outputFormat}
          setOutputFormat={setOutputFormat}
          bitrate={bitrate}
          setBitrate={setBitrate}
          sampleRate={sampleRate}
          setSampleRate={setSampleRate}
          metadata={metadata}
          setMetadata={setMetadata}
          isLoaded={isLoaded}
          ExportManager={ExportManager}
        />
      </main>

      {!isEmbed && (
        <>
          <SEOStructuredData 
            name={t("seo.title")}
            description={t("seo.description")}
            url="https://safetools.space/audio"
            faqItems={faqItems}
          />
          <FAQ 
            items={faqItems}
            title={t("faq.title")}
            description={t("faq.description")}
          />
          <Footer />
        </>
      )}
    </div>
  );
}
