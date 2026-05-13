export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#07070b] text-white">
      <section className="relative flex min-h-screen items-center justify-center px-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,214,165,0.18),transparent_34%),radial-gradient(circle_at_bottom,rgba(180,120,255,0.12),transparent_38%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(7,7,11,0.2),rgba(7,7,11,0.95))]" />

        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <div className="mb-8 inline-flex rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs uppercase tracking-[0.35em] text-white/60">
            Private Launch
          </div>

          <h1 className="mb-8 text-5xl font-semibold tracking-[-0.04em] text-white md:text-7xl">
            DIARYNITY
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-xl leading-relaxed text-white/72 md:text-2xl">
            We are designing a future-oriented page that people will be interested in.
          </p>

          <p className="text-sm uppercase tracking-[0.3em] text-white/38">
            Built in Switzerland
          </p>
        </div>
      </section>
    </main>
  );
}