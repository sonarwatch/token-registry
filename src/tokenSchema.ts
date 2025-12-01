const tokenSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  definitions: {
    ExtensionPrimitiveValue: {
      anyOf: [
        {
          type: 'string',
          minLength: 1,
          maxLength: 84,
          examples: ['#00000'],
        },
        {
          type: 'boolean',
          examples: [true],
        },
        {
          type: 'number',
          examples: [15],
        },
        {
          type: 'null',
        },
        {
          type: 'array',
          items: {
            type: 'string',
            minLength: 1,
            maxLength: 128,
            pattern: '^[: \\w-]+$',
          },
          maxItems: 20,
        },
      ],
    },
    ExtensionIdentifier: {
      type: 'string',
      description: 'The name of a token extension property',
      minLength: 1,
      maxLength: 40,
      pattern: '^[\\w]+$',
      examples: ['color', 'is_fee_on_transfer', 'aliases'],
    },
    ExtensionValue: {
      anyOf: [
        {
          $ref: '#/definitions/ExtensionPrimitiveValue',
        },
        {
          type: 'object',
          maxProperties: 10,
          propertyNames: {
            $ref: '#/definitions/ExtensionIdentifier',
          },
          additionalProperties: {
            $ref: '#/definitions/ExtensionValueInner0',
          },
        },
      ],
    },
    ExtensionValueInner0: {
      anyOf: [
        {
          $ref: '#/definitions/ExtensionPrimitiveValue',
        },
        {
          type: 'object',
          maxProperties: 10,
          propertyNames: {
            $ref: '#/definitions/ExtensionIdentifier',
          },
          additionalProperties: {
            $ref: '#/definitions/ExtensionValueInner1',
          },
        },
      ],
    },
    ExtensionValueInner1: {
      anyOf: [
        {
          $ref: '#/definitions/ExtensionPrimitiveValue',
        },
      ],
    },
    TagIdentifier: {
      type: 'string',
      description: 'The unique identifier of a tag',
      minLength: 1,
      maxLength: 24,
      pattern: '^[\\w-]+$',
      examples: ['compound', 'stablecoin'],
    },
    ExtensionMap: {
      type: 'object',
      description:
        'An object containing any arbitrary or vendor-specific token metadata',
      maxProperties: 10,
      propertyNames: {
        $ref: '#/definitions/ExtensionIdentifier',
      },
      additionalProperties: {
        $ref: '#/definitions/ExtensionValue',
      },
      examples: [
        {
          color: '#000000',
          is_verified_by_me: true,
        },
        {
          'x-bridged-addresses-by-chain': {
            '1': {
              bridgeAddress: '0x4200000000000000000000000000000000000010',
              tokenAddress: '0x4200000000000000000000000000000000000010',
            },
          },
        },
      ],
    },
  },
  type: 'object',
  description: 'Metadata for a single token in a token list',
  additionalProperties: false,
  properties: {
    chainId: {
      type: 'integer',
      description:
        'The chain ID of the Ethereum network where this token is deployed',
      minimum: 1,
      examples: [1, 42],
    },
    amountMultiplier: {
      type: 'number',
      description: 'The multiplier for the token amount',
      minimum: 0,
      examples: [1, 42],
    },
    sourceId: {
      type: 'string',
      description: 'The source ID of the token',
      minLength: 1,
      maxLength: 64,
      examples: ['job-jupiter'],
    },
    address: {
      type: 'string',
      description:
        'The checksummed address of the token on the specified chain ID',
      minLength: 1,
      maxLength: 1024,
      examples: ['0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'],
    },
    networkId: {
      type: 'string',
      description: 'The network ID',
      minLength: 1,
      maxLength: 64,
      examples: ['solana'],
    },
    decimals: {
      type: 'integer',
      description: 'The number of decimals for the token balance',
      minimum: 0,
      maximum: 255,
      examples: [18],
    },
    name: {
      type: 'string',
      description: 'The name of the token',
      minLength: 0,
      maxLength: 64,
      anyOf: [
        {
          const: '',
        },
        {
          pattern: '^[ \\S+]+$',
        },
      ],
      examples: ['USD Coin'],
    },
    symbol: {
      type: 'string',
      description: 'The symbol for the token',
      minLength: 0,
      maxLength: 25,
      anyOf: [
        {
          const: '',
        },
        {
          pattern: '^\\S+$',
        },
      ],
      examples: ['USDC'],
    },
    logoURI: {
      type: 'string',
      description:
        'A URI to the token logo asset; if not set, interface will attempt to find a logo based on the token address; suggest SVG or PNG of size 64x64',
      format: 'uri',
      examples: ['ipfs://QmXfzKRvjZz3u5JRgC4v5mGVbm9ahrUiB4DgzHBsnWbTMM'],
    },
    tags: {
      type: 'array',
      description:
        'An array of tag identifiers associated with the token; tags are defined at the list level',
      items: {
        $ref: '#/definitions/TagIdentifier',
      },
      maxItems: 20,
      examples: ['stablecoin', 'compound'],
    },
    extensions: {
      $ref: '#/definitions/ExtensionMap',
    },
  },
  required: [
    'chainId',
    'address',
    'decimals',
    'name',
    'symbol',
    'networkId',
    'sourceId',
  ],
};

export default tokenSchema;
