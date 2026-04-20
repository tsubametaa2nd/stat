import { DescriptiveStats } from "@/types";
import SectionCard from "@/components/ui/SectionCard";
import SectionTitle from "@/components/ui/SectionTitle";
import {
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Search,
  Zap,
} from "lucide-react";

interface KesimpulanSectionProps {
  stats: DescriptiveStats[];
}

export default function KesimpulanSection({ stats }: KesimpulanSectionProps) {
  const avgMean = stats.reduce((sum, s) => sum + s.mean, 0) / stats.length;
  const avgStdDev = stats.reduce((sum, s) => sum + s.stdDev, 0) / stats.length;
  const totalOutliers = stats.reduce((sum, s) => sum + s.outliers.length, 0);
  const highestStat = stats.reduce((max, s) => (s.mean > max.mean ? s : max));
  const lowestStat = stats.reduce((min, s) => (s.mean < min.mean ? s : min));

  const conclusions = [
    {
      Icon: CheckCircle,
      title: "Kepuasan Pengguna Tinggi",
      description: `Rata-rata keseluruhan ${avgMean.toFixed(2)} menunjukkan penilaian yang positif dari responden.`,
      badge: "Positif",
      badgeColor: "bg-[var(--accent-green)]",
      iconColor: "text-[var(--accent-green)]",
    },
    {
      Icon: highestStat.mean > 3.8 ? CheckCircle : AlertTriangle,
      title: `${highestStat.variable} Mendapat Penilaian Tertinggi`,
      description: `Dengan rata-rata ${highestStat.mean.toFixed(2)}, aspek ini menjadi kekuatan utama aplikasi.`,
      badge: highestStat.category,
      badgeColor:
        highestStat.mean > 3.8
          ? "bg-[var(--accent-green)]"
          : "bg-[var(--accent-gold)]",
      iconColor:
        highestStat.mean > 3.8
          ? "text-[var(--accent-green)]"
          : "text-[var(--accent-gold)]",
    },
    {
      Icon: lowestStat.mean < 3.4 ? AlertTriangle : BarChart3,
      title: `${lowestStat.variable} Perlu Perhatian`,
      description: `Dengan rata-rata ${lowestStat.mean.toFixed(2)}, aspek ini memerlukan perbaikan prioritas.`,
      badge: lowestStat.category,
      badgeColor:
        lowestStat.mean < 3.4
          ? "bg-[var(--accent-red)]"
          : "bg-[var(--accent-gold)]",
      iconColor:
        lowestStat.mean < 3.4
          ? "text-[var(--accent-red)]"
          : "text-[var(--accent-gold)]",
    },
    {
      Icon: BarChart3,
      title: avgStdDev < 0.8 ? "Konsistensi Tinggi" : "Variasi Sedang",
      description: `Standar deviasi rata-rata ${avgStdDev.toFixed(2)} menunjukkan ${
        avgStdDev < 0.8 ? "konsensus yang kuat" : "keberagaman pendapat"
      } di antara responden.`,
      badge: avgStdDev < 0.8 ? "Konsisten" : "Beragam",
      badgeColor:
        avgStdDev < 0.8
          ? "bg-[var(--accent-green)]"
          : "bg-[var(--accent-gold)]",
      iconColor:
        avgStdDev < 0.8
          ? "text-[var(--accent-green)]"
          : "text-[var(--accent-gold)]",
    },
    {
      Icon: totalOutliers < 5 ? Search : Zap,
      title: `${totalOutliers < 5 ? "Minimal" : "Beberapa"} Outlier Terdeteksi`,
      description: `Sebanyak ${totalOutliers} dari 500 data poin (${((totalOutliers / 500) * 100).toFixed(1)}%) merupakan outlier.`,
      badge:
        totalOutliers < 5
          ? "< 1%"
          : `${((totalOutliers / 500) * 100).toFixed(1)}%`,
      badgeColor:
        totalOutliers < 5
          ? "bg-[var(--accent-green)]"
          : "bg-[var(--accent-gold)]",
      iconColor:
        totalOutliers < 5
          ? "text-[var(--accent-green)]"
          : "text-[var(--accent-gold)]",
    },
  ];

  return (
    <section id="kesimpulan" className="max-w-7xl mx-auto px-6 py-20">
      <SectionTitle number="5.">Kesimpulan</SectionTitle>

      <div className="grid md:grid-cols-2 gap-6">
        {conclusions.map((conclusion, index) => {
          const IconComponent = conclusion.Icon;
          return (
            <SectionCard key={index}>
              <div className="flex items-start gap-4">
                <IconComponent
                  className={`w-10 h-10 ${conclusion.iconColor}`}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">
                      {conclusion.title}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded text-xs text-white ${conclusion.badgeColor}`}
                    >
                      {conclusion.badge}
                    </span>
                  </div>
                  <p className="text-[var(--text-secondary)] text-sm">
                    {conclusion.description}
                  </p>
                </div>
              </div>
            </SectionCard>
          );
        })}
      </div>

      <SectionCard className="mt-6">
        <h3 className="text-lg font-semibold mb-3 text-[var(--accent-blue)]">
          Ringkasan Eksekutif
        </h3>
        <p className="text-[var(--text-secondary)] leading-relaxed">
          Berdasarkan analisis statistik deskriptif terhadap 100 responden
          dengan 5 variabel pengukuran, dapat disimpulkan bahwa aplikasi
          mendapat penilaian yang {avgMean > 3.5 ? "positif" : "cukup baik"}{" "}
          secara keseluruhan. Aspek{" "}
          <strong className="text-[var(--text-primary)]">
            {highestStat.variable}
          </strong>{" "}
          menjadi kekuatan utama, sementara{" "}
          <strong className="text-[var(--text-primary)]">
            {lowestStat.variable}
          </strong>{" "}
          memerlukan perhatian khusus untuk meningkatkan kepuasan pengguna
          secara menyeluruh.
        </p>
      </SectionCard>
    </section>
  );
}
