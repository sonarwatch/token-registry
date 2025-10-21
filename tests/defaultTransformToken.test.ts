import { NetworkId } from '@sonarwatch/portfolio-core';
import { defaultTransformToken } from '../src/helpers/defaultTransformToken';
import { Token } from '../src/types';

describe('defaultTransformToken', () => {
  it('should preserve superscript characters in symbol (²)', async () => {
    const token: Token = {
      address: 'BnGt7pewVh4FVT5PmPGFKTEtNgQVivFUAPHLdXNpEXQp',
      chainId: 101,
      decimals: 8,
      name: 'Fragmetric Token',
      symbol: 'FRAG²',
      networkId: NetworkId.solana,
      sourceId: 'test',
    };

    const transformed = await defaultTransformToken(token);
    expect(transformed.symbol).toBe('FRAG²');
  });

  it('should preserve superscript characters in symbol (³)', async () => {
    const token: Token = {
      address: 'So11111111111111111111111111111111111111112',
      chainId: 101,
      decimals: 8,
      name: 'Test Token',
      symbol: 'TEST³',
      networkId: NetworkId.solana,
      sourceId: 'test',
    };

    const transformed = await defaultTransformToken(token);
    expect(transformed.symbol).toBe('TEST³');
  });

  it('should preserve superscript characters in symbol (¹)', async () => {
    const token: Token = {
      address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
      chainId: 101,
      decimals: 8,
      name: 'Test Token',
      symbol: 'TEST¹',
      networkId: NetworkId.solana,
      sourceId: 'test',
    };

    const transformed = await defaultTransformToken(token);
    expect(transformed.symbol).toBe('TEST¹');
  });

  it('should remove other special characters from symbol', async () => {
    const token: Token = {
      address: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
      chainId: 101,
      decimals: 8,
      name: 'Test Token',
      symbol: 'TEST🚀',
      networkId: NetworkId.solana,
      sourceId: 'test',
    };

    const transformed = await defaultTransformToken(token);
    expect(transformed.symbol).toBe('TEST');
  });

  it('should uppercase lowercase symbols', async () => {
    const token: Token = {
      address: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
      chainId: 101,
      decimals: 8,
      name: 'Test Token',
      symbol: 'test',
      networkId: NetworkId.solana,
      sourceId: 'test',
    };

    const transformed = await defaultTransformToken(token);
    expect(transformed.symbol).toBe('TEST');
  });
});
