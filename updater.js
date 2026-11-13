import { CapacitorUpdater } from '@capgo/capacitor-updater';

// Expose the official native plugin to the existing launcher OTA code.
window.WartegCapacitorUpdater = CapacitorUpdater;

// Must run on every launch so the native updater can keep rollback protection.
CapacitorUpdater.notifyAppReady().catch((error) => {
  console.warn('[Warteg Story] notifyAppReady:', error);
});
