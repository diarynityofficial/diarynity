"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "../../lib/auth";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await loginUser({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setMessage("Giriş başarılı. Dashboard açılıyor...");

    setTimeout(() => {
      router.push("/dashboard");
    }, 700);
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <p className="auth-kicker">DIARYNITY</p>

        <h1>Hatıra arşivine geri dön</h1>

        <p className="auth-text">
          Yaşam kayıtlarına, özel notlarına ve saklamak istediğin anlara güvenli
          şekilde eriş.
        </p>

        <form onSubmit={handleLogin} className="auth-form">
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
              placeholder="Şifren"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <button type="submit" disabled={loading}>
            {loading ? "Giriş yapılıyor..." : "Giriş yap"}
          </button>
        </form>

        {message && <p className="auth-message">{message}</p>}

        <p className="auth-switch">
          Henüz hesabın yok mu? <Link href="/register">Hesap oluştur</Link>
        </p>
      </section>
    </main>
  );
}