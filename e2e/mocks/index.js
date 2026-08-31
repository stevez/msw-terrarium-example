import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { createBucketedStore, createSeedLoader, createMockApp } from 'msw-terrarium';
import { createDb, seedBaseline } from './schema.js';
import { createHandlers } from './handlers.js';

const HERE = dirname(fileURLToPath(import.meta.url));

export const store = createBucketedStore({
  createDb,
  seedBaseline,
  bucketHeader: 'x-mock-bucket',
});
export const seedLoader = createSeedLoader({ seedsDir: resolve(HERE, 'seeds') });

export function buildMockServer() {
  return createMockApp({
    store,
    seedLoader,
    handlers: createHandlers({ store }),
  });
}
