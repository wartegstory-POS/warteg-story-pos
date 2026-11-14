import { CapacitorUpdater } from '@capgo/capacitor-updater';

window.WartegCapacitorUpdater = CapacitorUpdater;

if (
  window.Capacitor &&
  window.Capacitor.isNativePlatform &&
  window.Capacitor.isNativePlatform()
) {
  CapacitorUpdater.notifyAppReady().catch((error) => {
    console.error('[Warteg Story] notifyAppReady failed:', error);
  });
}

const OTA_BASE_URL =
  'https://wartegstory-pos.github.io/warteg-story-pos/';

window.wsGetNativeUpdater = function () {
  return window.WartegCapacitorUpdater || null;
};

window.wsCheckPatchUpdate = async function () {
  const button = document.getElementById('btn-check-update');

  try {
    if (button) {
      button.disabled = true;
      button.textContent = 'MEMERIKSA UPDATE…';
    }

    window.wsStatus(
      'Menghubungkan ke server Warteg Story untuk memeriksa patch…'
    );

    const updater = window.wsGetNativeUpdater();

    if (
      !updater ||
      typeof updater.download !== 'function' ||
      typeof updater.set !== 'function'
    ) {
      throw new Error(
        'Fitur OTA belum tersedia. Perlu pembaruan APK untuk mengaktifkan updater native.'
      );
    }

    const versionUrl =
      OTA_BASE_URL + 'version.json?t=' + Date.now();

    const response = await fetch(versionUrl, {
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(
        'Gagal mengambil informasi versi (HTTP ' +
          response.status +
          ').'
      );
    }

    const data = await response.json();

    if (!data.version) {
      throw new Error(
        'Informasi versi tidak ditemukan di version.json.'
      );
    }

    const releaseVersion = String(data.version);
    const patchName =
      data.patch_asset || 'warteg-story-pos-patch.zip';

    const patchUrl =
      OTA_BASE_URL +
      'updates/' +
      encodeURIComponent(patchName) +
      '?v=' +
      encodeURIComponent(releaseVersion);

    window.wsStatus(
      'Patch versi ' +
        releaseVersion +
        ' ditemukan. Mengunduh…'
    );

    const bundle = await updater.download({
      url: patchUrl,
      version: releaseVersion
    });

    if (!bundle || !bundle.id) {
      throw new Error(
        'Patch terunduh tetapi ID bundle tidak diterima.'
      );
    }

    window.wsStatus(
      'Patch berhasil diunduh. Memasang patch…'
    );

    await updater.set({
      id: bundle.id
    });

    window.wsStatus(
      'Patch versi ' +
        releaseVersion +
        ' berhasil dipasang. Restart aplikasi.'
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
      button.textContent = 'CEK UPDATE / PATCH';
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('btn-check-update');

  if (button) {
    button.addEventListener('click', () => {
      window.wsCheckPatchUpdate();
    });
  }
});
