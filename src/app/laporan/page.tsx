"use client";

import { rawData } from "@/lib/data";
import { computeAllStats } from "@/lib/statistics";
import { generatePDFReport } from "@/lib/pdfGenerator";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import DatasetSection from "@/components/sections/DatasetSection";
import MetodologiSection from "@/components/sections/MetodologiSection";
import TabelStatistik from "@/components/sections/TabelStatistik";
import HistogramChart from "@/components/sections/HistogramChart";
import BoxplotChart from "@/components/sections/BoxplotChart";
import AnalisisNarasi from "@/components/sections/AnalisisNarasi";
import KesimpulanSection from "@/components/sections/KesimpulanSection";
import RekomendasiSection from "@/components/sections/RekomendasiSection";
import { BarChart3, TrendingUp, Search, Download } from "lucide-react";
import { useState } from "react";

export default function LaporanPage() {
  const allStats = computeAllStats(rawData);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      await generatePDFReport(allStats, rawData);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Terjadi kesalahan saat membuat PDF");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Floating Download Button - Hidden */}
      {/* <button
        onClick={handleDownloadPDF}
        disabled={isGenerating}
        className="fixed bottom-8 right-8 z-50 flex items-center gap-2 px-6 py-3 bg-[var(--accent-blue)] text-white rounded-full shadow-lg hover:bg-[var(--accent-cyan)] transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Download className="w-5 h-5" />
        <span className="font-semibold">
          {isGenerating ? "Membuat PDF..." : "Download PDF"}
        </span>
      </button> */}

      <HeroSection
        stats={allStats.map((s) => ({ variable: s.variable, mean: s.mean }))}
      />

      <DatasetSection />

      <MetodologiSection />

      {/* Hasil Section */}
      <section id="hasil" className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold mb-8 flex items-center gap-3">
          <span className="text-[var(--accent-blue)]">3.</span>
          <span>Hasil & Pembahasan</span>
        </h2>

        <div className="space-y-8">
          <div>
            <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
              <BarChart3 className="w-7 h-7 text-[var(--accent-blue)]" />
              <span>Statistik Deskriptif</span>
            </h3>
            <TabelStatistik stats={allStats} />
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
              <TrendingUp className="w-7 h-7 text-[var(--accent-cyan)]" />
              <span>Visualisasi Data</span>
            </h3>
            <div className="space-y-6">
              <HistogramChart data={rawData} stats={allStats} />
              <BoxplotChart stats={allStats} />
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
              <Search className="w-7 h-7 text-[var(--accent-gold)]" />
              <span>Analisis</span>
            </h3>
            <AnalisisNarasi stats={allStats} />
          </div>
        </div>
      </section>

      <KesimpulanSection stats={allStats} />

      <RekomendasiSection />
    </main>
  );
}
