import { describe, expect, it } from 'vitest';
import { JevApiError } from './jev-api-error';

describe('JevApiError', () => {
  it('trims and truncates long response bodies', () => {
    const error = new JevApiError(422, `  ${'x'.repeat(2000)}  `);
    expect(error.detail).toHaveLength(500);
  });
});
