'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../../../../lib/supabaseClient';

export default function EditMemoryPage() {
  const params = useParams();
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [form, setForm] = useState({
    title: '',
    content: '',
    privacy: 'private',
    mood: '',
    category: '',
    location: '',
    memory_date: '',
  });

  useEffect(() => {
    async function loadMemory() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      setUser(user);

      const { data, error } = await supabase
        .from('memories')
        .select('*')
        .eq('id', params.id)
        .eq('user_id', user.id)
        .single();

      if (error || !data) {
        router.push('/dashboard');
        return;
      }

      setForm({
        title: data.title || '',
        content: data.content || '',
        privacy: data.privacy || 'private',
        mood: data.mood || '',
        category: data.category || '',
        location: data.location || '',
        memory_date: data.memory_date || '',
      });

      setLoading(false);
    }

    if (params?.id) loadMemory();
  }, [params, router]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    if (!form.title.trim() || !form.content.trim()) {
      setMessage('Başlık ve anı metni zorunludur.');
      setSaving(false);
      return;
    }

    const { error } = await supabase
      .from('memories')
      .update({
        title: form.title,
        content: form.content,
        privacy: form.privacy,
        mood: form.mood || null,
        category: form.category || null,
        location: form.location || null,
        memory_date: form.memory_date || null,
      })
      .eq('id', params.id)
      .eq('user_id', user.id);

    if (error) {
      console.error(error);
      setMessage('Anı güncellenemedi. Supabase update policy eksik olabilir.');
      setSaving(false);
      return;
    }

    router.push(`/memories/${params.id}`);
  }

  if (loading) {
    return (
      <main style={styles.page}>
        <p style={styles.loading}>Düzenleme sayfası hazırlanıyor...</p>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <p style={styles.badge}>ANIYI DÜZENLE</p>
        <h1 style={styles.title}>Anını güncelle</h1>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Başlık
            <input name="title" value={form.title} onChange={handleChange} style={styles.input} />
          </label>

          <label style={styles.label}>
            Anı Metni
            <textarea name="content" value={form.content} onChange={handleChange} style={styles.textarea} />
          </label>

          <div style={styles.grid}>
            <label style={styles.label}>
              Gizlilik
              <select name="privacy" value={form.privacy} onChange={handleChange} style={styles.input}>
                <option value="private">Özel</option>
                <option value="public">Açık</option>
                <option value="pin">PIN Korumalı</option>
              </select>
            </label>

            <label style={styles.label}>
              Ruh Hali
              <input name="mood" value={form.mood} onChange={handleChange} style={styles.input} />
            </label>

            <label style={styles.label}>
              Kategori
              <input name="category" value={form.category} onChange={handleChange} style={styles.input} />
            </label>

            <label style={styles.label}>
              Yer
              <input name="location" value={form.location} onChange={handleChange} style={styles.input} />
            </label>

            <label style={styles.label}>
              Anı Tarihi
              <input type="date" name="memory_date" value={form.memory_date} onChange={handleChange} style={styles.input} />
            </label>
          </div>

          {message && <p style={styles.message}>{message}</p>}

          <div style={styles.actions}>
            <button type="submit" disabled={saving} style={styles.primaryButton}>
              {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
            </button>

            <button type="button" onClick={() => router.push(`/memories/${params.id}`)} style={styles.secondaryButton}>
              Vazgeç
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #fff7f1 0%, #f7e6dc 45%, #ead1c5 100%)',
    padding: '34px',
    color: '#3b2a24',
  },
  card: {
    width: '100%',
    maxWidth: '980px',
    margin: '0 auto',
    background: 'rgba(255,255,255,0.74)',
    border: '1px solid rgba(120,80,65,0.16)',
    borderRadius: '28px',
    padding: '38px',
    boxShadow: '0 28px 80px rgba(80,45,30,0.14)',
  },
  badge: {
    fontSize: '12px',
    letterSpacing: '0.18em',
    color: '#9b6b5b',
    fontWeight: 700,
  },
  title: {
    fontSize: '36px',
    margin: '12px 0 28px',
    fontFamily: 'Georgia, serif',
    fontWeight: 500,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '22px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: '18px',
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    fontSize: '14px',
    color: '#5c4037',
    fontWeight: 600,
  },
  input: {
    border: '1px solid rgba(120,80,65,0.18)',
    borderRadius: '16px',
    padding: '14px 15px',
    fontSize: '15px',
    background: 'rgba(255,255,255,0.78)',
    color: '#3b2a24',
    outline: 'none',
  },
  textarea: {
    minHeight: '260px',
    border: '1px solid rgba(120,80,65,0.18)',
    borderRadius: '18px',
    padding: '16px',
    fontSize: '16px',
    lineHeight: 1.8,
    background: 'rgba(255,255,255,0.78)',
    color: '#3b2a24',
    outline: 'none',
    resize: 'vertical',
  },
  actions: {
    display: 'flex',
    gap: '14px',
    flexWrap: 'wrap',
  },
  primaryButton: {
    border: 'none',
    borderRadius: '999px',
    padding: '14px 24px',
    background: '#7b4a3a',
    color: '#fff',
    fontSize: '15px',
    cursor: 'pointer',
  },
  secondaryButton: {
    border: '1px solid rgba(123,74,58,0.28)',
    borderRadius: '999px',
    padding: '14px 24px',
    background: 'transparent',
    color: '#7b4a3a',
    fontSize: '15px',
    cursor: 'pointer',
  },
  message: {
    padding: '14px 16px',
    borderRadius: '16px',
    background: 'rgba(123,74,58,0.08)',
    color: '#7b4a3a',
    fontSize: '14px',
  },
  loading: {
    fontSize: '17px',
    color: '#7b4a3a',
  },
};