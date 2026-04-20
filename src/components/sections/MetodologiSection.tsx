import SectionCard from "@/components/ui/SectionCard";
import SectionTitle from "@/components/ui/SectionTitle";

export default function MetodologiSection() {
  return (
    <section id="metodologi" className="max-w-7xl mx-auto px-6 py-20">
      <SectionTitle number="2.">Metodologi</SectionTitle>

      <SectionCard>
        <h3 className="text-xl font-semibold mb-6 text-[var(--accent-blue)]">
          Analisis Statistik Deskriptif
        </h3>

        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-semibold mb-3 text-[var(--text-primary)]">
              Ukuran Pemusatan
            </h4>
            <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
              <li>• Mean (rata-rata)</li>
              <li>• Median (nilai tengah)</li>
              <li>• Modus (nilai terbanyak)</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-[var(--text-primary)]">
              Ukuran Penyebaran
            </h4>
            <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
              <li>• Range (rentang)</li>
              <li>• Variance (varians)</li>
              <li>• Standard Deviation</li>
              <li>• Interquartile Range (IQR)</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-[var(--text-primary)]">
              Ukuran Bentuk
            </h4>
            <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
              <li>• Skewness (kemencengan)</li>
              <li>• Kurtosis (keruncingan)</li>
              <li>• Outlier detection</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 p-4 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border)]">
          <p className="text-sm text-[var(--text-secondary)]">
            <strong className="text-[var(--text-primary)]">Catatan:</strong>{" "}
            Semua perhitungan menggunakan metode standar statistik deskriptif.
            Outlier dideteksi menggunakan metode IQR dengan batas 1.5 × IQR dari
            Q1 dan Q3.
          </p>
        </div>
      </SectionCard>
    </section>
  );
}
