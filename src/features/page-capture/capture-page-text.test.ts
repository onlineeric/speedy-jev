import { afterEach, describe, expect, it, vi } from 'vitest';
import { fakeBrowser } from 'wxt/testing/fake-browser';
import type { Browser } from 'wxt/browser';
import {
  captureActiveTabText,
  PageCaptureError,
  readSelectionOrPageText,
  type CapturedText,
} from './capture-page-text';

describe('readSelectionOrPageText', () => {
  afterEach(() => {
    window.getSelection()?.removeAllRanges();
    document.body.innerHTML = '';
  });

  it('returns the selected text when there is a selection', () => {
    document.body.innerHTML = '<p id="target">  Selected words  </p><p>Other text</p>';
    const range = document.createRange();
    range.selectNodeContents(document.getElementById('target')!);
    window.getSelection()!.addRange(range);

    expect(readSelectionOrPageText()).toEqual({ text: 'Selected words', source: 'selection' });
  });

  it('falls back to the whole page text when nothing is selected', () => {
    document.body.innerHTML = '<p>Whole page</p>';
    const captured = readSelectionOrPageText();

    expect(captured.source).toBe('page');
    expect(captured.text).toContain('Whole page');
  });
});

describe('captureActiveTabText', () => {
  const ACTIVE_TAB = { id: 7 } as Browser.tabs.Tab;

  // `as never` works around the overloaded (callback vs promise) browser API types.
  function mockActiveTab(tab: Browser.tabs.Tab | undefined) {
    return vi.spyOn(fakeBrowser.tabs, 'query').mockResolvedValue((tab ? [tab] : []) as never);
  }

  function mockScriptResult(result: CapturedText | undefined) {
    return vi
      .spyOn(fakeBrowser.scripting, 'executeScript')
      .mockResolvedValue([{ frameId: 0, documentId: 'doc', result }] as never);
  }

  it('runs the capture function in the active tab and returns its result', async () => {
    const queryTabs = mockActiveTab(ACTIVE_TAB);
    const executeScript = mockScriptResult({ text: 'Page text', source: 'page' });

    await expect(captureActiveTabText()).resolves.toEqual({ text: 'Page text', source: 'page' });

    expect(queryTabs).toHaveBeenCalledWith({ active: true, currentWindow: true });
    expect(executeScript).toHaveBeenCalledWith({
      target: { tabId: 7 },
      func: readSelectionOrPageText,
    });
  });

  it('fails when there is no active tab', async () => {
    mockActiveTab(undefined);
    await expect(captureActiveTabText()).rejects.toThrow('No active tab found.');
  });

  it('fails with a friendly message when the page cannot be scripted', async () => {
    mockActiveTab(ACTIVE_TAB);
    vi.spyOn(fakeBrowser.scripting, 'executeScript').mockRejectedValue(
      new Error('Cannot access a chrome:// URL'),
    );

    const error = await captureActiveTabText().catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(PageCaptureError);
    expect((error as Error).message).toContain('cannot be read');
  });

  it.each([undefined, { text: '', source: 'page' as const }])(
    'fails when no text is found (%o)',
    async (result) => {
      mockActiveTab(ACTIVE_TAB);
      mockScriptResult(result);
      await expect(captureActiveTabText()).rejects.toThrow('No text found on this page.');
    },
  );
});
