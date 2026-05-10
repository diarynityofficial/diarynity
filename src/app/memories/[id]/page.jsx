"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";

export default function MemoryDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [memory, setMemory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadMemory();
  }, [id]);

  async function loadMemory() {
    setLoading(true);
    setMessage("");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      router.push("/login");
      return;
    }

    const { data, error } = await supabase
      .from("memories")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error) {
      console.error(error);
      setMessage("Bu hatıra bulunamadı veya erişim iznin yok.");
      setMemory(null);
    } else {
      setMemory(data);
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <main className="memory-detail-page">
        <p className="dashboard-empty">Hatıra yükleniyor...</p>
      </main>
    );
  }

  if (message) {
    return (
      <main className="memory-detail-page">
        <p className="dashboard-empty">{message}</p>
      </main>
    );
  }

  return (
    <main className="memory-detail-page">
      <article className="memory-detail-shell">
        {memory.photo_url && (
          <div className="memory-detail-image-wrap">
            <img
              src={memory.photo_url}
              alt={memory.title}
              className="memory-detail-image"
            />
          </div>
        )}

        <div className="memory-detail-content">
          <span className="memory-detail-kicker">
            {memory.category || "memory"}
          </span>

          <h1>{memory.title}</h1>

          <div className="memory-detail-meta">
            {memory.memory_date && (
              <span>
                {new Date(memory.memory_date).toLocaleDateString("tr-TR")}
              </span>
            )}

            {memory.location && <span>{memory.location}</span>}

            {memory.mood && <span>{memory.mood}</span>}

            {memory.privacy && <span>{memory.privacy}</span>}
          </div>

          <p className="memory-detail-text">{memory.content}</p>

          <button
            className="memory-detail-back"
            onClick={() => router.push("/dashboard")}
          >
            Dashboard’a Dön
          </button>
        </div>
      </article>
    </main>
  );
}