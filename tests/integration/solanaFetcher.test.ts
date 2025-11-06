import SolanaFetcher from '../../src/fetchers/solana';

describe('SolanaFetcher', () => {
  const dasUrl = process.env.SOLANA_DAS;
  if (!dasUrl) throw new Error('SOLANA_DAS env is missing');
  const datapiHeader = process.env.DATAPI_HEADER;
  if (!datapiHeader) throw new Error('DATAPI_HEADER env is missing');

  let fetcher: SolanaFetcher;

  beforeEach(() => {
    fetcher = new SolanaFetcher(dasUrl, datapiHeader);
  });
  it('should return null if address is valid but not a token', async () => {
    const address = '1112223334445555666777888uuuuuuuuuuuuuuuuuu';
    const tokenInfo = await fetcher.fetch(address);
    expect(tokenInfo).toBe(null);
  });

  it('should return wSOL token', async () => {
    const address = 'So11111111111111111111111111111111111111112';
    const tokenInfo = await fetcher.fetch(address);
    expect(tokenInfo).not.toBeNull();
    expect(tokenInfo?.logoURI).not.toBeUndefined();
    expect(tokenInfo?.symbol).toBe('wSOL');
    expect(tokenInfo?.chainId).toBe(101);
    expect(tokenInfo?.decimals).toBe(9);
  });

  it('should return SOL token', async () => {
    const address = '11111111111111111111111111111111';
    const tokenInfo = await fetcher.fetch(address);
    expect(tokenInfo).not.toBeNull();
    expect(tokenInfo?.logoURI).not.toBeUndefined();
    expect(tokenInfo?.symbol).toBe('SOL');
    expect(tokenInfo?.chainId).toBe(101);
    expect(tokenInfo?.decimals).toBe(9);
  });

  it('should return ALP token', async () => {
    const address = '4yCLi5yWGzpTWMQ1iWHG5CrGYAdBkhyEdsuSugjDUqwj';
    const tokenInfo = await fetcher.fetch(address);
    expect(tokenInfo).not.toBeNull();
    expect(tokenInfo?.logoURI).not.toBeUndefined();
    expect(tokenInfo?.symbol).toBe('ALP');
    expect(tokenInfo?.chainId).toBe(101);
    expect(tokenInfo?.decimals).toBe(6);
  });

  it('should return xAUR token', async () => {
    const address = 'xAURp5XmAG7772mfkSy6vRAjGK9JofYjc3dmQDWdVDP';
    const tokenInfo = await fetcher.fetch(address);
    expect(tokenInfo).not.toBeNull();
    expect(tokenInfo?.logoURI).not.toBeUndefined();
    expect(tokenInfo?.symbol).toBe('xAURY');
    expect(tokenInfo?.chainId).toBe(101);
    expect(tokenInfo?.decimals).toBe(9);
  });

  it('should return xAUR token', async () => {
    const address = 'vPtS4ywrbEuufwPkBXsCYkeTBfpzCd6hF52p8kJGt9b';
    const tokenInfo = await fetcher.fetch(address);
    expect(tokenInfo).not.toBeNull();
    expect(tokenInfo?.logoURI).not.toBeUndefined();
    expect(tokenInfo?.symbol).toBe('VPTS');
    expect(tokenInfo?.chainId).toBe(101);
    expect(tokenInfo?.decimals).toBe(6);
  });

  it('should return PYTH token', async () => {
    const address = 'HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3';
    const tokenInfo = await fetcher.fetch(address);
    expect(tokenInfo).not.toBeNull();
    expect(tokenInfo?.tags?.includes('verified')).toBe(true);
    expect(tokenInfo?.logoURI).not.toBeUndefined();
    expect(tokenInfo?.symbol).toBe('PYTH');
    expect(tokenInfo?.chainId).toBe(101);
    expect(tokenInfo?.decimals).toBe(6);
  });

  it('should return SONAR token', async () => {
    const address = 'sonarX4VtVkQemriJeLm6CKeW3GDMyiBnnAEMw1MRAE';
    const tokenInfo = await fetcher.fetch(address);
    expect(tokenInfo).not.toBeNull();
    expect(tokenInfo?.logoURI).not.toBeUndefined();
    expect(tokenInfo?.symbol).toBe('SONAR');
    expect(tokenInfo?.chainId).toBe(101);
    expect(tokenInfo?.decimals).toBe(9);
  });

  it('should return SPOT token', async () => {
    const address = '2v5JwEru3nP6gij2pPReDVxHSyi4GNwXECb5mNrzpump';
    const tokenInfo = await fetcher.fetch(address);
    expect(tokenInfo).not.toBeNull();
    expect(tokenInfo?.logoURI).not.toBeUndefined();
    expect(tokenInfo?.symbol).toBe('SPOT');
    expect(tokenInfo?.chainId).toBe(101);
    expect(tokenInfo?.decimals).toBe(6);
  });

  it('should return pbUSDC token', async () => {
    const address = 'F35yYmTR6PqkbTx449P1eGhB57mRhWAdYs93eCo2dMZR';
    const tokenInfo = await fetcher.fetch(address);
    expect(tokenInfo).not.toBeNull();
    expect(tokenInfo?.logoURI).not.toBeUndefined();
    expect(tokenInfo?.symbol).toBe('pbUSDC');
    expect(tokenInfo?.chainId).toBe(101);
  });

  it('should return pbSPYx token', async () => {
    const address = 'E65CoK961Rs5LzKhGZxbKsB7xpFhYhXogH8nhr8zamTK';
    const tokenInfo = await fetcher.fetch(address);
    expect(tokenInfo).not.toBeNull();
    expect(tokenInfo?.logoURI).not.toBeUndefined();
    expect(tokenInfo?.symbol).toBe('pbSPYx');
    expect(tokenInfo?.chainId).toBe(101);
  });

  it('should support superscript characters in symbol', async () => {
    const address = 'FRAG2gPNXozPpYcn2a8zK7YdtfNXCLsioZNwZXwTQ3cP';
    const tokenInfo = await fetcher.fetch(address);
    expect(tokenInfo).not.toBeNull();
    expect(tokenInfo?.symbol).toBe('FRAG²');
    expect(tokenInfo?.chainId).toBe(101);
  });

  it('should support CJK characters in symbol', async () => {
    const address = 'CY1P83KnKwFYostvjQcoR2HJLyEJWRBRaVQmYyyD3cR8';
    const tokenInfo = await fetcher.fetch(address);
    expect(tokenInfo).not.toBeNull();
    expect(tokenInfo?.symbol).toBe('索拉拉');
    expect(tokenInfo?.chainId).toBe(101);
  });
});
