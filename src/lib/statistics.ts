import { DescriptiveStats } from "@/types";

export function mean(data: number[]): number {
  return data.reduce((sum, val) => sum + val, 0) / data.length;
}

export function median(data: number[]): number {
  const sorted = [...data].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

export function mode(data: number[]): number | number[] {
  const freq: Record<number, number> = {};
  data.forEach((val) => (freq[val] = (freq[val] || 0) + 1));

  const maxFreq = Math.max(...Object.values(freq));
  const modes = Object.keys(freq)
    .filter((key) => freq[Number(key)] === maxFreq)
    .map(Number);

  return modes.length === 1 ? modes[0] : modes;
}

export function variance(data: number[], ddof: number = 0): number {
  const avg = mean(data);
  const squaredDiffs = data.map((val) => Math.pow(val - avg, 2));
  return squaredDiffs.reduce((sum, val) => sum + val, 0) / (data.length - ddof);
}

export function stdDev(data: number[], ddof: number = 0): number {
  return Math.sqrt(variance(data, ddof));
}

export function skewness(data: number[]): number {
  const avg = mean(data);
  const sd = stdDev(data);
  const n = data.length;

  const cubedDiffs = data.map((val) => Math.pow((val - avg) / sd, 3));
  const sum = cubedDiffs.reduce((acc, val) => acc + val, 0);

  return (n / ((n - 1) * (n - 2))) * sum;
}

export function kurtosis(data: number[]): number {
  const avg = mean(data);
  const sd = stdDev(data);
  const n = data.length;

  const fourthDiffs = data.map((val) => Math.pow((val - avg) / sd, 4));
  const sum = fourthDiffs.reduce((acc, val) => acc + val, 0);

  return (
    ((n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3))) * sum -
    (3 * Math.pow(n - 1, 2)) / ((n - 2) * (n - 3))
  );
}

export function quartiles(data: number[]): {
  q1: number;
  q3: number;
  iqr: number;
} {
  const sorted = [...data].sort((a, b) => a - b);
  const n = sorted.length;

  const q1Index = Math.floor(n * 0.25);
  const q3Index = Math.floor(n * 0.75);

  const q1 = sorted[q1Index];
  const q3 = sorted[q3Index];
  const iqr = q3 - q1;

  return { q1, q3, iqr };
}

export function detectOutliers(data: number[]): number[] {
  const { q1, q3, iqr } = quartiles(data);
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;

  return data.filter((val) => val < lowerBound || val > upperBound);
}

export function computeStats(
  variable: string,
  data: number[],
): DescriptiveStats {
  const sorted = [...data].sort((a, b) => a - b);
  const avg = mean(data);
  const skew = skewness(data);
  const { q1, q3, iqr } = quartiles(data);

  let interpretation = "Simetris";
  if (skew > 0.5) interpretation = "Positif skew";
  else if (skew < -0.5) interpretation = "Negatif skew";

  let category = "Sedang";
  if (avg > 4.2) category = "Sangat Tinggi";
  else if (avg > 3.4) category = "Tinggi";
  else if (avg < 2.6) category = "Rendah";

  return {
    variable,
    n: data.length,
    mean: avg,
    median: median(data),
    mode: mode(data),
    min: sorted[0],
    max: sorted[sorted.length - 1],
    range: sorted[sorted.length - 1] - sorted[0],
    variance: variance(data, 1),
    stdDev: stdDev(data, 1),
    skewness: skew,
    kurtosis: kurtosis(data),
    q1,
    q3,
    iqr,
    outliers: detectOutliers(data),
    interpretation,
    category,
  };
}

export function computeAllStats(
  rawData: Record<string, number>[],
): DescriptiveStats[] {
  const variables = ["Usability", "UI/UX", "Speed", "Features", "Satisfaction"];
  return variables.map((variable) => {
    const data = rawData.map((row) => row[variable]);
    return computeStats(variable, data);
  });
}

export function getFrequencyDistribution(
  data: number[],
): { value: number; count: number; percent: number }[] {
  const freq: Record<number, number> = {};
  data.forEach((val) => (freq[val] = (freq[val] || 0) + 1));

  const total = data.length;
  return Object.keys(freq)
    .map(Number)
    .sort((a, b) => a - b)
    .map((value) => ({
      value,
      count: freq[value],
      percent: (freq[value] / total) * 100,
    }));
}

export function getBoxplotData(stats: DescriptiveStats): {
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  outliers: number[];
} {
  return {
    min: stats.min,
    q1: stats.q1,
    median: stats.median,
    q3: stats.q3,
    max: stats.max,
    outliers: stats.outliers,
  };
}
