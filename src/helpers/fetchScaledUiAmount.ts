import { fetchDasAsset, ScaledUiAmountConfig } from './fetchDasAsset';

/**
 * Fetches the scaled UI amount configuration for a token
 * @param dasUrl - The DAS API endpoint URL
 * @param address - The token address to fetch
 * @returns The ScaledUiAmountConfig object or undefined if not available
 */
export async function fetchScaledUiAmount(
  dasUrl: string,
  address: string
): Promise<ScaledUiAmountConfig | undefined> {
  const dasAsset = await fetchDasAsset(dasUrl, address);

  if (dasAsset.error) throw new Error('Error fetching DAS asset');
  if (!dasAsset.result) return undefined;

  return dasAsset.result.mint_extensions?.scaled_ui_amount_config;
}
