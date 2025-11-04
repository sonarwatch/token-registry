import axios, { AxiosResponse } from 'axios';
import { NetworkId } from '@sonarwatch/portfolio-core';
import { RawToken } from '../types';
import { getDasAsset } from './getDasAsset';

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

export async function fetchJupToken(
  mint: string,
  headers?: {
    [key: string]: string;
  },
  dasUrl?: string
): Promise<RawToken | null> {
  const res: AxiosResponse<JupToken[]> | null = await axios
    .get(`${datapiUrl}/v1/assets/search`, {
      params: {
        query: mint,
      },
      timeout: 10000,
      headers,
    })
    .catch(() => null);

  if (!res || !res.data) return null;
  if (!Array.isArray(res.data) || res.data.length !== 1) return null;

  const jupToken = res.data[0];

  // If symbol is empty and dasUrl is provided, try to get symbol from DAS
  let { symbol } = jupToken;
  if (symbol === '' && dasUrl) {
    const dasAsset = await getDasAsset(dasUrl, mint);
    if (dasAsset.result?.content.metadata?.symbol) {
      symbol = dasAsset.result.content.metadata.symbol;
    } else if (dasAsset.result?.token_info?.symbol) {
      symbol = dasAsset.result.token_info.symbol;
    }
  }

  const token: RawToken = {
    address: jupToken.id,
    chainId: 101,
    decimals: jupToken.decimals,
    name: jupToken.name,
    symbol,
    logoURI: jupToken.icon ? jupToken.icon : undefined,
    networkId: NetworkId.solana,
    tags: jupToken.tags,
  };
  return token;
}
