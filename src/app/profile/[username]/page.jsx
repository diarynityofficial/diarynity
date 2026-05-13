'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';

export default function PublicProfilePage() {
  const params = useParams();
  const router = useRouter();
  const username = params?.username;

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [memories, setMemories] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function loadProfile() {
      if (!username) return;

      setLoading(true);
      setErrorMessage('');

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .maybeSingle();

      if (profileError) {
        setErrorMessage(profileError.message);
        setLoading(false);
        return;
      }

      if (!profileData) {
        setErrorMessage(`Bu username ile profil bulunamadı: ${username}`);
        setLoading(false);
        return;
      }

      setProfile(profileData);

      const { data: memoriesData } = await supabase
        .from('memories')
        .select('*')
        .eq('user_id', profileData.id)
        .eq('privacy', 'public')
        .order('created_at', { ascending: false });

      setMemories(memoriesData || []);
      setLoading(false);
    }

    loadProfile();
  }, [username]);

  if (loading) {
    return (
      <main style={styles.page}>
        <p style={styles.loading}>Profil yükleniyor...</p>
      </main>
    );
  }

  if (errorMessage) {
    return (
      <main style={styles.page}>
        <section style={styles.hero}>
          <h1 style={styles.title}>Profil bulunamadı</h1>
          <p style={styles.bio}>{errorMessage}</p>

          <button
            style={styles.button}
            onClick={() => router.push('/dashboard')}
          >
            Dashboard’a Dön
          </button>
        </section>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.avatar}>
          {profile?.display_name?.charAt(0)?.toUpperCase() ||
            username?.charAt(0)?.toUpperCase()}
        </div>

        <h1 style={styles.title}>{profile?.display_name || username}</h1>

        <p style={styles.username}>@{username}</p>

        <p style={styles.bio}>
          {profile?.bio || 'Bu kullanıcı henüz profil açıklaması eklemedi.'}
        </p>

        <button style={styles.button} onClick={() => router.push('/dashboard')}>
          Dashboard’a Dön
        </button>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Public Memories</h2>

        {memories.length === 0 ? (
          <div style={styles.emptyBox}>
            <p>Henüz herkese açık bir anı paylaşılmamış.</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {memories.map((memory) => (
              <article
                key={memory.id}
                style={styles.card}
                onClick={() => router.push(`/memories/${memory.id}`)}
              >
                <p style={styles.date}>
                  {memory.memory_date ||
                    new Date(memory.created_at).toLocaleDateString('tr-TR')}
                </p>

                <h3 style={styles.cardTitle}>{memory.title}</h3>

                <p style={styles.excerpt}>
                  {memory.content?.slice(0, 180)}
                  {memory.content?.length > 180 ? '...' : ''}
                </p>

                <span style={styles.badge}>Public</span>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #fff8f4, #f8e7df)',
    padding: '56px 20px',
    color: '#3b2b28',
  },
  hero: {
    maxWidth: '860px',
    margin: '0 auto 42px',
    textAlign: 'center',
    background: 'rgba(255,255,255,0.72)',
    border: '1px solid rgba(160,110,95,0.18)',
    borderRadius: '32px',
    padding: '48px 28px',
    boxShadow: '0 24px 70px rgba(90,50,38,0.10)',
  },
  avatar: {
    width: '92px',
    height: '92px',
    borderRadius: '50%',
    margin: '0 auto 22px',
    background: 'linear-gradient(135deg, #8f5d50, #d9a99a)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '38px',
    fontWeight: '600',
  },
  title: {
    fontFamily: 'Georgia, serif',
    fontSize: '34px',
    margin: '0 0 8px',
  },
  username: {
    margin: '0 0 20px',
    color: '#9a746c',
    fontSize: '15px',
  },
  bio: {
    maxWidth: '620px',
    margin: '0 auto 24px',
    fontSize: '17px',
    lineHeight: '1.8',
    color: '#5f4742',
  },
  button: {
    border: 'none',
    borderRadius: '999px',
    padding: '12px 20px',
    background: '#8f5d50',
    color: '#fff',
    fontSize: '14px',
    cursor: 'pointer',
  },
  section: {
    maxWidth: '980px',
    margin: '0 auto',
  },
  sectionTitle: {
    fontFamily: 'Georgia, serif',
    fontSize: '26px',
    marginBottom: '20px',
  },
  emptyBox: {
    background: 'rgba(255,255,255,0.62)',
    border: '1px solid rgba(160,110,95,0.16)',
    borderRadius: '24px',
    padding: '30px',
    color: '#7a5d56',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '18px',
  },
  card: {
    textDecoration: 'none',
    color: 'inherit',
    background: 'rgba(255,255,255,0.74)',
    border: '1px solid rgba(160,110,95,0.16)',
    borderRadius: '24px',
    padding: '24px',
    boxShadow: '0 18px 45px rgba(90,50,38,0.08)',
    cursor: 'pointer',
  },
  date: {
    fontSize: '13px',
    color: '#a27a72',
    marginBottom: '10px',
  },
  cardTitle: {
    fontFamily: 'Georgia, serif',
    fontSize: '21px',
    margin: '0 0 12px',
  },
  excerpt: {
    fontSize: '15px',
    lineHeight: '1.7',
    color: '#5f4742',
  },
  badge: {
    display: 'inline-block',
    marginTop: '14px',
    fontSize: '12px',
    padding: '6px 10px',
    borderRadius: '999px',
    background: '#f2d7cd',
    color: '#7a4c42',
  },
  loading: {
    fontSize: '17px',
    color: '#7b4a3a',
  },
};