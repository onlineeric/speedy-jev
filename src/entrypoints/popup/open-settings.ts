import { browser } from 'wxt/browser';

export async function openSettingsAndClosePopup(): Promise<void> {
  await browser.runtime.openOptionsPage();
  window.close();
}
