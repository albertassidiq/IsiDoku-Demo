
---

# Product Requirements Document (PRD)

**Project Name:** Docx Bulk Generator (Web-based)
**Version:** 1.0 (MVP)
**Tech Stack:** Next.js, Tailwind CSS, Docxtemplater, Vercel.

## 1. Overview & Problem Statement

User seringkali perlu membuat banyak dokumen Word yang isinya hampir sama (surat kontrak, sertifikat, label undangan) namun datanya berbeda-beda. Melakukan *Find & Replace* satu per satu sangat memakan waktu.

Aplikasi ini memungkinkan user mengupload template Word (`.docx`), mendeteksi variabel di dalamnya (format `{nama}`), menyediakan tabel input data, dan men-generate dokumen tersebut secara massal dalam format ZIP.

## 2. User Flow (Alur Pengguna)

1. **Upload:** User membuka web dan drag-and-drop file template `.docx`.
2. **Parsing:** Sistem membaca file dan mengekstrak semua teks di dalam kurung kurawal `{...}`.
3. **Mapping:** Sistem menampilkan tabel kosong. Judul kolom (Header) diambil dari variabel yang ditemukan (misal: Kolom `Nama`, Kolom `Alamat`).
4. **Input:** User mengisi data pada tabel tersebut. User bisa menambah baris sebanyak yang diinginkan.
5. **Generate:** User menekan tombol "Generate".
6. **Download:** Sistem memproses data di browser (client-side), membungkus semua file hasil generate menjadi satu file `.zip`, dan mendownloadnya ke komputer user.

## 3. Functional Requirements

### A. Fitur Upload & Parsing

* **File Support:** Hanya menerima format `.docx`.
* **Validation:** Menolak file selain `.docx` dan file yang korup.
* **Variable Detection Logic:**
* Sistem harus memindai konten XML dokumen.
* Menggunakan Regex untuk menangkap pattern `{variabel}`.
* **Penting:** Menghilangkan duplikat (jika `{nama}` muncul 3 kali di dokumen, kolom `nama` di tabel tetap hanya 1).
* *Handling Error:* Jika tidak ada variabel ditemukan, tampilkan pesan peringatan.



### B. Fitur Data Entry (Grid/Table)

* **Dynamic Columns:** Kolom tabel dibuat otomatis berdasarkan variabel yang terdeteksi.
* **Row Management:**
* Tombol "Add Row" (Tambah baris manual).
* Tombol "Delete Row" (Hapus baris tertentu).
* (Optional untuk V2) "Import CSV/Excel" untuk mengisi tabel secara otomatis.


* **Filename Config:** Menyediakan opsi/kolom khusus untuk menentukan nama file output (misal: menggunakan variabel `{nama}` sebagai nama file: `Kontrak_Budi.docx`).

### C. Fitur Generation (Core Engine)

* **Library:** Menggunakan `docxtemplater` + `pizzip`.
* **Client-Side Processing:** Semua proses generate harus terjadi di browser untuk menghindari timeout server Vercel (Serverless function limit).
* **Data Mapping:** Mencocokkan data di baris tabel dengan variabel di template.
* **Sanitization:** Menangani input user yang mengandung karakter khusus agar tidak merusak XML Word.

### D. Fitur Download

* **Single File:** Jika user hanya mengisi 1 baris, download langsung `.docx`.
* **Bulk File:** Jika user mengisi >1 baris, gunakan library `jszip` untuk membungkus output menjadi `.zip`.

## 4. Technical Specifications

### Tech Stack

* **Frontend Framework:** Next.js 14/15 (App Router).
* **Styling:** Tailwind CSS + Shadcn/ui (untuk komponen Tabel dan Input yang rapi).
* **Hosting:** Vercel (Static Export atau Node runtime, tapi logic generate di Client).

### Key Libraries

| Library | Fungsi |
| --- | --- |
| `docxtemplater` | Core logic untuk replace variable `{...}` di dalam docx. |
| `pizzip` | Membuka/Unzip file docx agar bisa dibaca docxtemplater. |
| `jszip` | Membuat file .zip berisi kumpulan dokumen hasil generate. |
| `file-saver` | Trigger download file di browser. |
| `react-hook-form` | (Opsional) Mengelola state form tabel jika datanya banyak. |

### Regex Logic (Preliminary)

Untuk mendeteksi variabel `{...}` di dalam teks:

```javascript
// Regex sederhana untuk menangkap teks di dalam kurung kurawal
// Menangkap {nama}, {alamat_rumah}, tapi mengabaikan { dan } yang terpisah
const regex = /\{([a-zA-Z0-9_]+)\}/g;

```

## 5. UI/UX Guidelines

* **Simple Interface:** Fokus pada area upload yang besar di awal.
* **Real-time Feedback:** Tampilkan list variabel yang ditemukan segera setelah file diupload (misal: *"Ditemukan 3 variabel: Nama, Tanggal, Divisi"*).
* **Editable Table:** Tampilan tabel harus mirip Excel (user bisa tab antar kolom).

## 6. Out of Scope (Batasan MVP)

* Belum support *Conditional Logic* (If/Else di dalam Word).
* Belum support *Looping* di dalam Word (misal 1 dokumen berisi list tabel barang).
* Belum ada fitur Login/Save Template (Aplikasi bersifat *stateless* / sekali pakai langsung hilang).

---
