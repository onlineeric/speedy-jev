import { JevApiError, JevNetworkError } from './jev-api-error';
import type { JevResponse } from './jev-types';

/**
 * The only destination the API key is ever sent to.
 * Deliberately not user-configurable so the key cannot be redirected elsewhere.
 */
export const JEV_ENDPOINT = 'https://api.typesafe.ai/v1/systemone';

export interface SendToJevOptions {
  signal?: AbortSignal;
}

export async function sendToJev(
  requestBody: unknown,
  apiKey: string,
  { signal }: SendToJevOptions = {},
): Promise<JevResponse> {
  const response = await postJson(requestBody, apiKey, signal);

  if (!response.ok) {
    throw new JevApiError(response.status, await response.text());
  }

  return (await response.json()) as JevResponse;
}

async function postJson(
  requestBody: unknown,
  apiKey: string,
  signal: AbortSignal | undefined,
): Promise<Response> {
  try {
    return await fetch(JEV_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      signal,
    });
  } catch (error) {
    if (signal?.aborted) throw error;
    throw new JevNetworkError({ cause: error });
  }
}
