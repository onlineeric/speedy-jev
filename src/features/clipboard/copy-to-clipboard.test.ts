import { afterEach, describe, expect, it, vi } from 'vitest';
import { copyToClipboard } from './copy-to-clipboard';

describe('copyToClipboard', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('writes the text to the clipboard', async () => {
    const writeText = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue();

    await expect(copyToClipboard('Page text')).resolves.toBe(true);
    expect(writeText).toHaveBeenCalledWith('Page text');
  });

  it('resolves to false instead of failing when the clipboard is unavailable', async () => {
    vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(new Error('Document not focused'));

    await expect(copyToClipboard('Page text')).resolves.toBe(false);
  });
});
