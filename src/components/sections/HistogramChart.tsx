"use client";

import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { DescriptiveStats } from "@/types";
import { VARIABLE_COLORS } from "@/types";
import { getFrequencyDistribution } from "@/lib/statistics";

interface HistogramChartProps {
  data: Record<string, number>[];
  stats: DescriptiveStats[];
}

export default function HistogramChart({ data, stats }: HistogramChartProps) {
  const [selectedVariable, setSelectedVariable] = useState("Usability");

  const chartData = useMemo(() => {
    const variableData = data.map((row) => row[selectedVariable]);
    return getFrequencyDistribution(variableData);
  }, [data, selectedVariable]);

  const currentStats = stats.find((s) => s.variable === selectedVariable);

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-6">
        Histogram Distribusi Frekuensi
      </h3>

      {/* Variable selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {stats.map((stat) => (
          <button
            key={stat.variable}
            onClick={() => setSelectedVariable(stat.variable)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedVariable === stat.variable
                ? "text-white shadow-lg"
                : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
            style={{
              backgroundColor:
                selectedVariable === stat.variable
                  ? VARIABLE_COLORS[stat.variable]
                  : undefined,
            }}
          >
            {stat.variable}
          </button>
        ))}
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="value"
            stroke="var(--text-secondary)"
            label={{
              value: "Nilai",
              position: "insideBottom",
              offset: -5,
              fill: "var(--text-secondary)",
            }}
          />
          <YAxis
            stroke="var(--text-secondary)"
            label={{
              value: "Frekuensi",
              angle: -90,
              position: "insideLeft",
              fill: "var(--text-secondary)",
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              color: "var(--text-primary)",
            }}
            formatter={(value: any, name: any) => {
              if (name === "count") return [value, "Frekuensi"];
              return [value, name];
            }}
            labelFormatter={(label) => `Nilai: ${label}`}
          />
          <Legend
            verticalAlign="top"
            align="right"
            wrapperStyle={{ paddingBottom: "10px" }}
          />
          <Bar
            dataKey="count"
            fill={VARIABLE_COLORS[selectedVariable]}
            radius={[8, 8, 0, 0]}
            animationDuration={800}
          />
          {currentStats && (
            <>
              <ReferenceLine
                x={currentStats.mean}
                stroke="var(--accent-red)"
                strokeWidth={2}
                strokeDasharray="5 5"
                label={{
                  value: `Mean: ${currentStats.mean.toFixed(2)}`,
                  fill: "#1f1f1f",
                  position: "right",
                  offset: 15,
                }}
              />
              <ReferenceLine
                x={currentStats.median}
                stroke="var(--accent-blue)"
                strokeWidth={2}
                strokeDasharray="5 5"
                label={{
                  value: `Median: ${currentStats.median}`,
                  fill: "#1f1f1f",
                  position: "right",
                  offset: 15,
                }}
              />
            </>
          )}
        </BarChart>
      </ResponsiveContainer>

      {/* Interpretation */}
      {currentStats && (
        <div className="mt-6 p-4 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border)]">
          <p className="text-sm text-[var(--text-secondary)]">
            <strong className="text-[var(--text-primary)]">
              Interpretasi:
            </strong>{" "}
            Distribusi data {selectedVariable} menunjukkan{" "}
            <span className="text-[var(--accent-cyan)] font-semibold">
              {currentStats.interpretation}
            </span>{" "}
            dengan nilai rata-rata {currentStats.mean.toFixed(2)} dan standar
            deviasi {currentStats.stdDev.toFixed(2)}.
            {currentStats.skewness > 0.5 &&
              " Data cenderung terkonsentrasi pada nilai rendah dengan ekor panjang ke kanan."}
            {currentStats.skewness < -0.5 &&
              " Data cenderung terkonsentrasi pada nilai tinggi dengan ekor panjang ke kiri."}
            {Math.abs(currentStats.skewness) <= 0.5 &&
              " Data terdistribusi relatif simetris."}
          </p>
        </div>
      )}
    </div>
  );
}
