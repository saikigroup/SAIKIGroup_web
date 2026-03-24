# Setup Dub.co Link Shortener (s.saiki.id)

## 1. Buat Akun & Workspace

1. Buka [dub.co](https://dub.co) dan login/register
2. Buat workspace baru (atau pakai yang sudah ada)

## 2. Setup Custom Domain

> Kamu sudah selesai step ini (s.saiki.id sudah active)

1. Buka **Settings > Domains** di sidebar kiri
2. Klik **Add custom domain**
3. Masukkan: `s.saiki.id`
4. Di DNS provider (Cloudflare/Niagahoster), tambahkan:
   - **Type:** CNAME
   - **Name:** `s` (subdomain)
   - **Target:** `cname.dub.co`
5. Tunggu propagasi DNS (biasanya 5-30 menit)
6. Status di Dub.co akan berubah jadi hijau "DNS records are set up correctly"

## 3. Dapatkan API Key

1. Login ke [app.dub.co](https://app.dub.co)
2. Klik avatar/nama kamu di **kiri bawah** sidebar
3. Pilih **Settings**
4. Di sidebar Settings, klik **API Keys** (atau langsung buka [app.dub.co/settings/tokens](https://app.dub.co/settings/tokens))
5. Klik **Create new API key**
6. Isi:
   - **Name:** `saiki-web-production` (atau nama apapun untuk identifikasi)
   - **Permission:** pilih **All permissions** (atau minimal: `links.write`, `links.read`)
   - **Expiration:** pilih sesuai kebutuhan (recommended: No expiration, atau 1 year)
7. Klik **Create API Key**
8. **COPY API key yang muncul** (hanya tampil sekali!)
   - Format: `dub_xxxxxxxxxxxxxxxxxxxxxxxx`

## 4. Set Environment Variables

Tambahkan di `.env` (local) dan di hosting platform (Vercel/dll):

```env
DUB_API_KEY=dub_xxxxxxxxxxxxxxxxxxxxxxxx
DUB_DOMAIN=s.saiki.id
```

### Di Vercel:
1. Buka project di [vercel.com](https://vercel.com)
2. **Settings > Environment Variables**
3. Tambahkan:
   | Key | Value | Environment |
   |-----|-------|-------------|
   | `DUB_API_KEY` | `dub_xxxx...` | Production, Preview |
   | `DUB_DOMAIN` | `s.saiki.id` | Production, Preview |
4. Redeploy project agar env variables aktif

## 5. Buat Tabel Database

Jalankan SQL di Supabase SQL Editor:

1. Buka [Supabase Dashboard](https://supabase.com/dashboard) > project kamu
2. Klik **SQL Editor** di sidebar
3. Paste isi file `docs/database/create_short_links_table.sql`
4. Klik **Run**

Tabel `saikiweb_short_links` akan menyimpan cache semua short link yang pernah dibuat, jadi link yang sama tidak perlu di-generate ulang.

## 6. Test

1. Buka admin panel > Social Posts
2. Pilih article + platform + post type
3. Di section "UTM Tracked Link", klik **Shorten -> s.saiki.id**
4. Short link akan muncul (contoh: `https://s.saiki.id/abc123`)
5. Buka tab baru, ganti platform/postType, lalu kembali ke pilihan semula -> short link otomatis muncul (dari cache DB)

## Cara Kerja

```
User pilih article + platform + postType
         |
         v
  Auto-generate UTM link panjang
  (saiki.id/id/insights/xxx?utm_source=instagram&...)
         |
         v
  Auto-lookup di DB: sudah pernah di-shorten?
        / \
      Ya    Tidak
      |       |
  Tampilkan   User klik "Shorten"
  dari cache       |
      |        Call Dub.co API
      |            |
      |        Simpan ke DB
      |            |
      +------> Short link siap pakai
                   |
               Masuk ke prompt yang di-generate
               (s.saiki.id/xxx bukan link panjang)
```

## Troubleshooting

| Masalah | Solusi |
|---------|--------|
| "DUB_API_KEY not configured" | Tambahkan env variable dan redeploy |
| "Failed to create short link" | Cek API key valid, cek domain sudah aktif di Dub.co |
| Short link tidak muncul otomatis | Pastikan tabel `saikiweb_short_links` sudah dibuat di Supabase |
| Domain belum aktif | Cek DNS CNAME record: `s` -> `cname.dub.co` |
