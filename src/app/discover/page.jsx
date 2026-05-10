export default function DiscoverPage() {
  return (
    <main className="discover-page">
      <section className="discover-shell">
        <div className="discover-hero">
          <p>DISCOVER</p>
          <h1>Yaşam arşivlerinden seçilmiş izler.</h1>
          <span>
            Diarynity’de herkese açık bırakılan profiller, anılar ve hayat hikâyeleri burada zarif bir keşif alanında toplanır.
          </span>
        </div>

        <section className="discover-grid">
          <article className="discover-card featured">
            <p>FEATURED LIFE</p>
            <h2>Bir ömrün sessiz notları</h2>
            <span>
              Küçük anılar, yıllar sonra bir hayatın en değerli parçalarına dönüşebilir.
            </span>
          </article>

          <article className="discover-card">
            <p>PUBLIC MEMORY</p>
            <h2>Luzern’de yağmurlu bir gün</h2>
            <span>
              Bazen şehirler insanın içindeki sessizliği daha görünür hale getirir.
            </span>
          </article>

          <article className="discover-card">
            <p>STORY</p>
            <h2>Bir aile albümünden kalanlar</h2>
            <span>
              Fotoğraflar yalnızca görüntü değil, geçmişle kurulan nazik bir bağdır.
            </span>
          </article>

          <article className="discover-card">
            <p>GARDEN</p>
            <h2>Hatıra bahçesinde küçük bir ışık</h2>
            <span>
              Ziyaretçiler bazen tek cümleyle bile bir arşive sıcaklık bırakır.
            </span>
          </article>
        </section>
      </section>
    </main>
  );
}