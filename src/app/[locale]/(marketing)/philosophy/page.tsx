import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { PhilosophyClientView } from "./PhilosophyClientView";

export default async function PhilosophyPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Enable static rendering
  setRequestLocale(locale);

  return <PhilosophyClientView />;
}
