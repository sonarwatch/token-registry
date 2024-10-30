import axios from 'axios';
import SolanaFetcher from '../../src/fetchers/solana';
import { Token } from '../../src/types';

// Mock the axios module
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('SolanaFetcher', () => {
  const dasUrl = process.env.SOLANA_DAS || 'https://example.com';
  let fetcher: SolanaFetcher;

  beforeEach(() => {
    fetcher = new SolanaFetcher(dasUrl);
  });

  it('should call the correct URL and return data when fetch is called', async () => {
    const address = 'sample-address';
    const mockResponse: Token = {
      name: 'Sample Token',
      symbol: 'STK',
      decimals: 6,
      address,
      chainId: 101,
    };

    // Mocking axios.post to return a resolved promise with mock data
    mockedAxios.post.mockResolvedValueOnce({ data: mockResponse });

    // Call the fetch method
    const result = await fetcher.fetch(address);

    // Check if axios.post was called with correct parameters
    expect(mockedAxios.post).toHaveBeenCalledWith(dasUrl, {
      jsonrpc: '2.0',
      id: 'text',
      method: 'getAsset',
      params: { id: address },
    });

    // Check if the fetch method returned the expected data
    expect(result).toEqual(mockResponse);
  });

  it('should throw an error if axios.post fails', async () => {
    const address = 'sample-address';
    mockedAxios.post.mockRejectedValueOnce(new Error('Network error'));
    await expect(fetcher.fetch(address)).rejects.toThrow('Network error');
  });
});
