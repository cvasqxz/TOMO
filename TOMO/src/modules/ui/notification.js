/**
 * Native Notification System
 * Displays native OS notifications using Tauri's notification plugin
 */

import { sendNotification, isPermissionGranted, requestPermission } from '@tauri-apps/plugin-notification';

/**
 * Show a native notification
 * @param {string} message - The message to display
 * @param {string} type - The notification type: 'info', 'success', 'warning', 'error'
 */
export async function showNotification(message, type = 'info') {
  let permissionGranted = await isPermissionGranted();

  if (!permissionGranted) {
    const permission = await requestPermission();
    permissionGranted = permission === 'granted';
  }

  if (permissionGranted) {
    const titles = {
      info: 'TOMO',
      success: 'TOMO - Success',
      warning: 'TOMO - Warning',
      error: 'TOMO - Error'
    };

    await sendNotification({
      title: titles[type] || titles.info,
      body: message,
    });
  } else {
    console.warn('Notification permission not granted');
  }
}
