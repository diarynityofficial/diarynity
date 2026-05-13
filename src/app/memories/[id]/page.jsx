'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';

export default function MemoryDetailPage() {
  const params = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [memory, setMemory] = useState(null);

  useEffect(() => {
    async function loadMemory() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

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

      setMemory(data);
      setLoading(false);
    }

    if (params?.id) {
      loadMemory();
    }
  }, [params, router]);

  async function handleDelete() {
    const confirmed = window.confirm('Bu anıyı silmek istediğine emin misin?');

    if (!confirmed) return;

    const { error } = await supabase
      .from('memories')
      .delete()
      .eq('id', memory.id);

    if (error) {
      alert('Anı silinemedi.');
      console.error(error);
      return;
    }

    router.push('/dashboard');
  }

  if (loading) {
    return (
      <main style={styles.loadingPage}>
        <p style={styles.loadingText}>Anı yükleniyor...</p>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <section style={styles.container}>
        <div style={styles.topBar}>
          <button
            onClick={() => router.push('/dashboard')}
            style={styles.backButton}
          >
            ← Dashboard
          </button>

          <div style={styles.topActions}>
            <button
              onClick={() => router.push(`/memories/${memory.id}/edit`)}
              style={styles.editButton}
            >
              Düzenle
            </button>

            <button onClick={handleDelete} style={styles.deleteButton}>
              Sil
            </button>

            <span style={styles.privacyBadge}>
              {memory.privacy === 'public'
                ? 'Açık'
                : memory.privacy === 'pin'
                ? 'PIN Korumalı'
                : 'Özel'}
            </span>
          </div>
        </div>

        <article style={styles.memoryCard}>
          <div style={styles.header}>
            <p style={styles.meta}>
              {memory.memory_date
                ? formatDate(memory.memory_date)
                : formatDate(memory.created_at)}
            </p>

            <h1 style={styles.title}>{memory.title}</h1>

            <div style={styles.tags}>
              {memory.category && <span style={styles.tag}>{memory.category}</span>}
              {memory.mood && <span style={styles.tag}>{memory.mood}</span>}
              {memory.location && <span style={styles.tag}>{memory.location}</span>}
            </div>
          </div>

          <div style={styles.content}>{memory.content}</div>
        </article>
      </section>
    </main>
  );
}

function formatDate(dateValue) {
  if (!dateValue) return '';

  return new Date(dateValue).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

const styles = {
  page: {
    minHeight: '100vh',
    background:
      'linear-gradient(135deg, #fff7f1 0%, #f6e5db 45%, #ead0c3 100%)',
    padding: '42px 20px',
    color: '#3b2a24',
  },

  container: {
    width: '100%',
    maxWidth: '860px',
    margin: '0 auto',
  },

  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '22px',
    gap: '14px',
  },

  topActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
  },

  backButton: {
    border: 'none',
    background: 'rgba(255,255,255,0.7)',
    borderRadius: '999px',
    padding: '12px 18px',
    cursor: 'pointer',
    color: '#6e4d42',
    fontSize: '14px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
  },

  editButton: {
    border: 'none',
    background: '#7b4a3a',
    color: '#fff',
    borderRadius: '999px',
    padding: '10px 16px',
    cursor: 'pointer',
    fontSize: '14px',
  },

  deleteButton: {
    border: 'none',
    background: '#b83a2f',
    color: '#fff',
    borderRadius: '999px',
    padding: '10px 16px',
    cursor: 'pointer',
    fontSize: '14px',
  },

  privacyBadge: {
    fontSize: '13px',
    color: '#7b4a3a',
    background: 'rgba(123, 74, 58, 0.08)',
    padding: '8px 14px',
    borderRadius: '999px',
  },

  memoryCard: {
    background: 'rgba(255,255,255,0.72)',
    border: '1px solid rgba(120, 80, 65, 0.14)',
    borderRadius: '34px',
    padding: '46px',
    boxShadow: '0 28px 80px rgba(80, 45, 30, 0.12)',
  },

  header: {
    marginBottom: '36px',
  },

  meta: {
    margin: '0 0 16px',
    color: '#9b7566',
    fontSize: '14px',
    letterSpacing: '0.04em',
  },

  title: {
    fontSize: '48px',
    lineHeight: 1.15,
    margin: '0 0 22px',
    fontFamily: 'Georgia, serif',
    fontWeight: 500,
    color: '#2d1d17',
  },

  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
  },

  tag: {
    background: 'rgba(123, 74, 58, 0.08)',
    color: '#7b4a3a',
    padding: '8px 14px',
    borderRadius: '999px',
    fontSize: '13px',
  },

  content: {
    fontSize: '17px',
    lineHeight: 1.95,
    color: '#4e3931',
    whiteSpace: 'pre-wrap',
    fontFamily: 'Georgia, serif',
  },

  loadingPage: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background:
      'linear-gradient(135deg, #fff7f1 0%, #f6e5db 45%, #ead0c3 100%)',
  },

  loadingText: {
    color: '#7b4a3a',
    fontSize: '17px',
  },
};