import {
  NetworkId,
  uniformSolanaTokenAddress,
} from '@sonarwatch/portfolio-core';
import Fetcher from '../Fetcher';
import { RawToken } from '../types';
import { constTokensMap } from '../tokens/constTokens';
import { getKey } from '../helpers/getKey';
import { fetchTokenJup } from '../helpers/fetchTokenJup';
import { fetchTokenDas } from '../helpers/fetchTokenDas';

export default class SolanaFetcher extends Fetcher {
  public readonly id: string = 'solana';
  private dasUrl: string;
  private datapiHeaders?: { [key: string]: string };
  private shieldUrl?: string;
  private shieldExtraParam?: string;

  constructor(dasUrl: string, datapiHeader?: string, shieldUrl?: string, shieldExtraParam?: string) {
    super();
    this.dasUrl = dasUrl;
    this.datapiHeaders = datapiHeader
      ? { [datapiHeader.split(':')[0]]: datapiHeader.split(':')[1] }
      : undefined;
    this.shieldUrl = shieldUrl;
    this.shieldExtraParam = shieldExtraParam;
  }
  protected uniformTokenAddress(address: string): string {
    return uniformSolanaTokenAddress(address);
  }

  async _fetch(address: string): Promise<RawToken | null> {
    const cToken = constTokensMap.get(getKey(address, NetworkId.solana));
    if (cToken) return cToken;

    // Check Jupiter Datapi
    const jupToken = await fetchTokenJup(
      address,
      this.dasUrl,
      this.datapiHeaders,
      this.shieldUrl,
      this.shieldExtraParam
    );
    if (jupToken) return jupToken;

    // Check DAS
    return fetchTokenDas(this.dasUrl, address);
  }
}
