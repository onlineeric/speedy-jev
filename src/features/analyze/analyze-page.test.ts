import { describe, expect, it, vi } from 'vitest';
import type { JevResponse } from '../jev-api/jev-types';
import { analyzeActivePage, type AnalyzeDependencies } from './analyze-page';
import { MissingApiKeyError } from './analyze-errors';
import { InvalidTemplateError } from '../request-template/request-template';

const JEV_RESPONSE: JevResponse = { model: 'jev-1', answers: {} };

function createDependencies(overrides: Partial<AnalyzeDependencies> = {}): AnalyzeDependencies {
  return {
    loadSettings: vi.fn().mockResolvedValue({
      apiKey: 'key-123',
      requestTemplate: '{ "model": "jev-latest", "state": "{{text}}" }',
    }),
    captureText: vi.fn().mockResolvedValue({ text: 'Selected', source: 'selection' }),
    sendToJev: vi.fn().mockResolvedValue(JEV_RESPONSE),
    ...overrides,
  };
}

describe('analyzeActivePage', () => {
  it('captures text, fills the template and sends it to Jev', async () => {
    const dependencies = createDependencies();

    const result = await analyzeActivePage({ dependencies });

    expect(dependencies.sendToJev).toHaveBeenCalledWith(
      { model: 'jev-latest', state: 'Selected' },
      'key-123',
      { signal: undefined },
    );
    expect(result).toEqual({
      captured: { text: 'Selected', source: 'selection' },
      response: JEV_RESPONSE,
    });
  });

  it('reports each step in order', async () => {
    const onStep = vi.fn();
    await analyzeActivePage({ dependencies: createDependencies(), onStep });
    expect(onStep.mock.calls).toEqual([['capturing'], ['sending']]);
  });

  it('fails before reading the page when no API key is set', async () => {
    const dependencies = createDependencies({
      loadSettings: vi.fn().mockResolvedValue({ apiKey: '', requestTemplate: '{}' }),
    });

    await expect(analyzeActivePage({ dependencies })).rejects.toBeInstanceOf(MissingApiKeyError);
    expect(dependencies.captureText).not.toHaveBeenCalled();
  });

  it('fails without calling Jev when the template is invalid', async () => {
    const dependencies = createDependencies({
      loadSettings: vi.fn().mockResolvedValue({ apiKey: 'key', requestTemplate: 'oops' }),
    });

    await expect(analyzeActivePage({ dependencies })).rejects.toBeInstanceOf(InvalidTemplateError);
    expect(dependencies.sendToJev).not.toHaveBeenCalled();
  });

  it('does not call Jev when aborted while capturing', async () => {
    const controller = new AbortController();
    const dependencies = createDependencies({
      captureText: vi.fn().mockImplementation(async () => {
        controller.abort();
        return { text: 'x', source: 'page' };
      }),
    });

    await expect(
      analyzeActivePage({ dependencies, signal: controller.signal }),
    ).rejects.toThrow();
    expect(dependencies.sendToJev).not.toHaveBeenCalled();
  });

  it('passes the abort signal to Jev', async () => {
    const dependencies = createDependencies();
    const controller = new AbortController();

    await analyzeActivePage({ dependencies, signal: controller.signal });

    expect(dependencies.sendToJev).toHaveBeenCalledWith(expect.anything(), 'key-123', {
      signal: controller.signal,
    });
  });
});
