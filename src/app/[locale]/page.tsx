import { setRequestLocale } from 'next-intl/server';
import HomePageClient from "./HomePageClient";

export default async function RootPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Enable static rendering
  setRequestLocale(locale);

  return <HomePageClient />;
}
