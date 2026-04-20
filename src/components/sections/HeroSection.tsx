import { VARIABLE_COLORS } from "@/types";

interface HeroSectionProps {
  stats: Array<{ variable: string; mean: number }>;
}

export default function HeroSection({ stats }: HeroSectionProps) {
  return (
    <section
      id="pendahuluan"
      className="min-h-screen flex flex-col items-center justify-center px-6 py-20 relative overflow-hidden"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Gradient mesh */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--accent-blue)] opacity-10 blur-3xl rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[var(--accent-cyan)] opacity-10 blur-3xl rounded-full" />

      <div className="relative z-10 text-center max-w-4xl">
        <div className="mb-8 inline-block px-4 py-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-full">
          <span className="text-sm text-[var(--text-secondary)]">
            Statistika Deskriptif • 2026
          </span>
        </div>

        <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
          Analisis Statistik
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-cyan)]">
            Deskriptif Aplikasi
          </span>
        </h1>

        <p className="text-xl text-[var(--text-secondary)] mb-4">
          Studi Kuesioner 100 Responden
        </p>

        <div className="mb-12 text-[var(--text-muted)]">
          <p>Mata Kuliah: Statistika Deskriptif</p>
          <p>Universitas Nasional</p>
          <p>April 2026</p>
        </div>

        {/* Variable cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-16">
          {stats.map((stat, index) => (
            <div
              key={stat.variable}
              className="hero-card bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-4 hover:scale-105 transition-transform"
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <div
                className="w-3 h-3 rounded-full mb-2 mx-auto"
                style={{ backgroundColor: VARIABLE_COLORS[stat.variable] }}
              />
              <div className="text-xs text-[var(--text-secondary)] mb-1">
                {stat.variable}
              </div>
              <div className="text-2xl font-bold">{stat.mean.toFixed(2)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
