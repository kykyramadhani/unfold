// Checks that tapping a deck shows its loader right away instead of a dead tap.
// Start the dev server, then: node test-loader.mjs
import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:3000";
const fails = [];
const check = (name, ok) => {
  console.log(`${ok ? "ok  " : "FAIL"}  ${name}`);
  if (!ok) fails.push(name);
};

const browser = await chromium.launch();

for (const [id, color] of [
  ["light-and-fun", "rgb(255, 201, 60)"],
  ["us-two", "rgb(255, 107, 129)"],
  ["deep-dive", "rgb(108, 92, 231)"],
]) {
  const page = await (await browser.newContext({ viewport: { width: 460, height: 900 } })).newPage();
  // Hold the next route back so the loading state is observable.
  await page.route("**/play/**", async (route) => {
    await new Promise((r) => setTimeout(r, 2500));
    route.continue();
  });
  await page.goto(`${BASE}/decks`);
  await page.waitForTimeout(1000);
  await page.click(`a[href='/play/${id}']`);
  await page.waitForTimeout(600);

  const shown = (await page.locator('[role="status"]').count()) > 0;
  check(`${id}: loader appears while the route loads`, shown);

  if (shown) {
    const bg = await page
      .locator('[role="status"]')
      .locator("xpath=../div[1]")
      .evaluate((el) => getComputedStyle(el).backgroundColor);
    check(`${id}: loader uses the deck color`, bg === color);
    const svg = await page.locator('[role="status"]').locator("xpath=..").locator("svg").count();
    check(`${id}: loader shows the deck character`, svg > 0);
  }
  await page.close();
}

// Without the delay the loader must not linger on screen.
const page = await (await browser.newContext({ viewport: { width: 460, height: 900 } })).newPage();
await page.goto(`${BASE}/decks`);
await page.waitForTimeout(1000);
await page.click("a[href='/play/deep-dive']");
await page.locator('[role="button"]').last().waitFor({ timeout: 15000 });
await page.waitForTimeout(600);
check("loader is gone once the card is up", (await page.locator('[role="status"]').count()) === 0);
check("landed on the play route", page.url().includes("/play/deep-dive"));

await browser.close();
console.log(fails.length ? `\nFAILED: ${fails.join(", ")}` : "\nPASS");
process.exit(fails.length ? 1 : 0);
