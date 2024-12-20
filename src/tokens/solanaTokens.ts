import { NetworkId, solanaNativeDecimals } from '@sonarwatch/portfolio-core';
import { RawToken } from '../types';

export const solanaTokens: Omit<RawToken, 'chainId'>[] = [
  {
    address: '11111111111111111111111111111111',
    decimals: solanaNativeDecimals,
    name: 'Solana',
    networkId: NetworkId.solana,
    symbol: 'SOL',
    logoURI:
      'https://raw.githubusercontent.com/sonarwatch/token-registry/main/img/common/SOL.webp',
  },
  {
    address: 'So11111111111111111111111111111111111111112',
    decimals: solanaNativeDecimals,
    name: 'Wrapped SOL',
    networkId: NetworkId.solana,
    symbol: 'wSOL',
    logoURI:
      'https://raw.githubusercontent.com/sonarwatch/token-registry/main/img/common/SOL.webp',
  },
  {
    address: 'xAURp5XmAG7772mfkSy6vRAjGK9JofYjc3dmQDWdVDP',
    decimals: 9,
    name: 'Aurory',
    symbol: 'xAURY',
    networkId: NetworkId.solana,
  },
  {
    address: 'vPtS4ywrbEuufwPkBXsCYkeTBfpzCd6hF52p8kJGt9b',
    decimals: 6,
    name: 'Vault Points',
    symbol: 'VPTS',
    networkId: NetworkId.solana,
  },
  {
    address: 'FAJA9Qgn1CqLKtYi77CoWSGH7dyRrat394q9mpRFQzGs',
    decimals: 6,
    name: 'PayPal USD wrapped by Save',
    symbol: 'PYUSD',
    networkId: NetworkId.solana,
  },
];