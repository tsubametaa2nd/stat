"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { DescriptiveStats } from "@/types";
import { VARIABLE_COLORS } from "@/types";
import SectionCard from "@/components/ui/SectionCard";

interface AnalisisNarasiProps {
  stats: DescriptiveStats[];
}

export default function AnalisisNarasi({ stats }: AnalisisNarasiProps) {
  // Data untuk mean comparison
  const meanData = stats
    .map((stat) => ({
      variable: stat.variable,
      mean: stat.mean,
      category: stat.category,
    }))
    .sort((a, b) => b.mean - a.mean);

  // Data untuk std dev comparison
  const stdDevData = stats
    .map((stat) => ({
      variable: stat.variable,
      stdDev: stat.stdDev,
    }))
    .sort((a, b) => b.stdDev - a.stdDev);

  // Data untuk outlier pie chart
  const outlierData = stats
    .filter((stat) => stat.outliers.length > 0)
    .map((stat) => ({
      name: stat.variable,
      value: stat.outliers.length,
      color: VARIABLE_COLORS[stat.variable],
    }));

  const totalOutliers = outlierData.reduce((sum, item) => sum + item.value, 0);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Sangat Tinggi":
        return "var(--accent-green)";
      case "Tinggi":
        return "var(--accent-cyan)";
      case "Sedang":
        return "var(--accent-gold)";
      case "Rendah":
        return "var(--accent-red)";
      default:
        return "var(--text-secondary)";
    }
  };

  return (
    <div className="space-y-6">
      {/* Card 1: Nilai Rata-Rata */}
      <SectionCard>
        <h3 className="text-xl font-semibold mb-4 text-[var(--accent-blue)]">
          Analisis Nilai Rata-Rata
        </h3>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={meanData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              type="number"
              domain={[0, 5]}
              stroke="var(--text-secondary)"
            />
            <YAxis
              type="category"
              dataKey="variable"
              stroke="var(--text-secondary)"
              width={100}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="mean" radius={[0, 8, 8, 0]} animationDuration={800}>
              {meanData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={VARIABLE_COLORS[entry.variable]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-4 space-y-3">
          <p className="text-[var(--text-secondary)]">
            <strong className="text-[var(--text-primary)]">
              {meanData[0].variable}
            </strong>{" "}
            memiliki rata-rata tertinggi (
            <span className="text-[var(--accent-green)] font-semibold">
              {meanData[0].mean.toFixed(2)}
            </span>
            ) menunjukkan penilaian yang{" "}
            <span
              style={{ color: getCategoryColor(meanData[0].category) }}
              className="font-semibold"
            >
              {meanData[0].category}
            </span>
            .
          </p>
          <p className="text-[var(--text-secondary)]">
            <strong className="text-[var(--text-primary)]">
              {meanData[meanData.length - 1].variable}
            </strong>{" "}
            memiliki rata-rata terendah (
            <span className="text-[var(--accent-red)] font-semibold">
              {meanData[meanData.length - 1].mean.toFixed(2)}
            </span>
            ), mengindikasikan area yang perlu perbaikan.
          </p>

          <div className="flex flex-wrap gap-2 mt-4">
            {meanData.map((item) => (
              <div
                key={item.variable}
                className="px-3 py-1.5 rounded-full text-sm"
                style={{
                  backgroundColor: `${getCategoryColor(item.category)}20`,
                  color: getCategoryColor(item.category),
                  border: `1px solid ${getCategoryColor(item.category)}40`,
                }}
              >
                {item.variable}: {item.category}
              </div>
            ))}
          </div>
        </div>
      </SectionCard>

      {/* Card 2: Variasi Data */}
      <SectionCard>
        <h3 className="text-xl font-semibold mb-4 text-[var(--accent-cyan)]">
          Analisis Variasi Data
        </h3>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stdDevData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis type="number" stroke="var(--text-secondary)" />
            <YAxis
              type="category"
              dataKey="variable"
              stroke="var(--text-secondary)"
              width={100}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="stdDev" radius={[0, 8, 8, 0]} animationDuration={800}>
              {stdDevData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={VARIABLE_COLORS[entry.variable]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-4 space-y-3">
          <p className="text-[var(--text-secondary)]">
            <strong className="text-[var(--text-primary)]">
              {stdDevData[0].variable}
            </strong>{" "}
            memiliki variasi tertinggi (
            <span className="text-[var(--accent-gold)] font-semibold">
              SD = {stdDevData[0].stdDev.toFixed(2)}
            </span>
            ) menunjukkan pendapat responden sangat beragam pada aspek ini.
          </p>
          <p className="text-[var(--text-secondary)]">
            <strong className="text-[var(--text-primary)]">
              {stdDevData[stdDevData.length - 1].variable}
            </strong>{" "}
            memiliki variasi terendah (
            <span className="text-[var(--accent-green)] font-semibold">
              SD = {stdDevData[stdDevData.length - 1].stdDev.toFixed(2)}
            </span>
            ), mengindikasikan konsensus yang lebih kuat di antara responden.
          </p>
        </div>
      </SectionCard>

      {/* Card 3: Deteksi Outlier */}
      <SectionCard>
        <h3 className="text-xl font-semibold mb-4 text-[var(--accent-gold)]">
          Deteksi Outlier
        </h3>

        {totalOutliers > 0 ? (
          <>
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="w-full md:w-1/2">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={outlierData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }: any) =>
                        `${name}: ${((percent || 0) * 100).toFixed(0)}%`
                      }
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      animationDuration={800}
                    >
                      {outlierData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--bg-card)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="w-full md:w-1/2 space-y-3">
                <p className="text-[var(--text-secondary)]">
                  Sebanyak{" "}
                  <span className="text-[var(--accent-red)] font-semibold">
                    {totalOutliers}
                  </span>{" "}
                  dari 100 responden memberikan penilaian yang menyimpang
                  signifikan.
                </p>

                <div className="space-y-2">
                  {outlierData.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between p-2 bg-[var(--bg-secondary)] rounded"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-[var(--accent-red)]">
                        {item.value} outlier
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">✓</div>
            <p className="text-[var(--text-secondary)]">
              Tidak ada outlier terdeteksi dalam dataset. Semua responden
              memberikan penilaian dalam rentang normal.
            </p>
          </div>
        )}
      </SectionCard>
    </div>
  );
}
