"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../src/lib/supabaseClient";

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      router.push("/login");
      return;
    }

    setUser(user);

    const { data, error } = await supabase
      .from("memories")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setMemories([]);
    } else {
      setMemories(data || []);
    }

    setLoading(false);
  }

  return (
    <main className="dashboard-page">
      <section className="dashboard-hero">
        <div>
          <span className="dashboard-kicker">DIARYNITY DASHBOARD</span>
          <h1>Yaşam Arşivin</h1>
          <p>
            Sakladığın hatıralar, sessizce burada birikmeye başlar.
          </p>
        </div>

        <button onClick={() => router.push("/memories/new")}>
          Yeni Hatıra Ekle
        </button>
      </section>

      <section className="dashboard-section">
        <div className="dashboard-section-title">
          <h2>Son Hatıralar</h2>
          <p>{user?.email}</p>
        </div>

        {loading && <p className="dashboard-empty">Hatıralar yükleniyor...</p>}

        {!loading && memories.length === 0 && (
          <div className="dashboard-empty-card">
            <h3>Henüz bir hatıra eklenmedi.</h3>
            <p>
              İlk hatıranı ekleyerek DIARYNITY yaşam arşivini oluşturmaya
              başlayabilirsin.
            </p>
            <button onClick={() => router.push("/memories/new")}>
              İlk Hatırayı Ekle
            </button>
          </div>
        )}

        {!loading && memories.length > 0 && (
          <div className="memory-grid">
            {memories.map((memory) => (
              <article className="memory-card" key={memory.id}>
                {memory.photo_url && (
                  <img
                    src={memory.photo_url}
                    alt={memory.title}
                    className="memory-card-image"
                  />
                )}

                <div className="memory-card-body">
                  <div className="memory-card-meta">
                    <span>{memory.category || "memory"}</span>
                    <span>{memory.privacy}</span>
                  </div>

                  <h3>{memory.title}</h3>

                  <p>
                    {memory.content?.length > 140
                      ? memory.content.slice(0, 140) + "..."
                      : memory.content}
                  </p>

                  <button
                    onClick={() => router.push(`/memories/${memory.id}`)}
                  >
                    Hatırayı Aç
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}