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

const DEFAULT_COLORS = [
  "#3B82F6", // Blue
  "#8B5CF6", // Purple
  "#EF4444", // Red
  "#F59E0B", // Orange
  "#10B981", // Green
  "#EC4899", // Pink
  "#14B8A6", // Teal
  "#F97316", // Deep Orange
  "#8B5CF6", // Violet
  "#06B6D4", // Cyan
];

export const VARIABLE_COLORS: Record<string, string> = {
  Usability: "#3B82F6",
  "UI/UX": "#8B5CF6",
  Speed: "#EF4444",
  Features: "#F59E0B",
  Satisfaction: "#10B981",
};

/**
 * Get color for a variable, with fallback to default colors
 */
export function getVariableColor(variable: string, index: number = 0): string {
  return (
    VARIABLE_COLORS[variable] || DEFAULT_COLORS[index % DEFAULT_COLORS.length]
  );
}

export interface GroupStat {
  name: string;
  n: number;
  mean: number;
  variance: number;
  stdDev: number;
  sem: number;
  ciLower: number;
  ciUpper: number;
}

export interface PairwiseComparison {
  groupA: string;
  groupB: string;
  meanDiff: number;
  tStatistic: number;
  pValueRaw: number;
  pValueAdj: number;
  isSignificant: boolean;
  interpretation: string;
}

export interface AnovaResult {
  dfBetween: number;
  dfWithin: number;
  dfTotal: number;
  ssBetween: number;
  ssWithin: number;
  ssTotal: number;
  msBetween: number;
  msWithin: number;
  fStatistic: number;
  pValue: number;
  isSignificant: boolean;
  significanceLevel: number;
  groupStats: GroupStat[];
  pairwiseComparisons: PairwiseComparison[];
  interpretation: string;
  grandMean: number;
  totalN: number;
}

