import axios, { AxiosResponse } from 'axios';
import { NetworkId } from '@sonarwatch/portfolio-core';
import { RawToken } from '../types';
import { DasGetAsset, fetchDasAsset } from './fetchDasAsset';
import { isImageUrl } from './isImageUrl';
import { solTokenPid2022 } from './misc';
import { fetchScaledUiAmount } from './fetchScaledUiAmount';
import { getMultiplierFromScaledUiAmountConfig } from './getMultiplierFromScaledUiAmountConfig';

type JupToken = {
  id: string;
  name: string;
  symbol: string;
  icon?: string;
  decimals: number;
  tokenProgram: string;
  tags?: string[];
};

export const datapiUrl = 'https://datapi.jup.ag';

export async function fetchTokenJup(
  mint: string,
  dasUrl: string,
  datapiHeaders?: {
    [key: string]: string;
  }
): Promise<RawToken | null> {
  const res: AxiosResponse<JupToken[]> | null = await axios
    .get(`${datapiUrl}/v1/assets/search`, {
      params: {
        query: mint,
      },
      timeout: 10000,
      headers: datapiHeaders,
    })
    .catch(() => null);

  if (!res || !res.data) return null;
  if (!Array.isArray(res.data) || res.data.length !== 1) return null;

  const jupToken = res.data[0];
  let { symbol } = jupToken;
  let logoURI: string | undefined = jupToken.icon;

  // Fetching data from DAS if missing (symbol, logoURI)
  let dasAsset: DasGetAsset | undefined;
  if (symbol === '') {
    dasAsset = await fetchDasAsset(dasUrl, mint);
    if (dasAsset.result?.content.metadata?.symbol) {
      symbol = dasAsset.result.content.metadata.symbol;
    } else if (dasAsset.result?.token_info?.symbol) {
      symbol = dasAsset.result.token_info.symbol;
    }
  }
  if (logoURI === undefined) {
    if (!dasAsset) dasAsset = await fetchDasAsset(dasUrl, mint);
    logoURI = dasAsset.result?.content.links?.image;
    if (!logoURI) {
      const isJsonUriAnImg = await isImageUrl(
        dasAsset.result?.content.json_uri
      );
      if (isJsonUriAnImg) logoURI = dasAsset.result?.content.json_uri;
    }
  }

  // Amount multiplier
  let amountMultiplier: number | undefined;
  if (jupToken.tokenProgram === solTokenPid2022) {
    const config = await fetchScaledUiAmount(dasUrl, mint);
    amountMultiplier = getMultiplierFromScaledUiAmountConfig(config);
  }

  const token: RawToken = {
    address: jupToken.id,
    chainId: 101,
    decimals: jupToken.decimals,
    name: jupToken.name,
    symbol,
    logoURI,
    networkId: NetworkId.solana,
    tags: jupToken.tags,
    amountMultiplier,
  };
  return token;
}
