import { CapacitorUpdater } from '@capgo/capacitor-updater';

// Expose the official Capacitor plugin to the existing POS launcher updater.
window.WartegCapacitorUpdater = CapacitorUpdater;

// Capgo requires this on EVERY native app launch. Call it immediately after
// the bundled bridge is loaded so a valid bundle is not rolled back.
if (window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform()) {
  CapacitorUpdater.notifyAppReady().catch((error) => {
    console.error('[Warteg Story] notifyAppReady failed:', error);
  });
}
