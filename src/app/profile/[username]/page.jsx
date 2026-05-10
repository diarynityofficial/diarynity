export default function ProfilePage() {
  return (
    <main className="profile-page">
      <section className="profile-shell">

        <div className="profile-top">
          <div className="profile-avatar"></div>

          <div className="profile-info">
            <p className="profile-kicker">PUBLIC LIFE ARCHIVE</p>

            <h1>Ahmet Yılmaz</h1>

            <span>
              1984 — Devam ediyor
            </span>

            <p className="profile-bio">
              Hayatın küçük anlarını, sessiz düşüncelerini ve geleceğe bırakmak istediği izleri saklayan kişisel bir arşiv.
            </p>
          </div>
        </div>

        <div className="profile-stats">

          <div className="profile-stat-card">
            <strong>42</strong>
            <span>Hatıra</span>
          </div>

          <div className="profile-stat-card">
            <strong>12</strong>
            <span>Fotoğraf</span>
          </div>

          <div className="profile-stat-card">
            <strong>3</strong>
            <span>Ses Kaydı</span>
          </div>

        </div>

        <section className="profile-memories">

          <div className="profile-memory-card">
            <p>9 Mayıs 2026</p>

            <h2>
              Bir yaz akşamından kalan küçük bir hatıra
            </h2>

            <span>
              Sessiz, küçük ve içimde iz bırakan bir andı.
            </span>
          </div>

          <div className="profile-memory-card">
            <p>2 Mayıs 2026</p>

            <h2>
              Luzern’de yağmurlu bir gün
            </h2>

            <span>
              Bazen şehirler insanın ruh halini yansıtır.
            </span>
          </div>

        </section>

      </section>
    </main>
  );
}