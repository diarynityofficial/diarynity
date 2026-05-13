'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

export default function DashboardPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [memories, setMemories] = useState([]);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function loadDashboard() {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.push('/login');
        return;
      }

      setUser(user);

      const { data: profileData } = await supabase
        .from('profiles')
        .select('username, display_name, avatar_url, bio')
        .eq('id', user.id)
        .single();

      setProfile(profileData);

      const { data, error } = await supabase
        .from('memories')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error(error);
        setMemories([]);
      } else {
        setMemories(data || []);
      }

      setLoading(false);
    }

    loadDashboard();
  }, [router]);

  if (loading) {
    return (
      <main style={styles.page}>
        <p style={styles.loading}>DIARYNITY yükleniyor...</p>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div>
          <p style={styles.badge}>DIARYNITY DASHBOARD</p>
          <h1 style={styles.title}>Hoş geldin</h1>
          <p style={styles.subtitle}>
            Burası senin kişisel anı merkezinin başlangıç ekranı.
          </p>
          <p style={styles.email}>{user?.email}</p>

          {profile?.username && (
            <button
              style={styles.profileButton}
              onClick={() => router.push(`/profile/${profile.username}`)}
            >
              Profilimi Görüntüle
            </button>
          )}
        </div>

        <div style={styles.heroActions}>
          <button
            style={styles.primaryButton}
            onClick={() => router.push('/memories/new')}
          >
            Yeni Anı Yaz
          </button>

          <button
            style={styles.secondaryButton}
            onClick={async () => {
              await supabase.auth.signOut();
              router.push('/login');
            }}
          >
            Çıkış Yap
          </button>
        </div>
      </section>

      <section style={styles.statsGrid}>
        <div style={styles.statCard}>
          <span style={styles.statNumber}>{memories.length}</span>
          <span style={styles.statLabel}>Toplam Anı</span>
        </div>

        <div style={styles.statCard}>
          <span style={styles.statNumber}>
            {memories.filter((m) => m.privacy === 'private').length}
          </span>
          <span style={styles.statLabel}>Özel Anı</span>
        </div>

        <div style={styles.statCard}>
          <span style={styles.statNumber}>
            {memories.filter((m) => m.privacy === 'public').length}
          </span>
          <span style={styles.statLabel}>Açık Anı</span>
        </div>
      </section>

      <section style={styles.memoriesSection}>
        <div style={styles.sectionHeader}>
          <div>
            <p style={styles.sectionBadge}>SON KAYITLAR</p>
            <h2 style={styles.sectionTitle}>Son Anıların</h2>
          </div>

          <button
            style={styles.smallButton}
            onClick={() => router.push('/memories/new')}
          >
            + Yeni Anı
          </button>
        </div>

        {memories.length === 0 ? (
          <div style={styles.emptyBox}>
            <h3 style={styles.emptyTitle}>Henüz anı yok</h3>
            <p style={styles.emptyText}>
              İlk anını yazdığında burada görünecek.
            </p>
          </div>
        ) : (
          <div style={styles.memoryGrid}>
            {memories.slice(0, 6).map((memory) => (
              <article
                key={memory.id}
                style={styles.memoryCard}
                onClick={() => router.push(`/memories/${memory.id}`)}
              >
                <div style={styles.memoryTop}>
                  <span style={styles.privacyBadge}>
                    {memory.privacy === 'public'
                      ? 'Açık'
                      : memory.privacy === 'pin'
                      ? 'PIN'
                      : 'Özel'}
                  </span>

                  <span style={styles.dateText}>
                    {memory.memory_date || formatDate(memory.created_at)}
                  </span>
                </div>

                <h3 style={styles.memoryTitle}>{memory.title}</h3>

                <p style={styles.memoryContent}>
                  {memory.content?.length > 150
                    ? `${memory.content.slice(0, 150)}...`
                    : memory.content}
                </p>

                <div style={styles.memoryMeta}>
                  {memory.category && <span>{memory.category}</span>}
                  {memory.mood && <span>{memory.mood}</span>}
                  {memory.location && <span>{memory.location}</span>}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function formatDate(dateValue) {
  if (!dateValue) return '';
  return new Date(dateValue).toLocaleDateString('tr-TR');
}

const styles = {
  page: {
    minHeight: '100vh',
    background:
      'linear-gradient(135deg, #fff7f1 0%, #f7e6dc 45%, #ead1c5 100%)',
    padding: '34px',
    color: '#3b2a24',
  },
  hero: {
    width: '100%',
    maxWidth: '1100px',
    margin: '0 auto 24px',
    background: 'rgba(255, 255, 255, 0.72)',
    border: '1px solid rgba(120, 80, 65, 0.16)',
    borderRadius: '28px',
    padding: '36px',
    boxShadow: '0 28px 80px rgba(80, 45, 30, 0.14)',
    display: 'flex',
    justifyContent: 'space-between',
    gap: '26px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  badge: {
    fontSize: '12px',
    letterSpacing: '0.18em',
    color: '#9b6b5b',
    marginBottom: '14px',
    fontWeight: 700,
  },
  title: {
    fontSize: '38px',
    margin: '0 0 10px',
    fontFamily: 'Georgia, serif',
    fontWeight: 500,
  },
  subtitle: {
    fontSize: '16px',
    lineHeight: 1.8,
    color: '#6f554c',
    maxWidth: '560px',
    margin: 0,
  },
  email: {
    marginTop: '18px',
    fontSize: '14px',
    color: '#8a665a',
    background: 'rgba(255,255,255,0.55)',
    padding: '11px 15px',
    borderRadius: '14px',
    display: 'inline-block',
  },
  profileButton: {
    display: 'block',
    marginTop: '14px',
    border: 'none',
    borderRadius: '999px',
    padding: '11px 18px',
    background: '#8f5d50',
    color: '#fff',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  heroActions: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  primaryButton: {
    border: 'none',
    borderRadius: '999px',
    padding: '14px 22px',
    background: '#7b4a3a',
    color: '#fff',
    fontSize: '15px',
    cursor: 'pointer',
  },
  secondaryButton: {
    border: '1px solid rgba(123, 74, 58, 0.28)',
    borderRadius: '999px',
    padding: '14px 22px',
    background: 'transparent',
    color: '#7b4a3a',
    fontSize: '15px',
    cursor: 'pointer',
  },
  statsGrid: {
    width: '100%',
    maxWidth: '1100px',
    margin: '0 auto 24px',
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: '16px',
  },
  statCard: {
    background: 'rgba(255, 255, 255, 0.66)',
    border: '1px solid rgba(120, 80, 65, 0.14)',
    borderRadius: '24px',
    padding: '24px',
    boxShadow: '0 18px 50px rgba(80, 45, 30, 0.08)',
  },
  statNumber: {
    display: 'block',
    fontSize: '34px',
    fontFamily: 'Georgia, serif',
    color: '#7b4a3a',
    marginBottom: '8px',
  },
  statLabel: {
    fontSize: '14px',
    color: '#7a5b51',
  },
  memoriesSection: {
    width: '100%',
    maxWidth: '1100px',
    margin: '0 auto',
    background: 'rgba(255, 255, 255, 0.52)',
    border: '1px solid rgba(120, 80, 65, 0.13)',
    borderRadius: '28px',
    padding: '28px',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '18px',
    alignItems: 'center',
    marginBottom: '22px',
  },
  sectionBadge: {
    fontSize: '11px',
    letterSpacing: '0.16em',
    color: '#9b6b5b',
    fontWeight: 700,
    margin: '0 0 8px',
  },
  sectionTitle: {
    fontSize: '27px',
    margin: 0,
    fontFamily: 'Georgia, serif',
    fontWeight: 500,
  },
  smallButton: {
    border: 'none',
    borderRadius: '999px',
    padding: '12px 18px',
    background: '#7b4a3a',
    color: '#fff',
    fontSize: '14px',
    cursor: 'pointer',
  },
  emptyBox: {
    border: '1px dashed rgba(123, 74, 58, 0.25)',
    borderRadius: '22px',
    padding: '34px',
    textAlign: 'center',
    background: 'rgba(255,255,255,0.42)',
  },
  emptyTitle: {
    margin: '0 0 8px',
    fontSize: '22px',
    fontFamily: 'Georgia, serif',
    fontWeight: 500,
  },
  emptyText: {
    margin: 0,
    color: '#7a5b51',
  },
  memoryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: '16px',
  },
  memoryCard: {
    background: 'rgba(255,255,255,0.68)',
    border: '1px solid rgba(120, 80, 65, 0.14)',
    borderRadius: '22px',
    padding: '22px',
    boxShadow: '0 16px 44px rgba(80, 45, 30, 0.07)',
    cursor: 'pointer',
    transition: '0.2s',
  },
  memoryTop: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '12px',
    alignItems: 'center',
    marginBottom: '14px',
  },
  privacyBadge: {
    fontSize: '12px',
    color: '#7b4a3a',
    background: 'rgba(123, 74, 58, 0.08)',
    padding: '6px 10px',
    borderRadius: '999px',
  },
  dateText: {
    fontSize: '12px',
    color: '#8a665a',
  },
  memoryTitle: {
    margin: '0 0 10px',
    fontSize: '21px',
    fontFamily: 'Georgia, serif',
    fontWeight: 500,
  },
  memoryContent: {
    fontSize: '15px',
    lineHeight: 1.75,
    color: '#6f554c',
    margin: 0,
  },
  memoryMeta: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '16px',
    fontSize: '12px',
    color: '#8a665a',
  },
  loading: {
    fontSize: '17px',
    color: '#7b4a3a',
  },
};