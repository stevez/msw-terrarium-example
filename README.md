# msw-terrarium-example

A Todo app demonstrating three-tier testing with 100% merged coverage using [nextcov](https://github.com/stevez/nextcov), and parallel-safe SSR integration testing using [msw-terrarium](https://github.com/stevez/msw-terrarium).

## Overview

This is a todo-app using React, Next.js and TypeScript. The idea is mostly from this [article](https://medium.com/@amayawickramasinghe2001/creating-a-to-do-app-with-next-js-cdb58f0b12d1), and the code is referenced from [here](https://github.com/Amaya-2001/ToDoApp). It started as a fork of [nextcov-example](https://github.com/stevez/nextcov-example).

**Key Highlights:**
- Three-tier testing: Unit + Component + Integration (100% merged coverage)
- V8 code coverage collection using [nextcov](https://github.com/stevez/nextcov)
- Coverage merging with statement normalization
- [msw-terrarium](https://github.com/stevez/msw-terrarium) as a bucket-isolated stateful mock server for SSR tests — each Playwright worker gets its own in-memory world
- GitHub Actions CI pipeline

**Parallel SSR testing:** the original version of this app used a single `json-server` instance shared by every Playwright worker, so integration tests could only run serially (see the [nextcov-example README](https://github.com/stevez/nextcov-example) for the original constraint). Swapping the mock layer for msw-terrarium gives each worker its own isolated bucket, so `fullyParallel` integration tests — with real `workers > 1` on CI — now work correctly. See [`e2e/mocks/`](e2e/mocks) for the mock server and the [msw-terrarium blog post](https://github.com/stevez/msw-terrarium/blob/main/blog/parallel-isolated-mocks-with-msw-terrarium.md) for the full writeup.

## Quick Start

```bash
# Install dependencies
npm install

# Start mock server (in one terminal)
npm run mock

# Start development server (in another terminal)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Testing

This project uses a **three-tier testing strategy** with **[Vitest](https://vitest.dev/)** for unit and component tests and **[Playwright](https://playwright.dev/)** for integration tests, with coverage collection and merging powered by **[nextcov](https://github.com/stevez/nextcov)**.

### Test Types

| Test Type | Environment | Best For | Coverage Focus |
|-----------|-------------|----------|----------------|
| **Unit** | jsdom | Utilities, hooks, logic | Business logic, validation |
| **Component** | Real browser (Playwright) | UI components, interactions | React components, browser APIs |
| **Integration** | Full Next.js server | User flows, pages | Server components, SSR |

### Unit Tests (Vitest + jsdom)

Fast unit tests running in jsdom environment for utilities and hooks.

```bash
# Run unit tests with coverage
npm run test:unit

# Run tests in watch mode
npm run test:watch

# Run with Vitest UI dashboard
npm run test:unit:ui
```

Coverage output: `./coverage/unit`

View report: `npm run lcov:unit`

### Component Tests (Vitest + Playwright Browser)

Real browser tests using Vitest browser mode with Playwright. Components render in an actual browser with real DOM APIs, CSS, and user interactions.

```bash
# Run component tests (headless)
npm run test:component

# Run with visible browser for debugging
npm run test:component:headed
```

Coverage output: `./coverage/component`

View report: `npm run lcov:component`

### Integration Tests (Playwright)

Full end-to-end tests using Playwright that test the complete application including React Server Components and SSR.

```bash
# Run integration tests (local)
# 1. Build for local testing
npm run build:local

# 2. Start mock server and Next.js server
npm run start:integration

# 3. Run Playwright tests (in another terminal)
npm run playwright-test

# Or run all-in-one (CI mode)
npm run integration-test
```

Coverage output: `./coverage/integration`

View report: `npm run lcov:integration`

### Coverage

This project uses **[nextcov](https://www.npmjs.com/package/nextcov)** to collect V8 coverage from all three test types and merge them into a unified report.

```bash
# Run all tests (unit + component)
npm test

# Run integration tests (see steps above)

# Merge all coverage sources into a single report
npm run coverage:merge
```

**Coverage Output:**
- Unit test coverage: `coverage/unit/`
- Component test coverage: `coverage/component/`
- Integration test coverage: `coverage/integration/`
- Merged coverage: `coverage/merged/` (HTML report at `coverage/merged/index.html`)

View merged report: `npm run lcov:merged`

**Coverage by Test Type:**

| Test Type | Overall % | What It Covers |
|-----------|-----------|----------------|
| **Unit Tests** | ~36% | Utilities, hooks |
| **Component Tests** | ~52% | UI components (TodoList, TodoItem) |
| **Integration Tests** | ~88% | Pages, server components, SSR |
| **Merged** | **100%** | Complete picture of your application |

**Why Three Test Types?**

Each test type excels at different aspects:

1. **Unit tests** - Fast, isolated tests for business logic that doesn't need a browser
2. **Component tests** - Real browser rendering for components that use browser APIs (localStorage, CSS, events)
3. **Integration tests** - Full integration testing including React Server Components which can't be unit tested

### Coverage Normalization

Before merging, the `coverage:strip` script removes import statements and Next.js directives from unit/component coverage. This normalizes statement counts between environments:

- **jsdom** doesn't count imports as statements
- **Real browser** counts imports as executable statements
- **Next.js bundled** has different statement structure

The strip script ensures apples-to-apples comparison when merging.

## Available Scripts

### Development
- `npm run dev` - Start Next.js development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run mock` - Start the msw-terrarium mock server

### Testing
- `npm test` - Run unit + component tests with coverage
- `npm run test:unit` - Run unit tests only (jsdom)
- `npm run test:unit:ui` - Run unit tests with Vitest UI dashboard
- `npm run test:watch` - Run unit tests in watch mode
- `npm run test:component` - Run component tests (browser)
- `npm run test:component:headed` - Run component tests with visible browser

### Integration Testing
- `npm run build:local` - Build with E2E mode enabled
- `npm run start:integration` - Start Next.js + mock server
- `npm run playwright-test` - Run Playwright tests
- `npm run integration-test` - All-in-one integration test (CI)

### Coverage
- `npm run coverage:strip` - Normalize coverage data
- `npm run coverage:merge` - Merge all coverage sources
- `npm run lcov:unit` - Open unit coverage report
- `npm run lcov:component` - Open component coverage report
- `npm run lcov:integration` - Open integration coverage report
- `npm run lcov:merged` - Open merged coverage report

## Test Stack

- **Vitest**: Test runner for unit and browser tests
- **@vitest/browser**: Browser testing with Playwright provider
- **Playwright**: Integration testing and browser automation
- **nextcov**: V8 coverage collection for Next.js with Playwright
- **@vitest/coverage-v8**: V8 coverage for Vitest tests
- **msw-terrarium**: Bucket-isolated, stateful mock server for parallel-safe SSR testing

## CI/CD

The GitHub Actions workflow runs all tests and merges coverage:

1. Run unit tests (`npm run test:unit`)
2. Run component tests (`npm run test:component`)
3. Build for integration testing (`npm run build:local`)
4. Run integration tests (`npm run integration-test`)
5. Merge all coverage (`npm run coverage:merge`)

See [.github/workflows/ci.yml](.github/workflows/ci.yml) for details.
