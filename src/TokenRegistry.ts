import { Redis, RedisOptions } from 'ioredis';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import {
  NetworkIdType,
  uniformTokenAddress,
  UniTokenAddress,
} from '@sonarwatch/portfolio-core';
import { LRUCache } from 'lru-cache';
import { nanoid } from 'nanoid';
import { Logger } from './Logger';
import Fetcher from './Fetcher';
import { Milliseconds, Seconds, Token } from './types';
import tokenSchema from './tokenSchema';
import { defaultTransformToken } from './helpers/defaultTransformToken';
import runInBatch from './helpers/misc';
import { getKey } from './helpers/getKey';

const PAGINATE_MAX_COUNT = 500;
const nullTokenValue = Symbol('nulltoken');

// Prepare AJV
const ajv = new Ajv();
addFormats(ajv);
const ajvToken = ajv.compile(tokenSchema);

export type TokenRegistryConfig = {
  logger?: Logger;
  redisOptions: RedisOptions & {
    url?: string;
  };
  fetchers: Partial<Record<NetworkIdType, Fetcher>>;
  redisTtlMs?: Milliseconds;
  memoryTtlMs?: Milliseconds;
  transformToken?: (token: Token) => Promise<Token>;
};

export class TokenRegistry {
  private id: string;
  private logger: Logger | undefined;
  private redisClient: Redis;
  private fetchers: Partial<Record<NetworkIdType, Fetcher>>;
  private redisTtl: Seconds;
  private memoryTtl: Seconds;
  private lruCache: LRUCache<string, Token | typeof nullTokenValue>;
  private transformToken: (token: Token) => Promise<Token>;

  constructor(config: TokenRegistryConfig) {
    this.id = nanoid(6);
    this.logger = config.logger;
    this.fetchers = config.fetchers;
    this.transformToken = config.transformToken || defaultTransformToken;

    this.redisTtl = config.redisTtlMs
      ? Math.round(config.redisTtlMs / 1000)
      : 86400;
    this.memoryTtl = config.memoryTtlMs
      ? Math.round(config.memoryTtlMs / 1000)
      : 3600;
    this.lruCache = new LRUCache({
      ttl: this.memoryTtl * 1000,
      max: 500000,
    });

    // Redis
    this.redisClient = config.redisOptions.url
      ? new Redis(config.redisOptions.url, config.redisOptions)
      : new Redis(config.redisOptions);
    // this.redisClient.on('connect', () => {
    //   this.logger?.info(`[${this.id}] TokenRegistry connected to Redis`);
    // });
    this.redisClient.on('error', (err) => {
      this.logger?.error(`[${this.id}] TokenRegistry Redis client error`, err);
    });
  }

  static getKey(address: string, networkId: NetworkIdType) {
    return getKey(address, networkId);
  }

  static getAddressFromKey(key: string) {
    const splits = key.split(':');
    if (splits.length < 3)
      throw new Error(`Can not retieve address from key: ${key}`);
    const networkId = splits[1];
    const address = splits.slice(2).join(':');
    return { address, networkId };
  }

  public async addToken(
    address: string,
    networkId: NetworkIdType,
    token: Token | null
  ): Promise<void> {
    const vToken = await this.validateToken(token);
    await this.saveToken(address, networkId, vToken);
  }

  public async getToken(
    address: string,
    networkId: NetworkIdType
  ): Promise<Token | null> {
    const key = TokenRegistry.getKey(address, networkId);

    // Check memory cache
    const memoryToken = await this.lruCache.get(key);
    if (memoryToken !== undefined)
      return memoryToken === nullTokenValue ? null : memoryToken;

    // Check Redis cache first
    const redisToken = await this.redisClient.get(key);
    if (redisToken !== null) return JSON.parse(redisToken) as Token | null;

    // Fetch if not in cache
    const token = await this.fetch(networkId, address);
    await this.saveToken(address, networkId, token);
    return token;
  }

  public async getTokens(
    items: { address: string; networkId: NetworkIdType }[]
  ): Promise<(Token | null)[]> {
    const res = await runInBatch(
      items.map((i) => () => this.getToken(i.address, i.networkId)),
      20
    );
    return res.map((r, i) => {
      if (r.status === 'rejected') {
        this.logger?.warn(
          `[${this.id}] Failed to get token:  ${items[i].networkId} | ${items[i].address}`
        );
        return null;
      }
      return r.value;
    });
  }

  public async getTokensPaginate(cursor: number, count: number = 10) {
    if (count > PAGINATE_MAX_COUNT)
      throw new Error(`Paginate max count is ${PAGINATE_MAX_COUNT}`);
    if (cursor < 0) throw new Error('Cursor cannot be negative');
    if (count < 1) throw new Error('Count should be at least 1');

    const [nextCursorRaw, keys] = await this.redisClient.scan(
      cursor,
      'COUNT',
      count
    );
    const nextCursor = nextCursorRaw === '0' ? -1 : Number(nextCursorRaw);

    const values = keys.length > 0 ? await this.redisClient.mget(...keys) : [];
    return {
      nextCursor,
      values,
      hasMore: nextCursor !== -1,
    };
  }

  private async fetch(
    networkId: NetworkIdType,
    address: UniTokenAddress
  ): Promise<Token | null> {
    if (!this.fetchers[networkId])
      throw new Error(`Fetcher network is not configured: ${networkId}`);

    const uniTokAddress = uniformTokenAddress(address, networkId);
    const token = await this.fetchers[networkId].fetch(uniTokAddress);
    return this.validateToken(token);
  }

  private async validateToken(token: Token | null): Promise<Token | null> {
    if (token === null) return null;

    const tToken: Token = await this.transformToken(token);
    const valid = ajvToken(tToken);
    if (!valid) {
      this.logger?.warn(
        `[${this.id}] Failed to validate ${token.networkId} : ${token.address}`,
        token,
        JSON.stringify(ajvToken.errors)
      );
      return null;
    }

    return tToken;
  }

  private async saveToken(
    address: string,
    networkId: NetworkIdType,
    token: Token | null
  ): Promise<void> {
    const key = TokenRegistry.getKey(address, networkId);
    this.lruCache.set(key, token === null ? nullTokenValue : token);

    // ttl +/- 10% (to create a random ttl)
    let ttl = Math.round(this.redisTtl * (Math.random() * 0.2 + 0.9));

    // If token has amountMultiplier, reduce ttl (to avoid caching tokens with amountMultiplier for too long)
    if (token?.amountMultiplier !== undefined) {
      ttl = Math.round(ttl * 0.1);
    }

    await this.redisClient.set(key, JSON.stringify(token), 'EX', ttl);
  }

  public async disconnect(): Promise<void> {
    try {
      await this.redisClient.quit();
    } catch (error) {
      this.logger?.error(
        `[${this.id}] TokenRegistry error disconnecting from Redis`,
        error
      );
    }
  }
}
