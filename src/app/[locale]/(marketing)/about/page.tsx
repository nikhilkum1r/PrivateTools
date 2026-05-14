import { Metadata } from "next";
import { locales } from "@/config/locales";
import { getTranslations } from "next-intl/server";
import AboutClient from "./AboutClient";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });

  return {
    title: t("seo.title"),
    description: t("seo.description"),
    alternates: {
      canonical: `/${locale}/about`,
    },
  };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <AboutClient />;
}
