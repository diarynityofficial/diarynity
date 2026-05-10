export default function HomePage() {
  return (
    <main className="home-page">
      <nav className="topbar">
        <div className="logo-wrap">
          <div className="logo">DIARYNITY</div>
          <div className="logo-sub">Private Life Archive</div>
        </div>

        <div className="menu">
          <a href="#">Keşfet</a>
          <a href="#">Giriş</a>
          <button className="join-btn">Kayıt Ol</button>
        </div>
      </nav>

      <section className="hero-layout">
        <div className="hero-left">
          <h1>Bir ömür nasıl yaşandı?</h1>

          <p className="subtitle">
            Hayatını kaydet. Hatıranı yaşat.
          </p>

          <form className="memory-form">
            <input type="text" placeholder="Adınız" />
            <input type="email" placeholder="E-posta adresiniz" />

            <textarea
              rows="4"
              placeholder="Bugünden küçük bir hatıra yazın..."
            />

            <button type="submit">Hatırayı Kaydet</button>
          </form>

          <div className="trust-row">
            <span>Özel günlük alanı</span>
            <span>PIN korumalı anılar</span>
            <span>Hatıra bahçesi</span>
          </div>

          <p className="quiet-note">
            Diarynity, hayatın küçük anlarını ve geleceğe bırakmak istediğin izleri
            saklamak için tasarlanmış kişisel bir hafıza alanıdır.
          </p>
        </div>

        <div className="hero-right">
          <div className="memory-orb"></div>
        </div>
      </section>
    </main>
  );
}