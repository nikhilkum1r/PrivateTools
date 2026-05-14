import { getTranslations, setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import { ClientOnly } from "@/components/shared/ClientOnly";
import AudioStudioClient from "../../(tools)/audio/AudioStudioClient";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "audio.seo" });

  return {
    title: `${t("title")} | Embed by SafeTools`,
    robots: {
      index: false,
      follow: false,
    }
  };
}

export default async function EmbedAudioPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="w-full h-full max-h-screen overflow-y-auto custom-scrollbar rounded-xl border border-border/50 bg-background/95 backdrop-blur-md shadow-2xl overflow-hidden relative">
      <ClientOnly>
        <AudioStudioClient isEmbed={true} />
      </ClientOnly>
    </div>
  );
}
