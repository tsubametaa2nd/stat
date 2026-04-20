"use client";

import { useMemo } from "react";
import { DescriptiveStats } from "@/types";
import { VARIABLE_COLORS } from "@/types";

interface BoxplotChartProps {
  stats: DescriptiveStats[];
}

export default function BoxplotChart({ stats }: BoxplotChartProps) {
  const CustomTooltip = ({ data }: { data: DescriptiveStats | null }) => {
    if (!data) return null;
    
    return (
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-4 shadow-lg">
        <p className="font-semibold mb-2" style={{ color: VARIABLE_COLORS[data.variable] }}>
          {data.variable}
        </p>
        <div className="space-y-1 text-sm text-[var(--text-secondary)]">
          <p>Max: <span className="text-[var(--text-primary)]">{data.max}</span></p>
          <p>Q3: <span className="text-[var(--text-primary)]">{data.q3}</span></p>
          <p>Median: <span className="text-[var(--text-primary)]">{data.median}</span></p>
          <p>Q1: <span className="text-[var(--text-primary)]">{data.q1}</span></p>
          <p>Min: <span className="text-[var(--text-primary)]">{data.min}</span></p>
          <p>IQR: <span className="text-[var(--text-primary)]">{data.iqr.toFixed(2)}</span></p>
          <p>Outliers: <span className="text-[var(--accent-red)]">{data.outliers?.length || 0}</span></p>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-6">Boxplot Perbandingan Variabel</h3>

      {/* Main Boxplot Chart */}
      <div className="relative bg-[var(--bg-secondary)] rounded-lg p-8 mb-6">
        <svg width="100%" height="400" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet">
          {/* Grid lines */}
          <g>
            {[0, 1, 2, 3, 4, 5].map((value) => {
              const y = 350 - (value / 5) * 280;
              return (
                <g key={value}>
                  <line
                    x1="80"
                    y1={y}
                    x2="750"
                    y2={y}
                    stroke="var(--border)"
                    strokeWidth="1"
                    strokeDasharray="4"
                  />
                  <text
                    x="65"
                    y={y + 5}
                    textAnchor="end"
                    fill="var(--text-secondary)"
                    fontSize="14"
                  >
                    {value}
                  </text>
                </g>
              );
            })}
          </g>

          {/* Y-axis label */}
          <text
            x="20"
            y="200"
            textAnchor="middle"
            fill="var(--text-secondary)"
            fontSize="14"
            transform="rotate(-90, 20, 200)"
          >
            Nilai
          </text>

          {/* Boxplots */}
          {stats.map((stat, index) => {
            const totalVars = stats.length;
            const chartWidth = 670; // 750 - 80
            const boxWidth = Math.min(80, chartWidth / (totalVars * 2));
            const spacing = chartWidth / totalVars;
            const xPos = 80 + spacing * index + spacing / 2 - boxWidth / 2;
            
            // Scale: 0-5 mapped to 350-70 (inverted Y axis)
            const scale = (value: number) => 350 - (value / 5) * 280;
            
            const minY = scale(stat.min);
            const q1Y = scale(stat.q1);
            const medianY = scale(stat.median);
            const q3Y = scale(stat.q3);
            const maxY = scale(stat.max);
            
            const color = VARIABLE_COLORS[stat.variable];

            return (
              <g key={stat.variable} className="cursor-pointer hover:opacity-80 transition-opacity">
                {/* Whisker line (min to Q1) */}
                <line
                  x1={xPos + boxWidth / 2}
                  y1={minY}
                  x2={xPos + boxWidth / 2}
                  y2={q1Y}
                  stroke={color}
                  strokeWidth="2"
                />
                
                {/* Whisker line (Q3 to max) */}
                <line
                  x1={xPos + boxWidth / 2}
                  y1={q3Y}
                  x2={xPos + boxWidth / 2}
                  y2={maxY}
                  stroke={color}
                  strokeWidth="2"
                />
                
                {/* Min cap */}
                <line
                  x1={xPos + boxWidth / 3}
                  y1={minY}
                  x2={xPos + (2 * boxWidth) / 3}
                  y2={minY}
                  stroke={color}
                  strokeWidth="2"
                />
                
                {/* Max cap */}
                <line
                  x1={xPos + boxWidth / 3}
                  y1={maxY}
                  x2={xPos + (2 * boxWidth) / 3}
                  y2={maxY}
                  stroke={color}
                  strokeWidth="2"
                />
                
                {/* Box (Q1 to Q3) */}
                <rect
                  x={xPos}
                  y={q3Y}
                  width={boxWidth}
                  height={q1Y - q3Y}
                  fill={color}
                  fillOpacity="0.4"
                  stroke={color}
                  strokeWidth="2.5"
                  rx="4"
                />
                
                {/* Median line */}
                <line
                  x1={xPos}
                  y1={medianY}
                  x2={xPos + boxWidth}
                  y2={medianY}
                  stroke={color}
                  strokeWidth="3"
                />
                
                {/* Outliers */}
                {stat.outliers?.map((outlier, oidx) => (
                  <circle
                    key={oidx}
                    cx={xPos + boxWidth / 2}
                    cy={scale(outlier)}
                    r="5"
                    fill="var(--accent-red)"
                    stroke="var(--bg-secondary)"
                    strokeWidth="2"
                  />
                ))}
                
                {/* Variable label */}
                <text
                  x={xPos + boxWidth / 2}
                  y="380"
                  textAnchor="middle"
                  fill="var(--text-primary)"
                  fontSize="14"
                  fontWeight="500"
                >
                  {stat.variable}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Statistical summary table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="text-left py-3 px-4 text-[var(--text-secondary)] font-semibold">Variabel</th>
              <th className="text-center py-3 px-4 text-[var(--text-secondary)] font-semibold">Min</th>
              <th className="text-center py-3 px-4 text-[var(--text-secondary)] font-semibold">Q1</th>
              <th className="text-center py-3 px-4 text-[var(--text-secondary)] font-semibold">Median</th>
              <th className="text-center py-3 px-4 text-[var(--text-secondary)] font-semibold">Q3</th>
              <th className="text-center py-3 px-4 text-[var(--text-secondary)] font-semibold">Max</th>
              <th className="text-center py-3 px-4 text-[var(--text-secondary)] font-semibold">IQR</th>
              <th className="text-center py-3 px-4 text-[var(--text-secondary)] font-semibold">Outliers</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((stat) => (
              <tr key={stat.variable} className="border-b border-[var(--border)] hover:bg-[var(--bg-secondary)] transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded"
                      style={{ backgroundColor: VARIABLE_COLORS[stat.variable] }}
                    />
                    <span className="font-medium">{stat.variable}</span>
                  </div>
                </td>
                <td className="text-center py-3 px-4">{stat.min}</td>
                <td className="text-center py-3 px-4">{stat.q1}</td>
                <td className="text-center py-3 px-4 font-semibold text-[var(--accent-blue)]">{stat.median}</td>
                <td className="text-center py-3 px-4">{stat.q3}</td>
                <td className="text-center py-3 px-4">{stat.max}</td>
                <td className="text-center py-3 px-4">{stat.iqr.toFixed(2)}</td>
                <td className="text-center py-3 px-4">
                  <span className={stat.outliers.length > 0 ? "text-[var(--accent-red)] font-semibold" : ""}>
                    {stat.outliers.length}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        {stats.map((stat) => (
          <div key={stat.variable} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: VARIABLE_COLORS[stat.variable] }}
            />
            <span className="text-sm text-[var(--text-secondary)]">{stat.variable}</span>
          </div>
        ))}
      </div>

      {/* Interpretation */}
      <div className="mt-6 p-4 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border)]">
        <p className="text-sm text-[var(--text-secondary)]">
          <strong className="text-[var(--text-primary)]">Interpretasi:</strong> Boxplot menunjukkan distribusi dan perbandingan 
          nilai antar variabel. Box menggambarkan rentang interkuartil (IQR), garis tengah menunjukkan median, 
          dan whisker menunjukkan rentang data. Titik merah menandakan outlier (nilai ekstrem).
        </p>
      </div>
    </div>
  );
}
