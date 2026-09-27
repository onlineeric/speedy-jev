import { storage } from 'wxt/utils/storage';
import { DEFAULT_REQUEST_TEMPLATE } from '../request-template/default-request-template';

/*
 * All settings live in `storage.local`: private to this extension, kept on this
 * device only and never synced to the browser account (unlike `storage.sync`).
 */

export const apiKeySetting = storage.defineItem<string>('local:jevApiKey', {
  fallback: '',
});

export const requestTemplateSetting = storage.defineItem<string>('local:requestTemplate', {
  fallback: DEFAULT_REQUEST_TEMPLATE,
});

export interface Settings {
  apiKey: string;
  requestTemplate: string;
}

export async function loadSettings(): Promise<Settings> {
  const [apiKey, requestTemplate] = await Promise.all([
    apiKeySetting.getValue(),
    requestTemplateSetting.getValue(),
  ]);
  return { apiKey, requestTemplate };
}
