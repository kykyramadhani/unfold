// Measures the gap between pointer release and the exit animation's first move.
import { chromium } from "playwright";
const URL = process.argv[2] ?? "http://localhost:3000/play/deep-dive";
const THROTTLE = Number(process.argv[3] ?? 4);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
const cdp = await p.context().newCDPSession(p);
await cdp.send("Emulation.setCPUThrottlingRate", { rate: THROTTLE });
await p.goto(URL);
const card = p.locator('[role="button"]');
await card.waitFor(); await p.waitForTimeout(900);

for (let n = 0; n < 3; n++) {
  const box = await card.boundingBox();
  const cx = box.x + box.width/2, cy = box.y + box.height/2;
  await p.mouse.move(cx, cy); await p.mouse.down();
  for (let i=1;i<=6;i++) await p.mouse.move(cx + i*15, cy);
  // watch for x to exceed the drag distance => exit animation has begun
  await p.evaluate(() => {
    const el = document.querySelector('[role="button"]');
    window.__t0 = performance.now(); window.__moved = null;
    const startX = new DOMMatrix(getComputedStyle(el).transform).m41;
    const tick = () => {
      const x = new DOMMatrix(getComputedStyle(el).transform).m41;
      if (window.__moved === null && Math.abs(x - startX) > 15) window.__moved = performance.now() - window.__t0;
      if (window.__moved === null) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
  await p.mouse.up();
  await p.waitForTimeout(1500);
  console.log(`  swipe ${n+1}: release -> exit motion = ${await p.evaluate(() => window.__moved?.toFixed(1) ?? "never")}ms`);
}
await b.close();
