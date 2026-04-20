import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { DescriptiveStats } from "@/types";

const COLORS = {
  darkBlue: [13, 38, 89] as [number, number, number],
  midBlue: [46, 89, 153] as [number, number, number],
  lightBlue: [217, 232, 247] as [number, number, number],
  accent: [230, 102, 26] as [number, number, number],
  green: [26, 140, 89] as [number, number, number],
  red: [191, 38, 38] as [number, number, number],
  gold: [217, 166, 26] as [number, number, number],
  text: [31, 31, 31] as [number, number, number],
  lightGray: [242, 242, 242] as [number, number, number],
};

export async function generatePDFReport(
  stats: DescriptiveStats[],
  rawData: Record<string, number>[],
) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  let currentPage = 1;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;

  // Helper function untuk add header/footer
  const addHeaderFooter = (pageNum: number) => {
    if (pageNum > 1) {
      // Header
      doc.setDrawColor(...COLORS.darkBlue);
      doc.setLineWidth(0.5);
      doc.line(margin, 15, pageWidth - margin, 15);

      doc.setFontSize(8);
      doc.setTextColor(...COLORS.darkBlue);
      doc.setFont("times", "bold");
      doc.text("Laporan Statistik Deskriptif Aplikasi", margin, 12);

      doc.setFont("times", "normal");
      doc.setTextColor(...COLORS.midBlue);
      doc.text("Universitas Teknologi Digital", pageWidth - margin, 12, {
        align: "right",
      });

      // Footer
      doc.setDrawColor(180, 180, 180);
      doc.setLineWidth(0.3);
      doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);

      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(`— ${pageNum} —`, pageWidth / 2, pageHeight - 10, {
        align: "center",
      });

      doc.setFontSize(7);
      doc.text("Statistika Deskriptif", margin, pageHeight - 10);
      doc.text("Genap 2024/2025", pageWidth - margin, pageHeight - 10, {
        align: "right",
      });
    }
  };

  // ===== COVER PAGE =====
  doc.setFillColor(...COLORS.darkBlue);
  doc.rect(0, 0, pageWidth, 80, "F");

  // Accent triangle
  doc.setFillColor(...COLORS.accent);
  doc.triangle(pageWidth, 0, pageWidth - 40, 0, pageWidth, 40, "F");

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFont("times", "bold");
  doc.setFontSize(24);
  doc.text("ANALISIS STATISTIK", pageWidth / 2, 35, { align: "center" });
  doc.text("DESKRIPTIF APLIKASI", pageWidth / 2, 45, { align: "center" });

  doc.setFontSize(14);
  doc.setFont("times", "normal");
  doc.setTextColor(217, 232, 247);
  doc.text("Studi Kepuasan Pengguna Berbasis Kuesioner", pageWidth / 2, 55, {
    align: "center",
  });

  // Info box
  const boxY = 100;
  doc.setFillColor(247, 247, 249);
  doc.roundedRect(margin + 5, boxY, pageWidth - 2 * margin - 10, 70, 3, 3, "F");

  doc.setDrawColor(...COLORS.midBlue);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin + 5, boxY, pageWidth - 2 * margin - 10, 70, 3, 3, "S");

  // Accent bar
  doc.setFillColor(...COLORS.midBlue);
  doc.roundedRect(margin + 5, boxY, 4, 70, 2, 2, "F");

  // Info text
  doc.setFont("times", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.text);

  const infoItems = [
    ["Mata Kuliah", "Statistika dan Probabilitas"],
    ["Institusi", "Universitas Teknologi Digital"],
    ["Program Studi", "Teknik Informatika"],
    ["Semester", "Genap 2024/2025"],
    ["Penyusun", "Tim Peneliti"],
    ["Dosen Pembimbing", "Nama Dosen, M.Kom."],
  ];

  let infoY = boxY + 12;
  infoItems.forEach(([label, value]) => {
    doc.setFont("times", "bold");
    doc.setTextColor(...COLORS.midBlue);
    doc.text(label, margin + 15, infoY);

    doc.setFont("times", "normal");
    doc.setTextColor(...COLORS.text);
    doc.text(`: ${value}`, margin + 60, infoY);

    infoY += 11;
  });

  // Bottom strip with variables
  doc.setFillColor(...COLORS.darkBlue);
  doc.rect(0, pageHeight - 25, pageWidth, 25, "F");

  const variables = ["Usability", "UI/UX", "Speed", "Features", "Satisfaction"];
  const varColors = [
    [59, 130, 246],
    [139, 92, 246],
    [239, 68, 68],
    [245, 158, 11],
    [16, 185, 129],
  ];

  const varWidth = pageWidth / variables.length;
  variables.forEach((v, i) => {
    const x = i * varWidth + varWidth / 2;

    doc.setFillColor(...(varColors[i] as [number, number, number]));
    doc.circle(x, pageHeight - 15, 2, "F");

    doc.setFont("times", "bold");
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text(v, x, pageHeight - 8, { align: "center" });
  });

  doc.setFontSize(9);
  doc.setTextColor(153, 178, 230);
  doc.text("2025", pageWidth - margin, pageHeight - 8, { align: "right" });

  // ===== BAB 1: PENDAHULUAN =====
  doc.addPage();
  currentPage++;
  addHeaderFooter(currentPage);

  let y = 30;

  // Bab header
  doc.setFillColor(...COLORS.darkBlue);
  doc.rect(margin, y, pageWidth - 2 * margin, 12, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("times", "bold");
  doc.setFontSize(14);
  doc.text("BAB 1 — PENDAHULUAN", margin + 5, y + 8);

  y += 20;

  // 1.1 Latar Belakang
  doc.setTextColor(...COLORS.midBlue);
  doc.setFontSize(12);
  doc.text("1.1 Latar Belakang", margin, y);
  y += 8;

  doc.setTextColor(...COLORS.text);
  doc.setFont("times", "normal");
  doc.setFontSize(10);

  const latarBelakang = [
    "Perkembangan teknologi aplikasi mobile telah mendorong peningkatan kebutuhan akan evaluasi kualitas dari perspektif pengguna. Penilaian pengguna terhadap aspek-aspek seperti kemudahan penggunaan (usability), antarmuka pengguna (UI/UX), kecepatan (speed), fitur yang tersedia (features), serta kepuasan keseluruhan (satisfaction) menjadi indikator penting dalam pengembangan produk digital yang berorientasi pengguna.",
    "",
    "Untuk memperoleh gambaran objektif terhadap kondisi tersebut, diperlukan pendekatan analisis kuantitatif yang sistematis. Statistik deskriptif menyediakan kerangka metodologis untuk meringkas, menginterpretasikan, dan memvisualisasikan data secara efektif sehingga dapat dijadikan dasar pengambilan keputusan.",
  ];

  latarBelakang.forEach((text) => {
    if (text === "") {
      y += 5;
    } else {
      const lines = doc.splitTextToSize(text, pageWidth - 2 * margin);
      doc.text(lines, margin, y);
      y += lines.length * 5 + 3;
    }
  });

  y += 5;

  // 1.2 Tujuan
  doc.setTextColor(...COLORS.midBlue);
  doc.setFont("times", "bold");
  doc.setFontSize(12);
  doc.text("1.2 Tujuan Analisis", margin, y);
  y += 8;

  doc.setTextColor(...COLORS.text);
  doc.setFont("times", "normal");
  doc.setFontSize(10);

  const tujuan = [
    "Menghitung ukuran pemusatan data (mean, median, modus) untuk setiap variabel.",
    "Mengukur penyebaran data (standar deviasi, varians, range, IQR).",
    "Mengidentifikasi bentuk distribusi data (skewness dan kurtosis).",
    "Mendeteksi data pencilan (outlier) menggunakan metode IQR.",
    "Menyajikan visualisasi data dalam bentuk histogram dan boxplot.",
    "Memberikan interpretasi dan rekomendasi berbasis temuan statistik.",
  ];

  tujuan.forEach((t) => {
    const lines = doc.splitTextToSize(`• ${t}`, pageWidth - 2 * margin - 5);
    doc.text(lines, margin + 5, y);
    y += lines.length * 5 + 2;
  });

  // ===== BAB 2: DATASET =====
  doc.addPage();
  currentPage++;
  addHeaderFooter(currentPage);

  y = 30;

  // Bab header
  doc.setFillColor(...COLORS.darkBlue);
  doc.rect(margin, y, pageWidth - 2 * margin, 12, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("times", "bold");
  doc.setFontSize(14);
  doc.text("BAB 2 — DATASET", margin + 5, y + 8);

  y += 20;

  // 2.1 Deskripsi Dataset
  doc.setTextColor(...COLORS.midBlue);
  doc.setFontSize(12);
  doc.text("2.1 Deskripsi Dataset", margin, y);
  y += 8;

  doc.setTextColor(...COLORS.text);
  doc.setFont("times", "normal");
  doc.setFontSize(10);

  const deskripsiDataset = [
    "Dataset penelitian ini terdiri dari 100 responden yang memberikan penilaian terhadap aplikasi mobile menggunakan skala Likert 1-5. Data dikumpulkan melalui kuesioner online selama periode Januari-Maret 2026.",
    "",
    "Setiap responden memberikan penilaian terhadap 5 aspek utama aplikasi, yaitu: Usability (kemudahan penggunaan), UI/UX (kualitas desain dan pengalaman pengguna), Speed (kecepatan dan responsivitas), Features (kelengkapan fitur), dan Satisfaction (kepuasan keseluruhan).",
  ];

  deskripsiDataset.forEach((text) => {
    if (text === "") {
      y += 5;
    } else {
      const lines = doc.splitTextToSize(text, pageWidth - 2 * margin);
      doc.text(lines, margin, y);
      y += lines.length * 5 + 3;
    }
  });

  y += 5;

  // 2.2 Variabel Penelitian
  doc.setTextColor(...COLORS.midBlue);
  doc.setFont("times", "bold");
  doc.setFontSize(12);
  doc.text("2.2 Variabel Penelitian", margin, y);
  y += 10;

  // Tabel variabel
  const variabelData = [
    ["1", "Usability", "Kemudahan penggunaan antarmuka aplikasi", "Likert 1-5"],
    [
      "2",
      "UI/UX",
      "Kualitas desain visual dan pengalaman pengguna",
      "Likert 1-5",
    ],
    ["3", "Speed", "Kecepatan respon dan loading aplikasi", "Likert 1-5"],
    ["4", "Features", "Kelengkapan dan kegunaan fitur aplikasi", "Likert 1-5"],
    ["5", "Satisfaction", "Kepuasan keseluruhan pengguna", "Likert 1-5"],
  ];

  autoTable(doc, {
    startY: y,
    head: [["No", "Variabel", "Definisi Operasional", "Skala"]],
    body: variabelData,
    theme: "grid",
    styles: {
      font: "times",
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: COLORS.darkBlue,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "center",
    },
    columnStyles: {
      0: { halign: "center", cellWidth: 15 },
      1: { cellWidth: 30 },
      2: { cellWidth: 90 },
      3: { halign: "center", cellWidth: 25 },
    },
  });

  y = (doc as any).lastAutoTable.finalY + 10;

  // Sampel data
  doc.setTextColor(...COLORS.midBlue);
  doc.setFont("times", "bold");
  doc.setFontSize(12);
  doc.text("2.3 Sampel Data", margin, y);
  y += 10;

  const sampleData = rawData
    .slice(0, 10)
    .map((row, idx) => [
      (idx + 1).toString(),
      row.Usability.toString(),
      row["UI/UX"].toString(),
      row.Speed.toString(),
      row.Features.toString(),
      row.Satisfaction.toString(),
    ]);

  autoTable(doc, {
    startY: y,
    head: [
      ["Resp.", "Usability", "UI/UX", "Speed", "Features", "Satisfaction"],
    ],
    body: sampleData,
    theme: "grid",
    styles: {
      font: "times",
      fontSize: 9,
      cellPadding: 3,
      halign: "center",
    },
    headStyles: {
      fillColor: COLORS.darkBlue,
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    columnStyles: {
      0: { fillColor: COLORS.lightBlue },
    },
  });

  // ===== BAB 3: METODOLOGI =====
  doc.addPage();
  currentPage++;
  addHeaderFooter(currentPage);

  y = 30;

  // Bab header
  doc.setFillColor(...COLORS.darkBlue);
  doc.rect(margin, y, pageWidth - 2 * margin, 12, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("times", "bold");
  doc.setFontSize(14);
  doc.text("BAB 3 — METODOLOGI", margin + 5, y + 8);

  y += 20;

  // 3.1 Statistik Deskriptif
  doc.setTextColor(...COLORS.midBlue);
  doc.setFontSize(12);
  doc.text("3.1 Statistik Deskriptif", margin, y);
  y += 8;

  doc.setTextColor(...COLORS.text);
  doc.setFont("times", "normal");
  doc.setFontSize(10);

  const metodologiStats = [
    "Statistik deskriptif digunakan untuk meringkas dan mendeskripsikan karakteristik data. Ukuran-ukuran yang digunakan meliputi:",
    "",
    "a) Ukuran Pemusatan Data:",
    "   - Mean (rata-rata): jumlah semua nilai dibagi banyaknya data",
    "   - Median: nilai tengah setelah data diurutkan",
    "   - Modus: nilai yang paling sering muncul",
    "",
    "b) Ukuran Penyebaran Data:",
    "   - Range: selisih antara nilai maksimum dan minimum",
    "   - Varians: rata-rata kuadrat simpangan dari mean",
    "   - Standar Deviasi: akar kuadrat dari varians",
    "   - IQR (Interquartile Range): selisih antara Q3 dan Q1",
    "",
    "c) Ukuran Bentuk Distribusi:",
    "   - Skewness: mengukur kemencengan distribusi data",
    "   - Kurtosis: mengukur keruncingan distribusi data",
  ];

  metodologiStats.forEach((text) => {
    if (text === "") {
      y += 4;
    } else {
      const lines = doc.splitTextToSize(text, pageWidth - 2 * margin);
      doc.text(lines, margin, y);
      y += lines.length * 5 + 2;
    }
  });

  y += 5;

  // 3.2 Visualisasi Data
  doc.setTextColor(...COLORS.midBlue);
  doc.setFont("times", "bold");
  doc.setFontSize(12);
  doc.text("3.2 Visualisasi Data", margin, y);
  y += 8;

  doc.setTextColor(...COLORS.text);
  doc.setFont("times", "normal");
  doc.setFontSize(10);

  const metodologiVis = [
    "Visualisasi data dilakukan menggunakan dua jenis grafik utama:",
    "",
    "a) Histogram: menampilkan distribusi frekuensi data untuk setiap variabel. Histogram membantu mengidentifikasi pola distribusi, nilai yang paling sering muncul, dan bentuk sebaran data.",
    "",
    "b) Boxplot: menampilkan ringkasan lima angka (minimum, Q1, median, Q3, maksimum) dan outlier. Boxplot memudahkan perbandingan distribusi antar variabel dan identifikasi nilai ekstrem.",
  ];

  metodologiVis.forEach((text) => {
    if (text === "") {
      y += 4;
    } else {
      const lines = doc.splitTextToSize(text, pageWidth - 2 * margin);
      doc.text(lines, margin, y);
      y += lines.length * 5 + 2;
    }
  });

  y += 5;

  // 3.3 Deteksi Outlier
  doc.setTextColor(...COLORS.midBlue);
  doc.setFont("times", "bold");
  doc.setFontSize(12);
  doc.text("3.3 Deteksi Outlier", margin, y);
  y += 8;

  doc.setTextColor(...COLORS.text);
  doc.setFont("times", "normal");
  doc.setFontSize(10);

  const metodologiOutlier = [
    "Outlier adalah nilai yang secara signifikan berbeda dari nilai-nilai lainnya dalam dataset. Deteksi outlier menggunakan metode IQR (Interquartile Range) dengan kriteria:",
    "",
    "Outlier = nilai < (Q1 - 1.5 × IQR) atau nilai > (Q3 + 1.5 × IQR)",
    "",
    "Dimana:",
    "- Q1 adalah kuartil pertama (persentil ke-25)",
    "- Q3 adalah kuartil ketiga (persentil ke-75)",
    "- IQR = Q3 - Q1",
    "",
    "Metode ini efektif untuk mengidentifikasi nilai ekstrem yang mungkin disebabkan oleh kesalahan pengukuran atau karakteristik unik responden tertentu.",
  ];

  metodologiOutlier.forEach((text) => {
    if (text === "") {
      y += 4;
    } else {
      const lines = doc.splitTextToSize(text, pageWidth - 2 * margin);
      doc.text(lines, margin, y);
      y += lines.length * 5 + 2;
    }
  });

  // ===== BAB 4: HASIL DAN PEMBAHASAN (TABEL STATISTIK) =====
  doc.addPage();
  currentPage++;
  addHeaderFooter(currentPage);

  y = 30;

  // Bab header
  doc.setFillColor(...COLORS.darkBlue);
  doc.rect(margin, y, pageWidth - 2 * margin, 12, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("times", "bold");
  doc.setFontSize(14);
  doc.text("BAB 4 — HASIL DAN PEMBAHASAN", margin + 5, y + 8);

  y += 20;

  doc.setTextColor(...COLORS.midBlue);
  doc.setFontSize(12);
  doc.text("4.1 Statistik Deskriptif", margin, y);
  y += 10;

  // Tabel statistik
  const tableData = [
    ["N (Valid)", ...stats.map((s) => s.n.toString())],
    ["Mean", ...stats.map((s) => s.mean.toFixed(2))],
    ["Median", ...stats.map((s) => s.median.toFixed(2))],
    [
      "Modus",
      ...stats.map((s) =>
        Array.isArray(s.mode) ? s.mode.join(", ") : s.mode.toString(),
      ),
    ],
    ["Std. Deviasi", ...stats.map((s) => s.stdDev.toFixed(2))],
    ["Varians", ...stats.map((s) => s.variance.toFixed(2))],
    ["Minimum", ...stats.map((s) => s.min.toString())],
    ["Maksimum", ...stats.map((s) => s.max.toString())],
    ["Range", ...stats.map((s) => s.range.toString())],
    ["Q1", ...stats.map((s) => s.q1.toFixed(2))],
    ["Q3", ...stats.map((s) => s.q3.toFixed(2))],
    ["IQR", ...stats.map((s) => s.iqr.toFixed(2))],
    ["Skewness", ...stats.map((s) => s.skewness.toFixed(2))],
    ["Kurtosis", ...stats.map((s) => s.kurtosis.toFixed(2))],
    ["Outlier (n)", ...stats.map((s) => s.outliers.length.toString())],
    ["Kategori", ...stats.map((s) => s.category)],
  ];

  autoTable(doc, {
    startY: y,
    head: [["Statistik", ...stats.map((s) => s.variable)]],
    body: tableData,
    theme: "grid",
    styles: {
      font: "times",
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: COLORS.darkBlue,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "center",
    },
    columnStyles: {
      0: {
        fillColor: COLORS.lightBlue,
        fontStyle: "bold",
        textColor: COLORS.midBlue,
      },
    },
    alternateRowStyles: {
      fillColor: [245, 248, 255],
    },
  });

  y = (doc as any).lastAutoTable.finalY + 10;

  // Caption tabel
  doc.setFont("times", "italic");
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  const caption = "Tabel 1. Statistik Deskriptif Variabel Penelitian (n=100)";
  doc.text(caption, pageWidth / 2, y, { align: "center" });

  // ===== 4.2 Analisis Distribusi Data =====
  doc.addPage();
  currentPage++;
  addHeaderFooter(currentPage);

  y = 30;

  doc.setTextColor(...COLORS.midBlue);
  doc.setFont("times", "bold");
  doc.setFontSize(12);
  doc.text("4.2 Analisis Distribusi Data", margin, y);
  y += 10;

  doc.setTextColor(...COLORS.text);
  doc.setFont("times", "normal");
  doc.setFontSize(10);

  const analisisDistribusi = [
    "Berdasarkan nilai skewness dan kurtosis, dapat diidentifikasi bentuk distribusi data untuk setiap variabel:",
  ];

  analisisDistribusi.forEach((text) => {
    const lines = doc.splitTextToSize(text, pageWidth - 2 * margin);
    doc.text(lines, margin, y);
    y += lines.length * 5 + 3;
  });

  y += 5;

  // Tabel interpretasi distribusi
  const distribusiData = stats.map((s) => [
    s.variable,
    s.skewness.toFixed(2),
    s.kurtosis.toFixed(2),
    s.interpretation,
  ]);

  autoTable(doc, {
    startY: y,
    head: [["Variabel", "Skewness", "Kurtosis", "Interpretasi"]],
    body: distribusiData,
    theme: "grid",
    styles: {
      font: "times",
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: COLORS.darkBlue,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "center",
    },
    columnStyles: {
      0: { cellWidth: 35 },
      1: { halign: "center", cellWidth: 25 },
      2: { halign: "center", cellWidth: 25 },
      3: { cellWidth: 85 },
    },
  });

  y = (doc as any).lastAutoTable.finalY + 10;

  doc.setFont("times", "italic");
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text("Tabel 2. Interpretasi Bentuk Distribusi Data", pageWidth / 2, y, {
    align: "center",
  });

  y += 10;

  // Narasi interpretasi
  doc.setTextColor(...COLORS.text);
  doc.setFont("times", "normal");
  doc.setFontSize(10);

  const narasiDistribusi = [
    `Variabel dengan distribusi paling simetris adalah ${stats.reduce((min, s) => (Math.abs(s.skewness) < Math.abs(min.skewness) ? s : min)).variable} dengan nilai skewness ${stats.reduce((min, s) => (Math.abs(s.skewness) < Math.abs(min.skewness) ? s : min)).skewness.toFixed(2)}, mengindikasikan data terdistribusi relatif merata di sekitar nilai tengah.`,
    "",
    `Sebaliknya, ${stats.reduce((max, s) => (Math.abs(s.skewness) > Math.abs(max.skewness) ? s : max)).variable} menunjukkan kemencengan yang lebih signifikan dengan skewness ${stats.reduce((max, s) => (Math.abs(s.skewness) > Math.abs(max.skewness) ? s : max)).skewness.toFixed(2)}, menunjukkan konsentrasi data pada salah satu sisi distribusi.`,
  ];

  narasiDistribusi.forEach((text) => {
    if (text === "") {
      y += 4;
    } else {
      const lines = doc.splitTextToSize(text, pageWidth - 2 * margin);
      doc.text(lines, margin, y);
      y += lines.length * 5 + 3;
    }
  });

  // ===== 4.3 Deteksi dan Analisis Outlier =====
  doc.addPage();
  currentPage++;
  addHeaderFooter(currentPage);

  y = 30;

  doc.setTextColor(...COLORS.midBlue);
  doc.setFont("times", "bold");
  doc.setFontSize(12);
  doc.text("4.3 Deteksi dan Analisis Outlier", margin, y);
  y += 10;

  doc.setTextColor(...COLORS.text);
  doc.setFont("times", "normal");
  doc.setFontSize(10);

  const totalOutliersAll = stats.reduce((sum, s) => sum + s.outliers.length, 0);
  const totalDataPoints = stats.length * 100;
  const outlierPercent = ((totalOutliersAll / totalDataPoints) * 100).toFixed(
    1,
  );

  const analisisOutlier = [
    `Deteksi outlier menggunakan metode IQR mengidentifikasi ${totalOutliersAll} nilai ekstrem dari total ${totalDataPoints} data poin (${outlierPercent}%). Distribusi outlier per variabel adalah sebagai berikut:`,
  ];

  analisisOutlier.forEach((text) => {
    const lines = doc.splitTextToSize(text, pageWidth - 2 * margin);
    doc.text(lines, margin, y);
    y += lines.length * 5 + 3;
  });

  y += 5;

  // Tabel outlier
  const outlierData = stats.map((s) => [
    s.variable,
    s.outliers.length.toString(),
    ((s.outliers.length / 100) * 100).toFixed(1) + "%",
    s.outliers.length > 0
      ? s.outliers.slice(0, 5).join(", ") + (s.outliers.length > 5 ? "..." : "")
      : "Tidak ada",
  ]);

  autoTable(doc, {
    startY: y,
    head: [
      ["Variabel", "Jumlah Outlier", "Persentase", "Contoh Nilai Outlier"],
    ],
    body: outlierData,
    theme: "grid",
    styles: {
      font: "times",
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: COLORS.darkBlue,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "center",
    },
    columnStyles: {
      0: { cellWidth: 35 },
      1: { halign: "center", cellWidth: 30 },
      2: { halign: "center", cellWidth: 25 },
      3: { cellWidth: 80 },
    },
    didParseCell: (data: any) => {
      if (data.section === "body" && data.column.index === 1) {
        const count = parseInt(data.cell.text[0]);
        if (count > 0) {
          data.cell.styles.textColor = COLORS.red;
          data.cell.styles.fontStyle = "bold";
        }
      }
    },
  });

  y = (doc as any).lastAutoTable.finalY + 10;

  doc.setFont("times", "italic");
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text("Tabel 3. Deteksi Outlier per Variabel", pageWidth / 2, y, {
    align: "center",
  });

  y += 10;

  // Interpretasi outlier
  doc.setTextColor(...COLORS.text);
  doc.setFont("times", "normal");
  doc.setFontSize(10);

  const varWithMostOutliers = stats.reduce((max, s) =>
    s.outliers.length > max.outliers.length ? s : max,
  );
  const varWithNoOutliers = stats.filter((s) => s.outliers.length === 0);

  const interpretasiOutlier = [
    varWithMostOutliers.outliers.length > 0
      ? `Variabel ${varWithMostOutliers.variable} memiliki outlier terbanyak (${varWithMostOutliers.outliers.length} nilai), mengindikasikan adanya responden dengan penilaian yang sangat berbeda dari mayoritas. Hal ini dapat disebabkan oleh pengalaman pengguna yang unik atau ekspektasi yang berbeda.`
      : "Tidak ditemukan outlier yang signifikan pada semua variabel, menunjukkan konsistensi penilaian yang baik di antara responden.",
    "",
    varWithNoOutliers.length > 0
      ? `Variabel ${varWithNoOutliers.map((v) => v.variable).join(", ")} tidak memiliki outlier, menunjukkan distribusi penilaian yang homogen dan konsisten dari seluruh responden.`
      : "Semua variabel memiliki setidaknya satu outlier, menunjukkan keberagaman pendapat responden.",
  ];

  interpretasiOutlier.forEach((text) => {
    if (text === "") {
      y += 4;
    } else {
      const lines = doc.splitTextToSize(text, pageWidth - 2 * margin);
      doc.text(lines, margin, y);
      y += lines.length * 5 + 3;
    }
  });

  // ===== BAB 5: KESIMPULAN =====
  doc.addPage();
  currentPage++;
  addHeaderFooter(currentPage);

  y = 30;

  doc.setFillColor(...COLORS.darkBlue);
  doc.rect(margin, y, pageWidth - 2 * margin, 12, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("times", "bold");
  doc.setFontSize(14);
  doc.text("BAB 5 — KESIMPULAN", margin + 5, y + 8);

  y += 20;

  const avgMean = stats.reduce((sum, s) => sum + s.mean, 0) / stats.length;
  const highestStat = stats.reduce((max, s) => (s.mean > max.mean ? s : max));
  const lowestStat = stats.reduce((min, s) => (s.mean < min.mean ? s : min));
  const totalOutliers = stats.reduce((sum, s) => sum + s.outliers.length, 0);

  doc.setTextColor(...COLORS.text);
  doc.setFont("times", "normal");
  doc.setFontSize(10);

  const kesimpulan = [
    `Berdasarkan analisis statistik deskriptif terhadap 100 responden dengan 5 variabel pengukuran, dapat disimpulkan bahwa aplikasi mendapat penilaian yang ${avgMean > 3.5 ? "positif" : "cukup baik"} secara keseluruhan dengan rata-rata ${avgMean.toFixed(2)}.`,
    "",
    `Aspek ${highestStat.variable} memperoleh penilaian tertinggi (${highestStat.mean.toFixed(2)}) yang termasuk kategori "${highestStat.category}", menunjukkan kekuatan utama aplikasi.`,
    "",
    `Sebaliknya, ${lowestStat.variable} mendapat penilaian terendah (${lowestStat.mean.toFixed(2)}) yang memerlukan perhatian khusus untuk perbaikan.`,
    "",
    `Deteksi outlier menunjukkan ${totalOutliers} dari 500 data poin (${((totalOutliers / 500) * 100).toFixed(1)}%) merupakan nilai ekstrem, mengindikasikan ${totalOutliers < 25 ? "konsistensi yang baik" : "variasi pendapat yang cukup beragam"} di antara responden.`,
  ];

  kesimpulan.forEach((text) => {
    if (text === "") {
      y += 5;
    } else {
      const lines = doc.splitTextToSize(text, pageWidth - 2 * margin);
      doc.text(lines, margin, y);
      y += lines.length * 5 + 3;
    }
  });

  // ===== BAB 6: REKOMENDASI =====
  doc.addPage();
  currentPage++;
  addHeaderFooter(currentPage);

  y = 30;

  doc.setFillColor(...COLORS.darkBlue);
  doc.rect(margin, y, pageWidth - 2 * margin, 12, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("times", "bold");
  doc.setFontSize(14);
  doc.text("BAB 6 — REKOMENDASI", margin + 5, y + 8);

  y += 20;

  const rekomendasi = [
    {
      no: 1,
      aksi: "Optimasi performa dan kecepatan loading aplikasi",
      target: lowestStat.variable,
      prioritas: "HIGH",
      timeline: "Q2 2026",
    },
    {
      no: 2,
      aksi: "Peningkatan konsistensi dan kualitas UI/UX",
      target: "UI/UX",
      prioritas: "MEDIUM",
      timeline: "Q2 2026",
    },
    {
      no: 3,
      aksi: "Penambahan fitur berdasarkan feedback pengguna",
      target: "Features",
      prioritas: "MEDIUM",
      timeline: "Q3 2026",
    },
    {
      no: 4,
      aksi: "Program peningkatan kepuasan dan engagement pengguna",
      target: "Satisfaction",
      prioritas: "LOW",
      timeline: "Q3 2026",
    },
  ];

  autoTable(doc, {
    startY: y,
    head: [["No", "Rekomendasi", "Target", "Prioritas", "Timeline"]],
    body: rekomendasi.map((r) => [
      r.no.toString(),
      r.aksi,
      r.target,
      r.prioritas,
      r.timeline,
    ]),
    theme: "grid",
    styles: {
      font: "times",
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: COLORS.darkBlue,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "center",
    },
    columnStyles: {
      0: { halign: "center", cellWidth: 15 },
      1: { cellWidth: 80 },
      2: { halign: "center", cellWidth: 25 },
      3: { halign: "center", cellWidth: 25 },
      4: { halign: "center", cellWidth: 25 },
    },
  });

  // Save PDF
  doc.save("Laporan_Statistik_Deskriptif.pdf");
}
