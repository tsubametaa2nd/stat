"use client";

import { useState } from "react";
import { DescriptiveStats } from "@/types";
import { VARIABLE_COLORS } from "@/types";

interface TabelStatistikProps {
  stats: DescriptiveStats[];
}

export default function TabelStatistik({ stats }: TabelStatistikProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const formatValue = (value: number | number[]) => {
    if (Array.isArray(value)) {
      return value.join(", ");
    }
    return typeof value === "number" ? value.toFixed(2) : value;
  };

  const maxMean = Math.max(...stats.map((s) => s.mean));
  const maxOutliers = Math.max(...stats.map((s) => s.outliers.length));

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Tabel Statistik Deskriptif</h3>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="px-4 py-2 bg-[var(--accent-blue)] text-white rounded-lg text-sm hover:opacity-80 transition-opacity"
        >
          {showAdvanced ? "Sembunyikan" : "Tampilkan"} Statistik Lanjutan
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="text-left py-3 px-4 text-[var(--text-secondary)] font-semibold">
                Statistik
              </th>
              {stats.map((stat) => (
                <th
                  key={stat.variable}
                  className="text-center py-3 px-4 font-semibold"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: VARIABLE_COLORS[stat.variable],
                      }}
                    />
                    <span>{stat.variable}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[var(--border)] hover:bg-[var(--bg-secondary)] transition-colors">
              <td className="py-3 px-4 text-[var(--text-secondary)]">N</td>
              {stats.map((stat) => (
                <td key={stat.variable} className="text-center py-3 px-4">
                  {stat.n}
                </td>
              ))}
            </tr>
            <tr className="border-b border-[var(--border)] hover:bg-[var(--bg-secondary)] transition-colors">
              <td className="py-3 px-4 text-[var(--text-secondary)]">Mean</td>
              {stats.map((stat) => (
                <td
                  key={stat.variable}
                  className={`text-center py-3 px-4 font-semibold ${
                    stat.mean === maxMean
                      ? "bg-[var(--accent-gold)]/20 text-[var(--accent-gold)]"
                      : ""
                  }`}
                >
                  {formatValue(stat.mean)}
                </td>
              ))}
            </tr>
            <tr className="border-b border-[var(--border)] hover:bg-[var(--bg-secondary)] transition-colors">
              <td className="py-3 px-4 text-[var(--text-secondary)]">Median</td>
              {stats.map((stat) => (
                <td key={stat.variable} className="text-center py-3 px-4">
                  {formatValue(stat.median)}
                </td>
              ))}
            </tr>
            <tr className="border-b border-[var(--border)] hover:bg-[var(--bg-secondary)] transition-colors">
              <td className="py-3 px-4 text-[var(--text-secondary)]">Modus</td>
              {stats.map((stat) => (
                <td key={stat.variable} className="text-center py-3 px-4">
                  {formatValue(stat.mode)}
                </td>
              ))}
            </tr>
            <tr className="border-b border-[var(--border)] hover:bg-[var(--bg-secondary)] transition-colors">
              <td className="py-3 px-4 text-[var(--text-secondary)]">
                Std Dev
              </td>
              {stats.map((stat) => (
                <td key={stat.variable} className="text-center py-3 px-4">
                  {formatValue(stat.stdDev)}
                </td>
              ))}
            </tr>
            <tr className="border-b border-[var(--border)] hover:bg-[var(--bg-secondary)] transition-colors">
              <td className="py-3 px-4 text-[var(--text-secondary)]">
                Varians
              </td>
              {stats.map((stat) => (
                <td key={stat.variable} className="text-center py-3 px-4">
                  {formatValue(stat.variance)}
                </td>
              ))}
            </tr>
            <tr className="border-b border-[var(--border)] hover:bg-[var(--bg-secondary)] transition-colors">
              <td className="py-3 px-4 text-[var(--text-secondary)]">Min</td>
              {stats.map((stat) => (
                <td key={stat.variable} className="text-center py-3 px-4">
                  {stat.min}
                </td>
              ))}
            </tr>
            <tr className="border-b border-[var(--border)] hover:bg-[var(--bg-secondary)] transition-colors">
              <td className="py-3 px-4 text-[var(--text-secondary)]">Max</td>
              {stats.map((stat) => (
                <td key={stat.variable} className="text-center py-3 px-4">
                  {stat.max}
                </td>
              ))}
            </tr>
            <tr className="border-b border-[var(--border)] hover:bg-[var(--bg-secondary)] transition-colors">
              <td className="py-3 px-4 text-[var(--text-secondary)]">Range</td>
              {stats.map((stat) => (
                <td key={stat.variable} className="text-center py-3 px-4">
                  {stat.range}
                </td>
              ))}
            </tr>

            {showAdvanced && (
              <>
                <tr className="border-b border-[var(--border)] hover:bg-[var(--bg-secondary)] transition-colors">
                  <td className="py-3 px-4 text-[var(--text-secondary)]">
                    Skewness
                  </td>
                  {stats.map((stat) => (
                    <td key={stat.variable} className="text-center py-3 px-4">
                      {formatValue(stat.skewness)}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-[var(--border)] hover:bg-[var(--bg-secondary)] transition-colors">
                  <td className="py-3 px-4 text-[var(--text-secondary)]">
                    Kurtosis
                  </td>
                  {stats.map((stat) => (
                    <td key={stat.variable} className="text-center py-3 px-4">
                      {formatValue(stat.kurtosis)}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-[var(--border)] hover:bg-[var(--bg-secondary)] transition-colors">
                  <td className="py-3 px-4 text-[var(--text-secondary)]">Q1</td>
                  {stats.map((stat) => (
                    <td key={stat.variable} className="text-center py-3 px-4">
                      {formatValue(stat.q1)}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-[var(--border)] hover:bg-[var(--bg-secondary)] transition-colors">
                  <td className="py-3 px-4 text-[var(--text-secondary)]">Q3</td>
                  {stats.map((stat) => (
                    <td key={stat.variable} className="text-center py-3 px-4">
                      {formatValue(stat.q3)}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-[var(--border)] hover:bg-[var(--bg-secondary)] transition-colors">
                  <td className="py-3 px-4 text-[var(--text-secondary)]">
                    IQR
                  </td>
                  {stats.map((stat) => (
                    <td key={stat.variable} className="text-center py-3 px-4">
                      {formatValue(stat.iqr)}
                    </td>
                  ))}
                </tr>
              </>
            )}

            <tr className="hover:bg-[var(--bg-secondary)] transition-colors">
              <td className="py-3 px-4 text-[var(--text-secondary)]">
                Outlier
              </td>
              {stats.map((stat) => (
                <td
                  key={stat.variable}
                  className={`text-center py-3 px-4 ${
                    stat.outliers.length === maxOutliers && maxOutliers > 0
                      ? "bg-[var(--accent-red)]/20 text-[var(--accent-red)] font-semibold"
                      : ""
                  }`}
                >
                  {stat.outliers.length}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
