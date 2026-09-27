import { describe, expect, it } from 'vitest';
import {
  calculateRequestCost,
  DEFAULT_INPUT_PRICE_PER_MTOK,
  formatPricePerMTok,
  formatUsd,
  isValidPrice,
} from './request-cost';

describe('calculateRequestCost', () => {
  it('charges input tokens at the price per million tokens', () => {
    const cost = calculateRequestCost({ input_tokens: 1_000_000, output_tokens: 0 }, 0.042);
    expect(cost).toBeCloseTo(0.042);
  });

  it('does not charge output tokens', () => {
    const cost = calculateRequestCost({ input_tokens: 0, output_tokens: 5_000 }, 0.042);
    expect(cost).toBe(0);
  });

  it('scales with the number of input tokens', () => {
    const cost = calculateRequestCost(
      { input_tokens: 296, output_tokens: 20 },
      DEFAULT_INPUT_PRICE_PER_MTOK,
    );
    expect(cost).toBeCloseTo(0.000012432);
  });
});

describe('formatUsd', () => {
  it.each([
    [0.000012432, '$0.000012'],
    [0.00126, '$0.0013'],
    [0.042, '$0.042'],
    [0, '$0'],
  ])('formats %f as %s', (amount, expected) => {
    expect(formatUsd(amount)).toBe(expected);
  });
});

describe('formatPricePerMTok', () => {
  it.each([
    [0.042, '$0.042/MTok'],
    [0.0425, '$0.0425/MTok'],
    [1, '$1/MTok'],
    [0, '$0/MTok'],
  ])('formats %f as %s without rounding to cost precision', (price, expected) => {
    expect(formatPricePerMTok(price)).toBe(expected);
  });
});

describe('isValidPrice', () => {
  it.each([0, 0.042, 12])('accepts %f', (price) => {
    expect(isValidPrice(price)).toBe(true);
  });

  it.each([-1, Number.NaN, Number.POSITIVE_INFINITY])('rejects %f', (price) => {
    expect(isValidPrice(price)).toBe(false);
  });
});
