# Generator PDF Laporan Karya Ilmiah Statistik Deskriptif

## Gambaran Proyek

Buat **satu script js** bernama `report-summary.js` yang menghasilkan file
`Laporan_Statistik_Deskriptif.pdf` — berformat karya ilmiah akademik lengkap, profesional,
siap cetak. Semua data, statistik, dan chart di-generate langsung dari script ini (tidak
perlu file eksternal).

---

## Struktur Output PDF (8–12 halaman)

```
BAB 1 — Pendahuluan (Latar Belakang + Tujuan)
BAB 2 — Dataset (Deskripsi + Tabel Sampel Data)
BAB 3 — Metodologi
BAB 4 — Hasil dan Pembahasan
                 4.1 Tabel Statistik Deskriptif Lengkap
                 4.2 Histogram (5 variabel dalam 1 grid)
                 4.3 Boxplot Comparison
                 4.4 Analisis Naratif (mean, variasi, outlier)
BAB 5 — Kesimpulan
BAB 6 — Rekomendasi
Daftar Pustaka
```

---

## Instalasi

---

## File yang Harus Dibuat

### Hanya 1 file: `report-summary.js`

Susun dalam bagian-bagian berikut (gunakan komentar `# ===== BAGIAN X =====`):

---

## BAGIAN 1 — KONFIGURASI & KONSTANTA

# ===== KONFIGURASI =====

JUDUL         = "Analisis Statistik Deskriptif Aplikasi Mobile"
SUB_JUDUL     = "Studi Kepuasan Pengguna Berbasis Kuesioner"
INSTITUSI     = "Universitas [Nama Institusi]"
PROGRAM_STUDI = "Program Studi Teknik Informatika"
MATA_KULIAH   = "Statistika dan Probabilitas"
SEMESTER      = "Genap 2024/2025"
PENYUSUN      = "Tim Peneliti"
DOSEN         = "Nama Dosen Pembimbing, M.Kom."
OUTPUT_FILE   = "Laporan_Statistik_Deskriptif.pdf"

VARIABLES = ["Usability", "UI/UX", "Speed", "Features", "Satisfaction"]

# Warna tema (RGB 0–1)
COLOR_DARK_BLUE  = (0.05, 0.15, 0.35)   # Header utama
COLOR_MID_BLUE   = (0.18, 0.35, 0.60)   # Sub-header, aksen
COLOR_LIGHT_BLUE = (0.85, 0.91, 0.97)   # Background tabel baris genap
COLOR_ACCENT     = (0.90, 0.40, 0.10)   # Highlight penting (oranye)
COLOR_GREEN      = (0.10, 0.55, 0.35)   # Nilai baik
COLOR_RED        = (0.75, 0.15, 0.15)   # Nilai rendah / outlier
COLOR_GOLD       = (0.85, 0.65, 0.10)   # Medium / sedang
COLOR_WHITE      = (1, 1, 1)
COLOR_LIGHT_GRAY = (0.95, 0.95, 0.95)
COLOR_TEXT       = (0.12, 0.12, 0.12)
```

---

## BAGIAN 2 — DATA & STATISTIK

### 2a. Generate Data Dummy (100 responden)

import numpy as np
np.random.seed(42)

# Distribusi berbeda tiap variabel agar analisis menarik:
# Usability    → skewed kanan  → beta distribution → clip ke 1–5 → round
# UI/UX        → hampir normal → normal(3.6, 0.8)
# Speed        → skewed kiri   → banyak nilai 2–3 → normal(3.0, 1.1)
# Features     → bimodal       → campuran normal(2.5) + normal(4.5)
# Satisfaction → normal        → normal(3.7, 0.9)

# Semua nilai di-clip ke range [1, 5] dan di-round ke integer
# Simpan sebagai dict: {"Usability": [3,4,4,...], "UI/UX": [3,5,2,...], ...}
```

### 2b. Fungsi Statistik (implementasi manual, BUKAN pandas.describe())

Implementasikan setiap fungsi dari scratch menggunakan numpy:

```python
def hitung_mean(data):        # np.mean
def hitung_median(data):      # np.median  
def hitung_modus(data):       # nilai paling sering (bisa multiple)
def hitung_varians(data):     # np.var(ddof=1) — varians sampel
def hitung_std(data):         # np.std(ddof=1)
def hitung_range(data):       # max - min
def hitung_skewness(data):    # scipy.stats.skew
def hitung_kurtosis(data):    # scipy.stats.kurtosis (excess)
def hitung_quartiles(data):   # Q1, Q2(median), Q3, IQR = np.percentile
def hitung_outlier(data):     # IQR method: < Q1-1.5*IQR atau > Q3+1.5*IQR
def interpret_skewness(skew): # return string interpretasi
def interpret_mean(mean_val): # "Sangat Tinggi" / "Tinggi" / "Sedang" / "Rendah"

def compute_all_stats(data_dict):
    """
    Return list of dict, satu per variabel:
    {
      "variable": str,
      "n": int,
      "mean": float,
      "median": float,
      "modus": str,          # "4" atau "4, 5" jika multiple
      "std": float,
      "varians": float,
      "min": int,
      "max": int,
      "range": int,
      "q1": float,
      "q3": float,
      "iqr": float,
      "skewness": float,
      "kurtosis": float,
      "outlier_count": int,
      "outlier_values": list,
      "outlier_percent": float,
      "interpretasi_skew": str,
      "kategori_mean": str,
      "warna_kategori": tuple,   # COLOR_GREEN / COLOR_GOLD / COLOR_RED
    }
    """
```

