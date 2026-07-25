import SectionCard from "@/components/ui/SectionCard";
import SectionTitle from "@/components/ui/SectionTitle";
import { BookOpen, Sigma, Percent, AlertCircle, Activity } from "lucide-react";

export default function MetodologiSection() {
  return (
    <section id="metodologi" className="max-w-7xl mx-auto px-6 py-20 border-b border-[var(--border)]/40">
      <SectionTitle number="2.">Metodologi & Landasan Teori</SectionTitle>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Pemusatan */}
        <SectionCard className="flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-[var(--accent-blue)]/10 rounded-lg text-[var(--accent-blue)]">
                <Sigma className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-100">Ukuran Pemusatan</h3>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mb-4 leading-relaxed">
              Mengidentifikasi nilai tunggal yang mewakili pusat distribusi data observasi.
            </p>

            <ul className="space-y-3 text-xs text-[var(--text-secondary)] font-mono">
              <li className="flex flex-col gap-1 p-2 bg-slate-950/50 rounded-lg border border-slate-900/60">
                <span className="font-bold text-slate-200">Rata-rata (Mean) — x̄</span>
                <span>x̄ = Σx_i / n</span>
              </li>
              <li className="flex flex-col gap-1 p-2 bg-slate-950/50 rounded-lg border border-slate-900/60">
                <span className="font-bold text-slate-200">Nilai Tengah (Median) — Me</span>
                <span>Nilai posisi tengah data terurut.</span>
              </li>
              <li className="flex flex-col gap-1 p-2 bg-slate-950/50 rounded-lg border border-slate-900/60">
                <span className="font-bold text-slate-200">Modus — Mo</span>
                <span>Nilai dengan frekuensi tertinggi.</span>
              </li>
            </ul>
          </div>
        </SectionCard>

        {/* Card 2: Penyebaran */}
        <SectionCard className="flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-[var(--accent-cyan)]/10 rounded-lg text-[var(--accent-cyan)]">
                <Percent className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-100">Ukuran Penyebaran</h3>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mb-4 leading-relaxed">
              Sejauh mana nilai-nilai observasi menyebar dari rata-rata hitungnya.
            </p>

            <ul className="space-y-3 text-xs text-[var(--text-secondary)] font-mono">
              <li className="flex flex-col gap-1 p-2 bg-slate-950/50 rounded-lg border border-slate-900/60">
                <span className="font-bold text-slate-200">Standar Deviasi — s</span>
                <span>s = √[ Σ(x_i - x̄)² / (n - 1) ]</span>
              </li>
              <li className="flex flex-col gap-1 p-2 bg-slate-950/50 rounded-lg border border-slate-900/60">
                <span className="font-bold text-slate-200">Varians — s²</span>
                <span>Kuadrat simpangan baku (df = n - 1).</span>
              </li>
              <li className="flex flex-col gap-1 p-2 bg-slate-950/50 rounded-lg border border-slate-900/60">
                <span className="font-bold text-slate-200">Rentang Kuartil — IQR</span>
                <span>IQR = Q₃ - Q₁</span>
              </li>
            </ul>
          </div>
        </SectionCard>

        {/* Card 3: Bentuk */}
        <SectionCard className="flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-[var(--accent-gold)]/10 rounded-lg text-[var(--accent-gold)]">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-100">Bentuk Distribusi</h3>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mb-4 leading-relaxed">
              Mengukur kelengkungan bentuk kurva frekuensi dan anomali data.
            </p>

            <ul className="space-y-3 text-xs text-[var(--text-secondary)] font-mono">
              <li className="flex flex-col gap-1 p-2 bg-slate-950/50 rounded-lg border border-slate-900/60">
                <span className="font-bold text-slate-200">Skewness (Kemencengan)</span>
                <span>Mengukur ketidaksimetrisan kurva.</span>
              </li>
              <li className="flex flex-col gap-1 p-2 bg-slate-950/50 rounded-lg border border-slate-900/60">
                <span className="font-bold text-slate-200">Kurtosis (Keruncingan)</span>
                <span>Ketinggian puncak kurva frekuensi.</span>
              </li>
              <li className="flex flex-col gap-1 p-2 bg-slate-950/50 rounded-lg border border-slate-900/60">
                <span className="font-bold text-[var(--accent-red)]">Outlier (Aturan Tukey)</span>
                <span className="text-[10px] text-slate-300">Pagar: [Q₁ - 1.5×IQR, Q₃ + 1.5×IQR]</span>
              </li>
            </ul>
          </div>
        </SectionCard>

        {/* Card 4: ANOVA & Derajat Bebas */}
        <SectionCard className="flex flex-col justify-between border-l-4 border-l-[var(--accent-blue)]">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-[var(--accent-blue)]/10 rounded-lg text-[var(--accent-blue)]">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-100">Uji Hipotesis (ANOVA)</h3>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mb-4 leading-relaxed">
              Menguji kesamaan rerata antar k kelompok dengan evaluasi variansi (F-test).
            </p>

            <ul className="space-y-3 text-xs text-[var(--text-secondary)] font-mono">
              <li className="flex flex-col gap-1 p-2 bg-slate-950/50 rounded-lg border border-slate-900/60">
                <span className="font-bold text-[var(--accent-blue)]">Derajat Bebas (df)</span>
                <span>df_Between = k - 1</span>
                <span>df_Within = N - k</span>
                <span>df_Total = N - 1</span>
              </li>
              <li className="flex flex-col gap-1 p-2 bg-slate-950/50 rounded-lg border border-slate-900/60">
                <span className="font-bold text-slate-200">Rerata Kuadrat (MS)</span>
                <span>MS_Between = SS_Between / df_Between</span>
                <span>MS_Within = SS_Within / df_Within</span>
              </li>
              <li className="flex flex-col gap-1 p-2 bg-slate-950/50 rounded-lg border border-slate-900/60">
                <span className="font-bold text-[var(--accent-cyan)]">F-Statistik</span>
                <span>F = MS_Between / MS_Within</span>
              </li>
            </ul>
          </div>
        </SectionCard>
      </div>

      {/* Note footer */}
      <div className="mt-6 p-4 bg-slate-950/30 rounded-xl border border-slate-900 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-[var(--accent-blue)] flex-shrink-0 mt-0.5" />
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
          <strong className="text-slate-200">Keterangan Teknis:</strong> Seluruh pengolahan data numerik 
          dihitung secara real-time pada browser menggunakan metode sampel statistik bebas bias (unbiased variance estimator, 
          derajat kebebasan df = n-1 untuk simpangan baku dan varians, serta df_between = k-1 dan df_within = N-k untuk ANOVA). Deteksi pencilan (outliers) dihitung secara eksklusif menggunakan metode IQR Pagar Luar/Dalam Tukey.
        </p>
      </div>
    </section>
  );
}

