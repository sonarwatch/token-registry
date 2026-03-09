import { fetchTokenJup } from '../../src/helpers/fetchTokenJup';

describe('fetchTokenJup', () => {
  const dasUrl = process.env.SOLANA_DAS;
  if (!dasUrl) throw new Error('SOLANA_DAS env is missing');
  const datapiHeaderStr = process.env.DATAPI_HEADER;
  if (!datapiHeaderStr) throw new Error('DATAPI_HEADER env is missing');
  const datapiHeaders = datapiHeaderStr
    ? { [datapiHeaderStr.split(':')[0]]: datapiHeaderStr.split(':')[1] }
    : undefined;
  const shieldUrl = process.env.SHIELD_URL;
  const shieldExtraParam = process.env.SHIELD_EXTRA_PARAM;

  it('should fetch wSOL token from Jupiter', async () => {
    const mint = 'So11111111111111111111111111111111111111112';
    const token = await fetchTokenJup(mint, dasUrl, datapiHeaders, shieldUrl, shieldExtraParam);

    expect(token).not.toBeNull();
    expect(token?.address).toBe(mint);
    expect(token?.symbol).toBe('SOL');
    expect(token?.chainId).toBe(101);
    expect(token?.decimals).toBe(9);

    // warnings must be a valid ShieldWarning[]
    expect(token?.warnings).toBeDefined();
    expect(Array.isArray(token!.warnings)).toBe(true);
    for (const warning of token!.warnings!) {
      expect(warning).toHaveProperty('type');
      expect(warning).toHaveProperty('message');
      expect(warning).toHaveProperty('severity');
      expect(['info', 'warning', 'critical']).toContain(warning.severity);
    }
  });

  it('should fetch NFLXx token from Jupiter', async () => {
    const mint = 'XsEH7wWfJJu2ZT3UCFeVfALnVA6CP5ur7Ee11KmzVpL';
    const token = await fetchTokenJup(mint, dasUrl, datapiHeaders, shieldUrl, shieldExtraParam);

    expect(token).not.toBeNull();
    expect(token?.symbol).toBe('NFLXx');
    expect(token?.chainId).toBe(101);
    expect(token?.decimals).toBe(8);
    expect(token?.tags).toContain('token-2022');
    expect(token?.amountMultiplier).toBe(10);

    // warnings must be a valid ShieldWarning[]
    expect(token?.warnings).toBeDefined();
    expect(Array.isArray(token!.warnings)).toBe(true);
    for (const warning of token!.warnings!) {
      expect(warning).toHaveProperty('type');
      expect(warning).toHaveProperty('message');
      expect(warning).toHaveProperty('severity');
      expect(['info', 'warning', 'critical']).toContain(warning.severity);
    }
  });
});
