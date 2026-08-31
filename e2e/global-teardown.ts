import * as path from "path";
import { finalizeCoverage } from "nextcov/playwright";
import { loadNextcovConfig } from "nextcov";

export default async function globalTeardown() {
  const config = await loadNextcovConfig(
    path.join(process.cwd(), "playwright.config.ts")
  );
  await finalizeCoverage(config);
}