---

## BAGIAN 3 — GENERATOR CHART (matplotlib → embed ke PDF)

Buat fungsi yang menghasilkan chart sebagai `BytesIO` (buffer PNG), bukan file disk,
agar bisa langsung diembed ke ReportLab.

```python
from io import BytesIO
import matplotlib
matplotlib.use('Agg')  # WAJIB — non-interactive backend
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
```

### Chart 1: `generate_histogram_grid(data_dict, stats_list) → BytesIO`

- Figure size: 14 × 10 inch, DPI 150
- Layout: 2 baris × 3 kolom (5 variabel + 1 kosong)
- Tiap subplot = histogram 1 variabel:
  - Bar warna unik per variabel (pakai palet konsisten)
  - Garis vertikal merah putus-putus = mean, biru solid = median
  - Label sumbu X: "Nilai (Skala Likert 1–5)", Y: "Frekuensi"
  - Judul subplot = nama variabel
  - Anotasi kecil di pojok kanan atas: "Mean=X.XX | SD=X.XX"
  - Legenda mini: merah=mean, biru=median
- Background abu-abu sangat muda (#F8F9FA)
- Grid horizontal tipis
- `plt.tight_layout(pad=2.0)`
- Simpan ke BytesIO dengan `format='png'`, `dpi=150`, `bbox_inches='tight'`

### Chart 2: `generate_boxplot(data_dict, stats_list) → BytesIO`

- Figure size: 12 × 6 inch, DPI 150
- Satu axes, semua 5 variabel berdampingan
- Gunakan `plt.boxplot()` dengan:
  - `patch_artist=True` — box berwarna
  - `notch=False`
  - Tiap box = warna unik per variabel
  - `flierprops`: titik outlier merah ('o', markersize=5)
  - `medianprops`: garis median putih tebal
  - `whiskerprops`: garis tipis
- Sumbu X: nama variabel, Y: "Nilai (Skala Likert 1–5)"
- Judul: "Boxplot Perbandingan Semua Variabel"
- Tambah hline putus-putus abu-abu di y=1,2,3,4,5
- Grid horizontal
- Anotasi count outlier di atas tiap box jika > 0: "⚠ N outlier"

### Chart 3: `generate_mean_comparison(stats_list) → BytesIO`

- Figure size: 10 × 5 inch, DPI 150
- Horizontal bar chart mean semua variabel
- Bar diwarnai berdasarkan kategori: hijau (tinggi), kuning (sedang), merah (rendah)
- Garis vertikal putus-putus di x=3.0 (batas "Sedang") dan x=3.4 (batas "Tinggi")
- Label nilai di ujung bar: "3.87"
- Judul: "Perbandingan Nilai Rata-Rata Tiap Variabel"
- Urutkan dari tertinggi ke terendah

---

## BAGIAN 4 — PAGE TEMPLATE & STYLE

### Setup ReportLab Document

```python
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm, mm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, Image, HRFlowable, KeepTogether
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY, TA_RIGHT

PAGE_WIDTH, PAGE_HEIGHT = A4
MARGIN_LEFT   = 3.0 * cm
MARGIN_RIGHT  = 2.5 * cm
MARGIN_TOP    = 2.5 * cm
MARGIN_BOTTOM = 2.5 * cm
```

### Custom Page Template (Header + Footer tiap halaman)

```python
def on_page(canvas, doc):
    """Dipanggil tiap halaman — gambar header dan footer."""
    canvas.saveState()

    # ── HEADER (kecuali halaman 1 cover) ──
    if doc.page > 1:
        # Garis biru tebal di atas
        canvas.setStrokeColorRGB(*COLOR_DARK_BLUE)
        canvas.setLineWidth(2)
        canvas.line(MARGIN_LEFT, PAGE_HEIGHT - 1.8*cm,
                    PAGE_WIDTH - MARGIN_RIGHT, PAGE_HEIGHT - 1.8*cm)

        # Judul singkat di kiri header
        canvas.setFont("Helvetica-Bold", 8)
        canvas.setFillColorRGB(*COLOR_DARK_BLUE)
        canvas.drawString(MARGIN_LEFT, PAGE_HEIGHT - 1.5*cm,
                          "Laporan Statistik Deskriptif Aplikasi Mobile")

        # Nama institusi di kanan header
        canvas.setFont("Helvetica", 8)
        canvas.setFillColorRGB(*COLOR_MID_BLUE)
        canvas.drawRightString(PAGE_WIDTH - MARGIN_RIGHT,
                               PAGE_HEIGHT - 1.5*cm, INSTITUSI)

    # ── FOOTER ──
    if doc.page > 1:
        # Garis abu-abu tipis
        canvas.setStrokeColorRGB(0.7, 0.7, 0.7)
        canvas.setLineWidth(0.5)
        canvas.line(MARGIN_LEFT, 1.8*cm,
                    PAGE_WIDTH - MARGIN_RIGHT, 1.8*cm)

        # Nomor halaman tengah
        canvas.setFont("Helvetica", 9)
        canvas.setFillColorRGB(0.4, 0.4, 0.4)
        canvas.drawCentredString(PAGE_WIDTH / 2, 1.2*cm,
                                 f"— {doc.page} —")

        # Teks kiri footer
        canvas.setFont("Helvetica", 7)
        canvas.drawString(MARGIN_LEFT, 1.2*cm, MATA_KULIAH)

        # Teks kanan footer
        canvas.drawRightString(PAGE_WIDTH - MARGIN_RIGHT, 1.2*cm, SEMESTER)

    canvas.restoreState()
```

### Style Definitions

```python
def build_styles():
    """Return dict berisi semua ParagraphStyle custom."""
    base = getSampleStyleSheet()
    return {
        # Judul bab (misal: BAB 1 PENDAHULUAN)
        "bab": ParagraphStyle(
            "bab",
            fontName="Helvetica-Bold",
            fontSize=14,
            textColor=colors.Color(*COLOR_DARK_BLUE),
            spaceAfter=6,
            spaceBefore=18,
            borderPadding=(0, 0, 4, 0),
            leading=18,
        ),
        # Sub-judul (1.1, 1.2, dst)
        "sub": ParagraphStyle(
            "sub",
            fontName="Helvetica-Bold",
            fontSize=11,
            textColor=colors.Color(*COLOR_MID_BLUE),
            spaceAfter=4,
            spaceBefore=10,
            leading=14,
        ),
        # Body text justify
        "body": ParagraphStyle(
            "body",
            fontName="Helvetica",
            fontSize=10,
            textColor=colors.Color(*COLOR_TEXT),
            spaceAfter=6,
            leading=15,
            alignment=TA_JUSTIFY,
        ),
        # Body bullet
        "bullet": ParagraphStyle(
            "bullet",
            fontName="Helvetica",
            fontSize=10,
            textColor=colors.Color(*COLOR_TEXT),
            leftIndent=20,
            spaceAfter=3,
            leading=14,
            bulletIndent=8,
        ),
        # Caption tabel/gambar
        "caption": ParagraphStyle(
            "caption",
            fontName="Helvetica-Oblique",
            fontSize=9,
            textColor=colors.Color(0.4, 0.4, 0.4),
            alignment=TA_CENTER,
            spaceAfter=8,
            spaceBefore=4,
        ),
        # Highlight box (kotak berwarna untuk temuan penting)
        "highlight": ParagraphStyle(
            "highlight",
            fontName="Helvetica-Bold",
            fontSize=10,
            textColor=colors.Color(*COLOR_DARK_BLUE),
            backColor=colors.Color(*COLOR_LIGHT_BLUE),
            borderPadding=8,
            spaceAfter=8,
            leading=14,
        ),
        # Cover judul
        "cover_title": ParagraphStyle(
            "cover_title",
            fontName="Helvetica-Bold",
            fontSize=22,
            textColor=colors.Color(*COLOR_WHITE),
            alignment=TA_CENTER,
            leading=28,
            spaceAfter=10,
        ),
        # Cover subtitle
        "cover_sub": ParagraphStyle(
            "cover_sub",
            fontName="Helvetica",
            fontSize=13,
            textColor=colors.Color(0.85, 0.90, 0.98),
            alignment=TA_CENTER,
            leading=18,
            spaceAfter=6,
        ),
        # Cover info
        "cover_info": ParagraphStyle(
            "cover_info",
            fontName="Helvetica",
            fontSize=11,
            textColor=colors.Color(*COLOR_TEXT),
            alignment=TA_CENTER,
            leading=16,
            spaceAfter=4,
        ),
    }
```

---

## BAGIAN 5 — KOMPONEN HALAMAN

### 5a. Cover Page (Halaman 1)

Gunakan Canvas langsung (bukan flowable) untuk halaman cover yang fully designed:

```
┌─────────────────────────────────────────┐
│  [STRIP BIRU GELAP PENUH LEBAR ATAS     │
│   ~5cm, dengan logo/ikon statistik      │
│   sederhana di pojok kiri               │
│   dan garis diagonal aksen]             │
│                                         │
│  ████████████████████████████████████  │
│  █ ANALISIS STATISTIK DESKRIPTIF      █  │
│  █ APLIKASI MOBILE                    █  │
│  █ Studi Kepuasan Pengguna            █  │
│  █ Berbasis Kuesioner                 █  │
│  ████████████████████████████████████  │
│                                         │
│  ┌──────────────────────────────────┐   │
│  │ 📋 Mata Kuliah  : Statistika ... │   │
│  │ 🏛  Institusi   : Universitas .. │   │
│  │ 📅 Semester     : Genap 2024/25  │   │
│  │ 👤 Penyusun     : Tim Peneliti   │   │
│  │ 👩‍🏫 Dosen        : Nama Dosen   │   │
│  └──────────────────────────────────┘   │
│                                         │
│  [STRIP BIRU GELAP BAWAH ~3cm]         │
│  [5 badge variabel berwarna di strip]   │
└─────────────────────────────────────────┘
```

Implementasi dengan `canvas.rect()`, `canvas.drawString()`, custom polygon:

```python
def draw_cover(canvas, doc):
    """Gambar cover page menggunakan canvas secara langsung."""
    w, h = A4

    # Background putih bersih
    canvas.setFillColorRGB(1, 1, 1)
    canvas.rect(0, 0, w, h, fill=1, stroke=0)

    # Strip biru gelap atas (tinggi 8cm)
    canvas.setFillColorRGB(*COLOR_DARK_BLUE)
    canvas.rect(0, h - 8*cm, w, 8*cm, fill=1, stroke=0)

    # Aksen diagonal di pojok kanan atas (segitiga oranye)
    canvas.setFillColorRGB(*COLOR_ACCENT)
    p = canvas.beginPath()
    p.moveTo(w, h)
    p.lineTo(w - 4*cm, h)
    p.lineTo(w, h - 4*cm)
    p.close()
    canvas.drawPath(p, fill=1, stroke=0)

    # Ikon statistik abstrak (bar chart sederhana dari rect)
    # Di pojok kiri strip atas
    bar_x, bar_y = 1.5*cm, h - 7*cm
    heights = [1.2, 0.7, 1.8, 0.9, 1.5]  # cm
    for i, ht in enumerate(heights):
        alpha = 0.4 + i * 0.1
        canvas.setFillColorRGB(1, 1, 1, alpha)
        canvas.rect(bar_x + i*0.5*cm, bar_y, 0.35*cm, ht*cm, fill=1, stroke=0)

    # Teks judul di strip atas
    canvas.setFillColorRGB(1, 1, 1)
    canvas.setFont("Helvetica-Bold", 20)
    canvas.drawCentredString(w/2, h - 3.5*cm, "ANALISIS STATISTIK DESKRIPTIF")
    canvas.setFont("Helvetica-Bold", 16)
    canvas.drawCentredString(w/2, h - 4.5*cm, "APLIKASI MOBILE")
    canvas.setFont("Helvetica", 12)
    canvas.setFillColorRGB(0.80, 0.88, 0.98)
    canvas.drawCentredString(w/2, h - 5.5*cm, "Studi Kepuasan Pengguna Berbasis Kuesioner")

    # Garis pembatas tipis bawah strip
    canvas.setStrokeColorRGB(*COLOR_ACCENT)
    canvas.setLineWidth(3)
    canvas.line(0, h - 8*cm, w, h - 8*cm)

    # Kotak info di tengah halaman
    box_x, box_y = 2.5*cm, h - 15*cm
    box_w, box_h = w - 5*cm, 5.5*cm
    # Shadow
    canvas.setFillColorRGB(0.85, 0.85, 0.85)
    canvas.roundRect(box_x+0.15*cm, box_y-0.15*cm, box_w, box_h, 8, fill=1, stroke=0)
    # Kotak utama
    canvas.setFillColorRGB(0.97, 0.97, 0.99)
    canvas.setStrokeColorRGB(*COLOR_MID_BLUE)
    canvas.setLineWidth(1.5)
    canvas.roundRect(box_x, box_y, box_w, box_h, 8, fill=1, stroke=1)
    # Border kiri aksen
    canvas.setFillColorRGB(*COLOR_MID_BLUE)
    canvas.roundRect(box_x, box_y, 0.4*cm, box_h, 4, fill=1, stroke=0)

    # Info teks dalam kotak
    info_items = [
        ("Mata Kuliah", MATA_KULIAH),
        ("Institusi", INSTITUSI),
        ("Program Studi", PROGRAM_STUDI),
        ("Semester", SEMESTER),
        ("Penyusun", PENYUSUN),
        ("Dosen Pembimbing", DOSEN),
    ]
    canvas.setFont("Helvetica", 10)
    canvas.setFillColorRGB(*COLOR_TEXT)
    for i, (label, value) in enumerate(info_items):
        y_pos = box_y + box_h - (i+1) * (box_h / (len(info_items)+0.5))
        canvas.setFont("Helvetica-Bold", 9)
        canvas.setFillColorRGB(*COLOR_MID_BLUE)
        canvas.drawString(box_x + 0.8*cm, y_pos, f"{label}")
        canvas.setFont("Helvetica", 9)
        canvas.setFillColorRGB(*COLOR_TEXT)
        canvas.drawString(box_x + 0.8*cm + 4*cm, y_pos, f": {value}")

    # Strip bawah dengan 5 badge variabel
    strip_h = 2.5*cm
    canvas.setFillColorRGB(*COLOR_DARK_BLUE)
    canvas.rect(0, 0, w, strip_h, fill=1, stroke=0)

    var_colors = [
        (0.23, 0.51, 0.96),  # biru
        (0.55, 0.36, 0.96),  # ungu
        (0.94, 0.27, 0.27),  # merah
        (0.95, 0.62, 0.10),  # oranye
        (0.13, 0.69, 0.44),  # hijau
    ]
    badge_w = w / len(VARIABLES)
    for i, (var, col) in enumerate(zip(VARIABLES, var_colors)):
        bx = i * badge_w
        # Separasi vertikal tipis
        if i > 0:
            canvas.setStrokeColorRGB(1, 1, 1, 0.2)
            canvas.setLineWidth(0.5)
            canvas.line(bx, 0.3*cm, bx, strip_h - 0.3*cm)
        # Dot warna
        canvas.setFillColorRGB(*col)
        canvas.circle(bx + badge_w/2, strip_h/2 + 0.3*cm, 0.15*cm, fill=1, stroke=0)
        # Label
        canvas.setFont("Helvetica-Bold", 8)
        canvas.setFillColorRGB(1, 1, 1)
        canvas.drawCentredString(bx + badge_w/2, strip_h/2 - 0.3*cm, var)

    # Tahun di pojok kanan bawah strip
    canvas.setFont("Helvetica", 9)
    canvas.setFillColorRGB(0.6, 0.7, 0.9)
    canvas.drawRightString(w - 1*cm, 0.8*cm, "2025")
```

---

### 5b. Daftar Isi (Halaman 2)

Buat sebagai flowable biasa. Tampilkan sebagai tabel dua kolom (nama section | halaman):

```python
def build_toc(styles):
    """Return list of flowables untuk halaman Daftar Isi."""
    items = [
        ("BAB 1", "Pendahuluan", "3"),
        ("", "1.1 Latar Belakang", "3"),
        ("", "1.2 Tujuan Analisis", "3"),
        ("BAB 2", "Dataset", "4"),
        ("", "2.1 Deskripsi Dataset", "4"),
        ("", "2.2 Variabel Penelitian", "4"),
        ("BAB 3", "Metodologi", "5"),
        ("", "3.1 Statistik Deskriptif", "5"),
        ("", "3.2 Visualisasi Data", "5"),
        ("", "3.3 Deteksi Outlier", "5"),
        ("BAB 4", "Hasil dan Pembahasan", "6"),
        ("", "4.1 Tabel Statistik Deskriptif", "6"),
        ("", "4.2 Histogram", "7"),
        ("", "4.3 Boxplot", "8"),
        ("", "4.4 Analisis Naratif", "8"),
        ("BAB 5", "Kesimpulan", "9"),
        ("BAB 6", "Rekomendasi", "10"),
        ("", "Daftar Pustaka", "11"),
    ]
    # Render sebagai Table dengan garis titik-titik antara judul dan nomor
    # Bab → font bold biru, sub-item → font normal indented
```

---

### 5c. BAB 1 — Pendahuluan

```python
def build_bab1(styles):
    story = []

    # Judul bab dengan box biru penuh lebar
    story.append(bab_header("BAB 1", "PENDAHULUAN", styles))

    # 1.1 Latar Belakang
    story.append(Paragraph("1.1 Latar Belakang", styles["sub"]))
    story.append(Paragraph("""
        Perkembangan teknologi aplikasi mobile telah mendorong peningkatan kebutuhan
        akan evaluasi kualitas dari perspektif pengguna. Penilaian pengguna terhadap
        aspek-aspek seperti kemudahan penggunaan (<i>usability</i>), antarmuka pengguna
        (<i>UI/UX</i>), kecepatan (<i>speed</i>), fitur yang tersedia (<i>features</i>),
        serta kepuasan keseluruhan (<i>satisfaction</i>) menjadi indikator penting dalam
        pengembangan produk digital yang berorientasi pengguna.
    """, styles["body"]))
    story.append(Paragraph("""
        Untuk memperoleh gambaran objektif terhadap kondisi tersebut, diperlukan
        pendekatan analisis kuantitatif yang sistematis. Statistik deskriptif menyediakan
        kerangka metodologis untuk meringkas, menginterpretasikan, dan memvisualisasikan
        data secara efektif sehingga dapat dijadikan dasar pengambilan keputusan.
    """, styles["body"]))

    # 1.2 Tujuan
    story.append(Paragraph("1.2 Tujuan Analisis", styles["sub"]))
    tujuan = [
        "Menghitung ukuran pemusatan data (mean, median, modus) untuk setiap variabel.",
        "Mengukur penyebaran data (standar deviasi, varians, range, IQR).",
        "Mengidentifikasi bentuk distribusi data (skewness dan kurtosis).",
        "Mendeteksi data pencilan (<i>outlier</i>) menggunakan metode IQR.",
        "Menyajikan visualisasi data dalam bentuk histogram dan boxplot.",
        "Memberikan interpretasi dan rekomendasi berbasis temuan statistik.",
    ]
    for t in tujuan:
        story.append(Paragraph(f"• {t}", styles["bullet"]))

    return story
```

---

### 5d. BAB 2 — Dataset

```python
def build_bab2(styles, data_dict, stats_list):
    """
    Tampilkan:
    - Deskripsi dataset (100 responden, skala Likert, cara pengumpulan)
    - Tabel informasi variabel (Nama | Definisi | Skala | Kode)
    - Tabel sampel 10 baris data pertama (Resp. | Usability | UI/UX | ...)
    - Distribusi frekuensi ringkas per variabel (dalam tabel compact)
    """
```

Tabel variabel penelitian:

| No | Variabel | Definisi Operasional | Skala | Jumlah Item |
|----|----------|---------------------|-------|-------------|
| 1 | Usability | Kemudahan penggunaan antarmuka | Likert 1–5 | 1 |
| 2 | UI/UX | Kualitas desain visual & pengalaman | Likert 1–5 | 1 |
| 3 | Speed | Kecepatan respon dan loading aplikasi | Likert 1–5 | 1 |
| 4 | Features | Kelengkapan dan kegunaan fitur | Likert 1–5 | 1 |
| 5 | Satisfaction | Kepuasan keseluruhan pengguna | Likert 1–5 | 1 |

---

### 5e. BAB 3 — Metodologi

```python
def build_bab3(styles):
    """
    Jelaskan:
    3.1 Statistik Deskriptif — formula dan definisi tiap statistik
        Tampilkan rumus dalam teks (misal: Mean = Σx/n, SD = √(Σ(x-x̄)²/(n-1)))
        !! JANGAN pakai unicode superscript — gunakan teks biasa: "SD = akar(Var)"
    3.2 Visualisasi Data — penjelasan histogram dan boxplot
    3.3 Deteksi Outlier — metode IQR: outlier jika < Q1-1.5*IQR atau > Q3+1.5*IQR
    """
```

---

### 5f. BAB 4 — Hasil dan Pembahasan (UTAMA)

#### 4.1 Tabel Statistik Deskriptif

Tabel utama semua statistik semua variabel. Format:

```
Tabel 1. Statistik Deskriptif Variabel Penelitian (n=100)
```

| Statistik | Usability | UI/UX | Speed | Features | Satisfaction |
|---|---|---|---|---|---|
| N (Valid) | 100 | 100 | 100 | 100 | 100 |
| Mean | **.** | **.** | **.** | **.** | **.** |
| Median | | | | | |
| Modus | | | | | |
| Std. Deviasi | | | | | |
| Varians | | | | | |
| Minimum | | | | | |
| Maksimum | | | | | |
| Range | | | | | |
| Q1 | | | | | |
| Q3 | | | | | |
| IQR | | | | | |
| Skewness | | | | | |
| Kurtosis | | | | | |
| Outlier (n) | | | | | |
| Outlier (%) | | | | | |
| Kategori | | | | | |

Styling tabel:
- Header baris = background `COLOR_DARK_BLUE`, teks putih, bold
- Kolom pertama (nama statistik) = background `COLOR_LIGHT_BLUE`, teks biru bold
- Baris genap = background sangat muda (#F5F8FF)
- Sel "Kategori": Sangat Tinggi/Tinggi = hijau, Sedang = kuning, Rendah = merah
- Sel Outlier > 5% = latar merah muda
- Garis grid tipis abu-abu
- Font: Helvetica 9pt

#### 4.2 Histogram

Embed chart histogram grid:
```python
img_buffer = generate_histogram_grid(data_dict, stats_list)
img = Image(img_buffer, width=15*cm, height=11*cm)
story.append(img)
story.append(Paragraph(
    "Gambar 1. Histogram Distribusi Frekuensi Tiap Variabel\n"
    "(Garis merah = Mean, Garis biru = Median)",
    styles["caption"]
))
```

Setelah gambar, tambahkan tabel interpretasi distribusi:

| Variabel | Skewness | Kurtosis | Interpretasi |
|----------|----------|----------|--------------|
| Usability | -0.41 | -0.23 | Distribusi simetris, mendekati normal |
| Speed | 0.73 | 0.51 | Condong kanan, lebih banyak nilai rendah |
| ... | | | |

#### 4.3 Boxplot

Embed chart boxplot:
```python
img_buffer = generate_boxplot(data_dict, stats_list)
img = Image(img_buffer, width=15*cm, height=7*cm)
```

#### 4.4 Analisis Naratif

Tiga sub-bagian teks naratif yang di-generate OTOMATIS dari nilai statistik:

**Analisis Mean — Comparison Chart embed:**
```
Gambar 3. Perbandingan Nilai Rata-Rata Variabel
```
Teks naratif otomatis:
```python
def narasi_mean(stats_list):
    # Cari variabel tertinggi dan terendah
    tertinggi = max(stats_list, key=lambda x: x["mean"])
    terendah  = min(stats_list, key=lambda x: x["mean"])
    return f"""
    Berdasarkan analisis nilai rata-rata, variabel {tertinggi['variable']} 
    memperoleh skor tertinggi sebesar {tertinggi['mean']:.2f} yang termasuk 
    kategori "{tertinggi['kategori_mean']}", mengindikasikan bahwa responden 
    memberikan penilaian yang positif terhadap aspek tersebut. Sebaliknya, 
    variabel {terendah['variable']} mendapatkan rata-rata terendah sebesar 
    {terendah['mean']:.2f} (kategori "{terendah['kategori_mean']}"), 
    yang menunjukkan area yang memerlukan perhatian dan peningkatan lebih lanjut.
    """
```

**Analisis Variasi:**
```python
def narasi_variasi(stats_list):
    # Cari SD tertinggi dan terendah
    # Interpretasi: SD > 1.0 = variasi tinggi, 0.7-1.0 = sedang, < 0.7 = rendah
```

**Analisis Outlier:**
```python
def narasi_outlier(stats_list):
    # Hitung total outlier, variabel paling banyak outlier
    # Tabel detail nilai-nilai outlier
```

---

### 5g. BAB 5 — Kesimpulan

```python
def build_bab5(styles, stats_list):
    """
    Generate kesimpulan OTOMATIS berdasarkan statistik:
    - Identifikasi variabel dengan nilai tertinggi dan terendah
    - Tentukan variasi data (tinggi/sedang/rendah berdasarkan rata-rata SD)
    - Hitung total outlier keseluruhan
    - Simpulkan kondisi umum kepuasan pengguna
    
    Format: kotak highlight berwarna + bullet point
    Setiap poin diberi ikon emoji dan badge warna (OK/WARNING/CRITICAL)
    """
    kesimpulan = [
        {
            "icon": "✓",
            "color": COLOR_GREEN,
            "teks": f"Kepuasan pengguna ({stats['Satisfaction']['mean']:.2f}) tergolong {kategori}",
        },
        ...
    ]
```

---

### 5h. BAB 6 — Rekomendasi

```python
def build_bab6(styles, stats_list):
    """
    Generate rekomendasi OTOMATIS berdasarkan temuan:
    - Variabel dengan nilai terendah → rekomendasi peningkatan
    - Variabel dengan variasi tinggi → rekomendasi standarisasi
    - Variabel dengan banyak outlier → investigasi lebih lanjut
    
    Format tabel: No | Rekomendasi | Target Variabel | Prioritas | Timeline
    Prioritas: HIGH (merah), MEDIUM (kuning), LOW (hijau)
    """
    rekomendasi = [
        {
            "no": 1,
            "aksi": "Optimasi performa dan kecepatan loading aplikasi",
            "target": "Speed",
            "prioritas": "HIGH",
            "timeline": "Q1 2025",
        },
        {
            "no": 2,
            "aksi": "Redesain alur navigasi untuk meningkatkan usability",
            "target": "Usability",
            "prioritas": "MEDIUM",
            "timeline": "Q2 2025",
        },
        {
            "no": 3,
            "aksi": "Penambahan fitur berdasarkan survei kebutuhan lanjutan",
            "target": "Features",
            "prioritas": "MEDIUM",
            "timeline": "Q2 2025",
        },
        {
            "no": 4,
            "aksi": "Peningkatan konsistensi visual dan interaksi UI/UX",
            "target": "UI/UX",
            "prioritas": "LOW",
            "timeline": "Q3 2025",
        },
        {
            "no": 5,
            "aksi": "Program loyalty dan engagement untuk tingkatkan kepuasan",
            "target": "Satisfaction",
            "prioritas": "LOW",
            "timeline": "Q3 2025",
        },
    ]
    # Tambah narasi penjelas 1 paragraf per rekomendasi
```

---

### 5i. Daftar Pustaka

```python
def build_pustaka(styles):
    referensi = [
        "Field, A. (2018). <i>Discovering Statistics Using IBM SPSS Statistics</i> (5th ed.). SAGE Publications.",
        "Hair, J. F., Black, W. C., Babin, B. J., & Anderson, R. E. (2019). <i>Multivariate Data Analysis</i> (8th ed.). Cengage Learning.",
        "Sekaran, U., & Bougie, R. (2019). <i>Research Methods for Business</i> (8th ed.). Wiley.",
        "Sugiyono. (2022). <i>Metode Penelitian Kuantitatif, Kualitatif, dan R&D</i>. Alfabeta.",
        "Triola, M. F. (2021). <i>Elementary Statistics</i> (14th ed.). Pearson.",
    ]
    # Format APA, nomor urut, justified
```

---

## BAGIAN 6 — HELPER FUNCTIONS

```python
def bab_header(nomor_bab, judul_bab, styles):
    """
    Buat header bab dengan box penuh lebar berwarna biru gelap.
    Gunakan Table dengan background color dan teks putih bold.
    Return KeepTogether([box, spacer])
    """

def divider_line(color=COLOR_MID_BLUE, thickness=1):
    """Return HRFlowable tipis sebagai pemisah antar sub-section."""

def info_box(text, styles, color=COLOR_LIGHT_BLUE, border_color=COLOR_MID_BLUE):
    """
    Kotak highlight berwarna untuk temuan penting.
    Gunakan Table 1x1 dengan background + padding.
    """

def stat_summary_cards(stats_list, styles):
    """
    5 kartu mini dalam 1 baris — tiap kartu = 1 variabel.
    Menampilkan: nama variabel, nilai mean, badge kategori.
    Implementasikan sebagai Table 1×5 dengan inner styling.
    """
```

---

## BAGIAN 7 — MAIN BUILDER

```python
def build_pdf():
    """Fungsi utama yang merakit seluruh PDF."""
    
    # 1. Generate data
    data_dict = generate_data()
    
    # 2. Hitung statistik
    stats_list = compute_all_stats(data_dict)
    
    # 3. Generate charts
    hist_buffer = generate_histogram_grid(data_dict, stats_list)
    box_buffer  = generate_boxplot(data_dict, stats_list)
    mean_buffer = generate_mean_comparison(stats_list)
    
    # 4. Setup document
    doc = SimpleDocTemplate(
        OUTPUT_FILE,
        pagesize=A4,
        leftMargin=MARGIN_LEFT,
        rightMargin=MARGIN_RIGHT,
        topMargin=MARGIN_TOP + 1*cm,    # ruang untuk header
        bottomMargin=MARGIN_BOTTOM + 1*cm,  # ruang untuk footer
        title=JUDUL,
        author=PENYUSUN,
        subject=MATA_KULIAH,
        creator="ReportLab PDF Generator",
    )
    
    # 5. Build styles
    styles = build_styles()
    
    # 6. Rakit story
    story = []
    
    # Cover (halaman 1) — dihandle via onFirstPage
    story.append(PageBreak())  # Halaman 2 dst
    
    # Daftar Isi
    story.extend(build_toc(styles))
    story.append(PageBreak())
    
    # BAB 1
    story.extend(build_bab1(styles))
    story.append(PageBreak())
    
    # BAB 2
    story.extend(build_bab2(styles, data_dict, stats_list))
    story.append(PageBreak())
    
    # BAB 3
    story.extend(build_bab3(styles))
    story.append(PageBreak())
    
    # BAB 4
    story.extend(build_bab4(styles, data_dict, stats_list,
                            hist_buffer, box_buffer, mean_buffer))
    story.append(PageBreak())
    
    # BAB 5
    story.extend(build_bab5(styles, stats_list))
    story.append(PageBreak())
    
    # BAB 6
    story.extend(build_bab6(styles, stats_list))
    story.append(PageBreak())
    
    # Daftar Pustaka
    story.extend(build_pustaka(styles))
    
    # 7. Build
    doc.build(
        story,
        onFirstPage=draw_cover,
        onLaterPages=on_page,
    )
    
    print(f"\n✅ PDF berhasil dibuat: {OUTPUT_FILE}")
    print(f"   Total variabel   : {len(VARIABLES)}")
    print(f"   Total responden  : 100")
    print(f"   Perkiraan halaman: 10–12 halaman\n")

if __name__ == "__main__":
    build_pdf()
```

---

## URUTAN PENGERJAAN

1. Install dependencies: `pip install reportlab matplotlib numpy scipy`
2. Implementasikan BAGIAN 1 (konstanta) dan BAGIAN 2 (data + statistik) — test dulu di terminal
3. Implementasikan BAGIAN 3 (chart generator) — test simpan ke file PNG dulu
4. Implementasikan BAGIAN 4 (page template + on_page)
5. Implementasikan BAGIAN 5 (helper functions)
6. Implementasikan tiap BAB berurutan (cover → TOC → BAB 1–6 → pustaka)
7. Implementasikan BAGIAN 7 (main builder) — jalankan `python generate_report.py`
8. Periksa PDF: typography, tabel, chart, nomor halaman, header/footer
9. Pastikan tidak ada halaman terpotong (`KeepTogether` untuk tabel panjang)

---

## CARA MENJALANKAN

```bash
pip install reportlab matplotlib numpy scipy
python generate_report.py
# → File: Laporan_Statistik_Deskriptif.pdf
```

---

## CATATAN PENTING

- JANGAN gunakan Unicode subscript/superscript (₂, ², dst) — ReportLab tidak support
- Gunakan `KeepTogether([...])` untuk tabel dan chart agar tidak terpotong antar halaman
- Semua chart harus menggunakan `BytesIO` — JANGAN simpan ke file disk
- `matplotlib.use('Agg')` WAJIB ditulis sebelum `import matplotlib.pyplot`
- Untuk tabel panjang: gunakan `repeatRows=1` agar header terulang di halaman baru
- Cek ukuran Image: lebar maksimal = `PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT - 1*cm`