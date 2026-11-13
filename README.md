# Warteg Story POS — Root Build

Sumber aplikasi berada langsung di repository root: `index.html`, `icon.png`, `version.json`, dan `updater.js`. Tidak ada folder `www/` di source repository.

GitHub Actions membuat staging sementara `.build/web` saat build, lalu Capacitor mengemasnya ke APK. Folder staging bukan sumber yang perlu diedit atau diunggah.

## Build
1. Upload seluruh isi ZIP ini ke root repository branch `main`.
2. Buka Actions → Build Warteg Story POS APK → Run workflow.
3. Build menghasilkan APK dan `warteg-story-pos-patch.zip`.
4. Untuk menerbitkan OTA Release, naikkan `version` di `version.json`, lalu jalankan workflow manual.
5. Di launcher aplikasi, simpan URL repository GitHub yang sama pada Pengaturan Server Update.

Catatan: `appId` saat ini diset ke `com.wartegstory.pos`. Jangan menggantinya setelah APK pertama dipasang, karena Android memakai application ID untuk mengenali update aplikasi.
