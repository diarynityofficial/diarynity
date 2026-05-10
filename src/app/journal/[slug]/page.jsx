import Link from "next/link";
import { supabase } from "../../../lib/supabaseClient";
import { journalPosts } from "../../../data/journalPosts";

const SITE_URL = "https://diarynity.com";

async function getJournalPost(slug) {
  const { data, error } = await supabase
    .from("journal_posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!error && data) {
    return {
      title: data.title,
      summary: data.excerpt,
      content:
        data.content
          ?.split("\n")
          .filter((p) => p.trim() !== "") || [],
      category: "DIARYNITY JOURNAL",
      readingTime: "5 dakika okuma",
      image: data.cover_image_url,
      seoTitle: data.seo_title,
      seoDescription: data.seo_description,
      slug: data.slug,
    };
  }

  const fallbackPost = journalPosts.find((item) => item.slug === slug);

  if (!fallbackPost) return null;

  return {
    ...fallbackPost,
    seoTitle: fallbackPost.seoTitle || fallbackPost.title,
    seoDescription: fallbackPost.seoDescription || fallbackPost.summary,
    slug: fallbackPost.slug,
  };
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getJournalPost(slug);

  if (!post) {
    return {
      title: "Yazı bulunamadı | DIARYNITY",
      description:
        "Bu journal yazısı bulunamadı veya yayından kaldırılmış olabilir.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = post.seoTitle || `${post.title} | DIARYNITY`;
  const description =
    post.seoDescription ||
    post.summary ||
    "DIARYNITY Journal içinde hayat, hafıza, zaman ve dijital miras üzerine yazılar.";

  const image =
    post.image ||
    post.cover_image_url ||
    "/images/diarynity-journal-default.jpg";

  const canonicalUrl = `${SITE_URL}/journal/${slug}`;
  const ogImage = image.startsWith("http") ? image : `${SITE_URL}${image}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "DIARYNITY",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      locale: "tr_TR",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function JournalDetailPage({ params }) {
  const { slug } = await params;
  const post = await getJournalPost(slug);

  if (!post) {
    return (
      <main className="journal-detail-page">
        <article className="journal-detail-card">
          <Link href="/journal" className="back-link">
            ← Journal
          </Link>

          <p className="journal-detail-kicker">DIARYNITY JOURNAL</p>
          <h1>Yazı bulunamadı</h1>
          <p className="journal-detail-summary">
            Bu journal yazısı henüz yok veya yayından kaldırılmış olabilir.
          </p>
        </article>
      </main>
    );
  }

  const coverImage =
    post.image ||
    post.cover_image_url ||
    "/images/diarynity-journal-default.jpg";

  return (
    <main className="journal-detail-page">
      <article className="journal-detail-card journal-detail-premium-card">
        <Link href="/journal" className="back-link journal-detail-back">
          ← Journal
        </Link>

        <p className="journal-detail-kicker">
          {post.category || "DIARYNITY JOURNAL"}
        </p>

        <h1>{post.title}</h1>

        <p className="journal-detail-summary">{post.summary}</p>

        <div className="journal-detail-meta">
          <span>{post.readingTime || "5 dakika okuma"}</span>
        </div>

        {coverImage && (
          <div className="journal-detail-image">
            <img src={coverImage} alt={post.title} />
          </div>
        )}

        <div className="journal-detail-body">
          {post.content?.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </article>
    </main>
  );
}