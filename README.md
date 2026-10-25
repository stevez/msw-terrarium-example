# msw-terrarium-example

A Todo app (Next.js + TypeScript) demonstrating parallel-safe Playwright integration testing with [msw-terrarium](https://github.com/stevez/msw-terrarium) — a bucket-isolated stateful mock server. Each Playwright worker gets its own in-memory "world", so `fullyParallel` integration tests run with real concurrency instead of being forced serial.

This is a fork of [nextcov-example](https://github.com/stevez/nextcov-example) with its shared `json-server` mock layer swapped out. Everything about the app itself — the three-tier testing strategy, V8 coverage collection/merging, unit and component tests — is unchanged and documented there; this README only covers the mocking layer. See the [msw-terrarium blog post](https://github.com/stevez/msw-terrarium/blob/main/blog/parallel-isolated-mocks-with-msw-terrarium.md) for the full writeup of the port.

## Quick Start

```bash
npm install

# Start mock server (one terminal)
npm run mock

# Start dev server (another terminal)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Run the integration tests:

```bash
npm run build:local
npm run integration-test
```

## Writing Playwright tests with msw-terrarium

### 1. Declare the mock schema

[`e2e/mocks/schema.js`](e2e/mocks/schema.js) declares the `task` collection with `defineSchema`. No `baseline` is set, so every fresh bucket starts genuinely empty:

```js
import { z } from 'zod';
import { defineSchema } from 'msw-terrarium';

export const { createDb, seedBaseline } = defineSchema({
  task: {
    schema: z.object({ id: z.string(), text: z.string() }),
    idPrefix: 'task',
  },
});
```

### 2. Declare the REST handlers

[`e2e/mocks/handlers.js`](e2e/mocks/handlers.js) maps the app's four `/tasks` endpoints onto the bucket's collection with `createRestHandlers`:

```js
import { createRestHandlers } from 'msw-terrarium';

export function createHandlers({ store }) {
  return createRestHandlers({
    store,
    routes: {
      'GET /tasks': ({ world }) => ({
        body: world.db.task.findMany((q) => q.where({})),
      }),
      'POST /tasks': async ({ world, body }) => {
        const task = await world.db.task.createNext(body);
        return { status: 201, body: task };
      },
      // PUT /tasks/:id, DELETE /tasks/:id — see the file for the rest
    },
  });
}
```

### 3. Wire the mock server

[`e2e/mocks/index.js`](e2e/mocks/index.js) composes the bucket store, seed loader, and handlers into an app; [`e2e/mocks/server.mjs`](e2e/mocks/server.mjs) boots it on port 3001 via `startMockServer`. `bucketHeader: 'x-mock-bucket'` is the header the mock server reads on every request to resolve which worker's world to use.

### 4. Extend the Playwright fixture

[`e2e/fixtures.ts`](e2e/fixtures.ts) uses `extendWithGiven` from `msw-terrarium/playwright`, which adds a worker-scoped `bucketId`, a `page` fixture that auto-attaches the bucket header, and a `given` fixture for driving mock state:

```ts
import { test as base } from "@playwright/test";
import { extendWithGiven } from "msw-terrarium/playwright";

export const { test, expect } = extendWithGiven(base, {
  mockUrl: "http://localhost:3001",
  bucketHeader: "x-mock-bucket",
});
```

(The real file in this repo also layers in the app's `nextcov` coverage fixture on top — see the file for that composition.)

### 5. Write the spec

[`e2e/todo-app.spec.ts`](e2e/todo-app.spec.ts):

```ts
import { test, expect } from "./fixtures";

test.describe("ToDo App", () => {
  // Load the app's four canned tasks into this test's bucket before each test.
  test.beforeEach(async ({ given }) => {
    await given.load("default-tasks");
  });

  test("list when empty tasks", async ({ page, given }) => {
    // Override back to an empty bucket for this one test.
    await given.fresh();

    await page.goto("/");
    await expect(page.getByText("No task")).toBeVisible();
  });

  test("edit task", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("cell", { name: "✕ Edit Task HackerRank" }).getByRole("img").first().click();
    // ...
  });
});
```

`given.load('default-tasks')` loads the seed at [`e2e/mocks/seeds/default-tasks.json`](e2e/mocks/seeds/default-tasks.json) — the four tasks the app used to ship as its `json-server` database — into just this test's bucket. `given.fresh()` resets the bucket back to its empty default. Because every bucket is isolated per worker, these calls never affect any other test running concurrently.

## Desktop app

The same app, with its msw-terrarium mock server, can be packaged as a Windows or Mac desktop app with [web-terrarium](https://github.com/stevez/web-terrarium). The config is [`terrarium.config.mjs`](terrarium.config.mjs).

```bash
npx web-terrarium build   # zip in dist-desktop/out
npx web-terrarium start   # or open the staged app without packaging
```

In the desktop app, the mock server and the Next server start on free ports on `127.0.0.1`. `MOCK_PORT` and `MOCK_HOST` tell the mock where to listen, and `MOCK_API_URL` tells the app where it is. Without them, tests and dev use `http://localhost:3001` as before. The mock starts empty, as in tests, so add a task to see it work.

## Learn more

- [msw-terrarium](https://github.com/stevez/msw-terrarium) — the library itself, with the full README/API reference.
- [web-terrarium](https://github.com/stevez/web-terrarium) — packages this app and its mock as a desktop app.
- [nextcov-example](https://github.com/stevez/nextcov-example) — the original app, with the three-tier testing and coverage-merging setup this repo inherits unchanged.
