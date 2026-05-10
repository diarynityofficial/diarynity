"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "../../lib/auth";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await registerUser({
      email,
      password,
      username,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setMessage("Kayıt başarılı. Şimdi giriş yapabilirsin.");

    setTimeout(() => {
      router.push("/login");
    }, 1200);
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <p className="auth-kicker">DIARYNITY</p>

        <h1>Yeni bir yaşam arşivi oluştur</h1>

        <p className="auth-text">
          Hatıralarını, yazılarını ve özel anlarını sakin, zarif ve güvenli bir
          alanda saklamak için hesabını oluştur.
        </p>

        <form onSubmit={handleRegister} className="auth-form">
          <label>
            Kullanıcı adı
            <input
              type="text"
              placeholder="örnek: leo"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>

          <label>
            E-posta
            <input
              type="email"
              placeholder="mail@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label>
            Şifre
            <input
              type="password"
              placeholder="En az 6 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </label>

          <button type="submit" disabled={loading}>
            {loading ? "Hesap oluşturuluyor..." : "Hesap oluştur"}
          </button>
        </form>

        {message && <p className="auth-message">{message}</p>}

        <p className="auth-switch">
          Zaten hesabın var mı? <Link href="/login">Giriş yap</Link>
        </p>
      </section>
    </main>
  );
}