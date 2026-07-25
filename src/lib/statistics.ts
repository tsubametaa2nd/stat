import { DescriptiveStats, AnovaResult, GroupStat, PairwiseComparison } from "@/types";

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
  if (!rawData || rawData.length === 0) {
    return [];
  }

  // Get all unique variables from the data
  const variablesSet = new Set<string>();
  rawData.forEach((row) => {
    Object.keys(row).forEach((key) => variablesSet.add(key));
  });

  const variables = Array.from(variablesSet);

  return variables.map((variable) => {
    const data = rawData
      .map((row) => row[variable])
      .filter((val) => val !== undefined && val !== null && !isNaN(val));

    if (data.length === 0) {
      // Return default stats if no valid data
      return {
        variable,
        n: 0,
        mean: 0,
        median: 0,
        mode: 0,
        min: 0,
        max: 0,
        range: 0,
        variance: 0,
        stdDev: 0,
        skewness: 0,
        kurtosis: 0,
        q1: 0,
        q3: 0,
        iqr: 0,
        outliers: [],
        interpretation: "Tidak ada data",
        category: "N/A",
      };
    }

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

/**
 * Lanczos approximation for log Gamma ln(Gamma(x))
 */
export function logGamma(x: number): number {
  if (x <= 0) return NaN;
  const cof = [
    76.18009172947146,
    -86.50532032941677,
    24.01409824083091,
    -1.231739572450155,
    0.1208650973866179e-2,
    -0.5395239384953e-5
  ];
  let y = x;
  let tmp = x + 5.5;
  tmp -= (x + 0.5) * Math.log(tmp);
  let ser = 1.000000000190015;
  for (let j = 0; j <= 5; j++) {
    ser += cof[j] / ++y;
  }
  return -tmp + Math.log(2.5066282746310005 * ser / x);
}

/**
 * Continued fraction representation helper for incomplete beta function
 */
function betaCF(a: number, b: number, x: number): number {
  const MAXIT = 100;
  const EPS = 3e-7;
  const FPMIN = 1e-30;
  
  const qab = a + b;
  const qap = a + 1;
  const qam = a - 1;
  let c = 1.0;
  let d = 1.0 - qab * x / qap;
  if (Math.abs(d) < FPMIN) d = FPMIN;
  d = 1.0 / d;
  let h = d;
  
  for (let m = 1; m <= MAXIT; m++) {
    const m2 = 2 * m;
    // Even step
    let aa = m * (b - m) * x / ((qam + m2) * (a + m2));
    d = 1.0 + aa * d;
    if (Math.abs(d) < FPMIN) d = FPMIN;
    c = 1.0 + aa / c;
    if (Math.abs(c) < FPMIN) c = FPMIN;
    d = 1.0 / d;
    h *= d * c;
    
    // Odd step
    aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
    d = 1.0 + aa * d;
    if (Math.abs(d) < FPMIN) d = FPMIN;
    c = 1.0 + aa / c;
    if (Math.abs(c) < FPMIN) c = FPMIN;
    d = 1.0 / d;
    const del = d * c;
    h *= del;
    if (Math.abs(del - 1.0) < EPS) break;
  }
  return h;
}

/**
 * Regularized Incomplete Beta function I_x(a, b)
 */
export function regularizedIncompleteBeta(a: number, b: number, x: number): number {
  if (x < 0 || x > 1) return NaN;
  if (x === 0) return 0;
  if (x === 1) return 1;
  
  const bt = Math.exp(logGamma(a + b) - logGamma(a) - logGamma(b) + a * Math.log(x) + b * Math.log(1.0 - x));
  
  if (x < (a + 1.0) / (a + b + 2.0)) {
    return bt * betaCF(a, b, x) / a;
  } else {
    return 1.0 - bt * betaCF(b, a, 1.0 - x) / b;
  }
}

/**
 * Compute p-value from F-distribution
 */
export function fDistributionPValue(fStat: number, df1: number, df2: number): number {
  if (fStat <= 0) return 1.0;
  const x = df2 / (df1 * fStat + df2);
  const pValue = regularizedIncompleteBeta(df2 / 2, df1 / 2, x);
  return isNaN(pValue) ? 1.0 : pValue;
}

/**
 * Compute p-value from Student's t-distribution (two-tailed)
 */
export function tDistributionPValue(tStat: number, df: number): number {
  const absT = Math.abs(tStat);
  if (df <= 0) return 1.0;
  const x = df / (absT * absT + df);
  const pValue = regularizedIncompleteBeta(df / 2, 0.5, x);
  return isNaN(pValue) ? 1.0 : pValue;
}

/**
 * Get critical t-value for given df and alpha (default 0.05) using bisection
 */
export function getStudentTCriticalValue(df: number, alpha: number = 0.05): number {
  if (df <= 0) return 1.96;
  let low = 0.0;
  let high = 100.0;
  let tCrit = 1.96;
  for (let i = 0; i < 50; i++) {
    const mid = (low + high) / 2;
    const p = tDistributionPValue(mid, df);
    if (p > alpha) {
      low = mid;
    } else {
      high = mid;
      tCrit = mid;
    }
    if (Math.abs(high - low) < 1e-6) break;
  }
  return tCrit;
}

/**
 * Compute One-Way ANOVA and post-hoc pairwise comparisons with Bonferroni correction
 */
export function computeAnova(
  rawData: Record<string, number>[],
  variables: string[],
): AnovaResult | null {
  if (!rawData || rawData.length === 0 || !variables || variables.length < 2) {
    return null;
  }

  // Extract valid data per group (variable)
  const groupsData: { name: string; data: number[] }[] = variables.map((variable) => {
    const data = rawData
      .map((row) => row[variable])
      .filter((val) => val !== undefined && val !== null && !isNaN(val));
    return { name: variable, data };
  });

  // Ensure all groups have valid data
  if (groupsData.some((g) => g.data.length === 0)) {
    return null;
  }

  const k = groupsData.length;
  const nList = groupsData.map((g) => g.data.length);
  const N = nList.reduce((sum, n) => sum + n, 0);

  // Calculate stats for each group
  const groupStats: GroupStat[] = groupsData.map((g) => {
    const n = g.data.length;
    const avg = mean(g.data);
    const v = variance(g.data, 1); // Sample variance
    const sd = stdDev(g.data, 1);  // Sample std dev
    const sem = sd / Math.sqrt(n);
    
    // Critical t for 95% CI
    const tCrit = getStudentTCriticalValue(n - 1, 0.05);
    const ciHalf = tCrit * sem;
    const ciLower = avg - ciHalf;
    const ciUpper = avg + ciHalf;

    return {
      name: g.name,
      n,
      mean: avg,
      variance: v,
      stdDev: sd,
      sem,
      ciLower,
      ciUpper,
    };
  });

  // Calculate Grand Mean
  let totalSum = 0;
  groupsData.forEach((g) => {
    totalSum += g.data.reduce((sum, val) => sum + val, 0);
  });
  const grandMean = totalSum / N;

  // Calculate SS Between
  let ssBetween = 0;
  groupStats.forEach((g) => {
    ssBetween += g.n * Math.pow(g.mean - grandMean, 2);
  });

  // Calculate SS Within
  let ssWithin = 0;
  groupsData.forEach((g, idx) => {
    const gMean = groupStats[idx].mean;
    ssWithin += g.data.reduce((sum, val) => sum + Math.pow(val - gMean, 2), 0);
  });

  const ssTotal = ssBetween + ssWithin;

  const dfBetween = k - 1;
  const dfWithin = N - k;
  const dfTotal = N - 1;

  const msBetween = ssBetween / dfBetween;
  const msWithin = dfWithin > 0 ? ssWithin / dfWithin : 0;

  const fStatistic = msWithin > 0 ? msBetween / msWithin : 0;
  const pValue = fDistributionPValue(fStatistic, dfBetween, dfWithin);
  const alpha = 0.05;
  const isSignificant = pValue < alpha;

  // Post-hoc Pairwise Comparisons with Bonferroni Correction
  const pairwiseComparisons: PairwiseComparison[] = [];
  const numComparisons = (k * (k - 1)) / 2;

  for (let i = 0; i < k; i++) {
    for (let j = i + 1; j < k; j++) {
      const gA = groupStats[i];
      const gB = groupStats[j];
      const meanDiff = gA.mean - gB.mean;

      // Standard Error of the difference using MS_Within
      // SE = sqrt( MS_within * (1/n_A + 1/n_B) )
      const seDiff = Math.sqrt(msWithin * (1 / gA.n + 1 / gB.n));
      const tStat = seDiff > 0 ? meanDiff / seDiff : 0;
      
      // Raw p-value from t-distribution
      const pValRaw = tDistributionPValue(tStat, dfWithin);
      
      // Adjusted p-value (Bonferroni)
      const pValAdj = Math.min(1.0, pValRaw * numComparisons);
      const pairSignificant = pValAdj < alpha;

      let pairInterpretation = "";
      if (pairSignificant) {
        pairInterpretation = `Terdapat perbedaan rata-rata yang signifikan antara ${gA.name} dan ${gB.name} (selisih = ${meanDiff.toFixed(2)}, p-value adj = ${pValAdj.toExponential(3)}).`;
      } else {
        pairInterpretation = `Tidak ada perbedaan rata-rata yang signifikan antara ${gA.name} dan ${gB.name} (selisih = ${meanDiff.toFixed(2)}, p-value adj = ${pValAdj.toFixed(4)}).`;
      }

      pairwiseComparisons.push({
        groupA: gA.name,
        groupB: gB.name,
        meanDiff,
        tStatistic: tStat,
        pValueRaw: pValRaw,
        pValueAdj: pValAdj,
        isSignificant: pairSignificant,
        interpretation: pairInterpretation,
      });
    }
  }

  let interpretation = "";
  if (isSignificant) {
    interpretation = `Uji ANOVA satu arah menunjukkan bahwa terdapat perbedaan rata-rata yang signifikan secara statistik di antara aspek-aspek yang dianalisis (F(${dfBetween}, ${dfWithin}) = ${fStatistic.toFixed(2)}, p-value = ${pValue.toExponential(3)} < 0.05). Berdasarkan uji post-hoc Bonferroni, terdapat perbedaan nyata pada beberapa pasangan aspek. Hal ini mengindikasikan persepsi kepuasan pengguna tidak merata di seluruh indikator produk.`;
  } else {
    interpretation = `Uji ANOVA satu arah menunjukkan bahwa tidak terdapat perbedaan rata-rata yang signifikan secara statistik di antara aspek-aspek yang dianalisis (F(${dfBetween}, ${dfWithin}) = ${fStatistic.toFixed(2)}, p-value = ${pValue.toFixed(4)} >= 0.05). Penilaian pengguna di seluruh aspek cenderung homogen atau setara.`;
  }

  return {
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
    significanceLevel: alpha,
    groupStats,
    pairwiseComparisons,
    interpretation,
    grandMean,
    totalN: N,
  };
}
