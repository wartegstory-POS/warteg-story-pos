import { CapacitorUpdater } from '@capgo/capacitor-updater';

// Expose the official Capacitor plugin to the existing POS launcher updater.
window.WartegCapacitorUpdater = CapacitorUpdater;

// Capgo requires this on EVERY native app launch. Call it immediately after
// the bundled bridge is loaded so a valid bundle is not rolled back.
if (
  window.Capacitor &&
  window.Capacitor.isNativePlatform &&
  window.Capacitor.isNativePlatform()
) {
  CapacitorUpdater.notifyAppReady().catch((error) => {
    console.error('[Warteg Story] notifyAppReady failed:', error);
  });
}

// Base URL for Warteg Story OTA updates.
const OTA_BASE_URL = 'https://wartegstory-pos.github.io/warteg-story-pos/';

// Returns the native updater instance used by the POS launcher.
window.wsGetNativeUpdater = function wsGetNativeUpdater() {
  if (window.WartegCapacitorUpdater) {
    return window.WartegCapacitorUpdater;
  }

  return null;
};

// Checks GitHub Pages for a newer patch and installs it through CapacitorUpdater.
window.wsCheckPatchUpdate = async function wsCheckPatchUpdate() {
  const button = document.getElementById('btn-check-update');

  try {
    if (button) {
      button.disabled = true;
      button.innerHTML = '<span aria-hidden="true">↻</span> MEMERIKSA…';
    }

    window.wsStatus('Menghubungkan ke server Warteg Story untuk memeriksa patch…');

    const updater = window.wsGetNativeUpdater();

    if (
      !updater ||
      typeof updater.download !== 'function' ||
      typeof updater.set !== 'function'
    ) {
      throw new Error(
        'Fitur OTA belum tersedia. Diperlukan pembaruan APK untuk mengaktifkan updater native.'
      );
    }

    const versionResponse = await fetch(
      OTA_BASE_URL + 'version.json?t=' + Date.now(),
      {
        cache: 'no-store'
      }
    );

    if (!versionResponse.ok) {
      throw new Error(
        'Gagal mengambil informasi versi (HTTP ' + versionResponse.status + ').'
      );
    }

    const versionData = await versionResponse.json();

    if (!versionData.version) {
      throw new Error('Informasi versi tidak ditemukan di version.json.');
    }

    const releaseVersion = String(versionData.version);
    const patchName =
      versionData.patch_asset || 'warteg-story-pos-patch.zip';

    const patchUrl =
      OTA_BASE_URL +
      'updates/' +
      encodeURIComponent(patchName) +
      '?v=' +
      encodeURIComponent(releaseVersion);

    window.wsStatus(
      'Patch versi ' + releaseVersion + ' ditemukan. Mengunduh…'
    );

    const bundle = await updater.download({
      url: patchUrl,
      version: releaseVersion
    });

    if (!bundle || !bundle.id) {
      throw new Error('Patch terunduh tetapi ID bundle tidak diterima.');
    }

    window.wsStatus('Patch berhasil diunduh. Memasang patch…');

    await updater.set({ id: bundle.id });

    window.wsStatus(
      'Patch versi ' +
        releaseVersion +
        ' berhasil dipasang. Restart aplikasi untuk menerapkan perubahan.'
    );
  } catch (error) {
    const message =
      error && error.message
        ? error.message
        : 'Pemeriksaan atau pemasangan patch gagal.';

    window.wsStatus(
      message.includes('Failed to fetch')
        ? 'Tidak dapat terhubung ke server update. Periksa koneksi internet.'
        : message
    );
  } finally {
    if (button) {
      button.disabled = false;
      button.innerHTML =
        '<span aria-hidden="true">↻</span> CEK UPDATE / P
