# token-registry

## Publish new version

```shell
npm run test:integration
npm version patch
git push origin main --tags

# or
npm run test:integration && npm version patch && git push origin main --tags
```

## Integration tests

```shell
npm run test -- -t 'isUri'
npm run test:integration -- -t 'evmFetcher'
npm run test:integration -- -t 'jupiterJob'
npm run test:integration -- -t 'solanaFetcher'
```
