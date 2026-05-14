import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { locales } from '@/config/locales';
import { notFound } from 'next/navigation';
import { ThemeProvider } from '@/components/shared/ThemeProvider';
import { Toaster } from 'sonner';
import { GlobalVideoBackground } from '@/components/shared/GlobalVideoBackground';

export default async function EmbedLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
        <ThemeProvider defaultTheme="dark">
            <GlobalVideoBackground />
            <main className="w-full h-screen bg-transparent flex flex-col p-4 overflow-hidden relative">
                {children}
                <div className="absolute bottom-6 right-6 flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity z-50 bg-background/80 backdrop-blur-md px-2 py-1 rounded border border-border/50 shadow">
                    <span className="text-[10px] text-muted-foreground font-medium">Powered by</span>
                    <a href={`https://safetools.space/${locale}`} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                        SafeTools 🚀
                    </a>
                </div>
            </main>
            <Toaster richColors position="bottom-right" />
        </ThemeProvider>
    </NextIntlClientProvider>
  );
}
