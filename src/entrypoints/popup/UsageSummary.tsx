import { calculateRequestCost, formatUsd } from '../../features/pricing/request-cost';
import type { JevUsage } from '../../features/jev-api/jev-types';
import { inputPriceSetting } from '../../features/settings/settings-storage';
import { useStoredSetting } from '../../hooks/use-stored-setting';

interface UsageSummaryProps {
  usage: JevUsage;
}

/** Input token count plus the estimated cost at the price configured in Settings. */
export function UsageSummary({ usage }: UsageSummaryProps) {
  const { value: inputPrice } = useStoredSetting(inputPriceSetting);

  return (
    <>
      {` · ${usage.input_tokens.toLocaleString()} input tokens`}
      {inputPrice !== undefined && ` · ≈ ${formatUsd(calculateRequestCost(usage, inputPrice))}`}
    </>
  );
}
