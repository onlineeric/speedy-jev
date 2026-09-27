import { sendToJev } from '../jev-api/jev-client';
import type { JevResponse } from '../jev-api/jev-types';
import { captureActiveTabText, type CapturedText } from '../page-capture/capture-page-text';
import { fillRequestTemplate } from '../request-template/request-template';
import { loadSettings } from '../settings/settings-storage';
import { MissingApiKeyError } from './analyze-errors';

export type AnalyzeStep = 'capturing' | 'sending';

export interface AnalyzeResult {
  captured: CapturedText;
  response: JevResponse;
}

export interface AnalyzeDependencies {
  loadSettings: typeof loadSettings;
  captureText: typeof captureActiveTabText;
  sendToJev: typeof sendToJev;
}

export interface AnalyzeOptions {
  signal?: AbortSignal;
  onStep?: (step: AnalyzeStep) => void;
  dependencies?: AnalyzeDependencies;
}

const defaultDependencies: AnalyzeDependencies = {
  loadSettings,
  captureText: captureActiveTabText,
  sendToJev,
};

/** Captures text from the active tab, fills the request template and asks Jev. */
export async function analyzeActivePage({
  signal,
  onStep,
  dependencies = defaultDependencies,
}: AnalyzeOptions = {}): Promise<AnalyzeResult> {
  const { apiKey, requestTemplate } = await dependencies.loadSettings();
  if (!apiKey) throw new MissingApiKeyError();

  onStep?.('capturing');
  const captured = await dependencies.captureText();
  const requestBody = fillRequestTemplate(requestTemplate, captured.text);

  signal?.throwIfAborted();
  onStep?.('sending');
  const response = await dependencies.sendToJev(requestBody, apiKey, { signal });

  return { captured, response };
}
