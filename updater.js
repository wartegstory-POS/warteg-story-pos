import { CapacitorUpdater } from '@capgo/capacitor-updater';

// Expose the official Capacitor plugin to the existing POS launcher updater.
// The original HTML calls notifyAppReady after the page has loaded.
window.WartegCapacitorUpdater = CapacitorUpdater;
