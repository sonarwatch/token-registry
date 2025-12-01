import { NetworkId } from '@sonarwatch/portfolio-core';
import { RawToken } from '../types';
import { fetchDasAsset } from './fetchDasAsset';
import { isImageUrl } from './isImageUrl';
import { getMultiplierFromScaledUiAmountConfig } from './getMultiplierFromScaledUiAmountConfig';

/**
 * Fetches token information from a DAS (Digital Asset Standard) API
 * @param dasUrl - The DAS API endpoint URL
 * @param address - The token address to fetch
 * @returns A RawToken object or null if the token cannot be fetched
 */
export async function fetchTokenDas(
  dasUrl: string,
  address: string
): Promise<RawToken | null> {
  const dasAsset = await fetchDasAsset(dasUrl, address);

  if (dasAsset.error) return null;
  if (!dasAsset.result) return null;
  if (dasAsset.result.token_info?.decimals === undefined) return null;

  const symbol =
    dasAsset.result.content.metadata?.symbol ||
    dasAsset.result.token_info?.symbol ||
    dasAsset.result.content.metadata?.name;
  const name =
    dasAsset.result.content.metadata?.name ||
    dasAsset.result.token_info?.symbol;
  if (!symbol || !name) return null;

  let logoURI = dasAsset.result.content.links?.image;
  if (!logoURI) {
    const isJsonUriAnImg = await isImageUrl(dasAsset.result.content.json_uri);
    if (isJsonUriAnImg) logoURI = dasAsset.result.content.json_uri;
  }

  const amountMultiplier = getMultiplierFromScaledUiAmountConfig(
    dasAsset.result.mint_extensions?.scaled_ui_amount_config
  );

  const token: RawToken = {
    address,
    chainId: 101,
    decimals: dasAsset.result.token_info.decimals,
    name,
    symbol,
    logoURI,
    networkId: NetworkId.solana,
    amountMultiplier,
  };

  return token;
}
