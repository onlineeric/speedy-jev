import { browser } from 'wxt/browser';

export type TextSource = 'selection' | 'page';

export interface CapturedText {
  text: string;
  source: TextSource;
}

export class PageCaptureError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'PageCaptureError';
  }
}

/**
 * Runs inside the web page. Must be self-contained (no imports or outer
 * variables) because the browser serializes it into the page.
 */
export function readSelectionOrPageText(): CapturedText {
  const selection = window.getSelection()?.toString().trim() ?? '';
  if (selection) return { text: selection, source: 'selection' };
  return { text: document.body?.innerText.trim() ?? '', source: 'page' };
}

/** Reads the selected text of the active tab, or the whole page text if nothing is selected. */
export async function captureActiveTabText(): Promise<CapturedText> {
  const [activeTab] = await browser.tabs.query({ active: true, currentWindow: true });
  if (activeTab?.id === undefined) {
    throw new PageCaptureError('No active tab found.');
  }

  let results;
  try {
    results = await browser.scripting.executeScript({
      target: { tabId: activeTab.id },
      func: readSelectionOrPageText,
    });
  } catch (error) {
    throw new PageCaptureError(
      'This page cannot be read. Browser pages and extension stores are protected.',
      { cause: error },
    );
  }

  const captured = results[0]?.result as CapturedText | undefined;
  if (!captured?.text) {
    throw new PageCaptureError('No text found on this page.');
  }
  return captured;
}
