"use client";

import { useMemo, useState } from "react";
import { AnovaResult, getVariableColor } from "@/types";
import {
  Info,
  HelpCircle,
  Activity,
  CheckCircle2,
  AlertCircle,
  Calculator,
  Layers,
  Sigma,
  BookOpen,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import SectionCard from "@/components/ui/SectionCard";

interface AnovaSectionProps {
  anovaData: AnovaResult | null;
}

export default function AnovaSection({ anovaData }: AnovaSectionProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeCalcTab, setActiveCalcTab] = useState<"df" | "ss" | "ms" | "f">("df");

  // Find overall min and max for CI interval plot scaling
  const { minVal, maxVal } = useMemo(() => {
    if (!anovaData?.groupStats.length) return { minVal: 1, maxVal: 5 };
    
    const allLowers = anovaData.groupStats.map((s) => s.ciLower);
    const allUppers = anovaData.groupStats.map((s) => s.ciUpper);
    
    const absoluteMin = Math.min(...allLowers);
    const absoluteMax = Math.max(...allUppers);
    const range = absoluteMax - absoluteMin;
    
    // Add 15% buffer top and bottom
    const buffer = range === 0 ? 0.5 : range * 0.15;
    return {
      minVal: absoluteMin - buffer,
      maxVal: absoluteMax + buffer,
    };
  }, [anovaData]);

  // Scale Y coordinate (300 to 60)
  const scaleY = (value: number) => {
    const range = maxVal - minVal;
    if (range === 0) return 180;
    return 300 - ((value - minVal) / range) * 240;
  };

  // Generate 5 ticks
  const ticks = useMemo(() => {
    const range = maxVal - minVal;
    return Array.from({ length: 5 }, (_, i) => minVal + (range * i) / 4);
  }, [minVal, maxVal]);

  if (!anovaData) return null;

  const {
    dfBetween,
    dfWithin,
    dfTotal,
    ssBetween,
    ssWithin,
    ssTotal,
    msBetween,
    msWithin,
    fStatistic,
    pValue,
    isSignificant,
    groupStats,
    pairwiseComparisons,
    interpretation,
  } = anovaData;

  const k = groupStats.length;
  const totalN = anovaData.totalN || groupStats.reduce((sum, g) => sum + g.n, 0);
  const grandMean =
    anovaData.grandMean ||
    groupStats.reduce((sum, g) => sum + g.mean * g.n, 0) / (totalN || 1);

  const formatPValue = (p: number) => {
    if (p < 0.001) return p.toExponential(3);
    return p.toFixed(4);
  };

  return (
    <section id="anova-section-container" className="space-y-8 mt-12">
      <div className="flex items-center gap-3">
        <Activity className="w-8 h-8 text-[var(--accent-blue)]" />
        <div>
          <h2 className="text-3xl font-bold text-slate-100 tracking-tight">
            Analisis Variansi (ANOVA)
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mt-0.5">
            Uji komparatif untuk mengetahui apakah terdapat perbedaan rata-rata yang signifikan secara statistik di antara semua variabel.
          </p>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SectionCard className="flex items-center gap-4 border-l-4 border-l-[var(--accent-blue)]">
          <div className="p-3 bg-[var(--accent-blue)]/10 rounded-xl">
            <span className="font-mono text-xl font-bold text-[var(--accent-blue)]">F</span>
          </div>
          <div>
            <p className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">F-Statistik (F-Hitung)</p>
            <p className="text-2xl font-black text-slate-100 font-mono mt-0.5">{fStatistic.toFixed(3)}</p>
          </div>
        </SectionCard>

        <SectionCard className="flex items-center gap-4 border-l-4 border-l-[var(--accent-cyan)]">
          <div className="p-3 bg-[var(--accent-cyan)]/10 rounded-xl">
            <span className="font-mono text-xl font-bold text-[var(--accent-cyan)]">P</span>
          </div>
          <div>
            <p className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">P-Value (Signifikansi)</p>
            <p className="text-2xl font-black text-slate-100 font-mono mt-0.5">{formatPValue(pValue)}</p>
          </div>
        </SectionCard>

        <SectionCard 
          className={`flex items-center gap-4 border-l-4 ${
            isSignificant ? "border-l-[var(--accent-green)]" : "border-l-[var(--text-muted)]"
          }`}
        >
          <div className="p-3 rounded-xl bg-slate-900/60">
            {isSignificant ? (
              <CheckCircle2 className="w-6 h-6 text-[var(--accent-green)]" />
            ) : (
              <AlertCircle className="w-6 h-6 text-[var(--text-secondary)]" />
            )}
          </div>
          <div>
            <p className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">Hasil Pengujian (α = 0.05)</p>
            <p 
              className={`text-sm font-bold mt-1 uppercase tracking-wide ${
                isSignificant ? "text-[var(--accent-green)]" : "text-[var(--text-secondary)]"
              }`}
            >
              {isSignificant ? "Perbedaan Signifikan" : "Tidak Ada Perbedaan Nyata"}
            </p>
          </div>
        </SectionCard>
      </div>

      {/* SVG Mean Interval Plot */}
      <SectionCard id="anova-plot-card">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-100 tracking-tight">
              Interval Plot Rata-rata & 95% CI
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Visualisasi titik rata-rata (mean) dengan bilah rentang interval kepercayaan 95%.
            </p>
          </div>
          {hoveredIndex !== null && (
            <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300">
              <span className="font-bold text-[var(--accent-blue)]">{groupStats[hoveredIndex].name}</span>:{" "}
              Mean={groupStats[hoveredIndex].mean.toFixed(2)} |{" "}
              95% CI=[{groupStats[hoveredIndex].ciLower.toFixed(2)}, {groupStats[hoveredIndex].ciUpper.toFixed(2)}]
            </div>
          )}
        </div>

        <div className="relative bg-slate-950/40 border border-slate-900/60 rounded-xl p-4 overflow-hidden">
          <svg
            width="100%"
            height="320"
            viewBox="0 0 800 360"
            preserveAspectRatio="xMidYMid meet"
            className="mx-auto"
            id="anova-interval-plot-svg"
          >
            {/* Grid lines */}
            <g>
              {ticks.map((tickVal, index) => {
                const y = scaleY(tickVal);
                return (
                  <g key={index}>
                    <line
                      x1="80"
                      y1={y}
                      x2="760"
                      y2={y}
                      stroke="rgba(255, 255, 255, 0.03)"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                    <text
                      x="65"
                      y={y + 4}
                      textAnchor="end"
                      fill="var(--text-muted)"
                      className="font-mono"
                      fontSize="10"
                    >
                      {tickVal.toFixed(2)}
                    </text>
                  </g>
                );
              })}
            </g>

            {/* Y-axis label */}
            <text
              x="20"
              y="180"
              textAnchor="middle"
              fill="var(--text-muted)"
              fontSize="10"
              fontWeight="bold"
              transform="rotate(-90, 20, 180)"
            >
              RATA-RATA PENILAIAN
            </text>

            {/* Plot Data Points & Interval Bars */}
            {groupStats.map((g, index) => {
              const totalGroups = groupStats.length;
              const chartWidth = 680; // 760 - 80
              const spacing = chartWidth / totalGroups;
              const x = 80 + spacing * index + spacing / 2;
              
              const yMean = scaleY(g.mean);
              const yLower = scaleY(g.ciLower);
              const yUpper = scaleY(g.ciUpper);
              
              const color = getVariableColor(g.name, index);
              const isHovered = hoveredIndex === index;

              return (
                <g
                  key={g.name}
                  className="cursor-pointer group"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Confidence Interval Line */}
                  <line
                    x1={x}
                    y1={yLower}
                    x2={x}
                    y2={yUpper}
                    stroke={color}
                    strokeWidth={isHovered ? "3.5" : "2"}
                    className="transition-all"
                  />

                  {/* Top Cap */}
                  <line
                    x1={x - 10}
                    y1={yUpper}
                    x2={x + 10}
                    y2={yUpper}
                    stroke={color}
                    strokeWidth={isHovered ? "3" : "1.5"}
                    className="transition-all"
                  />

                  {/* Bottom Cap */}
                  <line
                    x1={x - 10}
                    y1={yLower}
                    x2={x + 10}
                    y2={yLower}
                    stroke={color}
                    strokeWidth={isHovered ? "3" : "1.5"}
                    className="transition-all"
                  />

                  {/* Center Dot (Mean) */}
                  <circle
                    cx={x}
                    cy={yMean}
                    r={isHovered ? "8" : "5.5"}
                    fill={color}
                    stroke="var(--bg-primary)"
                    strokeWidth="2"
                    className="transition-all"
                  />

                  {/* Label (Variable name) */}
                  <text
                    x={x}
                    y="335"
                    textAnchor="middle"
                    fill={isHovered ? "var(--text-primary)" : "var(--text-secondary)"}
                    fontSize="11"
                    fontWeight="bold"
                    className="transition-colors"
                  >
                    {g.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </SectionCard>

      {/* Tables section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Table 1: Standard ANOVA Table */}
        <SectionCard className="flex flex-col justify-between">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-md font-bold text-slate-100">Tabel Ringkasan ANOVA</h3>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">Format standar APA (American Psychological Association).</p>
              </div>
              <span className="text-[10px] font-mono px-2 py-1 bg-slate-900 border border-slate-800 text-[var(--accent-blue)] rounded-lg">
                df = ({dfBetween}, {dfWithin})
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-900 text-[var(--text-muted)] font-mono uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-3 font-semibold text-slate-400">Sumber Variasi</th>
                    <th className="py-3 px-3 text-center font-semibold">SS (Jml Kuadrat)</th>
                    <th className="py-3 px-3 text-center font-semibold text-[var(--accent-blue)]">df (Derajat Bebas)</th>
                    <th className="py-3 px-3 text-center font-semibold">MS (Rerata Kuadrat)</th>
                    <th className="py-3 px-3 text-center font-semibold">F-Hitung</th>
                    <th className="py-3 px-3 text-center font-semibold">P-Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900/50 font-medium">
                  <tr className="hover:bg-slate-900/20 transition-colors">
                    <td className="py-3 px-3 text-slate-200 font-semibold">
                      Antar Kelompok (Between)
                      <span className="block text-[10px] text-[var(--text-muted)] font-normal">k - 1</span>
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-slate-300">{ssBetween.toFixed(3)}</td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-[var(--accent-blue)] bg-[var(--accent-blue)]/5">{dfBetween}</td>
                    <td className="py-3 px-3 text-center font-mono text-slate-300">{msBetween.toFixed(3)}</td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-[var(--accent-blue)]" rowSpan={2}>{fStatistic.toFixed(3)}</td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-[var(--accent-cyan)]" rowSpan={2}>{formatPValue(pValue)}</td>
                  </tr>
                  <tr className="hover:bg-slate-900/20 transition-colors">
                    <td className="py-3 px-3 text-slate-200 font-semibold">
                      Dalam Kelompok (Within)
                      <span className="block text-[10px] text-[var(--text-muted)] font-normal">N - k</span>
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-slate-300">{ssWithin.toFixed(3)}</td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-[var(--accent-blue)] bg-[var(--accent-blue)]/5">{dfWithin}</td>
                    <td className="py-3 px-3 text-center font-mono text-slate-300">{msWithin.toFixed(3)}</td>
                  </tr>
                  <tr className="hover:bg-slate-900/20 transition-colors bg-slate-900/10 font-bold border-t border-slate-900">
                    <td className="py-3 px-3 text-slate-100 font-bold">
                      Total
                      <span className="block text-[10px] text-[var(--text-muted)] font-normal">N - 1</span>
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-slate-200">{ssTotal.toFixed(3)}</td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-[var(--accent-blue)] bg-[var(--accent-blue)]/5">{dfTotal}</td>
                    <td className="py-3 px-3 text-center font-mono text-slate-200"></td>
                    <td className="py-3 px-3 text-center font-mono text-slate-200"></td>
                    <td className="py-3 px-3 text-center font-mono text-slate-200"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6 p-4 bg-slate-950/40 border border-slate-900/60 rounded-xl flex items-start gap-2 text-[11px]">
            <Info className="w-4 h-4 text-[var(--accent-blue)] flex-shrink-0 mt-0.5" />
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Uji F ANOVA mengevaluasi rasio variabilitas antar variabel (MS Between) dibanding variabilitas di dalam individu (MS Within). F yang tinggi dan p-value &lt; 0.05 membuktikan perbedaan antar rata-rata tidak terjadi karena faktor kebetulan belaka.
            </p>
          </div>
        </SectionCard>

        {/* Table 2: Pairwise Comparisons */}
        <SectionCard className="flex flex-col justify-between">
          <div>
            <div className="mb-4 flex justify-between items-center">
              <div>
                <h3 className="text-md font-bold text-slate-100">Perbandingan Berpasangan (Post-Hoc)</h3>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">Uji t berpasangan dengan Koreksi Bonferroni.</p>
              </div>
            </div>

            <div className="overflow-x-auto max-h-[260px] overflow-y-auto pr-1">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="sticky top-0 bg-[var(--bg-secondary)] z-10">
                  <tr className="border-b border-slate-900 text-[var(--text-muted)] font-mono uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-3 font-semibold text-slate-400">Perbandingan</th>
                    <th className="py-2.5 px-3 text-center font-semibold">Selisih Mean</th>
                    <th className="py-2.5 px-3 text-center font-semibold">t-Stat</th>
                    <th className="py-2.5 px-3 text-center font-semibold">p-value (Adj)</th>
                    <th className="py-2.5 px-3 text-center font-semibold">Hasil</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900/50 font-medium">
                  {pairwiseComparisons.map((item, idx) => (
                    <tr 
                      key={idx} 
                      className={`hover:bg-slate-900/20 transition-colors ${
                        item.isSignificant ? "bg-[var(--accent-green)]/[0.02]" : ""
                      }`}
                    >
                      <td className="py-3 px-3 text-slate-200">
                        <span className="font-semibold text-slate-100">{item.groupA}</span>
                        <span className="text-[var(--text-muted)] mx-1 text-[10px]">vs</span>
                        <span className="font-semibold text-slate-100">{item.groupB}</span>
                      </td>
                      <td 
                        className={`py-3 px-3 text-center font-mono font-bold ${
                          item.meanDiff > 0 ? "text-[var(--accent-green)]" : "text-[var(--accent-red)]"
                        }`}
                      >
                        {item.meanDiff > 0 ? "+" : ""}{item.meanDiff.toFixed(2)}
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-slate-300">
                        {item.tStatistic.toFixed(2)}
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-slate-300">
                        {formatPValue(item.pValueAdj)}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span 
                          className={`font-mono text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            item.isSignificant 
                              ? "text-[var(--accent-green)] bg-[var(--accent-green)]/10 border border-[var(--accent-green)]/20"
                              : "text-slate-400 bg-slate-900/60 border border-slate-800"
                          }`}
                        >
                          {item.isSignificant ? "SIG" : "NS"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 p-4 bg-slate-950/40 border border-slate-900/60 rounded-xl flex items-start gap-2 text-[11px]">
            <HelpCircle className="w-4 h-4 text-[var(--accent-cyan)] flex-shrink-0 mt-0.5" />
            <p className="text-[var(--text-secondary)] leading-relaxed">
              <span className="text-slate-300 font-bold">Koreksi Bonferroni</span> mengontrol laju kesalahan tipe I secara ketat dengan mengalikan p-value dengan jumlah komparasi ({pairwiseComparisons.length}). <strong className="text-slate-300">SIG</strong> menunjukkan perbedaan nyata secara statistik, sedangkan <strong className="text-slate-300">NS</strong> berarti tidak signifikan.
            </p>
          </div>
        </SectionCard>
      </div>

      {/* NEW: Step-by-Step Calculation Breakdown Card */}
      <SectionCard className="border-t-4 border-t-[var(--accent-blue)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <Calculator className="w-6 h-6 text-[var(--accent-blue)]" />
              <span>Rincian & Langkah Perhitungan Komponen ANOVA</span>
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Substitusi nilai dan penjelasan cara menghitung setiap elemen statistik dari data aktif Anda.
            </p>
          </div>

          {/* Quick Data Context Badge */}
          <div className="flex items-center gap-3 bg-slate-950/60 p-2.5 rounded-xl border border-slate-900/80 text-xs font-mono">
            <div className="text-center px-2 border-r border-slate-800">
              <span className="text-[10px] text-[var(--text-muted)] uppercase block">Kelompok (k)</span>
              <span className="font-bold text-[var(--accent-blue)]">{k}</span>
            </div>
            <div className="text-center px-2 border-r border-slate-800">
              <span className="text-[10px] text-[var(--text-muted)] uppercase block">Total Observasi (N)</span>
              <span className="font-bold text-[var(--accent-cyan)]">{totalN}</span>
            </div>
            <div className="text-center px-2">
              <span className="text-[10px] text-[var(--text-muted)] uppercase block">Grand Mean (x̄)</span>
              <span className="font-bold text-[var(--accent-gold)]">{grandMean.toFixed(3)}</span>
            </div>
          </div>
        </div>

        {/* Calculation Nav Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
          <button
            onClick={() => setActiveCalcTab("df")}
            className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer border ${
              activeCalcTab === "df"
                ? "bg-[var(--accent-blue)]/15 border-[var(--accent-blue)]/40 text-[var(--accent-blue)] shadow-md"
                : "bg-slate-950/40 border-slate-900 text-[var(--text-secondary)] hover:text-slate-200 hover:bg-slate-900/40"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>1. Derajat Bebas (df)</span>
          </button>
          <button
            onClick={() => setActiveCalcTab("ss")}
            className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer border ${
              activeCalcTab === "ss"
                ? "bg-[var(--accent-blue)]/15 border-[var(--accent-blue)]/40 text-[var(--accent-blue)] shadow-md"
                : "bg-slate-950/40 border-slate-900 text-[var(--text-secondary)] hover:text-slate-200 hover:bg-slate-900/40"
            }`}
          >
            <Sigma className="w-4 h-4" />
            <span>2. Jumlah Kuadrat (SS)</span>
          </button>
          <button
            onClick={() => setActiveCalcTab("ms")}
            className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer border ${
              activeCalcTab === "ms"
                ? "bg-[var(--accent-blue)]/15 border-[var(--accent-blue)]/40 text-[var(--accent-blue)] shadow-md"
                : "bg-slate-950/40 border-slate-900 text-[var(--text-secondary)] hover:text-slate-200 hover:bg-slate-900/40"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>3. Rerata Kuadrat (MS)</span>
          </button>
          <button
            onClick={() => setActiveCalcTab("f")}
            className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer border ${
              activeCalcTab === "f"
                ? "bg-[var(--accent-blue)]/15 border-[var(--accent-blue)]/40 text-[var(--accent-blue)] shadow-md"
                : "bg-slate-950/40 border-slate-900 text-[var(--text-secondary)] hover:text-slate-200 hover:bg-slate-900/40"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>4. F-Hitung & P-Value</span>
          </button>
        </div>

        {/* Tab 1: Derajat Bebas (DF) */}
        {activeCalcTab === "df" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="p-4 bg-slate-950/40 border border-slate-900/60 rounded-xl text-xs text-[var(--text-secondary)] leading-relaxed">
              <span className="font-bold text-slate-100">Apa itu Derajat Bebas (Degrees of Freedom / df)?</span>
              <p className="mt-1">
                Derajat bebas mengukur jumlah estimasi nilai independen yang bebas bervariasi dalam perhitungan statistik. Pada ANOVA, df dibagi menjadi 3 bagian:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* DF Between */}
              <div className="p-4 bg-slate-950/60 border border-slate-900 rounded-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-200">df Antar Kelompok (df_Between)</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-[var(--accent-blue)]/10 text-[var(--accent-blue)] rounded border border-[var(--accent-blue)]/20 font-bold">
                      df1 = {dfBetween}
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)] mb-3">
                    Mengukur kebebasan variasi di antara {k} rerata kelompok terhadap rerata total.
                  </p>
                  <div className="p-3 bg-slate-900/60 rounded-lg font-mono text-xs text-slate-200 space-y-1 border border-slate-800">
                    <div className="text-[11px] text-[var(--text-muted)]">Rumus: df_between = k - 1</div>
                    <div className="text-[11px] text-slate-400">Substitusi: {k} - 1</div>
                    <div className="font-bold text-[var(--accent-blue)] text-sm pt-1 border-t border-slate-800 mt-1">
                      = {dfBetween}
                    </div>
                  </div>
                </div>
              </div>

              {/* DF Within */}
              <div className="p-4 bg-slate-950/60 border border-slate-900 rounded-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-200">df Dalam Kelompok (df_Within)</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-[var(--accent-cyan)]/10 text-[var(--accent-cyan)] rounded border border-[var(--accent-cyan)]/20 font-bold">
                      df2 = {dfWithin}
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)] mb-3">
                    Mengukur kebebasan variasi individu di dalam kelompok (galat/error).
                  </p>
                  <div className="p-3 bg-slate-900/60 rounded-lg font-mono text-xs text-slate-200 space-y-1 border border-slate-800">
                    <div className="text-[11px] text-[var(--text-muted)]">Rumus: df_within = N - k</div>
                    <div className="text-[11px] text-slate-400">Substitusi: {totalN} - {k}</div>
                    <div className="font-bold text-[var(--accent-cyan)] text-sm pt-1 border-t border-slate-800 mt-1">
                      = {dfWithin}
                    </div>
                  </div>
                </div>
              </div>

              {/* DF Total */}
              <div className="p-4 bg-slate-950/60 border border-slate-900 rounded-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-200">df Total (df_Total)</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700 font-bold">
                      df_tot = {dfTotal}
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)] mb-3">
                    Total kebebasan variasi seluruh {totalN} poin data observasi.
                  </p>
                  <div className="p-3 bg-slate-900/60 rounded-lg font-mono text-xs text-slate-200 space-y-1 border border-slate-800">
                    <div className="text-[11px] text-[var(--text-muted)]">Rumus: df_total = N - 1</div>
                    <div className="text-[11px] text-slate-400">Substitusi: {totalN} - 1 (atau {dfBetween} + {dfWithin})</div>
                    <div className="font-bold text-slate-100 text-sm pt-1 border-t border-slate-800 mt-1">
                      = {dfTotal}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Jumlah Kuadrat (SS) */}
        {activeCalcTab === "ss" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="p-4 bg-slate-950/40 border border-slate-900/60 rounded-xl text-xs text-[var(--text-secondary)] leading-relaxed">
              <span className="font-bold text-slate-100">Apa itu Jumlah Kuadrat (Sum of Squares / SS)?</span>
              <p className="mt-1">
                SS mengukur total variabilitas data dengan menjumlahkan kuadrat selisih tiap nilai terhadap reratanya.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-950/60 border border-slate-900 rounded-xl space-y-3">
                <div className="text-xs font-bold text-slate-200">SS Antar Kelompok (SS_Between)</div>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Variasi rerata kelompok terhadap Grand Mean ({grandMean.toFixed(3)}).
                </p>
                <div className="p-3 bg-slate-900/60 rounded-lg font-mono text-xs text-slate-200 border border-slate-800 space-y-1">
                  <div className="text-[10px] text-[var(--text-muted)]">Rumus: Σ n_j × (x̄_j - x̄_grand)²</div>
                  <div className="font-bold text-[var(--accent-blue)] text-sm mt-1">
                    = {ssBetween.toFixed(3)}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-950/60 border border-slate-900 rounded-xl space-y-3">
                <div className="text-xs font-bold text-slate-200">SS Dalam Kelompok (SS_Within / Error)</div>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Variasi alami data individu di dalam masing-masing kelompoknya.
                </p>
                <div className="p-3 bg-slate-900/60 rounded-lg font-mono text-xs text-slate-200 border border-slate-800 space-y-1">
                  <div className="text-[10px] text-[var(--text-muted)]">Rumus: Σ Σ (x_ij - x̄_j)²</div>
                  <div className="font-bold text-[var(--accent-cyan)] text-sm mt-1">
                    = {ssWithin.toFixed(3)}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-950/60 border border-slate-900 rounded-xl space-y-3">
                <div className="text-xs font-bold text-slate-200">SS Total (SS_Total)</div>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Total keseluruhan variasi data observasi.
                </p>
                <div className="p-3 bg-slate-900/60 rounded-lg font-mono text-xs text-slate-200 border border-slate-800 space-y-1">
                  <div className="text-[10px] text-[var(--text-muted)]">SS_Between + SS_Within</div>
                  <div className="text-[11px] text-slate-400">{ssBetween.toFixed(3)} + {ssWithin.toFixed(3)}</div>
                  <div className="font-bold text-slate-100 text-sm mt-1 border-t border-slate-800 pt-1">
                    = {ssTotal.toFixed(3)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Rerata Kuadrat (MS) */}
        {activeCalcTab === "ms" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="p-4 bg-slate-950/40 border border-slate-900/60 rounded-xl text-xs text-[var(--text-secondary)] leading-relaxed">
              <span className="font-bold text-slate-100">Apa itu Rerata Kuadrat (Mean Squares / MS)?</span>
              <p className="mt-1">
                MS adalah estimasi variansi rata-rata yang dihitung dengan membagi Jumlah Kuadrat (SS) dengan Derajat Bebas (df) masing-masing.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950/60 border border-slate-900 rounded-xl space-y-3">
                <div className="text-xs font-bold text-slate-200">MS Antar Kelompok (MS_Between)</div>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Variansi rerata antar kelompok per satu derajat bebas.
                </p>
                <div className="p-3 bg-slate-900/60 rounded-lg font-mono text-xs text-slate-200 border border-slate-800 space-y-1">
                  <div className="text-[10px] text-[var(--text-muted)]">Rumus: SS_Between / df_Between</div>
                  <div className="text-[11px] text-slate-400">Substitusi: {ssBetween.toFixed(3)} / {dfBetween}</div>
                  <div className="font-bold text-[var(--accent-blue)] text-sm mt-1 border-t border-slate-800 pt-1">
                    = {msBetween.toFixed(3)}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-950/60 border border-slate-900 rounded-xl space-y-3">
                <div className="text-xs font-bold text-slate-200">MS Dalam Kelompok (MS_Within)</div>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Variansi galat/error di dalam kelompok per satu derajat bebas.
                </p>
                <div className="p-3 bg-slate-900/60 rounded-lg font-mono text-xs text-slate-200 border border-slate-800 space-y-1">
                  <div className="text-[10px] text-[var(--text-muted)]">Rumus: SS_Within / df_Within</div>
                  <div className="text-[11px] text-slate-400">Substitusi: {ssWithin.toFixed(3)} / {dfWithin}</div>
                  <div className="font-bold text-[var(--accent-cyan)] text-sm mt-1 border-t border-slate-800 pt-1">
                    = {msWithin.toFixed(3)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: F-Hitung & P-Value */}
        {activeCalcTab === "f" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="p-4 bg-slate-950/40 border border-slate-900/60 rounded-xl text-xs text-[var(--text-secondary)] leading-relaxed">
              <span className="font-bold text-slate-100">Bagaimana F-Hitung & P-Value Ditentukan?</span>
              <p className="mt-1">
                F-Hitung membandingkan variabilitas antar kelompok terhadap variabilitas alami di dalam kelompok.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950/60 border border-slate-900 rounded-xl space-y-3">
                <div className="text-xs font-bold text-slate-200">Perhitungan Rasio F-Hitung</div>
                <div className="p-3 bg-slate-900/60 rounded-lg font-mono text-xs text-slate-200 border border-slate-800 space-y-1">
                  <div className="text-[10px] text-[var(--text-muted)]">Rumus: F = MS_Between / MS_Within</div>
                  <div className="text-[11px] text-slate-400">Substitusi: {msBetween.toFixed(3)} / {msWithin.toFixed(3)}</div>
                  <div className="font-bold text-[var(--accent-blue)] text-base mt-1 border-t border-slate-800 pt-1">
                    F = {fStatistic.toFixed(3)}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-950/60 border border-slate-900 rounded-xl space-y-3">
                <div className="text-xs font-bold text-slate-200">Evaluasi P-Value & Pengambilan Keputusan</div>
                <div className="p-3 bg-slate-900/60 rounded-lg font-mono text-xs text-slate-200 border border-slate-800 space-y-1">
                  <div className="text-[10px] text-[var(--text-muted)]">Distribusi F(df1={dfBetween}, df2={dfWithin})</div>
                  <div className="text-[11px] text-slate-300">P-Value = {formatPValue(pValue)}</div>
                  <div className={`font-bold text-xs mt-1 border-t border-slate-800 pt-1 ${isSignificant ? "text-[var(--accent-green)]" : "text-[var(--text-secondary)]"}`}>
                    {isSignificant ? "p-value < 0.05 → Tolak H0 (Signifikan)" : "p-value >= 0.05 → Gagal Tolak H0"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </SectionCard>

      {/* Narrative Interpretation */}
      <SectionCard className="border-l-4 border-l-[var(--accent-gold)]">
        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2 mb-3">
          <Info className="w-5 h-5 text-[var(--accent-gold)]" />
          <span>Interpretasi Hasil Uji ANOVA</span>
        </h3>
        <div className="bg-slate-950/40 p-4.5 rounded-xl border border-slate-900/60 text-slate-300 text-xs leading-relaxed space-y-3">
          <p>{interpretation}</p>
          {isSignificant && (
            <p>
              Perbandingan berpasangan mendeteksi bahwa perbedaan terbesar terjadi pada pasangan{" "}
              <strong className="text-slate-100">
                {
                  pairwiseComparisons.reduce((max, item) =>
                    Math.abs(item.meanDiff) > Math.abs(max.meanDiff) ? item : max
                  ).groupA
                }
              </strong>{" "}
              dan{" "}
              <strong className="text-slate-100">
                {
                  pairwiseComparisons.reduce((max, item) =>
                    Math.abs(item.meanDiff) > Math.abs(max.meanDiff) ? item : max
                  ).groupB
                }
              </strong>{" "}
              dengan selisih rata-rata sebesar{" "}
              <span className="font-mono font-bold text-[var(--accent-gold)]">
                {Math.abs(
                  pairwiseComparisons.reduce((max, item) =>
                    Math.abs(item.meanDiff) > Math.abs(max.meanDiff) ? item : max
                  ).meanDiff
                ).toFixed(2)}
              </span>{" "}
              poin. Hal ini menjadi petunjuk bagi pengembang untuk meratakan kualitas produk, berfokus meningkatkan aspek yang bernilai rendah agar setara dengan aspek yang sudah dinilai tinggi oleh pengguna.
            </p>
          )}
        </div>
      </SectionCard>
    </section>
  );
}
