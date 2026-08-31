import { test as base } from "@playwright/test";
import { extendWithGiven } from "msw-terrarium/playwright";
import { collectClientCoverage } from "nextcov/playwright";
import { nextcov } from "../playwright.config";

const withGiven = extendWithGiven(base, {
  mockUrl: "http://localhost:3001",
  bucketHeader: "x-mock-bucket",
});

const test = withGiven.extend<{ coverage: void }>({
  coverage: [
    async ({ page }, use, testInfo) => {
      await collectClientCoverage(page, testInfo, use, nextcov);
    },
    { auto: true },
  ],
});

const { expect } = base;

export { test, expect };
