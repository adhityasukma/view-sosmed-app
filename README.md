# Social Media Views Dashboard

Aplikasi dashboard analitik media sosial real-time yang dirancang untuk menampilkan metrik (Total Views, Followers, dan 5 konten terbaru) untuk TikTok, YouTube, dan Instagram secara bersamaan dengan antarmuka modern (glassmorphism). Dibangun menggunakan Next.js 15 (App Router).

Demo [klik disini](https://view-sosmed-app.vercel.app/)

## 🚀 Sumber Data API

Dashboard ini mengambil data secara real-time dari 3 sumber berbeda menggunakan strategi yang telah dioptimalkan:

### 1. YouTube (Google YouTube Data API v3)

- **Metode**: API Resmi (Official API)
- **Alasan**: YouTube menyediakan API resmi yang **gratis, stabil, dan bisa mengambil data publik**. Ini adalah opsi terbaik karena tidak perlu melakukan scraping atau menggunakan pihak ketiga dengan limit ketat.

### 2. Instagram & TikTok (RapidAPI)

- **Metode**: Unofficial API via RapidAPI (`instagram-scraper-stable-api` dan `tiktok-scraper7` sebagai fallback scraping)
- **Alasan Menggunakan RapidAPI**:
  - **TikTok**: Tidak menyediakan public API resmi sama sekali. Web scraping murni menggunakan headless browser (seperti Puppeteer/Playwright) sangat berat dijalankan di lingkungan serverless/Vercel (akan terkena timeout dan memory limit).
  - **Instagram**: Graph API resmi milik Meta **sangat dibatasi** dan hanya memperbolehkan akses data untuk akun bisnis milik Anda sendiri. Scraping manual tanpa login hampir selalu diblokir oleh Instagram.
    Oleh karena itu, menggunakan layanan pihak ketiga yang stabil di RapidAPI adalah solusi paling realistis untuk mendapatkan data publik dari akun manapun tanpa login.

---

## 🛠️ Instalasi & Menjalankan di Localhost

Ikuti langkah-langkah di bawah ini untuk menjalankan aplikasi secara lokal.

### 1. Clone & Install Dependencies

Buka terminal dan jalankan:

```bash
npm install
```

### 2. Setup Environment Variables (.env.local)

Aplikasi ini membutuhkan Environment Variables untuk bisa melakukan fetch data ke API.

1. Di root folder/direktori proyek Anda, buat file baru bernama `.env.local`
2. Isi file `.env.local` tersebut dengan kode berikut:

```env
# Dapatkan key di bagian `X-RapidAPI-Key` dari dashboard RapidAPI Anda
RAPIDAPI_KEY=your_rapidapi_key_here

# Dapatkan key di konsol Google Cloud Platform (API & Services -> Credentials)
YOUTUBE_API_KEY=your_youtube_api_key_here
```

**Cara Mendapatkan API Key:**

- **RAPIDAPI_KEY**: Buat akun di [RapidAPI](https://rapidapi.com/), cari API `instagram-scraper-stable-api` dan subscribe ke paket _Basic/Free_. Anda akan mendapatkan API Key yang bisa dipasang di file `.env.local`.
- **YOUTUBE_API_KEY**: Buat project di [Google Cloud Console](https://console.cloud.google.com/), aktifkan **YouTube Data API v3**, dan buat _API Key_ di bagian Credentials.

### 3. Jalankan Development Server

Setelah API Key telah siap di file `.env.local`, jalankan perintah:

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda. Aplikasi siap digunakan!
