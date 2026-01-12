<div align="center">
  <img src="./logo-isidoku.png" alt="IsiDoku Logo" width="120" height="auto" />
  <h1>IsiDoku (Demo Application)</h1>
  <p><strong>Generator SOP Otomatis berbasis AI dengan desain Minimalis Brutalis</strong></p>

  <p>
    <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js" /></a>
    <a href="https://turbo.build"><img src="https://img.shields.io/badge/Turborepo-Enabled-red?style=for-the-badge&logo=turborepo" alt="Turborepo" /></a>
    <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind" /></a>
    <a href="https://ai.google.dev/"><img src="https://img.shields.io/badge/AI-Google_Gemini-8E75B2?style=for-the-badge&logo=google-gemini" alt="Gemini" /></a>
    <img src="https://img.shields.io/badge/Type-Script-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  </p>
</div>

<br />

> [!WARNING]
> **DEMO VERSION**: Aplikasi ini adalah versi **Public Demo / Preview**. Beberapa fitur backend sengaja **dimatikan** untuk tujuan demonstrasi publik. Login tidak diperlukan.

## 🚀 FITUR UTAMA

| Fitur | Status Demo | Deskripsi |
| :--- | :--- | :--- |
| <code>AI Generator</code> | ✅ **Aktif** | Buat struktur SOP lengkap menggunakan Google Gemini AI (Gunakan API Key Anda). |
| <code>Smart Routing</code> | ✅ **Aktif** | Jalur panah otomatis menggunakan algoritma A* Pathfinding. |
| <code>Interactive Builder</code> | ✅ **Aktif** | Drag-and-drop editor yang intuitif untuk merancang Flowchart. |
| <code>PDF Export</code> | ✅ **Aktif** | Ekspor hasil diagram ke file PDF. |
| <code>User Auth</code> | ❌ **Non-Aktif** | Fitur login/registrasi dinonaktifkan (Clerk removed). |
| <code>Cloud Save</code> | ❌ **Non-Aktif** | Penyimpanan ke database Supabase dimatikan. Proyek tidak akan tersimpan. |
| <code>Automated Changelog</code> | ✅ **Aktif** | Sinkronisasi update otomatis dari Git Commit. |

<br />

> [!NOTE]
> Karena database dimatikan, semua SOP yang Anda buat **hanya bersifat sementara** di browser dan akan hilang jika halaman di-refresh. Silakan **Export ke PDF** untuk menyimpan hasil kerja Anda.

<br />

## 🏁 MEMULAI (GETTING STARTED)

Ikuti langkah-langkah berikut untuk menjalankan versi demo ini di lokal.

### PRASYARAT

- [Node.js](https://nodejs.org/) (v18+)
- [pnpm](https://pnpm.io/) (v9+)

### 1. CLONE REPOSITORY

```bash
git clone https://github.com/username/isidoku.git
cd isidoku
```

### 2. INSTALL DEPENDENCIES

```bash
pnpm install
```

### 3. KONFIGURASI ENVIRONMENT VARIABLE

Buat file `.env.local` di dalam folder `apps/web`:

```bash
cp apps/web/.env.example apps/web/.env.local
```

Isi dengan kredensial API Key Google Gemini Anda (Wajib untuk fitur AI):

```env
# apps/web/.env.local

# AI (Google Gemini) - REQUIRED for AI Generation
GOOGLE_GENERATIVE_AI_API_KEY=AIzaSy...
```

### 4. JALANKAN APLIKASI

```bash
pnpm dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

## 🤝 Kontribusi

1.  Buat branch baru (`git checkout -b fitur-baru`)
2.  Commit perubahan (`git commit -m "feat: tambah fitur keren"`)
3.  Push ke branch (`git push origin fitur-baru`)
4.  Buat Pull Request

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah [Apache License 2.0](LICENSE). Lihat file `LICENSE` untuk detail selengkapnya.

---

Dibuat dengan ❤️ oleh [Albert Assidiq](https://albertas.my.id)
