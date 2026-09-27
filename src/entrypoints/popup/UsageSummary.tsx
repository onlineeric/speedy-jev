import {
  calculateRequestCost,
  formatPricePerMTok,
  formatUsd,
} from '../../features/pricing/request-cost';
import type { JevUsage } from '../../features/jev-api/jev-types';
import { inputPriceSetting } from '../../features/settings/settings-storage';
import { useStoredSetting } from '../../hooks/use-stored-setting';

interface UsageSummaryProps {
  usage: JevUsage;
}

/**
 * Input token count plus the estimated cost, e.g.
 * `3,521 input tokens · ≈ $0.00015 (assuming $0.042/MTok input)`.
 */
export function UsageSummary({ usage }: UsageSummaryProps) {
  const { value: inputPrice } = useStoredSetting(inputPriceSetting);

  return (
    <p>
      {`${usage.input_tokens.toLocaleString()} input tokens`}
      {inputPrice !== undefined &&
        ` · ≈ ${formatUsd(calculateRequestCost(usage, inputPrice))}` +
          ` (assuming ${formatPricePerMTok(inputPrice)} input)`}
    </p>
  );
}
