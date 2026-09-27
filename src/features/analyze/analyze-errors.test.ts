import { describe, expect, it } from 'vitest';
import { JevApiError, JevNetworkError } from '../jev-api/jev-api-error';
import { PageCaptureError } from '../page-capture/capture-page-text';
import { InvalidTemplateError } from '../request-template/request-template';
import { isFixableInSettings, MissingApiKeyError, toErrorMessage } from './analyze-errors';

describe('isFixableInSettings', () => {
  it.each([
    ['missing API key', new MissingApiKeyError()],
    ['invalid template', new InvalidTemplateError('bad')],
    ['rejected key', new JevApiError(401, '')],
    ['rejected body', new JevApiError(422, '')],
  ])('is true for %s', (_label, error) => {
    expect(isFixableInSettings(error)).toBe(true);
  });

  it.each([
    ['rate limit', new JevApiError(429, '')],
    ['network error', new JevNetworkError()],
    ['page capture error', new PageCaptureError('nope')],
    ['non-error value', 'boom'],
  ])('is false for %s', (_label, error) => {
    expect(isFixableInSettings(error)).toBe(false);
  });
});

describe('toErrorMessage', () => {
  it('uses the message of Error instances', () => {
    expect(toErrorMessage(new Error('Specific problem'))).toBe('Specific problem');
  });

  it('falls back to a generic message for non-errors', () => {
    expect(toErrorMessage({ weird: true })).toBe('Something went wrong.');
  });
});
