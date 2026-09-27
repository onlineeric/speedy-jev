import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { JevApiError, JevNetworkError } from './jev-api-error';
import { JEV_ENDPOINT, sendToJev } from './jev-client';
import type { JevResponse } from './jev-types';

const API_KEY = 'test-key';
const REQUEST_BODY = { model: 'jev-latest', state: 'hello', questions: {} };
const JEV_RESPONSE: JevResponse = {
  model: 'jev-1.13.0',
  answers: { is_urgent: { type: 'noul', noul: 0.95 } },
  usage: { input_tokens: 10, output_tokens: 2 },
};

const fetchMock = vi.fn<typeof fetch>();

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  fetchMock.mockReset();
  vi.unstubAllGlobals();
});

function lastFetchCall() {
  const call = fetchMock.mock.lastCall;
  if (!call) throw new Error('fetch was not called');
  return call;
}

describe('sendToJev', () => {
  it('POSTs the JSON body to the Jev endpoint with the bearer key', async () => {
    fetchMock.mockResolvedValue(Response.json(JEV_RESPONSE));

    await sendToJev(REQUEST_BODY, API_KEY);

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = lastFetchCall();
    expect(url).toBe('https://api.typesafe.ai/v1/systemone');
    expect(url).toBe(JEV_ENDPOINT);
    expect(init?.method).toBe('POST');
    expect(init?.headers).toEqual({
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    });
    expect(JSON.parse(init?.body as string)).toEqual(REQUEST_BODY);
  });

  it('returns the parsed response', async () => {
    fetchMock.mockResolvedValue(Response.json(JEV_RESPONSE));
    await expect(sendToJev(REQUEST_BODY, API_KEY)).resolves.toEqual(JEV_RESPONSE);
  });

  it('forwards the abort signal to fetch', async () => {
    fetchMock.mockResolvedValue(Response.json(JEV_RESPONSE));
    const controller = new AbortController();

    await sendToJev(REQUEST_BODY, API_KEY, { signal: controller.signal });

    expect(lastFetchCall()[1]?.signal).toBe(controller.signal);
  });

  it.each([
    [401, 'API key'],
    [422, 'request template'],
    [429, 'rate limit'],
    [529, 'overloaded'],
    [500, 'HTTP 500'],
  ])('throws a JevApiError with a friendly message for HTTP %i', async (status, messagePart) => {
    fetchMock.mockResolvedValue(new Response('{"error":"details"}', { status }));

    const error = await sendToJev(REQUEST_BODY, API_KEY).catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(JevApiError);
    expect((error as JevApiError).status).toBe(status);
    expect((error as JevApiError).message).toContain(messagePart);
    expect((error as JevApiError).detail).toBe('{"error":"details"}');
  });

  it('never includes the API key in error messages', async () => {
    fetchMock.mockResolvedValue(new Response('', { status: 401 }));
    const error = (await sendToJev(REQUEST_BODY, API_KEY).catch((e: unknown) => e)) as Error;
    expect(error.message).not.toContain(API_KEY);
  });

  it('throws JevNetworkError when the request cannot be sent', async () => {
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'));
    await expect(sendToJev(REQUEST_BODY, API_KEY)).rejects.toBeInstanceOf(JevNetworkError);
  });

  it('rethrows the abort error untouched when the request is aborted', async () => {
    const controller = new AbortController();
    controller.abort();
    const abortError = new DOMException('Aborted', 'AbortError');
    fetchMock.mockRejectedValue(abortError);

    await expect(
      sendToJev(REQUEST_BODY, API_KEY, { signal: controller.signal }),
    ).rejects.toBe(abortError);
  });
});
