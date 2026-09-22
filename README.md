# 📊 Superstore Executive Analytics Dashboard

Dashboard analitik interaktif modern untuk menganalisis kinerja penjualan ritel, profitabilitas, diskon, dan logistik berdasarkan **Superstore Sales Dataset (9,994 baris transaksi)**.

![Superstore Dashboard](https://img.shields.io/badge/Status-Active-emerald)
![Tech Stack](https://img.shields.io/badge/Tech-HTML5%20%7C%20TailwindCSS%20%7C%20ApexCharts%20%7C%20JavaScript-sky)
![Theme](https://img.shields.io/badge/UI-Light%20%26%20Dark%20Mode-indigo)

---

## 🌟 Fitur Utama

- **5 Executive Scorecards (KPI)**:
  - *Total Revenue (Sales)*
  - *Total Net Profit* (dengan indikator status margin)
  - *Profit Margin %*
  - *Volume & Orders*
  - *Average Order Value (AOV)*
- **💡 Smart AI/Automated Insight Banner**: Ringkasan performa otomatis untuk mendeteksi lini produk terbaik dan peringatan kerugian akibat diskon.
- **📈 6 Grafik Visualisasi Interaktif**:
  1. *Monthly Sales & Profit Trend* (Area & Line Chart 2014-2017)
  2. *Top 10 Sub-Category Performance* (Dual Horizontal Bar Chart)
  3. *Customer Segment Contribution* (Donut Chart)
  4. *Regional Sales & Profit Share* (Bar Chart)
  5. *Discount vs Profit Margin Impact* (Combo Risk Chart)
  6. *Shipping Logistics Distribution* (Pie Chart)
- **🎛️ Filter Multi-Dimensi**: Filter instan berdasarkan Tahun (2014-2017), Region, Customer Segment, dan Kategori Produk.
- **🔍 Data Explorer Table**: Tabel transaksi lengkap dengan fitur pencarian real-time, sorting kolom, dan paginasi.
- **📥 Export Data**: Unduh data yang sedang difilter ke format `.csv` hanya dengan satu klik.
- **🌓 Light / Dark Mode**: Tampilan default tema terang yang bersih dan elegan dengan tombol switcher ke mode gelap.

---

## 🚀 Cara Menjalankan Secara Lokal

### Opsi 1: Langsung Buka File (Tanpa Server)
Cukup buka file `index.html` langsung di browser favorit Anda (Chrome, Edge, Firefox).

### Opsi 2: Menggunakan Local Web Server
Jalankan perintah berikut di terminal:
```bash
py -m http.server 3000
```
Lalu buka di browser: **[http://localhost:3000](http://localhost:3000)**

---

## 📁 Struktur File Proyek

```
superstore-dashboard/
├── index.html                  # Antarmuka Dashboard (Tailwind CSS, ApexCharts, Lucide Icons)
├── app.js                      # Logika aplikasi, state filter, chart rendering, tabel
├── data.js                     # Data 9,994 transaksi yang dinormalkan untuk browser
├── superstore_data.json        # Data JSON terstruktur
├── export_data.py              # Script Python ekstraksi dan normalisasi data
├── Superstore dataset (1).xlsx # Dataset mentah Excel
└── README.md                   # Dokumentasi proyek
```

---

Dibuat dengan ❤️ untuk analisis data dan visualisasi bisnis interaktif.
