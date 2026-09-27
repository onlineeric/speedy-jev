import type { JevUsage } from '../jev-api/jev-types';

/**
 * Jev 1.13 input price in USD per million tokens; output tokens are free.
 * TypeSafe has no pricing API, so this comes from https://docs.typesafe.ai/models
 * and users can override it in Settings when the price changes.
 */
export const DEFAULT_INPUT_PRICE_PER_MTOK = 0.042;

const TOKENS_PER_MTOK = 1_000_000;

const costFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumSignificantDigits: 2,
});

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 6,
});

/** Estimated request cost in USD. Only input tokens are billed. */
export function calculateRequestCost(usage: JevUsage, inputPricePerMTok: number): number {
  return (usage.input_tokens / TOKENS_PER_MTOK) * inputPricePerMTok;
}

/** Formats small USD amounts with enough precision to be meaningful, e.g. `$0.000012`. */
export function formatUsd(amount: number): string {
  return costFormatter.format(amount);
}

/** Formats a configured price without rounding it away, e.g. `$0.042/MTok`. */
export function formatPricePerMTok(pricePerMTok: number): string {
  return `${priceFormatter.format(pricePerMTok)}/MTok`;
}

export function isValidPrice(price: number): boolean {
  return Number.isFinite(price) && price >= 0;
}
