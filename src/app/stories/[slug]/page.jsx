export default function StoryDetailPage() {
  return (
    <main className="story-detail-page">
      <article className="story-detail-card">
        <a href="/stories" className="back-link">
          ← Stories
        </a>

        <p className="story-detail-kicker">LIFE STORY</p>

        <h1>Bir aile evinden kalan sesler</h1>

        <p className="story-detail-summary">
          Bazı evler yalnızca duvarlardan oluşmaz. İçlerinde yaşayan insanların
          sessiz izlerini de taşımaya devam ederler.
        </p>

        <div className="story-detail-meta">
          <span>Family Memory</span>
          <span>6 dakika okuma</span>
        </div>

        <div className="story-detail-body">
          <p>
            Yıllar geçtikten sonra bile bazı sesler insanın içinde yaşamaya devam eder.
            Eski bir kapının açılışı, mutfaktan gelen bir tabak sesi veya geceleri
            duyulan hafif bir radyo uğultusu gibi.
          </p>

          <p>
            O ev artık aynı insanlar tarafından kullanılmasa bile, hafızada hâlâ
            canlıdır. Çünkü bazı mekânlar yalnızca fiziksel alan değil, kişisel
            zaman kapsülleridir.
          </p>

          <p>
            Diarynity Stories tam olarak bu küçük insan izlerini kaybetmemek için
            vardır. Sessiz anıları görünür kılmak için.
          </p>
        </div>
      </article>
    </main>
  );
}