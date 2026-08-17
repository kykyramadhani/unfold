// Swipe sensitivity table. Start the dev server, then: node sens.mjs
import { chromium } from "playwright";

const CASES = [
  // label,           dist, steps, delayMs, shouldSwipe
  ["15px nudge",        15,  6, 30, false],
  ["35px slow drag",    35,  8, 30, false],
  ["60px slow drag",    60,  8, 25, true],
  ["90px slow drag",    90,  8, 25, true],
  ["40px quick flick",  40,  3,  0, true],
  ["70px quick flick",  70,  3,  0, true],
  ["-60px slow (left)",-60,  8, 25, true],
];

const browser = await chromium.launch();
const fails = [];

for (const [label, dist, steps, delay, expect] of CASES) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto("http://localhost:3000/play/deep-dive");
  const card = page.locator('[role="button"]');
  const bar = page.locator("header div div");
  await card.waitFor();
  await page.waitForTimeout(700);

  const before = await bar.evaluate((el) => el.getBoundingClientRect().width);
  const box = await card.boundingBox();
  const cx = box.x + box.width / 2;
  const cy = box.y + box.height / 2;
  await page.mouse.move(cx, cy);
  await page.mouse.down();
  for (let i = 1; i <= steps; i++) {
    await page.mouse.move(cx + (dist * i) / steps, cy);
    if (delay) await page.waitForTimeout(delay);
  }
  await page.mouse.up();
  await page.waitForTimeout(900);

  const after = await bar.evaluate((el) => el.getBoundingClientRect().width);
  const swiped = after > before + 1;
  const ok = swiped === expect;
  if (!ok) fails.push(label);
  console.log(
    `${ok ? "ok  " : "FAIL"}  ${label.padEnd(18)} ${swiped ? "swiped     " : "snapped back"} (expected ${expect ? "swipe" : "snap back"})`,
  );
  await page.close();
}

await browser.close();
console.log(fails.length ? `\nFAILED: ${fails.join(", ")}` : "\nPASS");
process.exit(fails.length ? 1 : 0);
