// Measures frame times during the card exit animation.
// node perf.mjs [url] [cpuThrottle]
import { chromium } from "playwright";

const URL = process.argv[2] ?? "http://localhost:3000/play/deep-dive";
const THROTTLE = Number(process.argv[3] ?? 4);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const cdp = await page.context().newCDPSession(page);
await cdp.send("Emulation.setCPUThrottlingRate", { rate: THROTTLE });

await page.goto(URL);
const card = page.locator('[role="button"]');
await card.waitFor();
await page.waitForTimeout(900);

const runs = [];
for (let n = 0; n < 4; n++) {
  await page.evaluate(() => {
    window.__f = [];
    let last = performance.now();
    window.__stop = false;
    const tick = (t) => {
      window.__f.push(t - last);
      last = t;
      if (!window.__stop) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });

  const box = await card.boundingBox();
  const cx = box.x + box.width / 2;
  const cy = box.y + box.height / 2;
  await page.mouse.move(cx, cy);
  await page.mouse.down();
  for (let i = 1; i <= 6; i++) await page.mouse.move(cx + i * 15, cy);
  await page.mouse.up();
  await page.waitForTimeout(700);

  const frames = await page.evaluate(() => {
    window.__stop = true;
    return window.__f.slice(2);
  });
  runs.push(frames);
  await page.waitForTimeout(500);
}

const all = runs.flat();
const sorted = [...all].sort((a, b) => a - b);
const pct = (p) => sorted[Math.floor(sorted.length * p)].toFixed(1);
console.log(`url=${URL}  cpu=${THROTTLE}x  frames=${all.length}`);
console.log(`  median ${pct(0.5)}ms   p95 ${pct(0.95)}ms   worst ${sorted.at(-1).toFixed(1)}ms`);
console.log(`  janky (>32ms): ${all.filter((f) => f > 32).length}   dropped (>20ms): ${all.filter((f) => f > 20).length}`);

await browser.close();
