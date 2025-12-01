import { fetchTokenDas } from '../../src/helpers/fetchTokenDas';

describe('fetchTokenDas', () => {
  const dasUrl = process.env.SOLANA_DAS;
  if (!dasUrl) throw new Error('SOLANA_DAS env is missing');

  it('should fetch wSOL token from DAS', async () => {
    const address = 'So11111111111111111111111111111111111111112';
    const token = await fetchTokenDas(dasUrl, address);

    expect(token).not.toBeNull();
    expect(token?.address).toBe(address);
    expect(token?.symbol).toBe('SOL');
    expect(token?.chainId).toBe(101);
    expect(token?.decimals).toBe(9);
  });

  it('should fetch NFLXx token from DAS', async () => {
    const address = 'XsEH7wWfJJu2ZT3UCFeVfALnVA6CP5ur7Ee11KmzVpL';
    const token = await fetchTokenDas(dasUrl, address);

    expect(token).not.toBeNull();
    expect(token?.symbol).toBe('NFLXx');
    expect(token?.chainId).toBe(101);
    expect(token?.decimals).toBe(8);
    expect(token?.amountMultiplier).toBe(10);
    expect(token?.tags).toContain('token-2022');
  });
});
