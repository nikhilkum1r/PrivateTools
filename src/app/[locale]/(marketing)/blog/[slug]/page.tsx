import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import BlogPostClient from "./BlogPostClient";

export async function generateStaticParams() {
  const locales = ['en', 'hi', 'ar', 'zh', 'ja', 'fr', 'es', 'de', 'it', 'pt', 'ru', 'ko'];
  
  // This is a simplified version. In a real app, you'd fetch slugs from a CMS or file system.
  const slugs = ['why-local-first-matters', 'mastering-webassembly', 'steganography-basics'];
  
  const params = [];
  for (const locale of locales) {
    for (const slug of slugs) {
      params.push({ locale, slug });
    }
  }
  
  return params;
}

export default async function BlogPostPage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const messages = (await getMessages()) as any;
  const posts = messages.blog?.posts || [];
  const post = posts.find((p: any) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return <BlogPostClient post={post} />;
}
