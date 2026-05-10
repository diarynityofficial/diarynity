"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { getCurrentUser } from "../../../lib/auth";
import { useRouter } from "next/navigation";

function createSlug(text) {
  return text
    .toLowerCase()
    .replaceAll("ı", "i")
    .replaceAll("ğ", "g")
    .replaceAll("ü", "u")
    .replaceAll("ş", "s")
    .replaceAll("ö", "o")
    .replaceAll("ç", "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function uploadJournalCover(userId, file) {
  const fileExt = file.name.split(".").pop();
  const fileName = `${userId}/journal-covers/${Date.now()}.${fileExt}`;

  const { error } = await supabase.storage
    .from("diarynity-uploads")
    .upload(fileName, file);

  if (error) {
    throw error;
  }

  const { data } = supabase.storage
    .from("diarynity-uploads")
    .getPublicUrl(fileName);

  return data.publicUrl;
}

export default function JournalAdminPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [saving, setSaving] = useState(false);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [coverFile, setCoverFile] = useState(null);
  const [editingPostId, setEditingPostId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    seo_title: "",
    seo_description: "",
    seo_keywords: "",
    is_published: false,
  });

  useEffect(() => {
    async function init() {
      const currentUser = await getCurrentUser();

      if (!currentUser) {
        router.push("/login");
        return;
      }

      setUser(currentUser);
      await loadPosts();
      setChecking(false);
    }

    init();
  }, [router]);

  async function loadPosts() {
    const { data, error } = await supabase
      .from("journal_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) {
      setPosts(data || []);
    }
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    const nextValue = type === "checkbox" ? checked : value;

    setForm((prev) => ({
      ...prev,
      [name]: nextValue,
      ...(name === "title" && !prev.slug
        ? { slug: createSlug(value) }
        : {}),
    }));
  }

  function resetForm() {
    setForm({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      seo_title: "",
      seo_description: "",
      seo_keywords: "",
      is_published: false,
    });

    setCoverFile(null);
    setEditingPostId(null);
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.title.trim()) {
      setError("Başlık zorunlu.");
      return;
    }

    if (!form.slug.trim()) {
      setError("Slug zorunlu.");
      return;
    }

    try {
      setSaving(true);

      let coverImageUrl = null;

      if (coverFile && user?.id) {
        coverImageUrl = await uploadJournalCover(user.id, coverFile);
      }

      const postData = {
        title: form.title,
        slug: form.slug,
        excerpt: form.excerpt,
        content: form.content,
        seo_title: form.seo_title,
        seo_description: form.seo_description,
        seo_keywords: form.seo_keywords,
        is_published: form.is_published,
      };

      if (coverImageUrl) {
        postData.cover_image_url = coverImageUrl;
      }

      const { error } = editingPostId
        ? await supabase
            .from("journal_posts")
            .update(postData)
            .eq("id", editingPostId)
        : await supabase.from("journal_posts").insert({
            ...postData,
            cover_image_url: coverImageUrl,
          });

      if (error) {
        throw error;
      }

      resetForm();
      await loadPosts();
    } catch (err) {
      setError(err.message || "Journal kaydedilirken hata oluştu.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeletePost(postId) {
    const confirmDelete = window.confirm(
      "Bu journal kaydını silmek istiyor musun?"
    );

    if (!confirmDelete) return;

    const { error } = await supabase
      .from("journal_posts")
      .delete()
      .eq("id", postId);

    if (error) {
      setError(error.message);
      return;
    }

    if (editingPostId === postId) {
      resetForm();
    }

    await loadPosts();
  }

  async function handleTogglePublish(post) {
    const nextStatus = !post.is_published;

    const confirmMessage = nextStatus
      ? "Bu journal yazısını yayınlamak istiyor musun?"
      : "Bu journal yazısını yayından kaldırmak istiyor musun?";

    const confirmed = window.confirm(confirmMessage);

    if (!confirmed) return;

    const { error } = await supabase
      .from("journal_posts")
      .update({ is_published: nextStatus })
      .eq("id", post.id);

    if (error) {
      setError(error.message);
      return;
    }

    await loadPosts();
  }

  function handleEditPost(post) {
    setEditingPostId(post.id);

    setForm({
      title: post.title || "",
      slug: post.slug || "",
      excerpt: post.excerpt || "",
      content: post.content || "",
      seo_title: post.seo_title || "",
      seo_description: post.seo_description || "",
      seo_keywords: post.seo_keywords || "",
      is_published: post.is_published ?? false,
    });

    setCoverFile(null);
    setError("");

    setTimeout(() => {
      const formTop = document.querySelector(".journal-admin-card");

      if (formTop) {
        formTop.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 50);
  }

  function handleViewPost(slug) {
    router.push(`/journal/${slug}`);
  }

  if (checking) {
    return (
      <main className="journal-admin-page">
        <section className="journal-admin-card">
          <p>Kontrol ediliyor...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="journal-admin-page">
      <section className="journal-admin-shell">
        <form onSubmit={handleSubmit} className="journal-admin-card">
          <a href="/journal" className="back-link">
            ← Journal
          </a>

          <h1>
            {editingPostId
              ? "Journal Yazısını Düzenle"
              : "Journal Admin Paneli"}
          </h1>

          <p className="journal-detail-summary">
            Yeni blog yazısı oluştur, SEO bilgilerini düzenle ve kapak görseli
            ekle.
          </p>

          <div className="journal-admin-form">
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Makale başlığı"
            />

            <input
              name="slug"
              value={form.slug}
              onChange={handleChange}
              placeholder="seo-url-slug"
            />

            <textarea
              name="excerpt"
              value={form.excerpt}
              onChange={handleChange}
              placeholder="Kısa açıklama"
              rows={3}
            />

            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              placeholder="Makale içeriği"
              rows={10}
            />

            <input
              name="seo_title"
              value={form.seo_title}
              onChange={handleChange}
              placeholder="SEO Title"
            />

            <textarea
              name="seo_description"
              value={form.seo_description}
              onChange={handleChange}
              placeholder="SEO Description"
              rows={3}
            />

            <input
              name="seo_keywords"
              value={form.seo_keywords}
              onChange={handleChange}
              placeholder="anahtar kelime, yaşam, hatıra"
            />

            <div className="journal-admin-upload">
              <label>Kapak Görseli</label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
              />

              {coverFile && <p>Seçilen: {coverFile.name}</p>}

              {editingPostId && !coverFile && (
                <p>Yeni görsel seçmezsen mevcut kapak görseli korunur.</p>
              )}
            </div>

            <label className="journal-admin-check">
              <input
                type="checkbox"
                name="is_published"
                checked={form.is_published}
                onChange={handleChange}
              />
              Bu yazıyı hemen yayınla
            </label>

            {error && <p className="form-error">{error}</p>}

            <button disabled={saving}>
              {saving
                ? "Kaydediliyor..."
                : editingPostId
                ? "Makaleyi Güncelle"
                : "Journal Yazısını Kaydet"}
            </button>

            {editingPostId && (
              <button type="button" onClick={resetForm}>
                Düzenlemeyi İptal Et
              </button>
            )}
          </div>
        </form>

        <section className="journal-admin-card">
          <p className="journal-detail-kicker">KAYITLAR</p>

          <h1>Journal kayıtları</h1>

          <div className="journal-admin-list journal-admin-premium-list">
            {posts.map((post) => (
              <article
                key={post.id}
                className="journal-card journal-admin-preview-card"
              >
                <div className="journal-card-image-wrap">
                  <img
                    src={
                      post.cover_image_url ||
                      "/images/diarynity-journal-default.jpg"
                    }
                    alt=""
                    className="journal-card-image"
                  />
                </div>

                <div className="journal-card-content">
                  <p className="journal-card-category">DIARYNITY JOURNAL</p>

                  <h2>{post.title}</h2>

                  <p className="journal-card-summary">
                    {post.excerpt || "Bu yazı için kısa açıklama eklenmemiş."}
                  </p>

                  <div className="journal-card-footer">
                    <span>/{post.slug}</span>

                    <span>
                      {post.is_published ? "Yayında" : "Taslak"}
                    </span>
                  </div>

                  <div className="journal-admin-actions">
                    <button
                      type="button"
                      onClick={() => handleViewPost(post.slug)}
                    >
                      Görüntüle
                    </button>

                    <button
                      type="button"
                      onClick={() => handleEditPost(post)}
                    >
                      Düzenle
                    </button>

                    <button
                      type="button"
                      className={
                        post.is_published
                          ? "journal-action-warning"
                          : "journal-action-success"
                      }
                      onClick={() => handleTogglePublish(post)}
                    >
                      {post.is_published ? "Yayından Kaldır" : "Yayınla"}
                    </button>

                    <button
                      type="button"
                      className="journal-action-danger"
                      onClick={() => handleDeletePost(post.id)}
                    >
                      Sil
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}