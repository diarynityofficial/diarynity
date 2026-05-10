export default function StoriesPage() {
  return (
    <main className="stories-page">
      <section className="stories-shell">
        <div className="stories-hero">
          <p>LIFE STORIES</p>
          <h1>Yaşanmış hayatlardan zarif hikâyeler.</h1>
          <span>
            Diarynity Stories; insanların geride bırakmak istediği anıları,
            yaşam parçalarını ve kişisel hikâyelerini sakin bir arşiv diliyle sunar.
          </span>
        </div>

        <section className="stories-grid">
          <article className="story-card">
            <p>FEATURED STORY</p>
            <h2>Bir aile evinden kalan sesler</h2>
            <span>
              Eski bir ev, bazen içinde yaşayanlardan daha uzun süre hatırlamaya devam eder.
            </span>
            <a href="/stories/bir-aile-evinden-kalan-sesler">Hikâyeyi oku</a>
          </article>

          <article className="story-card">
            <p>MEMORY</p>
            <h2>Çocukluk defterindeki son sayfa</h2>
            <span>
              Küçük bir defter, yıllar sonra unutulan bir benliği yeniden görünür kılar.
            </span>
            <a href="/stories/cocukluk-defterindeki-son-sayfa">Hikâyeyi oku</a>
          </article>

          <article className="story-card">
            <p>LEGACY</p>
            <h2>Dedemin hiç göndermediği mektup</h2>
            <span>
              Bazı cümleler zamanında ulaşmaz, fakat yıllar sonra bile kalbe dokunur.
            </span>
            <a href="/stories/dedemin-hic-gondermedigi-mektup">Hikâyeyi oku</a>
          </article>
        </section>
      </section>
    </main>
  );
}