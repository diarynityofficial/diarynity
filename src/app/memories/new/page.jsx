"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";
import { uploadMemoryPhoto } from "../../../lib/storage";

export default function NewMemoryPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    content: "",
    privacy: "private",
    pin_code: "",
    language: "tr",
    location: "",
    mood: "",
    category: "life",
    memory_date: "",
    photo_url: "",
    audio_url: "",
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handlePhotoChange(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setLoading(false);
      setMessage("Lütfen önce giriş yap.");
      router.push("/login");
      return;
    }

    let uploadedPhotoUrl = form.photo_url || null;

    if (photoFile) {
      const uploadResult = await uploadMemoryPhoto(photoFile, user.id);

      if (uploadResult.error) {
        setLoading(false);
        setMessage("Fotoğraf yüklenemedi: " + uploadResult.error);
        return;
      }

      uploadedPhotoUrl = uploadResult.url;
    }

    const { error } = await supabase.from("memories").insert([
      {
        user_id: user.id,
        title: form.title,
        content: form.content,
        privacy: form.privacy,
        pin_code: form.privacy === "pin" ? form.pin_code || null : null,
        language: form.language || "tr",
        location: form.location || null,
        mood: form.mood || null,
        category: form.category || null,
        memory_date: form.memory_date || null,
        photo_url: uploadedPhotoUrl,
        audio_url: form.audio_url || null,
      },
    ]);

    setLoading(false);

    if (error) {
      console.error(error);
      setMessage("Hatıra kaydedilemedi: " + error.message);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <main className="new-memory-page">
      <section className="new-memory-shell">
        <div className="new-memory-header">
          <span className="new-memory-kicker">DIARYNITY MEMORY</span>
          <h1>Yeni Hatıra Ekle</h1>
          <p>
            Bugünden kalan bir duyguyu, bir anı ya da sessiz bir yaşam izini
            kendi arşivine ekle.
          </p>
        </div>

        <form className="new-memory-form" onSubmit={handleSubmit}>
          <label>
            Başlık
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Bir yaz akşamından kalan küçük bir hatıra"
              required
            />
          </label>

          <label>
            Hatıra Metni
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              placeholder="Bugün saklamak istediğin şeyi yaz..."
              required
            />
          </label>

          <label>
            Fotoğraf Yükle
            <input type="file" accept="image/*" onChange={handlePhotoChange} />
          </label>

          {photoPreview && (
            <div className="memory-photo-preview">
              <img src={photoPreview} alt="Hatıra önizleme" />
            </div>
          )}

          <label>
            Gizlilik
            <select name="privacy" value={form.privacy} onChange={handleChange}>
              <option value="private">Private</option>
              <option value="public">Public</option>
              <option value="pin">PIN Protected</option>
            </select>
          </label>

          {form.privacy === "pin" && (
            <label>
              PIN Kodu
              <input
                name="pin_code"
                value={form.pin_code}
                onChange={handleChange}
                placeholder="Örn: 1234"
              />
            </label>
          )}

          <label>
            Konum
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Örn: Luzern, İsviçre"
            />
          </label>

          <label>
  Ruh Hali
  <select name="mood" value={form.mood} onChange={handleChange}>
    <option value="">Seçiniz</option>
    <option value="huzurlu">Huzurlu</option>
    <option value="mutlu">Mutlu</option>
    <option value="özlemli">Özlemli</option>
    <option value="duygusal">Duygusal</option>
    <option value="sakin">Sakin</option>
    <option value="umutlu">Umutlu</option>
  </select>
</label>

          <label>
            Kategori
            <select name="category" value={form.category} onChange={handleChange}>
              <option value="life">Life</option>
              <option value="family">Family</option>
              <option value="travel">Travel</option>
              <option value="love">Love</option>
              <option value="childhood">Childhood</option>
              <option value="legacy">Legacy</option>
            </select>
          </label>

          <label>
            Hatıra Tarihi
            <input
              type="date"
              name="memory_date"
              value={form.memory_date}
              onChange={handleChange}
            />
          </label>

          <label>
            Ses URL
            <input
              name="audio_url"
              value={form.audio_url}
              onChange={handleChange}
              placeholder="Şimdilik opsiyonel"
            />
          </label>

          {message && <p className="new-memory-message">{message}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Kaydediliyor..." : "Hatırayı Kaydet"}
          </button>
        </form>
      </section>
    </main>
  );
}