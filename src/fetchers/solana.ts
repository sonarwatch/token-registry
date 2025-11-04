import {
  NetworkId,
  uniformSolanaTokenAddress,
} from '@sonarwatch/portfolio-core';
import Fetcher from '../Fetcher';
import { RawToken } from '../types';
import { constTokensMap } from '../tokens/constTokens';
import { getKey } from '../helpers/getKey';
import { fetchJupToken } from '../helpers/fetchJupToken';
import { getDasToken } from '../helpers/getDasToken';

export default class SolanaFetcher extends Fetcher {
  public readonly id: string = 'solana';
  private dasUrl: string;
  private datapiHeaders?: { [key: string]: string };

  constructor(dasUrl: string, datapiHeader?: string) {
    super();
    this.dasUrl = dasUrl;
    this.datapiHeaders = datapiHeader
      ? { [datapiHeader.split(':')[0]]: datapiHeader.split(':')[1] }
      : undefined;
  }
  protected uniformTokenAddress(address: string): string {
    return uniformSolanaTokenAddress(address);
  }

  async _fetch(address: string): Promise<RawToken | null> {
    const cToken = constTokensMap.get(getKey(address, NetworkId.solana));
    if (cToken) return cToken;

    // Check Jupiter Datapi
    const jupToken = await fetchJupToken(address, this.datapiHeaders);
    if (jupToken) return jupToken;

    // Check DAS
    return getDasToken(this.dasUrl, address);
  }
}
