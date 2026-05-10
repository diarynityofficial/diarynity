import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";
import { journalPosts } from "../../data/journalPosts";

export const metadata = {
  title: "DIARYNITY Journal | Anılar, Hayat Hikâyeleri ve Dijital Hafıza",
  description:
    "DIARYNITY Journal; anılar, yaşam hikâyeleri, dijital miras, aile hatıraları ve hayatın anlamı üzerine premium yazılar sunar.",
};

async function getJournalPosts() {
  const { data, error } = await supabase
    .from("journal_posts")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (!error && data && data.length > 0) {
    return data.map((post) => ({
      title: post.title || "Başlıksız yazı",
      slug: post.slug,
      summary:
        post.excerpt ||
        post.summary ||
        "DIARYNITY Journal içinde yayınlanan özel bir yazı.",
      image: post.cover_image_url || post.image || null,
      category: "DIARYNITY JOURNAL",
      readingTime: post.reading_time || "5 dakika okuma",
    }));
  }

  return journalPosts.map((post) => ({
    title: post.title || "Başlıksız yazı",
    slug: post.slug,
    summary:
      post.summary ||
      post.excerpt ||
      "DIARYNITY Journal içinde yayınlanan özel bir yazı.",
    image: post.image || null,
    category: post.category || "DIARYNITY JOURNAL",
    readingTime: post.readingTime || "5 dakika okuma",
  }));
}

export default async function JournalPage() {
  const posts = await getJournalPosts();

  return (
    <main className="journal-page">
      <section className="journal-hero">
        <p className="journal-kicker">DIARYNITY JOURNAL</p>

        <h1>Anılar, hayat hikâyeleri ve dijital hafıza üzerine yazılar</h1>

        <p>
          Hatıraların zaman içindeki değerini, insanın geride bıraktığı izleri ve
          dijital çağda hafızanın nasıl korunabileceğini daha sakin, daha zarif
          ve daha kalıcı bir perspektifle ele alan seçilmiş yazılar.
        </p>
      </section>

      <section className="journal-grid">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/journal/${post.slug}`}
            className="journal-card"
          >
            <div className="journal-card-image">
              {post.image ? (
                <img src={post.image} alt="" />
              ) : (
                <div className="journal-image-placeholder">
                  DIARYNITY
                </div>
              )}
            </div>

            <div className="journal-card-content">
              <span>{post.category}</span>
              <h2>{post.title}</h2>
              <p>{post.summary}</p>
              <small>{post.readingTime}</small>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}