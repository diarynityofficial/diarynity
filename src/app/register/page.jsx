'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleRegister(e) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const cleanUsername = username
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-');

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setMessage(signUpError.message);
      setLoading(false);
      return;
    }

    const user = signUpData?.user;

    if (!user) {
      setMessage('Kayıt oluşturuldu. Lütfen email adresini onayla.');
      setLoading(false);
      return;
    }

   const { error: profileError } = await supabase.from('profiles').insert({
  id: user.id,
  username: cleanUsername,
  display_name: fullName,
  bio: '',
  avatar_url: '',
});

    if (profileError) {
      setMessage(profileError.message);
      setLoading(false);
      return;
    }

    setMessage('Kayıt başarılı. Şimdi giriş yapabilirsin.');
    setTimeout(() => {
      router.push('/login');
    }, 1200);
  }

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <h1 style={styles.title}>DIARYNITY</h1>
        <p style={styles.subtitle}>Kendi yaşam arşivini oluşturmaya başla.</p>

        <form onSubmit={handleRegister} style={styles.form}>
          <input
            style={styles.input}
            type="text"
            placeholder="Ad Soyad"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <input
            style={styles.input}
            type="text"
            placeholder="Kullanıcı adı"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            style={styles.input}
            type="email"
            placeholder="Email adresi"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            style={styles.input}
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button style={styles.button} disabled={loading}>
            {loading ? 'Kayıt oluşturuluyor...' : 'Kayıt Ol'}
          </button>
        </form>

        {message && <p style={styles.message}>{message}</p>}

        <p style={styles.bottomText}>
          Zaten hesabın var mı?{' '}
          <Link href="/login" style={styles.link}>
            Giriş yap
          </Link>
        </p>
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #fff8f4, #f6ded6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    color: '#3b2b28',
  },
  card: {
    width: '100%',
    maxWidth: '430px',
    background: 'rgba(255,255,255,0.78)',
    border: '1px solid rgba(160,110,95,0.18)',
    borderRadius: '30px',
    padding: '38px 30px',
    boxShadow: '0 24px 70px rgba(90,50,38,0.12)',
  },
  title: {
    fontFamily: 'Georgia, serif',
    fontSize: '34px',
    textAlign: 'center',
    margin: '0 0 8px',
  },
  subtitle: {
    textAlign: 'center',
    color: '#7a5d56',
    lineHeight: '1.6',
    marginBottom: '28px',
  },
  form: {
    display: 'grid',
    gap: '14px',
  },
  input: {
    width: '100%',
    border: '1px solid rgba(130,90,80,0.22)',
    borderRadius: '16px',
    padding: '14px 15px',
    fontSize: '15px',
    background: '#fffaf7',
    color: '#3b2b28',
    outline: 'none',
  },
  button: {
    marginTop: '6px',
    border: 'none',
    borderRadius: '18px',
    padding: '14px',
    background: '#8f5d50',
    color: '#fff',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  message: {
    marginTop: '18px',
    textAlign: 'center',
    color: '#7a4c42',
    fontSize: '14px',
  },
  bottomText: {
    marginTop: '22px',
    textAlign: 'center',
    fontSize: '14px',
    color: '#7a5d56',
  },
  link: {
    color: '#8f5d50',
    fontWeight: '600',
    textDecoration: 'none',
  },
};