# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## General Guidelines

**Language**: Always write code in English (including comments, variables, logs, and error messages), even when we communicate in other languages.

**Environment Variables**: You may read `.env.example` for reference, but you must NOT read `.env` as it contains sensitive credentials.

## Common Commands

### Development
- `npm run build` - Build the library using tsup (ESM + CJS + types)
- `npm run lint` - Run ESLint on TypeScript files
- `npm run format` - Format code with Prettier
- `npm run clean` - Remove dist folder

### Testing
- `npm test` - Run unit tests (excludes integration tests)
- `npm run test:integration` - Run integration tests only
- `npm run test -- -t 'isUri'` - Run specific unit test
- `npm run test:integration -- -t 'evmFetcher'` - Run specific integration test

### Publishing
- `npm version patch && git push origin main --tags` - Version bump and publish

## Architecture Overview

This is a token registry library for multi-chain token metadata management with Redis caching and pluggable fetchers.

### Core Components

**TokenRegistry** (`src/TokenRegistry.ts`): Main class that manages token metadata with dual-layer caching (LRU in-memory + Redis) and validation. Handles batched token fetching and pagination.

**Fetcher** (`src/Fetcher.ts`): Abstract base class for blockchain-specific token fetchers. Each fetcher implements `_fetch()` and `uniformTokenAddress()` methods.

**Fetchers** (`src/fetchers/`): Blockchain-specific implementations:
- `solana.ts` - Jupiter API integration
- `evm.ts` - Web3/Viem for Ethereum-compatible chains  
- `aptos.ts` - Aptos Labs SDK
- `sui.ts` - Mysten Labs SDK
- `bitcoin.ts` - Basic Bitcoin fetcher

**Jobs** (`src/jobs/`): Background data population tasks:
- `jupiterJob.ts` - Fetches all Jupiter tokens for Solana
- `coingeckoJob.ts` - Fetches CoinGecko token data

### Key Patterns

- Token validation using AJV schema (`src/tokenSchema.ts`)
- Uniform token addressing across chains via `@sonarwatch/portfolio-core`
- Transform pipeline with `defaultTransformToken` helper
- Batch processing with configurable concurrency
- TTL randomization (±10%) to prevent cache stampedes

### Configuration

TokenRegistry requires:
- Redis connection options
- Network-specific fetchers map
- Optional custom token transform function
- Configurable TTL for memory and Redis caches

### Testing Strategy

- Unit tests for core logic and utilities
- Integration tests for fetchers and jobs (require network access)
- Separate test commands allow running tests independently