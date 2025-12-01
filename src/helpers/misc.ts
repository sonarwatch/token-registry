import { NetworkIdType } from '@sonarwatch/portfolio-core';

export const solTokenPid = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';
export const solTokenPid2022 = 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb';
export const tgToken2022 = 'token-2022';

export async function sleep(ms = 100) {
  return new Promise((r) => {
    setTimeout(r, ms);
  });
}

export function stringToBoolean(str: string): boolean {
  return str === 'true';
}

const platforms: Record<string, string> = {
  aptos: 'aptos',
  avalanche: 'avalanche',
  bnb: 'binance-smart-chain',
  arbitrum: 'arbitrum-one',
  base: 'base',
  cronos: 'cronos',
  gnosis: 'xdai',
  linea: 'linea',
  scroll: 'scroll',
  zksync: 'zksync',
  'polygon-zkevm': 'polygon-zkevm',
  ethereum: 'ethereum',
  optimism: 'optimistic-ethereum',
  polygon: 'polygon-pos',
  solana: 'solana',
  sui: 'sui',
  sei: 'sei',
};

export function coingeckoPlatformFromNetworkId(networkId: NetworkIdType) {
  const platform = platforms[networkId];
  if (!platform) throw new Error('Platform is missing');
  return platform;
}

export default async function runInBatch<T>(
  functionsToRun: (() => Promise<T>)[],
  batchSize = 100
): Promise<PromiseSettledResult<T>[]> {
  const results: PromiseSettledResult<T>[] = [];

  while (functionsToRun.length !== 0) {
    const currFunctionsToRun = functionsToRun.splice(0, batchSize);
    const promises = currFunctionsToRun.map((fToRun) => fToRun());
    const currResults = await Promise.allSettled(promises);
    results.push(...currResults);
  }

  return results;
}
