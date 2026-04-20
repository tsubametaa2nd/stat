export const VARIABLES = [
  "Usability",
  "UI/UX",
  "Speed",
  "Features",
  "Satisfaction",
] as const;
export type VariableName = (typeof VARIABLES)[number];

export interface DescriptiveStats {
  variable: string;
  n: number;
  mean: number;
  median: number;
  mode: number | number[];
  min: number;
  max: number;
  range: number;
  variance: number;
  stdDev: number;
  skewness: number;
  kurtosis: number;
  q1: number;
  q3: number;
  iqr: number;
  outliers: number[];
  interpretation: string;
  category: string;
}

export const VARIABLE_COLORS: Record<string, string> = {
  Usability: "#3B82F6",
  "UI/UX": "#8B5CF6",
  Speed: "#EF4444",
  Features: "#F59E0B",
  Satisfaction: "#10B981",
};
