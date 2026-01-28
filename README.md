# 📚 Data Peminjaman Perpustakaan

Sistem Manajemen Data Peminjaman Perpustakaan yang modern dan responsif, dibangun dengan teknologi web terbaru untuk efisiensi dan kemudahan penggunaan.

## 🚀 Teknologi yang Digunakan

Proyek ini dibangun menggunakan stack teknologi berikut:

- **Framework**: [Astro](https://astro.build/) - Framework web modern untuk performa tinggi.
- **UI Library**: [Preact](https://preactjs.com/) - Alternatif ringan untuk React.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Framework CSS utility-first.
- **Icons**: [Lucide Preact](https://lucide.dev/) - Set ikon yang indah dan konsisten.
- **State Management**: [@preact/signals](https://preactjs.com/guide/v10/signals/) - Manajemen state yang reaktif dan performan.

## ✨ Fitur Utama

- **Dashboard**: Ringkasan data dan statistik peminjaman.
- **Manajemen Buku**:
  - Penambahan, pengeditan, dan penghapusan data buku.
  - Pencarian dan filter buku.
- **Manajemen Peminjam (Borrowers)**:
  - Data anggota atau peminjam.
  - Riwayat peminjaman siswa/anggota.
- **Sistem Peminjaman (Loans)**:
  - Pencatatan transaksi peminjaman dan pengembalian.
  - Tracking status buku.

## 📂 Struktur Proyek

```text
/
├── public/           # Aset statis
├── src/
│   ├── components/   # Komponen UI (Preact)
│   │   ├── books/    # Komponen manajemen buku
│   │   ├── borrowers/# Komponen manajemen peminjam
│   │   ├── dashboard/# Komponen dashboard
│   │   ├── layout/   # Layout utama (Sidebar, Header)
│   │   ├── loans/    # Komponen transaksi peminjaman
│   │   └── ui/       # Komponen UI reusable (Button, Input, dll)
│   ├── layouts/      # Layout halaman Astro
│   ├── pages/        # Halaman routing Astro
│   ├── stores/       # Global state (Signals)
│   └── styles/       # CSS global
└── package.json
```

## 🛠️ Cara Menjalankan

Ikuti langkah-langkah berikut untuk menjalankan proyek di komputer lokal Anda:

1. **Clone repositori** (jika belum):

   ```bash
   git clone <repository-url>
   cd data-peminjaman
   ```

2. **Instal dependensi**:

   ```bash
   npm install
   ```

3. **Jalankan server development**:
   ```bash
   npm run dev
   ```
   Aplikasi akan dapat diakses di `http://localhost:4321`.

## 📜 Perintah Lainnya

| Perintah          | Deskripsi                                                 |
| :---------------- | :-------------------------------------------------------- |
| `npm run build`   | Membangun aplikasi untuk produksi ke folder `./dist/`     |
| `npm run preview` | Melihat preview hasil build secara lokal                  |
| `npm run astro`   | Menjalankan CLI Astro (misal: `astro add`, `astro check`) |

---
