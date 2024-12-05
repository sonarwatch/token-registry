import {
  SuiClient as MystenSuiClient,
  SuiHTTPTransport,
} from '@mysten/sui/client';
import { NetworkId, uniformMoveTokenAddress } from '@sonarwatch/portfolio-core';
import Fetcher from '../Fetcher';
import { RawToken } from '../types';
import { suiToken } from '../helpers/constants';

export default class SuiFetcher extends Fetcher {
  public readonly id: string = 'sui';
  private client: MystenSuiClient;

  constructor(rpc: string) {
    super();
    this.client = new MystenSuiClient({
      transport: new SuiHTTPTransport({
        url: rpc,
        rpc: {
          headers: {},
        },
      }),
    });
  }

  protected uniformTokenAddress(address: string): string {
    return uniformMoveTokenAddress(address);
  }

  async _fetch(address: string): Promise<RawToken | null> {
    if (address === suiToken.address) return suiToken;

    const res = await this.client
      .getCoinMetadata({ coinType: address })
      .catch((e) => {
        if (e.code === -32602 || e.type === 'InvalidParams') {
          return null;
        }
        throw e;
      });
    if (!res) return null;

    return {
      address,
      chainId: 1,
      decimals: res.decimals,
      name: res.name,
      symbol: res.symbol,
      logoURI: res.iconUrl || undefined,
      networkId: NetworkId.sui,
    };
  }
}
