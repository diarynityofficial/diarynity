import { supabase } from "../lib/supabaseClient";
import { journalPosts } from "../data/journalPosts";

const SITE_URL = "https://diarynity.com";

export default async function sitemap() {
  const staticPages = [
    "",
    "/journal",
    "/stories",
    "/discover",
    "/pricing",
    "/legacy",
  ];

  const staticUrls = staticPages.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  const { data } = await supabase
    .from("journal_posts")
    .select("slug, updated_at, created_at")
    .eq("is_published", true);

  const supabaseJournalUrls =
    data?.map((post) => ({
      url: `${SITE_URL}/journal/${post.slug}`,
      lastModified: post.updated_at || post.created_at || new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    })) || [];

  const fallbackJournalUrls = journalPosts.map((post) => ({
    url: `${SITE_URL}/journal/${post.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const allUrls = [
    ...staticUrls,
    ...fallbackJournalUrls,
    ...supabaseJournalUrls,
  ];

  const uniqueUrls = Array.from(
    new Map(allUrls.map((page) => [page.url, page])).values()
  );

  return uniqueUrls;
}