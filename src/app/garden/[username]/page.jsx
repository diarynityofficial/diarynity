export default function GardenPage() {
  return (
    <main className="garden-page">
      <section className="garden-shell">
        <a href="/profile/test" className="back-link">
          ← Profile dön
        </a>

        <div className="garden-hero">
          <p className="garden-kicker">MEMORY GARDEN</p>

          <h1>Ahmet’in Hatıra Bahçesi</h1>

          <p>
            Burada ziyaretçiler sevgiyle bir çiçek bırakabilir, kısa bir mesaj
            yazabilir veya bu yaşam arşivine küçük bir iz ekleyebilir.
          </p>
        </div>

        <section className="garden-scene">
          <div className="garden-sky"></div>

          <div className="garden-ground">
            <div className="flower flower-one"></div>
            <div className="flower flower-two"></div>
            <div className="flower flower-three"></div>

            <div className="garden-bench"></div>
          </div>
        </section>

        <section className="garden-actions">
          <div className="garden-action-card">
            <h2>Çiçek Bırak</h2>
            <p>Bahçeye küçük ve zarif bir hatıra çiçeği ekleyin.</p>
            <button>Çiçek Ekle</button>
          </div>

          <div className="garden-action-card">
            <h2>Mesaj Yaz</h2>
            <p>Kısa, saygılı ve sıcak bir ziyaretçi mesajı bırakın.</p>
            <button>Mesaj Bırak</button>
          </div>

          <div className="garden-action-card">
            <h2>Işık Yak</h2>
            <p>Bu hatıra alanında sessiz bir ışık sembolü bırakın.</p>
            <button>Işık Ekle</button>
          </div>
        </section>
      </section>
    </main>
  );
}