import * as path from "path";
import { startServerCoverage, loadNextcovConfig } from "nextcov/playwright";

export default async function globalSetup() {
  const config = await loadNextcovConfig(
    path.join(process.cwd(), "playwright.config.ts")
  );
  await startServerCoverage(config);
}
