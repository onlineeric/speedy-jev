import { describe, expect, it } from 'vitest';
import { fakeBrowser } from 'wxt/testing/fake-browser';
import { DEFAULT_REQUEST_TEMPLATE } from '../request-template/default-request-template';
import {
  apiKeySetting,
  copyCapturedTextSetting,
  loadSettings,
  requestTemplateSetting,
} from './settings-storage';

describe('settings storage', () => {
  it('returns defaults when nothing is stored', async () => {
    await expect(loadSettings()).resolves.toEqual({
      apiKey: '',
      requestTemplate: DEFAULT_REQUEST_TEMPLATE,
      copyCapturedText: true,
    });
  });

  it('returns saved values', async () => {
    await apiKeySetting.setValue('my-key');
    await requestTemplateSetting.setValue('{"state":"{{text}}"}');
    await copyCapturedTextSetting.setValue(false);

    await expect(loadSettings()).resolves.toEqual({
      apiKey: 'my-key',
      requestTemplate: '{"state":"{{text}}"}',
      copyCapturedText: false,
    });
  });

  it('keeps the API key in local storage and never in synced storage', async () => {
    await apiKeySetting.setValue('my-key');

    await expect(fakeBrowser.storage.local.get('jevApiKey')).resolves.toEqual({
      jevApiKey: 'my-key',
    });
    await expect(fakeBrowser.storage.sync.get()).resolves.toEqual({});
  });
});
