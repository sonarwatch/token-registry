import { UniTokenInfo } from '@sonarwatch/portfolio-core';
import axios, { AxiosResponse } from 'axios';
import Fetcher from '../Fetcher';

type DasGetAsset = {
  error?: unknown;
  result?: {
    token_info?: {
      decimals?: number;
    };
    content: {
      links?: {
        image?: string;
      };
      metadata?: {
        description?: string;
        name: string;
        symbol: string;
        token_standard: string;
      };
    };
  };
};

export default class SolanaFetcher extends Fetcher {
  private dasUrl: string;

  constructor(dasUrl: string) {
    super();
    this.dasUrl = dasUrl;
  }

  async fetch(address: string): Promise<UniTokenInfo | null> {
    const res: AxiosResponse<DasGetAsset> = await axios.post(this.dasUrl, {
      jsonrpc: '2.0',
      id: 'text',
      method: 'getAsset',
      params: { id: address },
    });

    if (res.data.error) return null;
    if (!res.data.result) return null;
    if (res.data.result.token_info?.decimals === undefined) return null;
    if (!res.data.result.content?.metadata) return null;

    return {
      address,
      chainId: 101,
      decimals: res.data.result.token_info.decimals,
      name: res.data.result.content?.metadata.name,
      symbol: res.data.result.content.metadata.symbol,
      logoURI: res.data.result.content.links?.image,
    };
  }
}
