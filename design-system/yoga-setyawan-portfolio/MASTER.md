# Design System Master File — YOGA.DEV

**Project:** Yoga Setyawan Portfolio (YOGA.DEV)  
**Style:** Editorial Minimalist & Engineering Aesthetic  
**Focus:** Odoo ERP Engineering, Python Backend, Flutter Mobile  

---

## 1. Global Color Tokens

| Token | Hex / Value | Usage |
|---|---|---|
| `--color-bg` | `#F7F7F4` | Latar belakang halaman utama (warm off-white, paper-like) |
| `--color-surface` | `#FFFFFF` | Latar belakang panel kartu dan kontainer konten |
| `--color-surface-subtle` | `#F0F2ED` | Latar belakang sekunder untuk tag, code snippet header, dll. |
| `--color-text` | `#1B1E1B` | Teks judul dan heading utama (deep charcoal, kontras tinggi) |
| `--color-text-secondary` | `#575E56` | Teks paragraf tubuh dan deskripsi |
| `--color-text-muted` | `#7E867D` | Teks metadata, tanggal, dan label sekunder |
| `--color-border` | `#E1E4DC` | Garis batas dan pemisah section utama |
| `--color-border-subtle` | `#ECEEE8` | Garis batas elemen internal |
| `--color-accent` | `#2E563B` | Aksen tunggal (*muted forest green*) untuk penekanan penting |
| `--color-accent-subtle` | `#EAF1EB` | Latar belakang pill status dan badge aksen lembut |

---

## 2. Typography Hierarchy

- **Primary Sans Font:** `IBM Plex Sans` (300, 400, 500, 600, 700)
  - Heading utama: Weight 600–700, letter-spacing `-0.02em` sampai `-0.035em`, normal sentence case (bebas dari paksaan *all-caps*).
  - Teks paragraf: Weight 400, line-height 1.65, max line length `65–68ch`.
- **Technical Monospace Font:** `JetBrains Mono` (400, 500)
  - Digunakan secara spesifik hanya untuk: cuplikan kode, nomor indeks section (`01 // PENDEKATAN`), tag teknologi, status pill, dan label metadata.

---

## 3. Anti-AI-Slop & Design Principles

- ❌ Dilarang menggunakan neon green, gradient warna-warni, atau efek pendar/glow.
- ❌ Dilarang membungkus seluruh elemen ke dalam bento-grid berulang.
- ❌ Dilarang menggunakan progress bar persentase keahlian tanpa dasar objektif.
- ❌ Dilarang membuat seluruh heading kapital (all-caps).
- ❌ Dilarang mengarang angka statistik performa palsu.
- ✔️ Mengutamakan whitespace yang cukup, tipografi editorial yang nyaman dibaca, dan hierarki informasi berbasis pembuktian teknis nyata.
