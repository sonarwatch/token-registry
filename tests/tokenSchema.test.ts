import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import tokenSchema from '../src/tokenSchema';

describe('Token Schema Validation', () => {
  const ajv = new Ajv();
  addFormats(ajv);

  it('should validate a valid token object', async () => {
    const ajvToken = ajv.compile(tokenSchema);
    const token = {
      address: 'EJPtJEDogxzDbvM8qvAsqYbLmPj5n1vQeqoAzj9Yfv3q',
      chainId: 101,
      decimals: 9,
      name: 'bozo',
      symbol: '',
      logoURI:
        'https://nftstorage.link/ipfs/bafkreiamobqahwlwio5syavvfkknvfecgt7osbsh2s4xizihgpsajethyy',
      networkId: 'solana',
      sourceId: 'job-jupiter',
      tags: ['community', 'strict', 'verified'],
    };
    const valid = ajvToken(token);
    expect(valid).toBe(true);
  });

  it('should validate pbSPYx token', async () => {
    const ajvToken = ajv.compile(tokenSchema);
    const token = {
      address: 'E65CoK961Rs5LzKhGZxbKsB7xpFhYhXogH8nhr8zamTK',
      chainId: 101,
      decimals: 8,
      name: '',
      symbol: 'pbSPYx',
      logoURI: 'https://app.piggybank.fi/asset_icons/pbSPYx.png',
      networkId: 'solana',
      tags: ['token-2022'],
      sourceId: 'fetcher-solana',
    };

    const valid = ajvToken(token);
    expect(valid).toBe(true);
  });
});
