import axios, { AxiosResponse } from 'axios';

export type DasGetAsset = {
  error?: unknown;
  result?: {
    token_info?: {
      decimals?: number;
      symbol?: string;
    };
    content: {
      links?: {
        image?: string;
      };
      json_uri?: string;
      metadata?: {
        description?: string;
        name?: string;
        symbol?: string;
        token_standard?: string;
      };
    };
  };
};

/**
 * Fetches asset information from a DAS (Digital Asset Standard) API
 * @param dasUrl - The DAS API endpoint URL
 * @param address - The token address to fetch
 * @returns The DAS asset response data
 */
export async function getDasAsset(
  dasUrl: string,
  address: string
): Promise<DasGetAsset> {
  const res: AxiosResponse<DasGetAsset> = await axios.post(dasUrl, {
    jsonrpc: '2.0',
    id: 'text',
    method: 'getAsset',
    params: { id: address },
  });

  return res.data;
}
