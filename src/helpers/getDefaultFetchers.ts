import { NetworkId, NetworkIdType } from '@sonarwatch/portfolio-core';
import Fetcher from '../Fetcher';
import { EvmFetcher, SolanaFetcher } from '../fetchers';
import SuiFetcher from '../fetchers/sui';
import AptosFetcher from '../fetchers/aptos';
import BitcoinFetcher from '../fetchers/bitcoin';

export type GetDefaultFetchersConfig = {
  solana: {
    dasUrl: string;
    datapiHeader: string;
    shieldUrl?: string;
    shieldExtraParam?: string;
  };
  ethereum: {
    rpc: string;
  };
  polygon: {
    rpc: string;
  };
  avalanche: {
    rpc: string;
  };
  bnb: {
    rpc: string;
  };
  sui: {
    rpc: string;
  };
  aptos: {
    rpc: string;
  };
};

export function getDefaultFetchers(
  config: GetDefaultFetchersConfig
): Partial<Record<NetworkIdType, Fetcher>> {
  return {
    solana: new SolanaFetcher(config.solana.dasUrl, config.solana.datapiHeader, config.solana.shieldUrl, config.solana.shieldExtraParam),
    ethereum: new EvmFetcher(config.ethereum.rpc, NetworkId.ethereum),
    polygon: new EvmFetcher(config.polygon.rpc, NetworkId.polygon),
    avalanche: new EvmFetcher(config.avalanche.rpc, NetworkId.avalanche),
    bnb: new EvmFetcher(config.bnb.rpc, NetworkId.bnb),
    sui: new SuiFetcher(config.sui.rpc),
    aptos: new AptosFetcher(config.aptos.rpc),
    bitcoin: new BitcoinFetcher(),
  };
}
