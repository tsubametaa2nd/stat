import SectionCard from "@/components/ui/SectionCard";
import SectionTitle from "@/components/ui/SectionTitle";

export default function DatasetSection() {
  return (
    <section id="dataset" className="max-w-7xl mx-auto px-6 py-20">
      <SectionTitle number="1.">Dataset</SectionTitle>

      <div className="grid md:grid-cols-2 gap-6">
        <SectionCard>
          <h3 className="text-xl font-semibold mb-4 text-[var(--accent-blue)]">
            Sumber Data
          </h3>
          <div className="space-y-3 text-[var(--text-secondary)]">
            <p>
              <strong className="text-[var(--text-primary)]">
                Jumlah Responden:
              </strong>{" "}
              100 orang
            </p>
            <p>
              <strong className="text-[var(--text-primary)]">
                Metode Pengumpulan:
              </strong>{" "}
              Kuesioner online
            </p>
            <p>
              <strong className="text-[var(--text-primary)]">Periode:</strong>{" "}
              Januari - Maret 2026
            </p>
            <p>
              <strong className="text-[var(--text-primary)]">Skala:</strong>{" "}
              Likert 1-5
            </p>
          </div>
        </SectionCard>

        <SectionCard>
          <h3 className="text-xl font-semibold mb-4 text-[var(--accent-cyan)]">
            Variabel Penelitian
          </h3>
          <ul className="space-y-2 text-[var(--text-secondary)]">
            <li className="flex items-start gap-2">
              <span className="text-[var(--accent-blue)]">•</span>
              <span>
                <strong className="text-[var(--text-primary)]">
                  Usability:
                </strong>{" "}
                Kemudahan penggunaan aplikasi
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--accent-blue)]">•</span>
              <span>
                <strong className="text-[var(--text-primary)]">UI/UX:</strong>{" "}
                Desain antarmuka dan pengalaman pengguna
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--accent-blue)]">•</span>
              <span>
                <strong className="text-[var(--text-primary)]">Speed:</strong>{" "}
                Kecepatan loading dan responsivitas
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--accent-blue)]">•</span>
              <span>
                <strong className="text-[var(--text-primary)]">
                  Features:
                </strong>{" "}
                Kelengkapan fitur aplikasi
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--accent-blue)]">•</span>
              <span>
                <strong className="text-[var(--text-primary)]">
                  Satisfaction:
                </strong>{" "}
                Kepuasan pengguna secara keseluruhan
              </span>
            </li>
          </ul>
        </SectionCard>
      </div>
    </section>
  );
}
