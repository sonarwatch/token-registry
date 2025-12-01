import { ScaledUiAmountConfig } from './fetchDasAsset';

export function getMultiplierFromScaledUiAmountConfig(
  config?: ScaledUiAmountConfig
): number | undefined {
  if (!config) return undefined;
  if (config.new_multiplier && config.new_multiplier_effective_timestamp) {
    if (config.new_multiplier_effective_timestamp * 1000 < Date.now())
      return config.new_multiplier;
  }
  if (config.multiplier) return config.multiplier;
  return undefined;
}
