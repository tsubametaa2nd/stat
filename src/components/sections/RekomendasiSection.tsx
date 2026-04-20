import SectionCard from "@/components/ui/SectionCard";
import SectionTitle from "@/components/ui/SectionTitle";
import {
  Rocket,
  Zap,
  Palette,
  Settings,
  Bell,
  Smartphone,
  Globe,
} from "lucide-react";

export default function RekomendasiSection() {
  const recommendations = [
    {
      priority: "HIGH",
      Icon: Rocket,
      title: "Optimasi Kecepatan Loading Aplikasi",
      description:
        "Implementasi lazy loading, code splitting, dan optimasi aset untuk meningkatkan performa aplikasi.",
      timeline: "Q2 2026",
      priorityColor: "bg-[var(--accent-red)]",
      iconColor: "text-[var(--accent-red)]",
    },
    {
      priority: "HIGH",
      Icon: Zap,
      title: "Peningkatan Responsivitas Sistem",
      description:
        "Optimasi query database, implementasi caching, dan peningkatan infrastruktur server.",
      timeline: "Q2 2026",
      priorityColor: "bg-[var(--accent-red)]",
      iconColor: "text-[var(--accent-red)]",
    },
    {
      priority: "MEDIUM",
      Icon: Palette,
      title: "Tingkatkan Konsistensi UI/UX",
      description:
        "Standardisasi design system, perbaikan navigasi, dan peningkatan accessibility.",
      timeline: "Q3 2026",
      priorityColor: "bg-[var(--accent-gold)]",
      iconColor: "text-[var(--accent-gold)]",
    },
    {
      priority: "MEDIUM",
      Icon: Settings,
      title: "Tambah Fitur yang Sering Diminta",
      description:
        "Implementasi fitur berdasarkan feedback pengguna dan analisis kebutuhan pasar.",
      timeline: "Q3 2026",
      priorityColor: "bg-[var(--accent-gold)]",
      iconColor: "text-[var(--accent-gold)]",
    },
    {
      priority: "MEDIUM",
      Icon: Bell,
      title: "Sistem Notifikasi Real-time",
      description:
        "Implementasi push notification dan real-time updates untuk meningkatkan engagement.",
      timeline: "Q3 2026",
      priorityColor: "bg-[var(--accent-gold)]",
      iconColor: "text-[var(--accent-gold)]",
    },
    {
      priority: "LOW",
      Icon: Smartphone,
      title: "Perkuat Dokumentasi Fitur",
      description:
        "Buat tutorial interaktif, video guide, dan FAQ komprehensif untuk membantu pengguna.",
      timeline: "Q4 2026",
      priorityColor: "bg-[var(--accent-cyan)]",
      iconColor: "text-[var(--accent-cyan)]",
    },
    {
      priority: "LOW",
      Icon: Globe,
      title: "Dukungan Multi-bahasa",
      description:
        "Implementasi internationalization (i18n) untuk menjangkau pengguna global.",
      timeline: "Q4 2026",
      priorityColor: "bg-[var(--accent-cyan)]",
      iconColor: "text-[var(--accent-cyan)]",
    },
  ];

  return (
    <section id="rekomendasi" className="max-w-7xl mx-auto px-6 py-20 mb-20">
      <SectionTitle number="6.">Rekomendasi</SectionTitle>

      <div className="mb-8 p-4 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg">
        <p className="text-[var(--text-secondary)]">
          Berdasarkan hasil analisis, berikut adalah rekomendasi perbaikan yang
          diprioritaskan untuk meningkatkan kualitas aplikasi dan kepuasan
          pengguna:
        </p>
      </div>

      <div className="space-y-4">
        {recommendations.map((rec, index) => {
          const IconComponent = rec.Icon;
          return (
            <SectionCard key={index}>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <IconComponent className={`w-8 h-8 ${rec.iconColor}`} />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold text-white ${rec.priorityColor}`}
                      >
                        {rec.priority}
                      </span>
                      <h3 className="text-lg font-semibold">{rec.title}</h3>
                    </div>
                    <p className="text-[var(--text-secondary)] text-sm mb-3">
                      {rec.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-[var(--text-muted)]">
                        Timeline:
                      </span>
                      <span className="px-2 py-1 bg-[var(--bg-secondary)] rounded text-[var(--accent-blue)] font-mono">
                        {rec.timeline}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </SectionCard>
          );
        })}
      </div>

      <SectionCard className="mt-8">
        <h3 className="text-lg font-semibold mb-3 text-[var(--accent-blue)]">
          Langkah Selanjutnya
        </h3>
        <div className="space-y-2 text-[var(--text-secondary)]">
          <p>
            • Prioritaskan implementasi rekomendasi HIGH untuk dampak maksimal
          </p>
          <p>
            • Lakukan monitoring berkelanjutan terhadap metrik kinerja aplikasi
          </p>
          <p>
            • Kumpulkan feedback pengguna secara regular untuk iterasi perbaikan
          </p>
          <p>
            • Review dan update roadmap setiap kuartal berdasarkan hasil
            evaluasi
          </p>
        </div>
      </SectionCard>
    </section>
  );
}
