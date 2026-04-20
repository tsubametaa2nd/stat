# Laporan Statistik Deskriptif - Aplikasi Web

Aplikasi web interaktif untuk menampilkan analisis statistik deskriptif dari data kuesioner 100 responden dengan 5 variabel pengukuran: **Usability**, **UI/UX**, **Speed**, **Features**, dan **Satisfaction**.

## 🎯 Fitur Utama

- **Dashboard Interaktif** - Tampilan laporan statistik yang modern dan responsif
- **Statistik Deskriptif Lengkap** - Mean, Median, Modus, Standar Deviasi, Varians, Skewness, Kurtosis, IQR, dan Outlier
- **Visualisasi Data**:
  - Histogram distribusi frekuensi per variabel
  - Boxplot perbandingan antar variabel
  - Chart analisis mean, variasi, dan outlier
- **Analisis Otomatis** - Interpretasi data, kesimpulan, dan rekomendasi yang di-generate otomatis
- **Export PDF** - Generate laporan akademik lengkap dalam format PDF (fitur tersedia)
- **Responsive Design** - Tampilan optimal di desktop, tablet, dan mobile

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + CSS Variables
- **Charts**: Recharts
- **Icons**: Lucide React
- **PDF Generation**: jsPDF + jspdf-autotable
- **Font**: Plus Jakarta Sans (Google Fonts)

## 📦 Instalasi

1. Clone repository ini:

```bash
git clone <repository-url>
cd stat
```

2. Install dependencies:

```bash
npm install
```

3. Jalankan development server:

```bash
npm run dev
```

4. Buka browser dan akses [http://localhost:3000](http://localhost:3000)

## 🚀 Cara Menggunakan

1. **Halaman Utama** akan redirect otomatis ke `/laporan`
2. **Navigasi** menggunakan navbar sticky di atas atau scroll manual
3. **Histogram** - Klik tab variabel untuk melihat distribusi masing-masing
4. **Tabel Statistik** - Toggle "Tampilkan/Sembunyikan Statistik Lanjutan" untuk detail lengkap
5. **Download PDF** - Klik button floating di kanan bawah (jika diaktifkan)

## 📊 Struktur Data

Dataset terdiri dari 100 responden dengan 5 variabel skala Likert (1-5):

| Variabel     | Deskripsi                               |
| ------------ | --------------------------------------- |
| Usability    | Kemudahan penggunaan aplikasi           |
| UI/UX        | Kualitas desain dan pengalaman pengguna |
| Speed        | Kecepatan dan responsivitas aplikasi    |
| Features     | Kelengkapan dan kegunaan fitur          |
| Satisfaction | Kepuasan keseluruhan pengguna           |

## 📁 Struktur Proyek

```
src/
├── app/
│   ├── layout.tsx          # Root layout dengan Google Fonts
│   ├── page.tsx            # Redirect ke /laporan
│   ├── globals.css         # Global styles & CSS variables
│   └── laporan/
│       └── page.tsx        # Halaman laporan utama
├── components/
│   ├── ui/                 # Komponen UI dasar
│   │   ├── SectionCard.tsx
│   │   ├── StatBadge.tsx
│   │   └── SectionTitle.tsx
│   ├── layout/
│   │   └── Navbar.tsx      # Navigation dengan smooth scroll
│   └── sections/           # Section komponen
│       ├── HeroSection.tsx
│       ├── DatasetSection.tsx
│       ├── MetodologiSection.tsx
│       ├── TabelStatistik.tsx
│       ├── HistogramChart.tsx
│       ├── BoxplotChart.tsx
│       ├── AnalisisNarasi.tsx
│       ├── KesimpulanSection.tsx
│       └── RekomendasiSection.tsx
├── lib/
│   ├── data.ts             # Data dummy 100 responden
│   ├── statistics.ts       # Fungsi perhitungan statistik
│   └── pdfGenerator.ts     # Generator PDF laporan
└── types/
    └── index.ts            # TypeScript types & interfaces
```

## 🎨 Tema & Warna

Aplikasi menggunakan tema **"Scientific Dark"** dengan palet warna:

- **Primary**: `#0A0E1A` (Dark Blue)
- **Secondary**: `#111827` (Card Background)
- **Accent Blue**: `#3B82F6`
- **Accent Cyan**: `#06B6D4`
- **Accent Gold**: `#F59E0B`
- **Accent Green**: `#10B981`
- **Accent Red**: `#EF4444`

## 📈 Metodologi Statistik

### Ukuran Pemusatan

- **Mean**: Rata-rata aritmatika
- **Median**: Nilai tengah data terurut
- **Modus**: Nilai yang paling sering muncul

### Ukuran Penyebaran

- **Range**: Selisih nilai maksimum dan minimum
- **Varians**: Rata-rata kuadrat simpangan dari mean
- **Standar Deviasi**: Akar kuadrat dari varians
- **IQR**: Interquartile Range (Q3 - Q1)

### Ukuran Bentuk Distribusi

- **Skewness**: Kemencengan distribusi
- **Kurtosis**: Keruncingan distribusi

### Deteksi Outlier

Menggunakan metode IQR:

```
Outlier = nilai < (Q1 - 1.5 × IQR) atau nilai > (Q3 + 1.5 × IQR)
```

## 🔧 Scripts

```bash
# Development
npm run dev

# Build production
npm run build

# Start production server
npm start

# Lint
npm run lint
```
