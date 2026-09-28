import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fakeBrowser } from 'wxt/testing/fake-browser';
import { analyzeActivePage, type AnalyzeResult } from '../../features/analyze/analyze-page';
import { MissingApiKeyError } from '../../features/analyze/analyze-errors';
import { JevApiError } from '../../features/jev-api/jev-api-error';
import { inputPriceSetting } from '../../features/settings/settings-storage';
import { version } from '../../../package.json';
import iconUrl from '../../../resources/speedy-jev-icon.svg';
import { App } from './App';

vi.mock('../../features/analyze/analyze-page', () => ({
  analyzeActivePage: vi.fn(),
}));

const analyzeMock = vi.mocked(analyzeActivePage);

const RESULT: AnalyzeResult = {
  captured: { text: 'Some selected text', source: 'selection' },
  response: {
    model: 'jev-1.13.0',
    answers: { is_urgent: { type: 'noul', noul: 0.9 } },
    usage: { input_tokens: 1234, output_tokens: 5 },
  },
  copiedToClipboard: false,
};

beforeEach(() => {
  analyzeMock.mockReset();
  vi.spyOn(window, 'close').mockImplementation(() => {});
});

describe('popup App', () => {
  it('shows the extension icon before the title', () => {
    analyzeMock.mockReturnValue(new Promise(() => {}));

    render(<App />);

    const heading = screen.getByRole('heading', { name: 'Speedy Jev' });
    expect(heading.querySelector('img')).toHaveAttribute('src', iconUrl);
  });

  it('shows progress while Jev is working', async () => {
    analyzeMock.mockImplementation(({ onStep } = {}) => {
      onStep?.('sending');
      return new Promise(() => {});
    });

    render(<App />);

    expect(await screen.findByRole('status')).toHaveTextContent('Asking Jev…');
    expect(screen.getByRole('button', { name: 'Run again' })).toBeDisabled();
  });

  it('shows the answers returned by Jev', async () => {
    analyzeMock.mockResolvedValue(RESULT);

    render(<App />);

    expect(await screen.findByText('is_urgent')).toBeInTheDocument();
    expect(screen.getByText('Yes (90% yes)')).toBeInTheDocument();
    expect(screen.getByText(/Selected text · 18 characters/)).toBeInTheDocument();
    expect(screen.getByText('Model jev-1.13.0')).toBeInTheDocument();
    expect(screen.getByText(/^1,234 input tokens/)).toBeInTheDocument();
    expect(screen.getByText(`Version ${version}`)).toBeInTheDocument();
  });

  it('says when the captured text was copied to the clipboard', async () => {
    analyzeMock.mockResolvedValue({ ...RESULT, copiedToClipboard: true });

    render(<App />);

    expect(
      await screen.findByText('Selected text · 18 characters · Copied to clipboard'),
    ).toBeInTheDocument();
  });

  it('does not mention the clipboard when nothing was copied', async () => {
    analyzeMock.mockResolvedValue(RESULT);

    render(<App />);

    expect(await screen.findByText('Selected text · 18 characters')).toBeInTheDocument();
    expect(screen.queryByText(/Copied to clipboard/)).not.toBeInTheDocument();
  });

  it('shows the estimated cost at the default input price', async () => {
    analyzeMock.mockResolvedValue(RESULT);

    render(<App />);

    // 1,234 tokens × $0.042 / 1M tokens = $0.0000518
    expect(
      await screen.findByText(/≈ \$0\.000052 \(assuming \$0\.042\/MTok input\)/),
    ).toBeInTheDocument();
  });

  it('uses the input price saved in Settings for the cost', async () => {
    await inputPriceSetting.setValue(1);
    analyzeMock.mockResolvedValue(RESULT);

    render(<App />);

    expect(
      await screen.findByText(/≈ \$0\.0012 \(assuming \$1\/MTok input\)/),
    ).toBeInTheDocument();
  });

  it('shows the full captured text without truncating it', async () => {
    const longText = 'word '.repeat(2000).trim();
    analyzeMock.mockResolvedValue({ ...RESULT, captured: { text: longText, source: 'page' } });

    render(<App />);
    await userEvent.click(await screen.findByText('Captured text'));

    expect(screen.getByText(longText)).toBeInTheDocument();
  });

  it('runs the analysis again on "Run again"', async () => {
    analyzeMock.mockResolvedValue(RESULT);
    render(<App />);
    await screen.findByText('is_urgent');

    await userEvent.click(screen.getByRole('button', { name: 'Run again' }));

    await screen.findByText('is_urgent');
    expect(analyzeMock).toHaveBeenCalledTimes(2);
  });

  it('offers to open settings when the API key is missing', async () => {
    analyzeMock.mockRejectedValue(new MissingApiKeyError());
    const openOptionsPage = vi
      .spyOn(fakeBrowser.runtime, 'openOptionsPage')
      .mockResolvedValue(undefined);

    render(<App />);
    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Add your Jev API key');

    await userEvent.click(screen.getByRole('button', { name: 'Open settings' }));
    expect(openOptionsPage).toHaveBeenCalledOnce();
  });

  it('shows details from Jev and a retry button for other API errors', async () => {
    analyzeMock.mockRejectedValue(new JevApiError(429, 'slow down'));

    render(<App />);

    expect(await screen.findByRole('alert')).toHaveTextContent('rate limit');
    expect(screen.getByText('slow down')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
  });
});
