# 📚 Langkah IPII

> Roadmap perjalanan akademik mahasiswa **Ilmu Perpustakaan dan Informasi Islam** — dari semester 1 hingga wisuda.

Terinspirasi dari [roadmap.sh](https://roadmap.sh), didesain khusus untuk konteks mahasiswa IPII di Indonesia.

---

## 🗂 Struktur Folder

```
langkah-ipii/
│
├── index.html                    ← Halaman utama
│
├── assets/
│   ├── css/
│   │   ├── main.css              ← Variables, reset, tipografi
│   │   ├── layout.css            ← Container, grid, section layout
│   │   └── components.css        ← Node, tab, badge, card, button
│   │
│   ├── js/
│   │   ├── roadmap.js            ← Render roadmap dari JSON
│   │   ├── tabs.js               ← Logika tab switching 5 jalur
│   │   └── main.js               ← Init + theme toggle + scroll
│   │
│   ├── data/
│   │   └── roadmap-core.json     ← Semua data milestone semester 1–8
│   │
│   └── img/
│       └── (aset gambar)
│
└── README.md
```

---

## 🚀 Cara Jalankan Lokal

Karena project ini fetch JSON via `fetch()`, **tidak bisa dibuka langsung via `file://`**.
Gunakan server lokal:

**Opsi 1 — VS Code Live Server:**
- Install extension [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
- Klik kanan `index.html` → `Open with Live Server`

**Opsi 2 — Python:**
```bash
# Python 3
python -m http.server 3000
# Buka http://localhost:3000
```

**Opsi 3 — Node.js:**
```bash
npx serve .
```

---

## 🎨 Design System

| Token | Nilai |
|---|---|
| Font heading | Fraunces (serif) |
| Font body | Plus Jakarta Sans |
| Primary | `#0F6E56` (Teal) |
| Accent | `#BA7517` (Amber) |
| Dark mode | via `[data-theme="dark"]` |

---

## 📋 5 Jalur Mahasiswa

| ID | Nama | Deskripsi |
|---|---|---|
| `organisatoris` | Organisatoris | Aktif di HMJ, BEM, komunitas |
| `ipk` | Fokus IPK | Target nilai ≥ 3.70 |
| `sempro` | Sempro Cepat | Seminar proposal di sem 5 |
| `kupukupu` | Kupu-kupu | Kuliah-pulang, self-paced |
| `target35` | Target 3.5 Tahun | Lulus 7 semester |

---

## 🗺 Roadmap Pengembangan

- [x] Phase 1 — Struktur folder + HTML/CSS/JS dasar
- [ ] Phase 2 — Data JSON lengkap tiap jalur
- [ ] Phase 3 — Filter path lebih halus + animasi
- [ ] Phase 4 — Detail panel node (klik → sidebar)
- [ ] Phase 5 — Progress tracker (localStorage)
- [ ] Phase 6 — Deploy ke Vercel

---

## 📄 Lisensi

MIT — bebas digunakan dan dikembangkan untuk kebutuhan akademik.
