import axios from 'axios';
import { NetworkId } from '@sonarwatch/portfolio-core';
import SolanaFetcher from '../../src/fetchers/solana';
import { Token } from '../../src/types';

// Mock the axios module
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('SolanaFetcher', () => {
  const dasUrl = 'https://example.com';
  let fetcher: SolanaFetcher;

  beforeEach(() => {
    fetcher = new SolanaFetcher(dasUrl);
    jest.clearAllMocks();
  });

  it('should call the correct URL and return data when fetch is called', async () => {
    const address = 'HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3';
    const mockJupiterResponse = [
      {
        id: 'HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3',
        name: 'Pyth Network',
        symbol: 'PYTH',
        icon: 'https://pyth.network/token.svg',
        decimals: 6,
        tokenProgram: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
        tags: ['birdeye-trending', 'community', 'strict', 'verified'],
        warnings: [],
      },
    ];

    // Mocking axios.get to return Jupiter response then Shield response
    mockedAxios.get
      .mockResolvedValueOnce({ data: mockJupiterResponse })
      .mockResolvedValueOnce({ data: { warnings: {} } });

    // Call the fetch method
    const result = await fetcher.fetch(address);

    // Check if axios.get was called with correct parameters
    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://datapi.jup.ag/v1/assets/search',
      {
        headers: undefined,
        params: { query: 'HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3' },
        timeout: 10000,
      }
    );

    // Check if the fetch method returned the expected data
    const pythToken: Token = {
      address: 'HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3',
      chainId: 101,
      decimals: 6,
      name: 'Pyth Network',
      symbol: 'PYTH',
      logoURI: 'https://pyth.network/token.svg',
      networkId: NetworkId.solana,
      sourceId: fetcher.getSourceId(),
      tags: ['birdeye-trending', 'community', 'strict', 'verified'],
      warnings: [],
    };
    expect(result).toEqual(pythToken);
  });

  it('should throw an error if axios.post fails', async () => {
    const address = 'sampLe1111111111111111111111111111111111111';
    mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));
    mockedAxios.post.mockRejectedValueOnce(new Error('Network error'));
    await expect(fetcher.fetch(address)).rejects.toThrow('Network error');
  });
});
