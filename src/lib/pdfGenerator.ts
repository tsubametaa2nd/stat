import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";
import { DescriptiveStats, AnovaResult } from "@/types";

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

/**
 * Capture element as image using html2canvas
 */
async function captureElement(elementId: string): Promise<string | null> {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      console.warn(`Element with id "${elementId}" not found`);
      return null;
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: "#ffffff",
      logging: false,
      useCORS: true,
    });

    return canvas.toDataURL("image/png");
  } catch (error) {
    console.error(`Error capturing element ${elementId}:`, error);
    return null;
  }
}

export async function generatePDFReport(
  stats: DescriptiveStats[],
  rawData: Record<string, number>[],
  anovaData: AnovaResult | null,
  mode: "deskriptif" | "anova",
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

  // Dynamic date helpers
  const currentYear = new Date().getFullYear();
  const semesterStr = `Genap ${currentYear - 1}/${currentYear}`;
  const currentDateFormatted = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const reportTitle =
    mode === "deskriptif"
      ? "LAPORAN STATISTIK DESKRIPTIF"
      : "LAPORAN ANALISIS VARIANSI (ANOVA)";

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
      doc.text(
        mode === "deskriptif"
          ? "Laporan Analisis Statistik Deskriptif"
          : "Laporan Analisis Variansi (ANOVA)",
        margin,
        12,
      );

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
      doc.text(
        mode === "deskriptif" ? "Statistika Deskriptif" : "Uji Hipotesis ANOVA",
        margin,
        pageHeight - 10,
      );
      doc.text(semesterStr, pageWidth - margin, pageHeight - 10, {
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
  doc.setFontSize(22);
  
  if (mode === "deskriptif") {
    doc.text("ANALISIS STATISTIK", pageWidth / 2, 32, { align: "center" });
    doc.text("DESKRIPTIF DATASET", pageWidth / 2, 42, { align: "center" });
  } else {
    doc.text("ANALISIS VARIANSI (ANOVA)", pageWidth / 2, 32, { align: "center" });
    doc.text("KOMPARATIF KELOMPOK", pageWidth / 2, 42, { align: "center" });
  }

  doc.setFontSize(12);
  doc.setFont("times", "normal");
  doc.setTextColor(217, 232, 247);
  doc.text(
    mode === "deskriptif"
      ? "Studi Profil & Distribusi Penilaian Observasi"
      : "Studi Komparasi & Pengujian Perbedaan Rata-rata Kelompok",
    pageWidth / 2,
    52,
    { align: "center" },
  );

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
    ["Jenis Laporan", mode === "deskriptif" ? "Analisis Statistik Deskriptif" : "Analisis Variansi (ANOVA)"],
    ["Program Studi", "Sistem Informasi"],
    ["Semester", semesterStr],
    ["Tanggal Ekspor", currentDateFormatted],
    ["Ukuran Sampel", `${rawData.length} Responden / Observasi`],
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

  const variables = stats.map((s) => s.variable);
  const varColors = [
    [59, 130, 246],
    [139, 92, 246],
    [239, 68, 68],
    [245, 158, 11],
    [16, 185, 129],
    [236, 72, 153],
    [20, 184, 166],
    [249, 115, 22],
  ];

  const varWidth = pageWidth / Math.max(variables.length, 5);
  variables.forEach((v, i) => {
    const x = i * varWidth + varWidth / 2;

    doc.setFillColor(
      ...(varColors[i % varColors.length] as [number, number, number]),
    );
    doc.circle(x, pageHeight - 15, 2, "F");

    doc.setFont("times", "bold");
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text(v, x, pageHeight - 8, { align: "center" });
  });

  doc.setFontSize(9);
  doc.setTextColor(153, 178, 230);
  doc.text(currentYear.toString(), pageWidth - margin, pageHeight - 8, { align: "right" });

  // ===== BAB 1: PENDAHULUAN =====
  doc.addPage();
  currentPage++;
  addHeaderFooter(currentPage);

  let y = 30;

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

  const latarBelakang =
    mode === "deskriptif"
      ? [
          "Evaluasi kualitas variabel-variabel kuantitatif dalam sebuah dataset merupakan instrumen penting bagi proses analisis ilmiah dan pengambilan keputusan. Untuk memperoleh gambaran objektif terhadap karakteristik data dari responden, diperlukan pendekatan analisis kuantitatif deskriptif.",
          "",
          "Statistik deskriptif menyediakan kerangka metodologis untuk meringkas, menginterpretasikan, dan memvisualisasikan data (menggunakan histogram dan boxplot) secara efektif sehingga pola sebaran, keragaman opini, dan nilai ekstrem (outlier) dapat dipahami dengan mudah.",
        ]
      : [
          "Dalam analisis dataset kuantitatif yang terdiri dari beberapa kelompok atau variabel pengukuran (seperti aspek kualitas produk atau penilaian kinerja), membandingkan rata-rata secara individu tidaklah cukup untuk membuktikan perbedaan ilmiah secara valid.",
          "",
          "Uji Analisis Variansi (ANOVA) satu arah menyediakan landasan teoretis untuk menguji hipotesis nol secara simultan bahwa tidak ada perbedaan rata-rata di antara semua kelompok yang dianalisis. Bila pengujian ini terbukti signifikan, dilanjutkan dengan perbandingan berpasangan (post-hoc) menggunakan koreksi Bonferroni untuk mengidentifikasi variabel spesifik mana yang mengalami kesenjangan skor secara nyata.",
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

  const tujuan =
    mode === "deskriptif"
      ? [
          "Menghitung ukuran pemusatan data (mean, median, modus) untuk setiap variabel.",
          "Mengukur tingkat penyebaran data (standar deviasi, varians, rentang, dan interquartile range).",
          "Mengidentifikasi bentuk distribusi data melalui nilai skewness dan kurtosis.",
          "Mendeteksi keberadaan pencilan data (outliers) dengan batas pagar luar Tukey.",
          "Menyajikan visualisasi distribusi frekuensi menggunakan grafik histogram dan boxplot.",
        ]
      : [
          "Menguji secara statistik apakah terdapat perbedaan rata-rata penilaian yang signifikan di antara seluruh variabel.",
          "Menghitung nilai F-hitung dan membandingkannya terhadap distribusi F teoritis guna memperoleh p-value.",
          "Menganalisis perbandingan berpasangan (post-hoc) t-test di antara variabel-variabel dengan koreksi Bonferroni.",
          "Menyajikan visualisasi interval rata-rata beserta rentang Confidence Interval 95% untuk mendeteksi tumpang tindih persepsi.",
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
    `Dataset penelitian ini terdiri dari ${rawData.length} responden/observasi yang telah divalidasi dan dikonversi ke dalam format numerik. Pengambilan sampel dilakukan untuk mengukur penilaian terhadap beberapa indikator utama secara kuantitatif.`,
    "",
    `Setiap observasi memberikan skor terhadap ${variables.length} aspek penelitian, yaitu: ${variables.join(", ")}. Nilai observasi dianalisis secara komparatif untuk mendalami parameter statistik deskriptif maupun inferensial kelompok.`,
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

  const variabelData = stats.map((stat, index) => [
    (index + 1).toString(),
    stat.variable,
    `Penilaian pengguna terhadap indikator ${stat.variable}`,
    "Numerik",
  ]);

  autoTable(doc, {
    startY: y,
    head: [["No", "Variabel", "Definisi Operasional", "Tipe Data"]],
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
      1: { cellWidth: 35 },
      2: { cellWidth: 85 },
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

  const dataVariables = stats.map((s) => s.variable);
  const sampleData = rawData
    .slice(0, 10)
    .map((row, idx) => [
      (idx + 1).toString(),
      ...dataVariables.map((v) =>
        row[v] !== undefined && row[v] !== null ? row[v].toString() : "-",
      ),
    ]);

  autoTable(doc, {
    startY: y,
    head: [["Resp.", ...dataVariables]],
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

  doc.setFillColor(...COLORS.darkBlue);
  doc.rect(margin, y, pageWidth - 2 * margin, 12, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("times", "bold");
  doc.setFontSize(14);
  doc.text("BAB 3 — METODOLOGI", margin + 5, y + 8);

  y += 20;

  if (mode === "deskriptif") {
    // 3.1 Statistik Deskriptif
    doc.setTextColor(...COLORS.midBlue);
    doc.setFontSize(12);
    doc.text("3.1 Statistik Deskriptif", margin, y);
    y += 8;

    doc.setTextColor(...COLORS.text);
    doc.setFont("times", "normal");
    doc.setFontSize(10);

    const metodologiStats = [
      "Statistik deskriptif digunakan untuk meringkas dan mendeskripsikan karakteristik data observasi. Ukuran-ukuran yang dihitung meliputi:",
      "",
      "a) Ukuran Pemusatan Data:",
      "   - Mean (rata-rata): jumlah semua nilai dibagi banyaknya data observasi.",
      "   - Median: nilai tengah setelah data diurutkan dari kecil ke besar.",
      "   - Modus: nilai yang memiliki frekuensi pemunculan tertinggi.",
      "",
      "b) Ukuran Penyebaran Data:",
      "   - Rentang (Range): selisih antara nilai maksimum dan minimum.",
      "   - Varians: rata-rata kuadrat simpangan dari nilai mean.",
      "   - Standar Deviasi: akar kuadrat dari varians, menunjukkan dispersi data asli.",
      "   - IQR (Interquartile Range): selisih nilai Q3 dan Q1.",
      "",
      "c) Ukuran Bentuk Distribusi:",
      "   - Skewness: derajat ketidaksimetrisan sebaran data di sekitar mean.",
      "   - Kurtosis: derajat keruncingan kurva distribusi frekuensi dibanding normal.",
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
      "a) Histogram: menampilkan distribusi frekuensi sebaran data ke dalam kelas-kelas interval, berguna untuk mengidentifikasi kemiringan (skewness) sebaran.",
      "",
      "b) Boxplot: menggambarkan pemusatan kuartil bawah (Q1), median (Q2), kuartil atas (Q3), rentang whiskers, dan pencilan ekstrem secara visual.",
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
  } else {
    // ANOVA Metodologi
    doc.setTextColor(...COLORS.midBlue);
    doc.setFontSize(12);
    doc.text("3.1 Analisis Variansi (ANOVA One-Way)", margin, y);
    y += 8;

    doc.setTextColor(...COLORS.text);
    doc.setFont("times", "normal");
    doc.setFontSize(10);

    const metodologiAnova = [
      "Uji ANOVA satu arah digunakan untuk membandingkan rata-rata dari k kelompok independen kuantitatif guna melihat apakah kelompok-kelompok tersebut ditarik dari populasi dengan mean yang sama. Uji ini membagi variabilitas total data menjadi dua bagian:",
      "",
      "1. Variabilitas antar kelompok (Between-groups Variance): variansi yang dipicu oleh perbedaan nyata antar kelompok variabel.",
      "2. Variabilitas dalam kelompok (Within-groups Variance): variansi acak di dalam masing-masing individu kelompok.",
      "",
      "Rasio kedua variansi ini menghasilkan F-statistik (F-hitung). Jika F-hitung cukup besar sehingga p-value < 0.05, maka hipotesis nol (bahwa seluruh rata-rata kelompok adalah sama) ditolak secara ilmiah.",
    ];

    metodologiAnova.forEach((text) => {
      if (text === "") {
        y += 4;
      } else {
        const lines = doc.splitTextToSize(text, pageWidth - 2 * margin);
        doc.text(lines, margin, y);
        y += lines.length * 5 + 2;
      }
    });

    y += 5;

    // 3.2 Uji Post-Hoc t-Test Bonferroni
    doc.setTextColor(...COLORS.midBlue);
    doc.setFont("times", "bold");
    doc.setFontSize(12);
    doc.text("3.2 Uji Perbandingan Berpasangan (Post-Hoc Bonferroni)", margin, y);
    y += 8;

    doc.setTextColor(...COLORS.text);
    doc.setFont("times", "normal");
    doc.setFontSize(10);

    const metodologiPostHoc = [
      "Uji ANOVA hanya memberi tahu apakah terdapat perbedaan rata-rata secara keseluruhan, tetapi tidak merinci kelompok mana yang berbeda satu sama lain. Oleh karena itu, jika uji ANOVA signifikan, dilakukan uji post-hoc berpasangan.",
      "",
      "Metode Bonferroni digunakan untuk menjaga agar tingkat kesalahan Tipe I keluarga (family-wise error rate) tidak melonjak akibat melakukan beberapa uji t berulang. Bonferroni mengoreksi nilai p-value dengan mengalikan nilai p-value t-test mentah dengan jumlah total perbandingan berpasangan (m = k(k-1)/2).",
    ];

    metodologiPostHoc.forEach((text) => {
      if (text === "") {
        y += 4;
      } else {
        const lines = doc.splitTextToSize(text, pageWidth - 2 * margin);
        doc.text(lines, margin, y);
        y += lines.length * 5 + 2;
      }
    });
  }

  // ===== BAB 4: HASIL DAN PEMBAHASAN =====
  doc.addPage();
  currentPage++;
  addHeaderFooter(currentPage);

  y = 30;

  doc.setFillColor(...COLORS.darkBlue);
  doc.rect(margin, y, pageWidth - 2 * margin, 12, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("times", "bold");
  doc.setFontSize(14);
  doc.text("BAB 4 — HASIL DAN PEMBAHASAN", margin + 5, y + 8);

  y += 20;

  if (mode === "deskriptif") {
    doc.setTextColor(...COLORS.midBlue);
    doc.setFontSize(12);
    doc.text("4.1 Ringkasan Parameter Statistik Deskriptif", margin, y);
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

    y = (doc as any).lastAutoTable.finalY + 8;

    doc.setFont("times", "italic");
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Tabel 1. Parameter Deskriptif Variabel Penelitian (n=${rawData.length})`,
      pageWidth / 2,
      y,
      { align: "center" },
    );
    y += 15;

    // 4.2 Analisis Distribusi Data
    if (y > pageHeight - 80) {
      doc.addPage();
      currentPage++;
      addHeaderFooter(currentPage);
      y = 30;
    }

    doc.setTextColor(...COLORS.midBlue);
    doc.setFont("times", "bold");
    doc.setFontSize(12);
    doc.text("4.2 Analisis Distribusi Data", margin, y);
    y += 8;

    doc.setTextColor(...COLORS.text);
    doc.setFont("times", "normal");
    doc.setFontSize(10);
    doc.text(
      "Berdasarkan nilai skewness dan kurtosis, bentuk sebaran distribusi data diidentifikasi sebagai berikut:",
      margin,
      y,
    );
    y += 8;

    const distribusiData = stats.map((s) => [
      s.variable,
      s.skewness.toFixed(2),
      s.kurtosis.toFixed(2),
      s.interpretation,
    ]);

    autoTable(doc, {
      startY: y,
      head: [["Variabel", "Skewness", "Kurtosis", "Interpretasi Sebaran"]],
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

    y = (doc as any).lastAutoTable.finalY + 8;

    doc.setFont("times", "italic");
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text("Tabel 2. Penafsiran Bentuk Distribusi Variabel", pageWidth / 2, y, {
      align: "center",
    });
    y += 15;

    // 4.3 Deteksi Outlier
    if (y > pageHeight - 80) {
      doc.addPage();
      currentPage++;
      addHeaderFooter(currentPage);
      y = 30;
    }

    doc.setTextColor(...COLORS.midBlue);
    doc.setFont("times", "bold");
    doc.setFontSize(12);
    doc.text("4.3 Deteksi dan Analisis Outlier", margin, y);
    y += 8;

    doc.setTextColor(...COLORS.text);
    doc.setFont("times", "normal");
    doc.setFontSize(10);

    const totalOutliersAll = stats.reduce((sum, s) => sum + s.outliers.length, 0);
    const totalDataPointsOutlier = stats.length * rawData.length;
    const outlierPercent = (
      (totalOutliersAll / totalDataPointsOutlier) *
      100
    ).toFixed(1);

    doc.text(
      `Deteksi outlier mendeteksi sebanyak ${totalOutliersAll} pencilan data dari total ${totalDataPointsOutlier} data poin (${outlierPercent}%).`,
      margin,
      y,
    );
    y += 8;

    const outlierData = stats.map((s) => [
      s.variable,
      s.outliers.length.toString(),
      ((s.outliers.length / rawData.length) * 100).toFixed(1) + "%",
      s.outliers.length > 0
        ? s.outliers.slice(0, 5).join(", ") + (s.outliers.length > 5 ? "..." : "")
        : "Tidak ada",
    ]);

    autoTable(doc, {
      startY: y,
      head: [
        ["Variabel", "Jumlah Outlier", "Persentase", "Sampel Nilai Outlier"],
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

    y = (doc as any).lastAutoTable.finalY + 8;

    doc.setFont("times", "italic");
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text("Tabel 3. Ringkasan Outlier Data per Variabel", pageWidth / 2, y, {
      align: "center",
    });
    y += 15;

    // 4.4 Visualisasi
    console.log("Capturing visualizations for PDF...");
    const histogramImage = await captureElement("histogram-section");
    const boxplotImage = await captureElement("boxplot-section");

    if (histogramImage || boxplotImage) {
      doc.addPage();
      currentPage++;
      addHeaderFooter(currentPage);
      y = 30;

      doc.setTextColor(...COLORS.midBlue);
      doc.setFont("times", "bold");
      doc.setFontSize(12);
      doc.text("4.4 Visualisasi Data Deskriptif", margin, y);
      y += 8;

      if (histogramImage) {
        doc.setTextColor(...COLORS.text);
        doc.setFont("times", "normal");
        doc.setFontSize(10);
        doc.text("Histogram Distribusi Frekuensi:", margin, y);
        y += 6;

        const imgWidth = pageWidth - 2 * margin;
        const imgHeight = 75;
        doc.addImage(histogramImage, "PNG", margin, y, imgWidth, imgHeight);
        y += imgHeight + 4;

        doc.setFont("times", "italic");
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text("Gambar 1. Histogram Distribusi Frekuensi Variabel", pageWidth / 2, y, {
          align: "center",
        });
        y += 12;
      }

      if (boxplotImage) {
        if (y > pageHeight - 90) {
          doc.addPage();
          currentPage++;
          addHeaderFooter(currentPage);
          y = 30;
        }

        doc.setTextColor(...COLORS.text);
        doc.setFont("times", "normal");
        doc.setFontSize(10);
        doc.text("Boxplot Sebaran & Komparasi Kuartil:", margin, y);
        y += 6;

        const imgWidth = pageWidth - 2 * margin;
        const imgHeight = 75;
        doc.addImage(boxplotImage, "PNG", margin, y, imgWidth, imgHeight);
        y += imgHeight + 4;

        doc.setFont("times", "italic");
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text("Gambar 2. Box & Whisker Plot Komparasi Variabel", pageWidth / 2, y, {
          align: "center",
        });
      }
    }
  } else {
    // ANOVA Mode Hasil & Pembahasan
    if (anovaData) {
      doc.setTextColor(...COLORS.midBlue);
      doc.setFontSize(12);
      doc.text("4.1 Uji F Analisis Variansi (ANOVA)", margin, y);
      y += 10;

      // APA Table
      const formatPValue = (p: number) => {
        if (p < 0.001) return p.toExponential(3);
        return p.toFixed(4);
      };

      const anovaTableRows = [
        [
          "Antar Kelompok (Between Groups)",
          anovaData.ssBetween.toFixed(3),
          anovaData.dfBetween.toString(),
          anovaData.msBetween.toFixed(3),
          anovaData.fStatistic.toFixed(3),
          formatPValue(anovaData.pValue),
        ],
        [
          "Dalam Kelompok (Within Groups)",
          anovaData.ssWithin.toFixed(3),
          anovaData.dfWithin.toString(),
          anovaData.msWithin.toFixed(3),
          "",
          "",
        ],
        [
          "Total",
          anovaData.ssTotal.toFixed(3),
          anovaData.dfTotal.toString(),
          "",
          "",
          "",
        ],
      ];

      autoTable(doc, {
        startY: y,
        head: [["Sumber Variasi", "SS (Jml Kuadrat)", "df", "MS (Rerata Kuadrat)", "F-Hitung", "P-Value"]],
        body: anovaTableRows,
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
          0: { cellWidth: 50 },
          1: { halign: "center", cellWidth: 30 },
          2: { halign: "center", cellWidth: 15 },
          3: { halign: "center", cellWidth: 30 },
          4: { halign: "center", cellWidth: 25 },
          5: { halign: "center", cellWidth: 25 },
        },
      });

      y = (doc as any).lastAutoTable.finalY + 6;

      doc.setFont("times", "italic");
      doc.setFontSize(8.5);
      doc.setTextColor(100, 100, 100);
      doc.text("Tabel 1. Ringkasan Hasil Pengujian ANOVA Satu Arah", pageWidth / 2, y, {
        align: "center",
      });
      y += 10;

      // Catatan Rincian Perhitungan df & ANOVA
      doc.setFont("times", "bold");
      doc.setFontSize(9);
      doc.setTextColor(...COLORS.midBlue);
      doc.text("Rincian Perhitungan Derajat Bebas (df) & Statistik ANOVA:", margin, y);
      y += 5;

      doc.setFont("times", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(60, 60, 60);

      const k = anovaData.groupStats.length;
      const totalN = anovaData.totalN || (anovaData.dfTotal + 1);

      const dfLines = [
        `1. df Antar Kelompok (df_Between) = k - 1 = ${k} - 1 = ${anovaData.dfBetween}`,
        `2. df Dalam Kelompok (df_Within) = N - k = ${totalN} - ${k} = ${anovaData.dfWithin}`,
        `3. df Total (df_Total) = N - 1 = ${totalN} - 1 = ${anovaData.dfTotal}`,
        `4. MS Between = SS_Between / df_Between = ${anovaData.ssBetween.toFixed(3)} / ${anovaData.dfBetween} = ${anovaData.msBetween.toFixed(3)}`,
        `5. MS Within = SS_Within / df_Within = ${anovaData.ssWithin.toFixed(3)} / ${anovaData.dfWithin} = ${anovaData.msWithin.toFixed(3)}`,
        `6. F-Hitung = MS_Between / MS_Within = ${anovaData.msBetween.toFixed(3)} / ${anovaData.msWithin.toFixed(3)} = ${anovaData.fStatistic.toFixed(3)}`,
      ];

      dfLines.forEach((line) => {
        doc.text(line, margin + 2, y);
        y += 4.5;
      });

      y += 8;

      // 4.2 Visualisasi Interval Plot
      const anovaPlotImage = await captureElement("anova-plot-card");
      if (anovaPlotImage) {
        if (y > pageHeight - 90) {
          doc.addPage();
          currentPage++;
          addHeaderFooter(currentPage);
          y = 30;
        }

        doc.setTextColor(...COLORS.text);
        doc.setFont("times", "normal");
        doc.setFontSize(10);
        doc.text("Interval Plot Rata-rata & 95% Confidence Interval (CI):", margin, y);
        y += 6;

        const imgWidth = pageWidth - 2 * margin;
        const imgHeight = 70;
        doc.addImage(anovaPlotImage, "PNG", margin, y, imgWidth, imgHeight);
        y += imgHeight + 4;

        doc.setFont("times", "italic");
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text("Gambar 1. Interval Kepercayaan Rata-rata 95% Kelompok", pageWidth / 2, y, {
          align: "center",
        });
        y += 15;
      }

      // 4.3 Post-hoc Pairwise Comparisons
      if (y > pageHeight - 80) {
        doc.addPage();
        currentPage++;
        addHeaderFooter(currentPage);
        y = 30;
      }

      doc.setTextColor(...COLORS.midBlue);
      doc.setFont("times", "bold");
      doc.setFontSize(12);
      doc.text("4.3 Perbandingan Berpasangan Uji Post-Hoc Bonferroni", margin, y);
      y += 8;

      const postHocRows = anovaData.pairwiseComparisons.map((item) => [
        `${item.groupA} vs ${item.groupB}`,
        (item.meanDiff > 0 ? "+" : "") + item.meanDiff.toFixed(2),
        item.tStatistic.toFixed(2),
        formatPValue(item.pValueAdj),
        item.isSignificant ? "Signifikan" : "Tidak Signifikan",
      ]);

      autoTable(doc, {
        startY: y,
        head: [["Perbandingan Kelompok", "Selisih Mean", "t-Statistik", "p-value (Adj)", "Hasil Uji"]],
        body: postHocRows,
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
          0: { cellWidth: 50 },
          1: { halign: "center", cellWidth: 25 },
          2: { halign: "center", cellWidth: 25 },
          3: { halign: "center", cellWidth: 30 },
          4: { halign: "center", cellWidth: 40 },
        },
        didParseCell: (data: any) => {
          if (data.section === "body" && data.column.index === 4) {
            const isSig = data.cell.text[0] === "Signifikan";
            if (isSig) {
              data.cell.styles.textColor = COLORS.green;
              data.cell.styles.fontStyle = "bold";
            }
          }
        },
      });

      y = (doc as any).lastAutoTable.finalY + 8;

      doc.setFont("times", "italic");
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text("Tabel 2. Hasil Komparasi Berpasangan Koreksi Bonferroni", pageWidth / 2, y, {
        align: "center",
      });
      y += 15;

      // 4.4 Interpretasi Hasil Uji
      if (y > pageHeight - 60) {
        doc.addPage();
        currentPage++;
        addHeaderFooter(currentPage);
        y = 30;
      }

      doc.setTextColor(...COLORS.midBlue);
      doc.setFont("times", "bold");
      doc.setFontSize(12);
      doc.text("4.4 Interpretasi Hasil Analisis Variansi", margin, y);
      y += 8;

      doc.setTextColor(...COLORS.text);
      doc.setFont("times", "normal");
      doc.setFontSize(10);

      const interpLines = doc.splitTextToSize(anovaData.interpretation, pageWidth - 2 * margin);
      doc.text(interpLines, margin, y);
      y += interpLines.length * 5 + 5;

      if (anovaData.isSignificant) {
        const diffMax = anovaData.pairwiseComparisons.reduce((max, item) =>
          Math.abs(item.meanDiff) > Math.abs(max.meanDiff) ? item : max
        );
        const extraInterp = `Berdasarkan perbandingan di atas, kesenjangan terbesar terdapat pada perbandingan aspek ${diffMax.groupA} dan ${diffMax.groupB} dengan selisih mean ${Math.abs(diffMax.meanDiff).toFixed(2)} (p-value adj = ${formatPValue(diffMax.pValueAdj)}), yang menunjukkan bahwa kepuasan responden tidak homogen pada kedua variabel tersebut.`;
        
        const extraLines = doc.splitTextToSize(extraInterp, pageWidth - 2 * margin);
        doc.text(extraLines, margin, y);
        y += extraLines.length * 5 + 5;
      }
    }
  }

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
  const totalDataPoints = stats.length * rawData.length;

  doc.setTextColor(...COLORS.text);
  doc.setFont("times", "normal");
  doc.setFontSize(10);

  let kesimpulan: string[] = [];

  if (mode === "deskriptif") {
    kesimpulan = [
      `Berdasarkan analisis statistik deskriptif terhadap ${rawData.length} responden dengan ${stats.length} variabel pengukuran, dapat disimpulkan bahwa data menunjukkan karakteristik sebaran rata-rata keseluruhan sebesar ${avgMean.toFixed(2)}.`,
      "",
      `Aspek ${highestStat.variable} memperoleh penilaian tertinggi (${highestStat.mean.toFixed(2)}) yang termasuk kategori "${highestStat.category}", menunjukkan kekuatan utama dari data yang dianalisis.`,
      "",
      `Sebaliknya, aspek ${lowestStat.variable} mendapat penilaian terendah (${lowestStat.mean.toFixed(2)}) yang memerlukan perhatian khusus untuk perbaikan di masa mendatang.`,
      "",
      `Deteksi outlier menunjukkan terdapat ${totalOutliers} pencilan ekstrem dari total ${totalDataPoints} poin data (${((totalOutliers / totalDataPoints) * 100).toFixed(1)}%), mengindikasikan adanya ${totalOutliers < totalDataPoints * 0.05 ? "konsistensi penilaian yang tinggi" : "variabilitas tanggapan yang cukup lebar"} di antara observasi.`,
    ];
  } else {
    kesimpulan = [
      `Berdasarkan pengujian hipotesis ANOVA satu arah terhadap ${rawData.length} responden dengan ${stats.length} variabel, terbukti secara statistik bahwa terdapat ${anovaData?.isSignificant ? "perbedaan rata-rata yang signifikan secara nyata" : "tidak ada perbedaan rata-rata yang signifikan"} di antara kelompok aspek (F = ${anovaData?.fStatistic.toFixed(2)}, p-value = ${anovaData ? (anovaData.pValue < 0.001 ? anovaData.pValue.toExponential(3) : anovaData.pValue.toFixed(4)) : ""}).`,
      "",
      anovaData?.isSignificant
        ? `Hasil pengujian post-hoc Bonferroni menegaskan adanya perbedaan nyata di beberapa kelompok berpasangan, dengan perbedaan skor tertinggi tercatat pada perbandingan aspek ${
            anovaData.pairwiseComparisons.reduce((max, item) =>
              Math.abs(item.meanDiff) > Math.abs(max.meanDiff) ? item : max
            ).groupA
          } vs ${
            anovaData.pairwiseComparisons.reduce((max, item) =>
              Math.abs(item.meanDiff) > Math.abs(max.meanDiff) ? item : max
            ).groupB
          } (selisih = ${Math.abs(
            anovaData.pairwiseComparisons.reduce((max, item) =>
              Math.abs(item.meanDiff) > Math.abs(max.meanDiff) ? item : max
            ).meanDiff
          ).toFixed(2)} poin).`
        : "Seluruh variabel dinilai setara oleh observasi, menunjukkan tidak adanya kesenjangan mutu yang nyata di antara indikator-indikator yang diteliti.",
      "",
      `Analisis visual plot interval 95% Confidence Interval mengonfirmasi bahwa rentang taksiran rata-rata kelompok ${highestStat.variable} dan ${lowestStat.variable} ${anovaData?.isSignificant ? "saling terpisah secara nyata" : "saling beririsan (tumpang tindih)"}, selaras dengan kesimpulan uji hipotesis ANOVA.`,
    ];
  }

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

  const rekomendasiRows: string[][] = [];

  if (mode === "deskriptif") {
    rekomendasiRows.push(
      [
        "1",
        `Lakukan optimasi dan peningkatan performa intensif untuk aspek ${lowestStat.variable} guna meningkatkan kepuasan pengguna.`,
        lowestStat.variable,
        "HIGH",
        "Q2 " + currentYear,
      ],
      [
        "2",
        "Lakukan audit desain secara berkala untuk mempertahankan konsistensi antarmuka pengguna.",
        "UI/UX",
        "MEDIUM",
        "Q2 " + currentYear,
      ],
      [
        "3",
        "Tambahkan fitur-fitur pendukung secara bertahap sesuai kebutuhan prioritas.",
        "Features",
        "MEDIUM",
        "Q3 " + currentYear,
      ],
      [
        "4",
        "Pertahankan keunggulan layanan dan lakukan monitoring kepuasan pengguna secara reguler.",
        "Satisfaction",
        "LOW",
        "Q4 " + currentYear,
      ],
    );
  } else {
    if (anovaData?.isSignificant) {
      rekomendasiRows.push(
        [
          "1",
          `Fokuskan peningkatan kualitas pada variabel ${lowestStat.variable} untuk memperkecil gap perbedaan rata-rata yang signifikan dibanding ${highestStat.variable}.`,
          lowestStat.variable,
          "HIGH",
          "Q2 " + currentYear,
        ],
        [
          "2",
          "Standardisasi proses dan infrastruktur layanan antar-aspek agar persepsi kualitas lebih merata di seluruh indikator.",
          "Semua Aspek",
          "MEDIUM",
          "Q3 " + currentYear,
        ],
        [
          "3",
          "Lakukan evaluasi pasca-implementasi perbaikan untuk memverifikasi apakah gap variansi mean telah berhasil dieliminasi.",
          "Evaluasi Ulang",
          "MEDIUM",
          "Q4 " + currentYear,
        ],
      );
    } else {
      rekomendasiRows.push(
        [
          "1",
          "Pertahankan kualitas yang sudah merata secara homogen di seluruh indikator variabel agar kepuasan pengguna tetap seimbang.",
          "Semua Aspek",
          "MEDIUM",
          "Q3 " + currentYear,
        ],
        [
          "2",
          "Lakukan audit performa preventif untuk mencegah penurunan mendadak pada salah satu aspek penilaian.",
          "Maintenance",
          "LOW",
          "Q4 " + currentYear,
        ],
      );
    }
  }

  autoTable(doc, {
    startY: y,
    head: [["No", "Aksi Rekomendasi Kerja", "Sasaran / Target", "Prioritas", "Timeline Target"]],
    body: rekomendasiRows,
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
  doc.save(
    mode === "deskriptif"
      ? "Laporan_Statistik_Deskriptif.pdf"
      : "Laporan_Analisis_ANOVA.pdf",
  );
}
